import { isSameDay, money } from '../utils'

export default function Dashboard({ sales, expenses, products, onReset }) {
  const sum = (arr, key) => arr.reduce((s, x) => s + x[key], 0)

  const todaySales = sales.filter((s) => isSameDay(s.date))
  const todayExpenses = expenses.filter((x) => isSameDay(x.date))

  const totalSales = sum(sales, 'total')
  const totalExpenses = sum(expenses, 'amount')
  const profit = totalSales - totalExpenses
  const lowStock = products.filter((p) => p.stock <= 5)

  const cards = [
    { label: "Today's sales", value: money(sum(todaySales, 'total')), sub: `${todaySales.length} transactions` },
    { label: "Today's expenses", value: money(sum(todayExpenses, 'amount')), sub: `${todayExpenses.length} entries` },
    { label: 'Total sales', value: money(totalSales), sub: `${sales.length} transactions` },
    { label: 'Total expenses', value: money(totalExpenses), sub: `${expenses.length} entries` },
    { label: 'Net profit', value: money(profit), sub: 'Sales − expenses', tone: profit < 0 ? 'negative' : 'positive' },
  ]

  return (
    <div className="stack">
      <div className="cards">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <span className="muted small">{c.label}</span>
            <strong className={c.tone}>{c.value}</strong>
            <span className="muted small">{c.sub}</span>
          </div>
        ))}
      </div>

      <div className="two-col">
        <section className="panel">
          <h2>Recent sales</h2>
          {!sales.length && <p className="muted">No sales yet.</p>}
          <table>
            <tbody>
              {sales.slice(0, 10).map((s) => (
                <tr key={s.id}>
                  <td>{new Date(s.date).toLocaleString()}</td>
                  <td>{s.items.reduce((n, i) => n + i.qty, 0)} items</td>
                  <td>{money(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h2>Low stock</h2>
          {!lowStock.length && <p className="muted">All products are well stocked.</p>}
          <table>
            <tbody>
              {lowStock.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="negative">{p.stock} left</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <div>
        <button className="btn danger" onClick={onReset}>Reset all data</button>
      </div>
    </div>
  )
}
