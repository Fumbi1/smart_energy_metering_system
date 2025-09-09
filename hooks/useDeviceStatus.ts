import { useState, useEffect, useCallback } from 'react'
import { MeterService } from '@/lib/services/meterService'
import { DeviceStatus, MeterReading, Alert } from '@/lib/supabase'

export function useDeviceStatus(deviceId: string) {
  const [status, setStatus] = useState<DeviceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      const data = await MeterService.getDeviceStatus(deviceId)
      setStatus(data)
      
      // Check if device is online (last seen within 5 minutes)
      if (data) {
        const lastSeen = new Date(data.last_seen)
        const now = new Date()
        const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60)
        setIsOnline(diffMinutes < 5)
      }
      
      setError(null)
    } catch (err) {
      setError('Failed to fetch device status')
      console.error('Device status error:', err)
    } finally {
      setLoading(false)
    }
  }, [deviceId])

  useEffect(() => {
    fetchStatus()
    
    // Set up real-time subscription
    const subscription = MeterService.subscribeToDeviceStatus(deviceId, (newStatus) => {
      setStatus(newStatus)
      
      // Update online status
      const lastSeen = new Date(newStatus.last_seen)
      const now = new Date()
      const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60)
      setIsOnline(diffMinutes < 5)
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [deviceId, fetchStatus])

  return {
    status,
    loading,
    error,
    isOnline,
    refetch: fetchStatus
  }
}

export function useRealtimeReadings(deviceId: string, limit: number = 50) {
  const [readings, setReadings] = useState<MeterReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReadings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await MeterService.getRecentReadings(deviceId, limit)
      setReadings(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch readings')
      console.error('Readings error:', err)
    } finally {
      setLoading(false)
    }
  }, [deviceId, limit])

  useEffect(() => {
    fetchReadings()
    
    // Set up real-time subscription
    const subscription = MeterService.subscribeToReadings(deviceId, (newReading) => {
      setReadings(prev => [newReading, ...prev.slice(0, limit - 1)])
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [deviceId, limit, fetchReadings])

  return {
    readings,
    loading,
    error,
    refetch: fetchReadings
  }
}

export function useAlerts(deviceId: string, limit: number = 20) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unacknowledgedCount, setUnacknowledgedCount] = useState(0)

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await MeterService.getAlerts(deviceId, limit)
      setAlerts(data)
      setUnacknowledgedCount(data.filter(alert => !alert.acknowledged).length)
      setError(null)
    } catch (err) {
      setError('Failed to fetch alerts')
      console.error('Alerts error:', err)
    } finally {
      setLoading(false)
    }
  }, [deviceId, limit])

  const acknowledgeAlert = async (alertId: number) => {
    const success = await MeterService.acknowledgeAlert(alertId)
    if (success) {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      )
      setUnacknowledgedCount(prev => Math.max(0, prev - 1))
    }
    return success
  }

  useEffect(() => {
    fetchAlerts()
    
    // Set up real-time subscription
    const subscription = MeterService.subscribeToAlerts(deviceId, (newAlert) => {
      setAlerts(prev => [newAlert, ...prev.slice(0, limit - 1)])
      if (!newAlert.acknowledged) {
        setUnacknowledgedCount(prev => prev + 1)
      }
      
      // Show browser notification for new alerts
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Smart Meter Alert`, {
          body: newAlert.message,
          icon: '/meter-icon.png' // Add your icon
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [deviceId, limit, fetchAlerts])

  return {
    alerts,
    loading,
    error,
    unacknowledgedCount,
    refetch: fetchAlerts,
    acknowledgeAlert
  }
}