import { supabase } from '../supabase'

export interface UnitPurchase {
  id: number
  device_id: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  units_purchased: number
  amount_paid: number
  payment_method: string
  payment_reference?: string
  payment_status: 'pending' | 'completed' | 'failed'
  purchase_date: string
  applied_to_meter: boolean
  applied_at?: string
}

export interface MeterCommand {
  id: number
  device_id: string
  command_type: string
  command_data: any
  status: 'pending' | 'sent' | 'acknowledged' | 'failed'
  created_at: string
  retry_count: number
}

export interface PaymentDetails {
  customerName: string
  customerEmail?: string
  customerPhone?: string
  units: number
  amount: number
  paymentMethod: 'card' | 'bank_transfer' | 'mobile_money'
}

export class UnitPurchaseService {
  // Create a new unit purchase
  static async createPurchase(
    deviceId: string,
    paymentDetails: PaymentDetails
  ): Promise<{ success: boolean; purchaseId?: number; error?: string }> {
    try {
      // Calculate amount (you can adjust the rate)
      const pricePerUnit = 50; // ₦50 per unit
      const totalAmount = paymentDetails.units * pricePerUnit

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('unit_purchases')
        .insert({
          device_id: deviceId,
          customer_name: paymentDetails.customerName,
          customer_email: paymentDetails.customerEmail,
          customer_phone: paymentDetails.customerPhone,
          units_purchased: paymentDetails.units,
          amount_paid: totalAmount,
          payment_method: paymentDetails.paymentMethod,
          payment_status: 'pending'
        })
        .select()
        .single()

      if (purchaseError) {
        console.error('Purchase creation error:', purchaseError)
        return { success: false, error: 'Failed to create purchase record' }
      }

      // For demo purposes, we'll immediately mark as completed
      // In production, you'd integrate with actual payment providers
      const paymentSuccess = await this.processPayment(purchase.id, paymentDetails)

      if (paymentSuccess) {
        // Create command for meter to add units
        await this.createAddUnitsCommand(deviceId, paymentDetails.units, purchase.id)
        
        return { success: true, purchaseId: purchase.id }
      } else {
        return { success: false, error: 'Payment processing failed' }
      }

    } catch (error) {
      console.error('Purchase service error:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  // Process payment (mock implementation)
  private static async processPayment(
    purchaseId: number,
    paymentDetails: PaymentDetails
  ): Promise<boolean> {
    try {
      // Mock payment processing - replace with actual payment gateway
      // For demo, we'll simulate payment success
      const paymentReference = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const { error } = await supabase
        .from('unit_purchases')
        .update({
          payment_status: 'completed',
          payment_reference: paymentReference
        })
        .eq('id', purchaseId)

      if (error) {
        console.error('Payment update error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Payment processing error:', error)
      return false
    }
  }

  // Create command for meter to add units
  private static async createAddUnitsCommand(
    deviceId: string,
    units: number,
    purchaseId: number
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('create_unit_purchase_command', {
        device_id_param: deviceId,
        units_to_add: units,
        purchase_id: purchaseId
      })

      if (error) {
        console.error('Command creation error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Command service error:', error)
      return false
    }
  }

  // Get purchase history for a device
  static async getPurchaseHistory(deviceId: string): Promise<UnitPurchase[]> {
    try {
      const { data, error } = await supabase
        .from('unit_purchases')
        .select('*')
        .eq('device_id', deviceId)
        .order('purchase_date', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Purchase history error:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Purchase history service error:', error)
      return []
    }
  }

  // Get pending commands for a device (used by meter)
  static async getPendingCommands(deviceId: string): Promise<MeterCommand[]> {
    try {
      const { data, error } = await supabase.rpc('get_pending_commands', {
        device_id_param: deviceId
      })

      if (error) {
        console.error('Pending commands error:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Pending commands service error:', error)
      return []
    }
  }

  // Acknowledge command (called by meter after processing)
  static async acknowledgeCommand(commandId: number): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('acknowledge_command', {
        command_id_param: commandId
      })

      if (error) {
        console.error('Command acknowledgment error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Command acknowledgment service error:', error)
      return false
    }
  }

  // Get command status
  static async getCommandStatus(commandId: number): Promise<MeterCommand | null> {
    try {
      const { data, error } = await supabase
        .from('meter_commands')
        .select('*')
        .eq('id', commandId)
        .single()

      if (error) {
        console.error('Command status error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Command status service error:', error)
      return null
    }
  }

  // Calculate unit price
  static getUnitPrice(): number {
    return 50 // ₦50 per unit - you can make this dynamic
  }

  // Validate purchase request
  static validatePurchaseRequest(paymentDetails: PaymentDetails): string | null {
    if (!paymentDetails.customerName || paymentDetails.customerName.trim().length < 2) {
      return 'Customer name is required'
    }

    if (paymentDetails.units <= 0 || paymentDetails.units > 1000) {
      return 'Units must be between 1 and 1000'
    }

    if (paymentDetails.customerEmail && !this.isValidEmail(paymentDetails.customerEmail)) {
      return 'Invalid email address'
    }

    if (paymentDetails.customerPhone && !this.isValidPhone(paymentDetails.customerPhone)) {
      return 'Invalid phone number'
    }

    return null
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }
}