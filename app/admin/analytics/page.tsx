"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Clock, Flame, PhilippinePeso } from "lucide-react"

// Sales data by day
const salesData = [
  { day: "Monday", sales: 2400, orders: 24, revenue: 2400 },
  { day: "Tuesday", sales: 1398, orders: 22, revenue: 1398 },
  { day: "Wednesday", sales: 9800, orders: 29, revenue: 9800 },
  { day: "Thursday", sales: 3908, orders: 35, revenue: 3908 },
  { day: "Friday", sales: 4800, orders: 45, revenue: 4800 },
  { day: "Saturday", sales: 3800, orders: 50, revenue: 3800 },
  { day: "Sunday", sales: 4300, orders: 38, revenue: 4300 },
]

// Peak hours data
const peakHoursData = [
  { hour: "11am", orders: 5 },
  { hour: "12pm", orders: 18 },
  { hour: "1pm", orders: 22 },
  { hour: "2pm", orders: 15 },
  { hour: "5pm", orders: 8 },
  { hour: "6pm", orders: 25 },
  { hour: "7pm", orders: 28 },
  { hour: "8pm", orders: 20 },
  { hour: "9pm", orders: 12 },
]

// Popular dishes
const popularDishes = [
  { name: "Truffle Dumplings", orders: 145, revenue: 1885.55 },
  { name: "Pan-Seared Salmon", orders: 98, revenue: 2449.02 },
  { name: "Wagyu Beef Steak", orders: 76, revenue: 2507.24 },
  { name: "Chocolate Lava Cake", orders: 112, revenue: 1006.88 },
  { name: "Crispy Spring Rolls", orders: 134, revenue: 1206.66 },
]

// Category distribution
const categoryData = [
  { name: "Appetizers", value: 35, fill: "#f59e0b" },
  { name: "Main Courses", value: 45, fill: "#8b5a3c" },
  { name: "Desserts", value: 12, fill: "#d4a574" },
  { name: "Beverages", value: 8, fill: "#6b4c3a" },
]

export default function AnalyticsPage() {
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const avgOrderValue = (totalRevenue / totalOrders).toFixed(2)
  const topDish = popularDishes[0]

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h2>
        <p className="text-muted-foreground">Comprehensive sales insights and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Revenue</CardTitle>
            <PhilippinePeso className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Orders</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Avg Order Value</CardTitle>
            <PhilippinePeso className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${avgOrderValue}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Top Dish</CardTitle>
            <Flame className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{topDish.orders}</div>
            <p className="text-xs text-muted-foreground truncate">{topDish.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend - This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="day" stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--color-card))",
                    border: "1px solid hsl(var(--color-border))",
                  }}
                  labelStyle={{ color: "hsl(var(--color-foreground))" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--color-primary))"
                  dot={{ fill: "hsl(var(--color-primary))" }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="day" stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--color-card))",
                    border: "1px solid hsl(var(--color-border))",
                  }}
                  labelStyle={{ color: "hsl(var(--color-foreground))" }}
                />
                <Bar dataKey="orders" fill="hsl(var(--color-primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Peak Hours Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--color-card))",
                    border: "1px solid hsl(var(--color-border))",
                  }}
                  labelStyle={{ color: "hsl(var(--color-foreground))" }}
                />
                <Bar dataKey="orders" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--color-card))",
                    border: "1px solid hsl(var(--color-border))",
                  }}
                  labelStyle={{ color: "hsl(var(--color-foreground))" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Popular Dishes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Dishes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Dish Name</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Orders</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Revenue</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {popularDishes.map((dish, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="py-4 px-4 text-foreground font-medium">{dish.name}</td>
                    <td className="py-4 px-4 text-foreground">{dish.orders}</td>
                    <td className="py-4 px-4 text-foreground font-semibold">${dish.revenue.toFixed(2)}</td>
                    <td className="py-4 px-4 text-muted-foreground">${(dish.revenue / dish.orders).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
