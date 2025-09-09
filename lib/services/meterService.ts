import { supabase, MeterReading, Alert, DeviceStatus } from '../supabase'

export class MeterService {
  // Get device status
  static async getDeviceStatus(deviceId: string): Promise<DeviceStatus | null> {
    try {
      const { data, error } = await supabase
        .from('device_status')
        .select('*')
        .eq('device_id', deviceId)
        .single()

      if (error) {
        console.error('Error fetching device status:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Service error:', error)
      return null
    }
  }

  // Get recent meter readings
  static async getRecentReadings(
    deviceId: string, 
    limit: number = 50
  ): Promise<MeterReading[]> {
    try {
      const { data, error } = await supabase
        .from('meter_readings')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching readings:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Service error:', error)
      return []
    }
  }

  // Get readings for time range
  static async getReadingsInRange(
    deviceId: string,
    startDate: string,
    endDate: string
  ): Promise<MeterReading[]> {
    try {
      const { data, error } = await supabase
        .from('meter_readings')
        .select('*')
        .eq('device_id', deviceId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching readings in range:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Service error:', error)
      return []
    }
  }

  // Get hourly average power consumption for the last 24 hours
  static async getHourlyPowerConsumption(deviceId: string): Promise<Array<{
    hour: string
    average_power: number
    readings_count: number
  }>> {
    try {
      const { data, error } = await supabase.rpc('get_hourly_power_avg', {
        device_id_param: deviceId,
        hours_back: 24
      })

      if (error) {
        console.error('Error fetching hourly power:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Service error:', error)
      return []
    }
  }

  // Get daily power consumption for the last 30 days
  static async getDailyPowerConsumption(deviceId: string): Promise<Array<{
    date: string
    total_consumption: number
    average_power: number
  }>> {
    try {
      const { data, error } = await supabase.rpc('get_daily_power_consumption', {
        device_id_param: deviceId,
        days_back: 30
      })

      if (error) {
        console.error('Error fetching daily power:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Service error:', error)
      return []
    }
  }

  // Get alerts
  static async getAlerts(
    deviceId: string, 
    limit: number = 20
  ): Promise<Alert[]> {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching alerts:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Service error:', error)
      return []
    }
  }

  // Acknowledge alert
  static async acknowledgeAlert(alertId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ acknowledged: true })
        .eq('id', alertId)

      if (error) {
        console.error('Error acknowledging alert:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Service error:', error)
      return false
    }
  }

  // Subscribe to real-time updates
  static subscribeToReadings(
    deviceId: string, 
    callback: (reading: MeterReading) => void
  ) {
    return supabase
      .channel('meter_readings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'meter_readings',
          filter: `device_id=eq.${deviceId}`
        },
        (payload: { new: MeterReading }) => {
          callback(payload.new as MeterReading)
        }
      )
      .subscribe()
  }

  // Subscribe to alerts
  static subscribeToAlerts(
    deviceId: string,
    callback: (alert: Alert) => void
  ) {
    return supabase
      .channel('alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `device_id=eq.${deviceId}`
        },
        (payload: { new: Alert }) => {
          callback(payload.new as Alert)
        }
      )
      .subscribe()
  }

  // Subscribe to device status updates
  static subscribeToDeviceStatus(
    deviceId: string,
    callback: (status: DeviceStatus) => void
  ) {
    return supabase
      .channel('device_status')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'device_status',
        filter: `device_id=eq.${deviceId}`
      }, (payload) => {
        if (payload.new) {
          callback(payload.new as DeviceStatus)
        }
      })
      .subscribe()
  }
}