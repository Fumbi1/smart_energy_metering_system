import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Currency formatting for Nigerian Naira
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format units with proper decimal places
export function formatUnits(units: number): string {
  return units.toFixed(2) + ' units'
}

// Format power with appropriate unit
export function formatPower(power: number): string {
  if (power >= 1000) {
    return (power / 1000).toFixed(2) + ' kW'
  }
  return power.toFixed(0) + ' W'
}

// Format voltage
export function formatVoltage(voltage: number): string {
  return voltage.toFixed(1) + ' V'
}

// Format current
export function formatCurrent(current: number): string {
  return current.toFixed(2) + ' A'
}

// Calculate time ago
export function timeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
}

// Device status helpers
export function getDeviceStatusColor(isOnline: boolean, lastSeen?: string): string {
  if (!isOnline) return 'text-red-500'
  
  if (lastSeen) {
    const diffMinutes = (new Date().getTime() - new Date(lastSeen).getTime()) / (1000 * 60)
    if (diffMinutes > 10) return 'text-yellow-500'
  }
  
  return 'text-green-500'
}

export function getUnitStatusInfo(units: number): {
  color: string
  status: string
  urgent: boolean
} {
  if (units <= 0) {
    return { color: 'text-red-600', status: 'No Units', urgent: true }
  } else if (units < 5) {
    return { color: 'text-red-500', status: 'Critical', urgent: true }
  } else if (units < 20) {
    return { color: 'text-yellow-500', status: 'Low', urgent: false }
  } else if (units < 50) {
    return { color: 'text-blue-500', status: 'Medium', urgent: false }
  } else {
    return { color: 'text-green-500', status: 'Good', urgent: false }
  }
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateNigerianPhone(phone: string): boolean {
  // Remove all spaces and special characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  
  // Check for Nigerian phone number patterns
  const patterns = [
    /^(\+234|234)[789][01]\d{8}$/, // International format
    /^0[789][01]\d{8}$/, // Local format
    /^[789][01]\d{8}$/ // Without leading zero
  ]
  
  return patterns.some(pattern => pattern.test(cleanPhone))
}

// Data transformation helpers
export function transformChartData(data: any[], timeField: string, valueField: string) {
  return data.map(item => ({
    time: item[timeField],
    value: Number(item[valueField]) || 0,
    label: new Date(item[timeField]).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }))
}

// Local storage helpers (for client-side preferences)
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Number formatting helpers
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%'
  return ((value / total) * 100).toFixed(1) + '%'
}

// Error handling helpers
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}

// API response helpers
export function isSuccessResponse(response: any): boolean {
  return response && (response.success === true || response.error === undefined)
}

// Date range helpers
export function getDateRange(period: 'today' | 'week' | 'month' | 'year'): {
  start: Date
  end: Date
} {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  
  let start: Date
  
  switch (period) {
    case 'today':
      start = new Date(now)
      start.setHours(0, 0, 0, 0)
      break
    case 'week':
      start = new Date(now)
      start.setDate(now.getDate() - 7)
      start.setHours(0, 0, 0, 0)
      break
    case 'month':
      start = new Date(now)
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      break
    case 'year':
      start = new Date(now.getFullYear(), 0, 1)
      break
    default:
      start = new Date(now)
      start.setHours(0, 0, 0, 0)
  }
  
  return { start, end }
}

// Generate random ID (for demo purposes)
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}