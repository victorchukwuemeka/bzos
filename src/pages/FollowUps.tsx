import { useEffect, useState } from "react"
import { getFollowUps, completeFollowUp, createFollowUp } from "../api"
import type { FollowUp, CreateFollowUp } from "../types"

const typeIcons: Record<string, string> = {
  call: "📞",
  visit: "🤝",
  whatsapp: "💬",
  email: "📧",
}

export default function FollowUps() {
  const [items, setItems] = useState<FollowUp[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateFollowUp>({ customer_id: "", type: "call", scheduled_at: "" })

  useEffect(() => { getFollowUps().then(setItems) }, [])

  const handleComplete = async (id: string) => {
    await completeFollowUp(id)
    setItems(items.map((f) => f.id === id ? { ...f, completed_at: new Date().toISOString(), status: "completed" } : f))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const f = await createFollowUp(form)
    setItems([...items, f])
    setForm({ customer_id: "", type: "call", scheduled_at: "" })
    setShowForm(false)
  }

  const pending = items.filter((f) => !f.completed_at)
  const done = items.filter((f) => f.completed_at)

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Follow-ups</h2>
          <p className="text-slate-500 text-sm mt-0.5">{pending.length} pending, {done.length} completed</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
          + Schedule Follow-up
        </button>
      </div>

      <div className="h-5" />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Schedule Follow-up</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer ID *</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="call">📞 Call</option>
                <option value="visit">🤝 In-person Visit</option>
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="email">📧 Email</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
              <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" rows={2} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">Schedule</button>
        </form>
      )}

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Pending</h3>
        {pending.map((f) => (
          <div key={f.id} className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{typeIcons[f.type] || "🔔"}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 capitalize">{f.type}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Pending</span>
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{new Date(f.scheduled_at).toLocaleString()}</p>
                {f.notes && <p className="text-xs text-slate-500 mt-0.5">{f.notes}</p>}
                <p className="text-xs text-slate-400 mt-0.5">Customer: {f.customer_id.slice(0, 8)}</p>
              </div>
            </div>
            <button onClick={() => handleComplete(f.id)} className="text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors border border-green-200">Mark Done</button>
          </div>
        ))}
        {pending.length === 0 && <p className="text-sm text-slate-400 text-center py-6">All caught up! No pending follow-ups.</p>}
      </div>

      {done.length > 0 && (
        <div className="mt-8 space-y-1">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Completed</h3>
          {done.map((f) => (
            <div key={f.id} className="bg-white rounded-lg border border-slate-200 p-4 flex items-start gap-3 opacity-60">
              <span className="text-lg mt-0.5">{typeIcons[f.type] || "🔔"}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 capitalize">{f.type}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">Done</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{new Date(f.scheduled_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
