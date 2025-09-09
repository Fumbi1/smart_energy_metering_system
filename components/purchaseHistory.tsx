"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, Download, CheckCircle, Clock, XCircle } from "lucide-react"
import { UnitPurchaseService, UnitPurchase } from "@/lib/services/unitPurchaseService"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"

interface PurchaseHistoryProps {
    deviceId: string
}

export function PurchaseHistory({ deviceId }: PurchaseHistoryProps) {
    const [purchases, setPurchases] = useState<UnitPurchase[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    const fetchPurchases = async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await UnitPurchaseService.getPurchaseHistory(deviceId)
            setPurchases(data)
        } catch (err) {
            setError('Failed to load purchase history')
            console.error('Purchase history error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPurchases()
    }, [deviceId])

    const getStatusBadge = (status: string, appliedToMeter: boolean) => {
        if (status === 'completed' && appliedToMeter) {
            return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Applied</Badge>
        } else if (status === 'completed' && !appliedToMeter) {
            return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
        } else if (status === 'failed') {
            return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
        } else {
            return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Processing</Badge>
        }
    }

    const getTotalPurchased = () => {
        return purchases
            .filter(p => p.payment_status === 'completed')
            .reduce((total, p) => total + p.units_purchased, 0)
    }

    const getTotalSpent = () => {
        return purchases
            .filter(p => p.payment_status === 'completed')
            .reduce((total, p) => total + p.amount_paid, 0)
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                    Loading purchase history...
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{error}</p>
                        <Button variant="outline" onClick={fetchPurchases} className="mt-2">
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{purchases.length}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Units Purchased</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{getTotalPurchased().toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Successfully completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(getTotalSpent())}</div>
                        <p className="text-xs text-muted-foreground">All purchases</p>
                    </CardContent>
                </Card>
            </div>

            {/* Purchase History Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Purchase History</CardTitle>
                            <CardDescription>
                                View all your electricity unit purchases
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchPurchases}
                                disabled={loading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {purchases.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No purchases found</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Your purchase history will appear here after you buy units
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead className="text-right">Units</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Payment Method</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchases.map((purchase) => (
                                        <TableRow key={purchase.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {format(new Date(purchase.purchase_date), 'MMM dd, yyyy')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(purchase.purchase_date), 'HH:mm')}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-mono text-sm">#{purchase.id}</p>
                                                {purchase.payment_reference && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {purchase.payment_reference}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{purchase.customer_name}</p>
                                                    {purchase.customer_email && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {purchase.customer_email}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {purchase.units_purchased.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(purchase.amount_paid)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {purchase.payment_method.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(purchase.payment_status, purchase.applied_to_meter)}
                                                {purchase.applied_at && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Applied: {format(new Date(purchase.applied_at), 'MMM dd, HH:mm')}
                                                    </p>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}