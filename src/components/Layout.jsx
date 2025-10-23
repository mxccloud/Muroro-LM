import React from 'react'
import { useSignOut, useAuthenticationStatus } from '@nhost/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, Cow, Egg, Wheat, Utensils, LogOut } from 'lucide-react'

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuthenticationStatus()
  const { signOut } = useSignOut()
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Animals', href: '/animals', icon: Cow },
    { name: 'Eggs', href: '/eggs', icon: Egg },
    { name: 'Feeds', href: '/feeds', icon: Wheat },
    { name: 'Feeding', href: '/feeding', icon: Utensils }
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  // Don't show sidebar on auth page
  if (!isAuthenticated) {
    return children
  }

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="logo">
          <h1>Muroro Livestock</h1>
        </div>
        
        <div className="nav-links">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="user-section">
          <button onClick={handleSignOut} className="btn btn-secondary" style={{ width: '100%' }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout