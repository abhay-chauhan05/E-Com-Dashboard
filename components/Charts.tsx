// components/Charts.tsx
'use client'

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartsProps {
  categoryStats: Array<{ category: string; count: number }>
  stockAvailability: { inStock: number; outOfStock: number }
  priceDistribution: Record<string, number>
  productsOverTime: Array<{ date: string; count: number }>
}

const COLORS = ['#3B82F6', '#6366F1', '#7C3AED', '#4F46E5', '#60A5FA', '#8B5CF6']

export function CategoryChart({ data }: { data: Array<{ category: string; count: number }> }) {
  if (!data.length) {
    return <div className="text-blue-500 text-center py-8">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#BFDBFE" />
        <XAxis dataKey="category" stroke="#3B82F6" />
        <YAxis stroke="#3B82F6" />
        <Tooltip />
        <Bar dataKey="count" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function StockChart({ data }: { data: { inStock: number; outOfStock: number } }) {
  const chartData = [
    { name: 'In Stock', value: data.inStock },
    { name: 'Out of Stock', value: data.outOfStock },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={80}
          fill="#3B82F6"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function PriceDistributionChart({
  data,
}: {
  data: Record<string, number>
}) {
  const chartData = Object.entries(data).map(([range, count]) => ({
    range,
    count,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#BFDBFE" />
        <XAxis dataKey="range" stroke="#3B82F6" />
        <YAxis stroke="#3B82F6" />
        <Tooltip />
        <Bar dataKey="count" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function TimelineChart({
  data,
}: {
  data: Array<{ date: string; count: number }>
}) {
  if (!data.length) {
    return <div className="text-purple-500 text-center py-8">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
        <XAxis dataKey="date" stroke="#7C3AED" />
        <YAxis stroke="#7C3AED" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#7C3AED"
          name="Products Added"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function DashboardCharts(props: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Products by Category</h3>
        <CategoryChart data={props.categoryStats} />
      </div>

      <div className="rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Stock Availability</h3>
        <StockChart data={props.stockAvailability} />
      </div>

      <div className="rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Price Distribution</h3>
        <PriceDistributionChart data={props.priceDistribution} />
      </div>

      <div className="rounded-lg border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Products Added (Last 30 Days)</h3>
        <TimelineChart data={props.productsOverTime} />
      </div>
    </div>
  )
}
