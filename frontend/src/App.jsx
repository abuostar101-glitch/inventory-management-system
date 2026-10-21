import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Products from './components/Products'
import Orders from './components/Orders'
import './App.css'

const TABS = {
  dashboard: { label: 'Dashboard', component: Dashboard },
  products: { label: 'Products', component: Products },
  orders: { label: 'Orders', component: Orders },
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const ActiveComponent = TABS[activeTab].component

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Inventory & Order Management</h1>
        <nav className="tab-nav">
          {Object.entries(TABS).map(([key, tab]) => (
            <button
              key={key}
              className={activeTab === key ? 'active' : ''}
              onClick={() => setActiveTab(key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-content">
        <ActiveComponent />
      </main>
    </div>
  )
}

export default App
