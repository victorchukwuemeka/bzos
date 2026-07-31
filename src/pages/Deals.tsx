import { useEffect, useState } from "react"
import { getDeals, createDeal } from "../api"
import type { Deal, CreateDeal } from "../types"

const stages = [
  { key: "lead", label: "Lead", color: "bg-blue-500" },
  { key: "negotiation", label: "Negotiation", color: "bg-amber-500" },
  { key: "won", label: "Won", color: "bg-green-500" },
  { key: "lost", label: "Lost", color: "bg-red-500" },
]

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateDeal>({ title: "" })

  useEffect(() => { getDeals().then(setDeals) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== "" && v !== undefined))
    const d = await createDeal(clean as CreateDeal)
    setDeals([...deals, d])
    setForm({ title: "" })
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Deals Pipeline</h2>
          <p className="text-slate-500 text-sm mt-0.5">{deals.length} deals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
          + Add Deal
        </button>
      </div>

      <div className="h-5" />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-slate-800">New Deal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Value (₦)</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.value ?? ""} onChange={(e) => setForm({ ...form, value: e.target.value ? Number(e.target.value) : undefined })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="lead">Lead</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">Save Deal</button>
        </form>
      )}

      <div className="grid grid-cols-4 gap-5">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.status === stage.key)
          const total = stageDeals.reduce((sum, d) => sum + (d.value ?? 0), 0)
          return (
            <div key={stage.key}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                  <h3 className="text-sm font-semibold text-slate-700">{stage.label}</h3>
                </div>
                <span className="text-xs text-slate-400">{stageDeals.length}</span>
              </div>
              <div className="space-y-2">
                {stageDeals.map((d) => (
                  <div key={d.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                    <p className="font-medium text-sm text-slate-800">{d.title}</p>
                    {d.value && <p className="text-sm font-semibold text-slate-700 mt-1">₦{d.value.toLocaleString()}</p>}
                    {d.customer_id && <p className="text-xs text-slate-400 mt-2">CID: {d.customer_id.slice(0, 8)}</p>}
                  </div>
                ))}
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Total: ₦{total.toLocaleString()}</p>
                </div>
                {stageDeals.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No deals</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
