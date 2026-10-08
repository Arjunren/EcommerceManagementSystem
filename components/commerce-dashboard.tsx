"use client";

import { useMemo, useState } from "react";
import { Bell, Boxes, ChevronDown, CircleDollarSign, LayoutDashboard, Menu, PackageCheck, Search, ShoppingBag, Users, X } from "lucide-react";

const orders = [
  { id: "#1048", customer: "Riley Morgan", item: "Studio Headphones", amount: "$299.80", status: "Processing", date: "Today, 10:42" },
  { id: "#1047", customer: "Noah Kim", item: "Oak Standing Desk", amount: "$529.00", status: "Shipped", date: "Today, 09:18" },
  { id: "#1046", customer: "Avery Patel", item: "Halo Task Lamp", amount: "$159.00", status: "Delivered", date: "Yesterday" },
  { id: "#1045", customer: "Sofia Reyes", item: "Canvas Carryall", amount: "$116.00", status: "Processing", date: "Yesterday" },
  { id: "#1044", customer: "Ethan Jones", item: "Ergo Desk Chair", amount: "$389.00", status: "Delivered", date: "Oct 6" },
];

const products = [
  { initials: "SH", name: "Studio Headphones", sku: "AUD-HDP-01", stock: 42, tone: "violet" },
  { initials: "OD", name: "Oak Standing Desk", sku: "WRK-DSK-02", stock: 8, tone: "amber" },
  { initials: "HL", name: "Halo Task Lamp", sku: "LGT-LMP-03", stock: 3, tone: "blue" },
];

const navigation = [
  ["Overview", LayoutDashboard], ["Orders", ShoppingBag], ["Products", Boxes], ["Customers", Users],
] as const;

export function CommerceDashboard() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? orders.filter((order) => Object.values(order).some((value) => value.toLowerCase().includes(normalized))) : orders;
  }, [query]);

  return (
    <div className="app-shell">
      <aside className={mobileOpen ? "sidebar sidebar-open" : "sidebar"} aria-label="Primary navigation">
        <div className="brand"><span className="brand-mark"><PackageCheck size={21} /></span><span>Northstar</span></div>
        <button className="close-menu" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></button>
        <nav>
          <p className="nav-label">Workspace</p>
          {navigation.map(([label, Icon]) => (
            <button className={active === label ? "nav-item active" : "nav-item"} key={label} onClick={() => { setActive(label); setMobileOpen(false); }}>
              <Icon size={18} /><span>{label}</span>{label === "Orders" ? <em>12</em> : null}
            </button>
          ))}
        </nav>
        <div className="workspace-card">
          <span className="workspace-icon">NS</span>
          <div><strong>Northstar Store</strong><small>Enterprise workspace</small></div>
          <ChevronDown size={15} />
        </div>
        <div className="user-card"><span className="avatar">AR</span><div><strong>Arjun Rao</strong><small>Administrator</small></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></button>
          <label className="search"><Search size={18} /><span className="sr-only">Search orders</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders, customers, products…" /></label>
          <div className="header-actions"><button className="icon-button" aria-label="Notifications"><Bell size={19} /><span /></button><button className="primary-button">+ New order</button></div>
        </header>

        <div className="content">
          <section className="intro"><div><p className="eyebrow">Thursday, October 8</p><h1>{active}</h1><p>Here’s what’s happening across your store today.</p></div><button className="period-button">Last 30 days <ChevronDown size={15} /></button></section>

          <section className="metrics" aria-label="Store metrics">
            <Metric icon={<CircleDollarSign />} label="Net revenue" value="$48,290" delta="12.4%" detail="vs. last period" />
            <Metric icon={<ShoppingBag />} label="Orders" value="1,284" delta="8.2%" detail="vs. last period" />
            <Metric icon={<Users />} label="Customers" value="3,946" delta="5.7%" detail="vs. last period" />
            <Metric icon={<Boxes />} label="Low stock" value="7" delta="Needs review" detail="across 3 categories" warning />
          </section>

          <section className="grid-section">
            <article className="panel revenue-panel">
              <div className="panel-heading"><div><h2>Revenue pulse</h2><p>Net sales performance</p></div><span className="legend"><i /> Revenue</span></div>
              <div className="chart-wrap" aria-label="Revenue increased from 4,200 dollars to 11,800 dollars over seven weeks">
                <div className="axis"><span>$12k</span><span>$8k</span><span>$4k</span><span>$0</span></div>
                <svg className="chart" viewBox="0 0 600 190" role="img" aria-hidden="true" preserveAspectRatio="none">
                  <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7c5cff" stopOpacity=".28"/><stop offset="1" stopColor="#7c5cff" stopOpacity="0"/></linearGradient></defs>
                  <path className="grid-lines" d="M0 15H600M0 70H600M0 125H600M0 180H600" />
                  <path className="area" d="M0 145 C55 132 70 104 120 116 S205 77 260 91 S330 111 382 62 S465 70 510 32 S570 25 600 16 V190 H0Z" />
                  <path className="line" d="M0 145 C55 132 70 104 120 116 S205 77 260 91 S330 111 382 62 S465 70 510 32 S570 25 600 16" />
                </svg>
                <div className="chart-labels"><span>Aug 24</span><span>Aug 31</span><span>Sep 7</span><span>Sep 14</span><span>Sep 21</span><span>Sep 28</span><span>Oct 5</span></div>
              </div>
            </article>

            <article className="panel stock-panel">
              <div className="panel-heading"><div><h2>Inventory watch</h2><p>Items nearing reorder level</p></div><button>View all</button></div>
              <div className="product-list">{products.map((product) => <div className="product" key={product.sku}><span className={`product-thumb ${product.tone}`}>{product.initials}</span><div><strong>{product.name}</strong><small>{product.sku}</small></div><span className={product.stock <= 5 ? "stock critical" : "stock"}>{product.stock} left</span></div>)}</div>
              <div className="inventory-summary"><span><strong>486</strong><small>Active products</small></span><span><strong>96.2%</strong><small>In-stock rate</small></span></div>
            </article>
          </section>

          <section className="panel orders-panel">
            <div className="panel-heading"><div><h2>Recent orders</h2><p>{filteredOrders.length} matching orders</p></div><button>View all orders</button></div>
            <div className="table-scroll"><table><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Date</th><th>Status</th><th className="align-right">Total</th></tr></thead><tbody>{filteredOrders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.customer}</td><td>{order.item}</td><td className="muted">{order.date}</td><td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td><td className="align-right"><strong>{order.amount}</strong></td></tr>)}</tbody></table>{filteredOrders.length === 0 ? <p className="empty">No orders match “{query}”.</p> : null}</div>
          </section>
        </div>
      </main>
      {mobileOpen ? <button className="overlay" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" /> : null}
    </div>
  );
}

function Metric({ icon, label, value, delta, detail, warning = false }: { icon: React.ReactNode; label: string; value: string; delta: string; detail: string; warning?: boolean }) {
  return <article className="metric-card"><div className="metric-top"><span className="metric-icon">{icon}</span><span className={warning ? "delta warning" : "delta"}>{delta}</span></div><p>{label}</p><strong className="metric-value">{value}</strong><small>{detail}</small></article>;
}
