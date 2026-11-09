import { useMemo, useState } from 'react'
import { money, uid } from '../utils'

export default function POS({ products, setProducts, setSales }) {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [paid, setPaid] = useState('')
  const [receipt, setReceipt] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    )
  }, [products, search])

  const inCart = (id) => cart.find((i) => i.id === id)?.qty ?? 0

  const addToCart = (product) => {
    if (inCart(product.id) >= product.stock) return
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id)
      if (existing) {
        return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...c, { id: product.id, name: product.name, price: product.price, qty: 1 }]
    })
  }

  const changeQty = (id, delta) => {
    const stock = products.find((p) => p.id === id)?.stock ?? 0
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + delta, stock) } : i))
        .filter((i) => i.qty > 0),
    )
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const paidNum = Number(paid) || 0
  const change = paidNum - total

  const checkout = () => {
    if (!cart.length || paidNum < total) return
    const sale = {
      id: uid(),
      date: new Date().toISOString(),
      items: cart,
      total,
      paid: paidNum,
      change,
    }
    setSales((s) => [sale, ...s])
    setProducts((ps) =>
      ps.map((p) => {
        const item = cart.find((i) => i.id === p.id)
        return item ? { ...p, stock: p.stock - item.qty } : p
      }),
    )
    setReceipt(sale)
    setCart([])
    setPaid('')
  }

  return (
    <div className="pos">
      <section className="panel products-panel">
        <input
          className="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="product-grid">
          {filtered.map((p) => {
            const out = p.stock - inCart(p.id) <= 0
            return (
              <button
                key={p.id}
                className={`product-card ${out ? 'disabled' : ''}`}
                onClick={() => addToCart(p)}
                disabled={out}
              >
                <span className="product-name">{p.name}</span>
                <span className="product-price">{money(p.price)}</span>
                <span className={`product-stock ${p.stock <= 5 ? 'low' : ''}`}>
                  {p.stock} in stock
                </span>
              </button>
            )
          })}
          {!filtered.length && <p className="muted">No products found.</p>}
        </div>
      </section>

      <section className="panel cart-panel">
        <h2>Cart</h2>
        {!cart.length && <p className="muted">Tap a product to add it.</p>}
        <ul className="cart-list">
          {cart.map((i) => (
            <li key={i.id}>
              <div>
                <strong>{i.name}</strong>
                <div className="muted small">{money(i.price)} each</div>
              </div>
              <div className="qty">
                <button onClick={() => changeQty(i.id, -1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => changeQty(i.id, 1)}>+</button>
              </div>
              <span className="line-total">{money(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>

        <div className="cart-footer">
          <div className="row total">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
          <label className="row">
            <span>Amount paid</span>
            <input
              type="number"
              min="0"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              placeholder="0"
            />
          </label>
          <div className={`row ${change < 0 ? 'negative' : ''}`}>
            <span>Change</span>
            <span>{paid ? money(change) : '—'}</span>
          </div>
          <div className="actions">
            <button className="btn secondary" onClick={() => setCart([])} disabled={!cart.length}>
              Clear
            </button>
            <button
              className="btn primary"
              onClick={checkout}
              disabled={!cart.length || paidNum < total}
            >
              Checkout
            </button>
          </div>
        </div>
      </section>

      {receipt && (
        <div className="modal-backdrop" onClick={() => setReceipt(null)}>
          <div className="modal receipt" onClick={(e) => e.stopPropagation()}>
            <h3>Receipt</h3>
            <p className="muted small">{new Date(receipt.date).toLocaleString()}</p>
            <ul>
              {receipt.items.map((i) => (
                <li key={i.id}>
                  <span>
                    {i.qty} × {i.name}
                  </span>
                  <span>{money(i.qty * i.price)}</span>
                </li>
              ))}
            </ul>
            <div className="row total">
              <span>Total</span>
              <span>{money(receipt.total)}</span>
            </div>
            <div className="row">
              <span>Paid</span>
              <span>{money(receipt.paid)}</span>
            </div>
            <div className="row">
              <span>Change</span>
              <span>{money(receipt.change)}</span>
            </div>
            <div className="actions">
              <button className="btn secondary" onClick={() => window.print()}>
                Print
              </button>
              <button className="btn primary" onClick={() => setReceipt(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
