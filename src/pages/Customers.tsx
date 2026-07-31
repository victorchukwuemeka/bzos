import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getCustomers, createCustomer } from "../api"
import type { Customer, CreateCustomer } from "../types"

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateCustomer>({ name: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    getCustomers()
      .then((r) => setCustomers(r as Customer[]))
      .catch((e) => setError(String(e)))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.name.trim()) return
    try {
      const created = await createCustomer(form)
      setCustomers([...customers, created as Customer])
      setForm({ name: "" })
      setShowForm(false)
    } catch (err) {
      setError(String(err))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Customers</h2>
          <p className="text-slate-500 text-sm mt-0.5">{customers.length} total</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
          + Add Customer
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}
      <div className="h-4" />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-slate-800">New Customer</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" value={form.source ?? ""} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Min Budget (₦)</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" value={form.budget_min ?? ""} onChange={(e) => setForm({ ...form, budget_min: e.target.value ? Number(e.target.value) : undefined })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Budget (₦)</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" value={form.budget_max ?? ""} onChange={(e) => setForm({ ...form, budget_max: e.target.value ? Number(e.target.value) : undefined })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" rows={2} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">Save Customer</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Name</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Customer ID</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Phone</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Email</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Source</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Budget Range</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <Link to={`/customers/${c.id}`} className="text-brand-600 hover:text-brand-700 font-medium">{c.name}</Link>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs text-slate-500">{c.id.slice(0, 8)}</span>
                  <button onClick={() => navigator.clipboard.writeText(c.id)} title="Copy full ID" className="ml-2 text-xs text-slate-400 hover:text-brand-600 transition-colors">⧉</button>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{c.phone || <span className="text-slate-400">-</span>}</td>
                <td className="px-5 py-3.5 text-slate-600">{c.email || <span className="text-slate-400">-</span>}</td>
                <td className="px-5 py-3.5 text-slate-600">{c.source || <span className="text-slate-400">-</span>}</td>
                <td className="px-5 py-3.5 text-slate-600">
                  {c.budget_min ? `₦${c.budget_min.toLocaleString()}` : ""}
                  {c.budget_max ? ` - ₦${c.budget_max.toLocaleString()}` : <span className="text-slate-400">-</span>}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">No customers yet. Click "Add Customer" to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
