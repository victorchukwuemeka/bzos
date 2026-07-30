import { useEffect, useState } from "react"
import { getDashboardStats } from "../api"
import type { DashboardStats } from "../types"

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [])

  const cards = [
    { label: "Total Customers", value: stats?.total_customers ?? 0, icon: "👥", color: "from-blue-500 to-blue-600" },
    { label: "Active Deals", value: stats?.active_deals ?? 0, icon: "💰", color: "from-emerald-500 to-emerald-600" },
    { label: "Pipeline Value", value: `₦${(stats?.pipeline_value ?? 0).toLocaleString()}`, icon: "📈", color: "from-amber-500 to-amber-600" },
    { label: "Today Follow-ups", value: stats?.today_follow_ups ?? 0, icon: "🔔", color: "from-violet-500 to-violet-600" },
    { label: "Total Sales", value: `₦${(stats?.total_sales ?? 0).toLocaleString()}`, icon: "💳", color: "from-teal-500 to-teal-600" },
    { label: "Net Profit", value: `₦${(stats?.profit ?? 0).toLocaleString()}`, icon: "📊", color: stats && stats.profit >= 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Dashboard</h2>
      <p className="text-slate-500 mb-8">Overview of your business</p>
      <div className="grid grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{c.icon}</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-slate-800">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
