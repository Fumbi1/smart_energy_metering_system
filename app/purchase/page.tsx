"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UnitPurchase } from "@/components/unitPurchase"
import { PurchaseHistory } from "@/components/purchaseHistory"
import { useDeviceStatus } from "@/hooks/useDeviceStatus"
import { ShoppingCart, History, Zap, HomeIcon } from "lucide-react"

export default function PurchasePage() {
    const deviceId = process.env.NEXT_PUBLIC_DEFAULT_DEVICE_ID || "METER_001"
    const [activeTab, setActiveTab] = useState("purchase")
    const { status, loading, isOnline } = useDeviceStatus(deviceId)

    const route = useRouter();

    const handlePurchaseSuccess = (purchaseId: number) => {
        // Switch to history tab to show the new purchase
        setActiveTab("history")
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="w-12 h-12 bg-cyan-900 rounded-full fixed right-10 bottom-10 hover:invert active:invert-50">
                <div className="w-full h-full flex justify-center items-center">
                    <HomeIcon className="text-white" onClick={() => route.push("/")} />
                </div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Purchase Electricity Units</h1>
                    <p className="text-muted-foreground">
                        Buy electricity units for your smart meter
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant={isOnline ? "default" : "destructive"}>
                        Device {isOnline ? "Online" : "Offline"}
                    </Badge>
                </div>
            </div>

            {/* Current Status Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span>Current Meter Status</span>
                    </CardTitle>
                    <CardDescription>
                        Device ID: {deviceId}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">
                            <p className="text-muted-foreground">Loading meter status...</p>
                        </div>
                    ) : status ? (
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {status.voltage.toFixed(1)}V
                                </p>
                                <p className="text-sm text-muted-foreground">Voltage</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {status.current.toFixed(2)}A
                                </p>
                                <p className="text-sm text-muted-foreground">Current</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-orange-600">
                                    {status.power.toFixed(0)}W
                                </p>
                                <p className="text-sm text-muted-foreground">Power</p>
                            </div>
                            <div className="text-center">
                                <p className={`text-2xl font-bold ${status.total_units < 10 ? 'text-red-600' :
                                        status.total_units < 50 ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                    {status.total_units.toFixed(5)}
                                </p>
                                <p className="text-sm text-muted-foreground">Units Remaining</p>
                                {status.unit_low && (
                                    <Badge variant="destructive" className="mt-1">Low Units</Badge>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted-foreground">Unable to load meter status</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="purchase" className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Buy Units</span>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center space-x-2">
                        <History className="h-4 w-4" />
                        <span>Purchase History</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="purchase" className="space-y-6">
                    <UnitPurchase
                        deviceId={deviceId}
                        currentUnits={status?.total_units || 0}
                        onPurchaseSuccess={handlePurchaseSuccess}
                    />
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    <PurchaseHistory deviceId={deviceId} />
                </TabsContent>
            </Tabs>

            {/* Help Section */}
            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-blue-600 font-bold">1</span>
                            </div>
                            <h3 className="font-semibold">Select Units</h3>
                            <p className="text-sm text-muted-foreground">
                                Choose how many electricity units you want to purchase
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-green-600 font-bold">2</span>
                            </div>
                            <h3 className="font-semibold">Make Payment</h3>
                            <p className="text-sm text-muted-foreground">
                                Pay securely using your preferred payment method
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-purple-600 font-bold">3</span>
                            </div>
                            <h3 className="font-semibold">Units Added</h3>
                            <p className="text-sm text-muted-foreground">
                                Units are automatically added to your meter within 2 minutes
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Units are added automatically - no need to enter tokens</li>
                            <li>• Your meter must be online to receive new units</li>
                            <li>• Purchase confirmations are sent via SMS (if phone provided)</li>
                            <li>• Contact support if units don't appear within 5 minutes</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}