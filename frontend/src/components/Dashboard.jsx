import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.getProducts(), api.getOrders()])
      .then(([productsData, ordersData]) => {
        setProducts(productsData)
        setOrders(ordersData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="status-text">Loading dashboard...</p>
  if (error) return <p className="status-text error">Could not reach the API: {error}</p>

  const lowStock = products.filter(p => p.stockQuantity <= p.lowStockThreshold)
  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0)
  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{products.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Stock Value</span>
          <span className="stat-value">₹{totalStockValue.toLocaleString('en-IN')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Orders Placed</span>
          <span className="stat-value">{orders.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">₹{revenue.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <h2>Low Stock Alerts</h2>
      {lowStock.length === 0 ? (
        <p className="status-text">All products are sufficiently stocked.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Threshold</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map(p => (
              <tr key={p.id} className="low-stock-row">
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.stockQuantity}</td>
                <td>{p.lowStockThreshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="status-text">No orders placed yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customerName || 'Walk-in'}</td>
                <td>{o.items.length}</td>
                <td>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
