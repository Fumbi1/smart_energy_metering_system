"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Building2, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { UnitPurchaseService, PaymentDetails } from "@/lib/services/unitPurchaseService"
import { formatCurrency } from "@/lib/utils"

interface UnitPurchaseProps {
    deviceId: string
    currentUnits?: number
    onPurchaseSuccess?: (purchaseId: number) => void
}

export function UnitPurchase({
    deviceId,
    currentUnits = 0,
    onPurchaseSuccess
}: UnitPurchaseProps) {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        units: '',
        paymentMethod: 'card' as PaymentDetails['paymentMethod']
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ purchaseId: number; units: number } | null>(null)


    const unitPrice = UnitPurchaseService.getUnitPrice()
    const totalAmount = parseFloat(formData.units) * unitPrice || 0

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError(null)
    }

    const handlePurchase = async () => {
        setLoading(true)
        setError(null)

        try {
            // Prepare payment details
            const paymentDetails: PaymentDetails = {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail || undefined,
                customerPhone: formData.customerPhone || undefined,
                units: parseFloat(formData.units),
                amount: totalAmount,
                paymentMethod: formData.paymentMethod
            }

            // Validate request
            const validationError = UnitPurchaseService.validatePurchaseRequest(paymentDetails)
            if (validationError) {
                setError(validationError)
                setLoading(false)
                return
            }

            // Process purchase
            const result = await UnitPurchaseService.createPurchase(deviceId, paymentDetails)

            if (result.success && result.purchaseId) {
                setSuccess({
                    purchaseId: result.purchaseId,
                    units: paymentDetails.units
                })

                // Reset form
                setFormData({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    units: '',
                    paymentMethod: 'card'
                })

                // Notify parent component
                onPurchaseSuccess?.(result.purchaseId)
            } else {
                setError(result.error || 'Purchase failed')
            }
        } catch (err) {
            setError('An unexpected error occurred')
            console.error('Purchase error:', err)
        } finally {
            setLoading(false)
        }
    }

    const isFormValid = () => {
        return (
            formData.customerName.trim().length >= 2 &&
            parseFloat(formData.units) > 0 &&
            parseFloat(formData.units) <= 1000 &&
            formData.paymentMethod
        )
    }

    if (success) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Purchase Successful!</span>
                    </CardTitle>
                    <CardDescription>
                        Your units have been purchased and will be added to your meter shortly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="flex justify-between">
                            <span>Purchase ID:</span>
                            <span className="font-mono">#{success.purchaseId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Units Purchased:</span>
                            <span className="font-semibold">{success.units} units</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Amount Paid:</span>
                            <span className="font-semibold">{formatCurrency(success.units * unitPrice)}</span>
                        </div>
                    </div>

                    <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                            The units will be automatically added to your meter within the next few minutes.
                            You should see the updated balance on your meter display.
                        </AlertDescription>
                    </Alert>

                    <Button
                        variant="outline"
                        onClick={() => setSuccess(null)}
                        className="w-full"
                    >
                        Purchase More Units
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Purchase Electricity Units</CardTitle>
                <CardDescription>
                    Add units to your smart meter. Current balance: {currentUnits.toFixed(2)} units
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Customer Information */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Customer Information</h3>

                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="customerName">Full Name *</Label>
                            <Input
                                id="customerName"
                                value={formData.customerName}
                                onChange={(e) => handleInputChange('customerName', e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="customerEmail">Email (Optional)</Label>
                                <Input
                                    id="customerEmail"
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="customerPhone">Phone (Optional)</Label>
                                <Input
                                    id="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                    placeholder="+234 801 234 5678"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Unit Selection */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Purchase Details</h3>

                    <div>
                        <Label htmlFor="units">Number of Units *</Label>
                        <Input
                            id="units"
                            type="number"
                            min="1"
                            max="1000"
                            value={formData.units}
                            onChange={(e) => handleInputChange('units', e.target.value)}
                            placeholder="Enter number of units"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Price: ₦{unitPrice} per unit
                        </p>
                    </div>

                    {/* Quick unit selection buttons */}
                    <div className="flex flex-wrap gap-2">
                        {[10, 20, 50, 100].map((units) => (
                            <Button
                                key={units}
                                variant="outline"
                                size="sm"
                                onClick={() => handleInputChange('units', units.toString())}
                            >
                                {units} units
                            </Button>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Payment Method</h3>

                    <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleInputChange('paymentMethod', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="card">
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="h-4 w-4" />
                                    <span>Debit/Credit Card</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="bank_transfer">
                                <div className="flex items-center space-x-2">
                                    <Building2 className="h-4 w-4" />
                                    <span>Bank Transfer</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="mobile_money">
                                <div className="flex items-center space-x-2">
                                    <Smartphone className="h-4 w-4" />
                                    <span>Mobile Money</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Summary */}
                {totalAmount > 0 && (
                    <div className="space-y-2 p-4 bg-muted rounded-lg">
                        <div className="flex justify-between text-sm">
                            <span>Units:</span>
                            <span>{formData.units} units</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Price per unit:</span>
                            <span>₦{unitPrice}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Total Amount:</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </div>
                    </div>
                )}

                <Button
                    onClick={handlePurchase}
                    disabled={!isFormValid() || loading}
                    className="w-full"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Purchase...
                        </>
                    ) : (
                        `Purchase ${formData.units || 0} Units - ${formatCurrency(totalAmount)}`
                    )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                    Units will be automatically added to your meter after successful payment.
                    This usually takes 1-2 minutes.
                </p>
            </CardContent>
        </Card>
    )
}