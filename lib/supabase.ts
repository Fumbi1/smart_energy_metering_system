import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for your database tables
export interface MeterReading {
  id: number
  device_id: string
  voltage: number
  current: number
  power: number
  total_units: number
  unit_low: boolean
  relay_status: boolean
  created_at: string
}

export interface Alert {
  id: number
  device_id: string
  alert_type: 'tamper' | 'low_unit'
  message: string
  acknowledged: boolean
  created_at: string
}

export interface DeviceStatus {
  device_id: string
  voltage: number
  current: number
  power: number
  total_units: number
  unit_low: boolean
  relay_status: boolean
  last_seen: string
  created_at: string
}