import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getCustomer, getDeals, createDeal, getFollowUps, createFollowUp } from "../api"
import type { Customer, Deal, FollowUp, CreateDeal, CreateFollowUp } from "../types"

const USER_ID = "user-1"

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [showDealForm, setShowDealForm] = useState(false)
  const [showFUpForm, setShowFUpForm] = useState(false)
  const [dealForm, setDealForm] = useState<CreateDeal>({ customer_id: id!, title: "" })
  const [fupForm, setFupForm] = useState<CreateFollowUp>({ customer_id: id!, type: "call", scheduled_at: "" })

  useEffect(() => {
    if (!id) return
    getCustomer(id).then(setCustomer)
    getDeals(USER_ID).then((d) => setDeals(d.filter((x) => x.customer_id === id)))
    getFollowUps(USER_ID).then((f) => setFollowUps(f.filter((x) => x.customer_id === id)))
  }, [id])

  if (!customer) return <p className="text-slate-400 mt-8 text-center">Loading...</p>

  const handleDeal = async (e: React.FormEvent) => {
    e.preventDefault()
    const d = await createDeal(USER_ID, { ...dealForm, customer_id: id! })
    setDeals([...deals, d])
    setDealForm({ customer_id: id!, title: "" })
    setShowDealForm(false)
  }

  const handleFUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const f = await createFollowUp(USER_ID, { ...fupForm, customer_id: id! })
    setFollowUps([...followUps, f])
    setFupForm({ customer_id: id!, type: "call", scheduled_at: "" })
    setShowFUpForm(false)
  }

  return (
    <div>
      <Link to="/customers" className="text-sm text-brand-600 hover:text-brand-700 mb-4 inline-block">&larr; Back to Customers</Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-800">{customer.name}</h2>
        <div className="flex gap-6 mt-3 text-sm">
          <div><span className="text-slate-400">Phone:</span> <span className="text-slate-700 font-medium">{customer.phone || "-"}</span></div>
          <div><span className="text-slate-400">Email:</span> <span className="text-slate-700 font-medium">{customer.email || "-"}</span></div>
          <div><span className="text-slate-400">Source:</span> <span className="text-slate-700 font-medium">{customer.source || "-"}</span></div>
        </div>
        {customer.notes && <p className="text-sm text-slate-600 mt-3 bg-slate-50 rounded-lg p-3">{customer.notes}</p>}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Deals</h3>
            <button onClick={() => setShowDealForm(!showDealForm)} className="text-sm text-brand-600 hover:text-brand-700 font-medium">+ New Deal</button>
          </div>
          {showDealForm && (
            <form onSubmit={handleDeal} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-4 space-y-3">
              <h4 className="text-sm font-semibold text-slate-700">New Deal</h4>
              <input placeholder="Deal title *" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={dealForm.title} onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })} required />
              <input placeholder="Value (₦)" type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={dealForm.value ?? ""} onChange={(e) => setDealForm({ ...dealForm, value: e.target.value ? Number(e.target.value) : undefined })} />
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={dealForm.status} onChange={(e) => setDealForm({ ...dealForm, status: e.target.value })}>
                <option value="lead">Lead</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">Save Deal</button>
            </form>
          )}
          <div className="space-y-2">
            {deals.map((d) => (
              <div key={d.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-slate-800">{d.title}</p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(d.status)}`}>{d.status}</span>
                </div>
                {d.value && <p className="text-sm text-slate-600">₦{d.value.toLocaleString()}</p>}
              </div>
            ))}
            {deals.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No deals yet</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Follow-ups</h3>
            <button onClick={() => setShowFUpForm(!showFUpForm)} className="text-sm text-brand-600 hover:text-brand-700 font-medium">+ Schedule</button>
          </div>
          {showFUpForm && (
            <form onSubmit={handleFUp} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-4 space-y-3">
              <h4 className="text-sm font-semibold text-slate-700">Schedule Follow-up</h4>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={fupForm.type} onChange={(e) => setFupForm({ ...fupForm, type: e.target.value })}>
                <option value="call">Call</option>
                <option value="visit">In-person Visit</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
              <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={fupForm.scheduled_at} onChange={(e) => setFupForm({ ...fupForm, scheduled_at: e.target.value })} required />
              <textarea placeholder="Notes (optional)" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" rows={2} value={fupForm.notes ?? ""} onChange={(e) => setFupForm({ ...fupForm, notes: e.target.value })} />
              <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">Schedule</button>
            </form>
          )}
          <div className="space-y-2">
            {followUps.map((f) => (
              <div key={f.id} className={`bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow ${f.completed_at ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${f.completed_at ? "" : "font-medium"} text-slate-800 capitalize`}>{f.type}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${f.completed_at ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {f.completed_at ? "Done" : "Pending"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-1">{new Date(f.scheduled_at).toLocaleString()}</p>
                {f.notes && <p className="text-xs text-slate-500 mt-1">{f.notes}</p>}
              </div>
            ))}
            {followUps.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No follow-ups scheduled</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function statusColor(s: string) {
  switch (s) {
    case "lead": return "bg-blue-100 text-blue-700"
    case "negotiation": return "bg-amber-100 text-amber-700"
    case "won": return "bg-green-100 text-green-700"
    case "lost": return "bg-red-100 text-red-700"
    default: return "bg-slate-100 text-slate-700"
  }
}
