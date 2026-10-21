import { useEffect, useState } from 'react'
import { api } from '../api'

const emptyForm = { name: '', sku: '', category: '', price: '', stockQuantity: '', lowStockThreshold: 10 }

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const loadProducts = () => {
    setLoading(true)
    api.getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadProducts, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      price: parseFloat(form.price) || 0,
      stockQuantity: parseInt(form.stockQuantity, 10) || 0,
      lowStockThreshold: parseInt(form.lowStockThreshold, 10) || 0,
    }

    try {
      if (editingId) {
        await api.updateProduct(editingId, { id: editingId, ...payload })
      } else {
        await api.createProduct(payload)
      }
      resetForm()
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.deleteProduct(id)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stockQuantity" type="number" placeholder="Stock Qty" value={form.stockQuantity} onChange={handleChange} required />
        <input name="lowStockThreshold" type="number" placeholder="Low Stock Alert At" value={form.lowStockThreshold} onChange={handleChange} required />
        <div className="form-actions">
          <button type="submit">{editingId ? 'Save Changes' : 'Add Product'}</button>
          {editingId && <button type="button" className="secondary" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {error && <p className="status-text error">{error}</p>}

      <h2>All Products</h2>
      {loading ? (
        <p className="status-text">Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className={p.stockQuantity <= p.lowStockThreshold ? 'low-stock-row' : ''}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stockQuantity}</td>
                <td className="row-actions">
                  <button className="link-btn" onClick={() => startEdit(p)}>Edit</button>
                  <button className="link-btn danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
