import { useState } from 'react'
import { money, uid } from '../utils'

const EMPTY = { name: '', price: '', stock: '', category: '' }

export default function Products({ products, setProducts }) {
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || form.price === '') return
    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      category: form.category.trim() || 'General',
    }
    if (editingId) {
      setProducts((ps) => ps.map((p) => (p.id === editingId ? { ...p, ...data } : p)))
    } else {
      setProducts((ps) => [...ps, { id: uid(), ...data }])
    }
    setForm(EMPTY)
    setEditingId(null)
  }

  const edit = (p) => {
    setEditingId(p.id)
    setForm({ name: p.name, price: p.price, stock: p.stock, category: p.category })
  }

  const remove = (id) => {
    if (confirm('Delete this product?')) setProducts((ps) => ps.filter((p) => p.id !== id))
  }

  return (
    <div className="two-col">
      <form className="panel form" onSubmit={submit}>
        <h2>{editingId ? 'Edit product' : 'Add product'}</h2>
        <label>
          Name
          <input value={form.name} onChange={update('name')} required />
        </label>
        <label>
          Price
          <input type="number" min="0" value={form.price} onChange={update('price')} required />
        </label>
        <label>
          Stock
          <input type="number" min="0" value={form.stock} onChange={update('stock')} />
        </label>
        <label>
          Category
          <input value={form.category} onChange={update('category')} placeholder="General" />
        </label>
        <div className="actions">
          {editingId && (
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setEditingId(null)
                setForm(EMPTY)
              }}
            >
              Cancel
            </button>
          )}
          <button className="btn primary">{editingId ? 'Save' : 'Add'}</button>
        </div>
      </form>

      <section className="panel">
        <h2>Products ({products.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{money(p.price)}</td>
                <td className={p.stock <= 5 ? 'negative' : ''}>{p.stock}</td>
                <td className="row-actions">
                  <button className="link" onClick={() => edit(p)}>Edit</button>
                  <button className="link danger" onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
