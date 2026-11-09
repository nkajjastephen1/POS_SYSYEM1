export const CURRENCY = 'UGX'

const formatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
})

export const money = (n) => formatter.format(Number(n) || 0)

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

const localDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const today = () => localDate(new Date())

export const isSameDay = (date, day = today()) =>
  (date.length === 10 ? date : localDate(new Date(date))) === day

export const EXPENSE_CATEGORIES = [
  'Stock Purchase',
  'Rent',
  'Utilities',
  'Salaries',
  'Transport',
  'Maintenance',
  'Other',
]

export const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Bread', price: 4000, stock: 30, category: 'Bakery' },
  { id: 'p2', name: 'Milk (1L)', price: 3000, stock: 40, category: 'Dairy' },
  { id: 'p3', name: 'Sugar (1kg)', price: 5000, stock: 25, category: 'Groceries' },
  { id: 'p4', name: 'Soda (500ml)', price: 2000, stock: 60, category: 'Drinks' },
  { id: 'p5', name: 'Rice (1kg)', price: 6000, stock: 20, category: 'Groceries' },
  { id: 'p6', name: 'Eggs (tray)', price: 13000, stock: 10, category: 'Dairy' },
  { id: 'p7', name: 'Water (1.5L)', price: 2500, stock: 50, category: 'Drinks' },
  { id: 'p8', name: 'Soap', price: 3500, stock: 35, category: 'Household' },
]
