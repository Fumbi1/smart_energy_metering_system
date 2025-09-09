"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Zap, Battery, Power, RefreshCw, Clock } from "lucide-react"
import { PowerConsumptionChart } from "@/components/power-consumption-chart"
import { useDeviceStatus, useAlerts } from "@/hooks/useDeviceStatus"
import { format } from "date-fns"

export default function DashboardPage() {
  const deviceId = process.env.NEXT_PUBLIC_DEFAULT_DEVICE_ID || "METER_001"
  const [selectedTimeRange, setSelectedTimeRange] = useState<'hourly' | 'daily'>('hourly')
  
  const { status, loading: statusLoading, isOnline, refetch: refetchStatus } = useDeviceStatus(deviceId)
  const { alerts, unacknowledgedCount, acknowledgeAlert, loading: alertsLoading } = useAlerts(deviceId)

  const route = useRouter();

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const handleRefreshAll = () => {
    refetchStatus()
  }

  const getUnitStatusColor = () => {
    if (!status) return "secondary"
    if (status.total_units < 5) return "destructive"
    if (status.total_units < 20) return "outline"
    return "default"
  }

  const getUnitStatusText = () => {
    if (!status) return "Unknown"
    if (status.total_units < 5) return "Critical"
    if (status.total_units < 20) return "Low"
    return "Good"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Meter Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your energy consumption in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={statusLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${statusLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voltage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status ? `${status.voltage.toFixed(2)}V` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {status && status.voltage > 0 ? 'Normal' : 'No reading'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status ? `${status.current.toFixed(2)}A` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {status && status.current > 0 ? 'Active load' : 'No load'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Power</CardTitle>
            <Power className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status ? `${status.power.toFixed(2)}W` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current consumption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units Remaining</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status ? status.total_units.toFixed(5) : '--'}
            </div>
            <div className="flex flex-row w-full justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant={getUnitStatusColor()}>
                  {getUnitStatusText()}
                </Badge>
                {status?.relay_status && (
                  <Badge variant="default">Active</Badge>
                )}
              </div>
              <Button variant={"outline"} className="text-slate-600 active:invert-75" onClick={() =>route.push("../purchase") }>Purchase New Units</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Device Information</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Device ID: {deviceId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* <div>
              <p className="text-sm font-medium text-muted-foreground">Last Seen</p>
              <p className="text-sm">
                {status ? format(new Date(status.last_seen), 'PPp') : 'Never'}
              </p>
            </div> */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tamper Status</p>
              <Badge variant={status?.relay_status ? "default" : "destructive"}>
                {status?.relay_status ? "OFF" : "ON"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unit Status</p>
              <Badge variant={status?.unit_low ? "destructive" : "default"}>
                {status?.unit_low ? "Low Units" : "Normal"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Analytics */}
      <Tabs value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value as 'hourly' | 'daily')}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="hourly">Hourly View</TabsTrigger>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="hourly" className="space-y-4">
          <PowerConsumptionChart 
            deviceId={deviceId} 
            timeRange="hourly"
            height={400}
          />
        </TabsContent>
        
        <TabsContent value="daily" className="space-y-4">
          <PowerConsumptionChart 
            deviceId={deviceId} 
            timeRange="daily"
            height={400}
          />
        </TabsContent>
      </Tabs>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Recent Alerts</span>
              {unacknowledgedCount > 0 && (
                <Badge variant="destructive">
                  {unacknowledgedCount} new
                </Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Monitor system alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Loading alerts...
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No alerts to display
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.acknowledged 
                      ? 'bg-muted/50 border-muted' 
                      : alert.alert_type === 'tamper'
                      ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                      : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className={`h-5 w-5 ${
                        alert.alert_type === 'tamper' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">
                          {alert.alert_type === 'tamper' ? 'Tamper Alert' : 'Low Units Alert'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(alert.created_at), 'PPp')}
                        </p>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
