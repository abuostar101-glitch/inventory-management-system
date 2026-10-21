const API_BASE = 'http://localhost:5080/api'

async function handle(res) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  // 204 No Content has no body to parse
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // Products
  getProducts: () => fetch(`${API_BASE}/products`).then(handle),
  getLowStock: () => fetch(`${API_BASE}/products/low-stock`).then(handle),
  createProduct: (product) =>
    fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).then(handle),
  updateProduct: (id, product) =>
    fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).then(handle),
  deleteProduct: (id) =>
    fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' }).then(handle),

  // Orders
  getOrders: () => fetch(`${API_BASE}/orders`).then(handle),
  createOrder: (order) =>
    fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).then(handle),
}
