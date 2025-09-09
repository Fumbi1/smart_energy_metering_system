"use client"

import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { format } from "date-fns" // Keep date-fns for client-side formatting
import { RefreshCw, TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { MeterService } from "@/lib/services/meterService"

interface PowerConsumptionChartProps {
  deviceId: string
  timeRange?: "hourly" | "daily"
  height?: number
}

interface ChartDataPoint {
  time: string // Original timestamp string (ISO if possible)
  power: number
  consumption?: number
  label: string | null; // This will be set on the client after hydration
}

const chartConfig = {
  power: {
    label: "Power",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function PowerConsumptionChart({
  deviceId,
  timeRange = "hourly",
  height = 400,
}: PowerConsumptionChartProps) {
  // Initialize chartData with original `time` but `label` as null on server
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState<string | null>(null) // For client-side display only

  const fetchChartData = async () => {
    setLoading(true)
    setError(null)

    try {
      let data: any[] = [];
      if (timeRange === "hourly") {
        data = await MeterService.getHourlyPowerConsumption(deviceId)
      } else {
        data = await MeterService.getDailyPowerConsumption(deviceId)
      }

      // Store raw data initially, format labels in useEffect for client-side
      const rawDataForState: ChartDataPoint[] = data.map((item) => ({
        time: timeRange === "hourly" ? item.hour : item.date, // Store the original string
        power: Number(item.average_power),
        consumption: timeRange === "daily" ? Number(item.total_consumption) : undefined,
        label: null, // Set to null for server render, will be formatted on client
      }))
      setChartData(rawDataForState); // Set the raw data

      // Set last updated string on client-side
      setLastUpdatedDisplay(format(new Date(), "HH:mm"));

    } catch (err) {
      setError("Failed to load chart data")
      console.error("Chart data error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Effect to fetch data on component mount or prop changes
  useEffect(() => {
    fetchChartData()
  }, [deviceId, timeRange])

  // Effect to format labels *only on the client* after initial data fetch
  useEffect(() => {
    if (chartData.length > 0 && chartData[0].label === null) {
      const formattedData = chartData.map((item) => ({
        ...item,
        label: timeRange === "hourly"
          ? format(new Date(item.time), "HH:mm")
          : format(new Date(item.time), "MMM dd"),
      }));
      setChartData(formattedData);
    }
  }, [chartData, timeRange]); // Re-run if chartData or timeRange changes


  const getTitle = () => {
    return timeRange === "hourly"
      ? "Hourly Power Consumption (Last 24 Hours)"
      : "Daily Power Consumption (Last 30 Days)"
  }

  const getDescription = () => {
    if (loading) return "Loading data..."
    if (error) return error
    if (chartData.length === 0) return "No data available"

    const latestPower = chartData[chartData.length - 1]?.power || 0
    // Use lastUpdatedDisplay which is only set on the client
    return `Latest reading: ${latestPower.toFixed(1)}W ${
      lastUpdatedDisplay ? `• Updated ${lastUpdatedDisplay}` : ""
    }`
  }

  const formatTooltipValue = (value: any, name: any) => {
    if (name === "power") {
      return [`${value.toFixed(1)}W`, "Average Power"]
    }
    // Handle consumption for daily view
    if (name === "consumption") {
        return [`${value.toFixed(2)}kWh`, "Total Consumption"];
    }
    return [value, name]
  }

  const formatTooltipLabel = (label: string) => {
    // This label is already formatted by the useEffect on the client
    // However, for tooltips, it's safer to re-format the *original* `time` property
    // if `label` might be null or not the original date string.
    // Assuming `label` passed here is the `item.time` or `item.label`
    const originalTime = chartData.find(d => d.label === label)?.time || label; // Try to find original time
    if (timeRange === "hourly") {
      return format(new Date(originalTime), "MMM dd, HH:mm")
    }
    return format(new Date(originalTime), "MMMM dd, yyyy")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchChartData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/*
          Using template literals for height in className can still sometimes cause issues
          if Tailwind's JIT or other post-processing doesn't produce identical output
          on server vs. client. Consider a fixed height or a style prop if issues persist.
          e.g., style={{ height: `${height}px` }}
        */}
        <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label" // Use the 'label' which is formatted client-side
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value} // Value is already formatted
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}W`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={formatTooltipValue}
                  labelFormatter={formatTooltipLabel}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="power"
              stroke="var(--color-power)"
              strokeWidth={2}
              fill="var(--color-power)"
              fillOpacity={0.2}
              dot={{
                fill: "var(--color-power)",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
              }}
            />
             {timeRange === "daily" && (
                <Area
                    type="monotone"
                    dataKey="consumption"
                    stroke="hsl(var(--chart-2))" // Example color for consumption
                    strokeWidth={2}
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.1}
                    dot={{
                        fill: "hsl(var(--chart-2))",
                        strokeWidth: 2,
                        r: 4,
                    }}
                    activeDot={{
                        r: 6,
                        strokeWidth: 2,
                    }}
                />
            )}
          </AreaChart>
        </ChartContainer>

        {chartData.length > 0 && (
          <div className="flex items-center pt-4 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>
              {timeRange === "hourly"
                ? `${chartData.length} hourly readings`
                : `${chartData.length} daily readings`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}