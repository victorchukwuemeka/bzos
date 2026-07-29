import { NavLink } from "react-router-dom"

const links = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/deals", label: "Deals", icon: "💰" },
  { to: "/follow-ups", label: "Follow-ups", icon: "🔔" },
  { to: "/transactions", label: "Transactions", icon: "💳" },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-800">
        <h1 className="text-lg font-bold tracking-tight">Victor</h1>
        <p className="text-xs text-slate-500 mt-0.5">Business Manager</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`
            }
          >
            <span className="text-lg">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-600">v0.1.0 - Offline</p>
      </div>
    </aside>
  )
}
