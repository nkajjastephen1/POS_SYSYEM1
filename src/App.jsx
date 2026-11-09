import { useState } from 'react'
import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_PRODUCTS } from './utils'
import POS from './components/POS'
import Products from './components/Products'
import Expenses from './components/Expenses'
import Dashboard from './components/Dashboard'

const TABS = ['Register', 'Products', 'Expenses', 'Dashboard']

export default function App() {
  const [tab, setTab] = useState('Register')
  const [products, setProducts] = useLocalStorage('pos.products', DEFAULT_PRODUCTS)
  const [sales, setSales] = useLocalStorage('pos.sales', [])
  const [expenses, setExpenses] = useLocalStorage('pos.expenses', [])

  const resetAll = () => {
    if (!confirm('This will delete all sales, expenses and products. Continue?')) return
    setProducts(DEFAULT_PRODUCTS)
    setSales([])
    setExpenses([])
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Simple POS</h1>
        <nav>
          {TABS.map((t) => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === 'Register' && (
          <POS products={products} setProducts={setProducts} setSales={setSales} />
        )}
        {tab === 'Products' && <Products products={products} setProducts={setProducts} />}
        {tab === 'Expenses' && <Expenses expenses={expenses} setExpenses={setExpenses} />}
        {tab === 'Dashboard' && (
          <Dashboard sales={sales} expenses={expenses} products={products} onReset={resetAll} />
        )}
      </main>
    </div>
  )
}
