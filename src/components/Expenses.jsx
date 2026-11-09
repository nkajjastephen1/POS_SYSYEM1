import { useMemo, useState } from 'react'
import { EXPENSE_CATEGORIES, money, today, uid } from '../utils'

const EMPTY = { description: '', amount: '', category: EXPENSE_CATEGORIES[0], date: today() }

export default function Expenses({ expenses, setExpenses }) {
  const [form, setForm] = useState(EMPTY)
  const [filter, setFilter] = useState('All')

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!form.description.trim() || !Number(form.amount)) return
    setExpenses((xs) => [
      { id: uid(), ...form, description: form.description.trim(), amount: Number(form.amount) },
      ...xs,
    ])
    setForm({ ...EMPTY, category: form.category, date: form.date })
  }

  const remove = (id) => setExpenses((xs) => xs.filter((x) => x.id !== id))

  const visible = useMemo(
    () =>
      expenses
        .filter((x) => filter === 'All' || x.category === filter)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, filter],
  )

  const byCategory = useMemo(() => {
    const totals = {}
    expenses.forEach((x) => (totals[x.category] = (totals[x.category] || 0) + x.amount))
    return Object.entries(totals).sort((a, b) => b[1] - a[1])
  }, [expenses])

  const grandTotal = expenses.reduce((s, x) => s + x.amount, 0)
  const visibleTotal = visible.reduce((s, x) => s + x.amount, 0)

  return (
    <div className="two-col">
      <div className="stack">
        <form className="panel form" onSubmit={submit}>
          <h2>Add expense</h2>
          <label>
            Description
            <input value={form.description} onChange={update('description')} required />
          </label>
          <label>
            Amount
            <input type="number" min="0" value={form.amount} onChange={update('amount')} required />
          </label>
          <label>
            Category
            <select value={form.category} onChange={update('category')}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input type="date" value={form.date} onChange={update('date')} />
          </label>
          <div className="actions">
            <button className="btn primary">Add expense</button>
          </div>
        </form>

        <section className="panel">
          <h2>By category</h2>
          {!byCategory.length && <p className="muted">No expenses yet.</p>}
          {byCategory.map(([cat, amt]) => (
            <div key={cat} className="bar-row">
              <div className="row">
                <span>{cat}</span>
                <span>{money(amt)}</span>
              </div>
              <div className="bar">
                <div style={{ width: `${(amt / grandTotal) * 100}%` }} />
              </div>
            </div>
          ))}
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h2>Expenses</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.map((x) => (
              <tr key={x.id}>
                <td>{x.date}</td>
                <td>{x.description}</td>
                <td>
                  <span className="tag">{x.category}</span>
                </td>
                <td>{money(x.amount)}</td>
                <td className="row-actions">
                  <button className="link danger" onClick={() => remove(x.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Total</td>
              <td>{money(visibleTotal)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
        {!visible.length && <p className="muted">No expenses to show.</p>}
      </section>
    </div>
  )
}
