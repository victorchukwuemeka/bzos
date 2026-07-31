import { useEffect, useState } from "react"
import { getTransactions, getTransactionsSummary, createTransaction } from "../api"
import type { Transaction, CreateTransaction } from "../types"

export default function Transactions() {
  const [items, setItems] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<[number, number, number]>([0, 0, 0])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState<CreateTransaction>({ type: "sale", amount: 0 })

  useEffect(() => {
    getTransactions().then(setItems).catch((e) => setError(String(e)))
    getTransactionsSummary().then(setSummary).catch((e) => setError(String(e)))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.amount || form.amount <= 0) { setError("Amount must be greater than 0"); return }
    try {
      const clean = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== "" && v !== undefined))
      const t = await createTransaction(clean as CreateTransaction)
      setItems([...items, t])
      setForm({ type: "sale", amount: 0 })
      setShowForm(false)
      getTransactionsSummary().then(setSummary)
    } catch (err) {
      setError(String(err))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Transactions</h2>
          <p className="text-slate-500 text-sm mt-0.5">{items.length} records</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
          + Record Transaction
        </button>
      </div>

      <div className="h-5" />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}

      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-emerald-600">₦{summary[0].toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-500">₦{summary[1].toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Net Profit</p>
          <p className={`text-2xl font-bold ${summary[2] >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {summary[2] >= 0 ? "+" : ""}₦{summary[2].toLocaleString()}
          </p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Record Transaction</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="sale">💰 Sale</option>
                <option value="expense">📤 Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₦) *</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.payment_method ?? ""} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">Record</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Type</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Amount</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Description</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Category</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.type === "sale" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {t.type === "sale" ? "💰 Sale" : "📤 Expense"}
                  </span>
                </td>
                <td className={`px-5 py-3.5 font-semibold ${t.type === "sale" ? "text-emerald-600" : "text-red-500"}`}>
                  ₦{t.amount.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-slate-600">{t.description || <span className="text-slate-400">-</span>}</td>
                <td className="px-5 py-3.5 text-slate-600">{t.category || <span className="text-slate-400">-</span>}</td>
                <td className="px-5 py-3.5 text-slate-500">{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400">No transactions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
