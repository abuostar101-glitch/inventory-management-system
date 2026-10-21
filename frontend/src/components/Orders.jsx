import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Orders() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [cart, setCart] = useState([]) // { productId, name, price, quantity }
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const loadData = () => {
    Promise.all([api.getProducts(), api.getOrders()])
      .then(([p, o]) => { setProducts(p); setOrders(o) })
      .catch((err) => setError(err.message))
  }

  useEffect(loadData, [])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id)
      if (existing) {
        return prev.map(item =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1)
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity: qty } : item))
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const submitOrder = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (cart.length === 0) {
      setError('Add at least one product to the order.')
      return
    }

    try {
      const order = await api.createOrder({
        customerName,
        items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
      })
      setSuccess(`Order #${order.id} placed successfully.`)
      setCart([])
      setCustomerName('')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>New Order</h2>
      <form className="order-form" onSubmit={submitOrder}>
        <input
          placeholder="Customer name (optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <div className="order-grid">
          <div>
            <h3>Available Products</h3>
            <ul className="product-pick-list">
              {products.map(p => (
                <li key={p.id}>
                  <span>{p.name} — ₹{p.price} ({p.stockQuantity} in stock)</span>
                  <button type="button" onClick={() => addToCart(p)} disabled={p.stockQuantity === 0}>
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <p className="status-text">No items added yet.</p>
            ) : (
              <ul className="cart-list">
                {cart.map(item => (
                  <li key={item.productId}>
                    <span>{item.name}</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, e.target.value)}
                    />
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <button type="button" className="link-btn danger" onClick={() => removeFromCart(item.productId)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
            <p className="cart-total">Total: ₹{cartTotal.toLocaleString('en-IN')}</p>
            <button type="submit" className="place-order-btn">Place Order</button>
          </div>
        </div>
      </form>

      {error && <p className="status-text error">{error}</p>}
      {success && <p className="status-text success">{success}</p>}

      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p className="status-text">No orders yet.</p>
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
            {orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customerName || 'Walk-in'}</td>
                <td>{o.items.map(i => `${i.product?.name ?? 'Item'} x${i.quantity}`).join(', ')}</td>
                <td>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
