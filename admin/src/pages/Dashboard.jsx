import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../config'
import Loading from '../components/Loading'
import { ShoppingBag, Users, Package, CreditCard, XCircle, CheckCircle, Clock, Truck } from 'lucide-react'

const Dashboard = ({ token }) => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalEarnings: 0,
        totalProducts: 0,
        totalUsers: 0,
        ordersByStatus: {
            "Order Placed": 0,
            "Packing": 0,
            "Shipped": 0,
            "Out for delivery": 0,
            "Delivered": 0,
            "Cancelled": 0
        },
        recentOrders: []
    })

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const [ordersRes, productsRes, usersRes] = await Promise.all([
                axios.post(backendUrl + '/api/order/list', {}, { headers: { token } }),
                axios.get(backendUrl + '/api/product/list'),
                axios.post(backendUrl + '/api/user/all-users', {}, { headers: { token } })
            ])

            const orders = ordersRes.data.success ? ordersRes.data.orders : [];
            const products = productsRes.data.success ? productsRes.data.products : [];
            const users = usersRes.data.success ? usersRes.data.users : [];

            // Calculate Stats
            let totalEarnings = 0;
            const statusCounts = {
                "Order Placed": 0,
                "Packing": 0,
                "Shipped": 0,
                "Out for delivery": 0,
                "Delivered": 0,
                "Cancelled": 0
            };

            orders.forEach(order => {
                if (order.status !== 'Cancelled') {
                    // Assuming amount is number
                    totalEarnings += Number(order.amount);
                }
                if (statusCounts[order.status] !== undefined) {
                    statusCounts[order.status]++;
                } else {
                    // Handle unknown statuses if any
                    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
                }
            });

            setStats({
                totalOrders: orders.length,
                totalEarnings,
                totalProducts: products.length,
                totalUsers: users.length,
                ordersByStatus: statusCounts,
                recentOrders: orders.reverse().slice(0, 5) // Last 5 orders
            })

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [token])

    if (loading) return <Loading />

    return (
        <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
                <p className="text-muted-foreground">Performance overview.</p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Earnings"
                    value={`${currency}${stats.totalEarnings.toLocaleString()}`}
                    icon={<CreditCard className="w-5 h-5 text-emerald-600" />}
                    bg="bg-emerald-50"
                    textColor="text-emerald-700"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
                    bg="bg-blue-50"
                    textColor="text-blue-700"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={<Package className="w-5 h-5 text-purple-600" />}
                    bg="bg-purple-50"
                    textColor="text-purple-700"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users className="w-5 h-5 text-orange-600" />}
                    bg="bg-orange-50"
                    textColor="text-orange-700"
                />
            </div>

            {/* Status Grid */}
            <h3 className="text-lg font-semibold text-foreground mt-2">Order Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatusCard label="Placed" count={stats.ordersByStatus["Order Placed"]} icon={<Clock className="w-4 h-4" />} color="text-yellow-600" bg="bg-yellow-50" />
                <StatusCard label="Packing" count={stats.ordersByStatus["Packing"]} icon={<Package className="w-4 h-4" />} color="text-indigo-600" bg="bg-indigo-50" />
                <StatusCard label="Shipped" count={stats.ordersByStatus["Shipped"]} icon={<Truck className="w-4 h-4" />} color="text-blue-600" bg="bg-blue-50" />
                <StatusCard label="Out for delivery" count={stats.ordersByStatus["Out for delivery"]} icon={<Truck className="w-4 h-4" />} color="text-cyan-600" bg="bg-cyan-50" />
                <StatusCard label="Delivered" count={stats.ordersByStatus["Delivered"]} icon={<CheckCircle className="w-4 h-4" />} color="text-green-600" bg="bg-green-50" />
                <StatusCard label="Cancelled" count={stats.ordersByStatus["Cancelled"]} icon={<XCircle className="w-4 h-4" />} color="text-red-600" bg="bg-red-50" />
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-5 mt-2">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Order ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 rounded-r-lg">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map((order, i) => (
                                <tr key={order._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3 font-medium text-foreground">#{order._id.slice(-6)}</td>
                                    <td className="px-4 py-3">{order.address.firstName} {order.address.lastName}</td>
                                    <td className="px-4 py-3 font-medium">{currency}{order.amount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {stats.recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground italic">No recent orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

const StatCard = ({ title, value, icon, bg, textColor }) => (
    <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bg} ${textColor}`}>
            {icon}
        </div>
    </div>
)

const StatusCard = ({ label, count, icon, color, bg }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 ${bg} ${color}`}>
        <div className="mb-2 opacity-80">{icon}</div>
        <span className="text-2xl font-bold mb-1">{count}</span>
        <span className="text-xs font-medium opacity-80 text-center whitespace-nowrap">{label}</span>
    </div>
)

export default Dashboard
