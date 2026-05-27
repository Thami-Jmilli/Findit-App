export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }) : "—";

export const CATEGORIES = ["Electronics","Clothing","Bags & Wallets","Keys & Cards","Documents","Jewelry","Books","Sports","Pets","Other"];

export const STATUS_MAP = {
  pending:  { label: "Pending",  cls: "badge-pending"  },
  approved: { label: "Approved", cls: "badge-approved" },
  matched:  { label: "Matched",  cls: "badge-matched"  },
  rejected: { label: "Rejected", cls: "badge-rejected" },
  returned: { label: "Returned", cls: "badge-returned" },
};

export const TYPE_MAP = {
  lost:  { label: "Lost",  cls: "badge-lost"  },
  found: { label: "Found", cls: "badge-found" },
};

export function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: "badge-pending" };
  return <span className={s.cls}>{s.label}</span>;
}

export function TypeBadge({ type }) {
  const t = TYPE_MAP[type] || { label: type, cls: "badge-lost" };
  return <span className={t.cls}>{t.label}</span>;
}

export function Spinner({ sm }) {
  return (
    <div className={`inline-block border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin ${sm ? "w-4 h-4" : "w-7 h-7"}`} />
  );
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon || "📭"}</div>
      <p className="text-lg font-semibold text-slate-700 mb-1">{title}</p>
      {desc && <p className="text-sm text-slate-500 mb-4">{desc}</p>}
      {action}
    </div>
  );
}
