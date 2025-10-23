import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { NhostProvider, useAuthenticationStatus } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'
import { nhost } from './config/nhost'
import './styles/global.css'

// Components
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Animals from './pages/Animals'
import Eggs from './pages/Eggs'
import Feeds from './pages/Feeds'
import Feeding from './pages/Feeding'
import Auth from './pages/Auth'

// Loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div className="loading-spinner"></div>
    <span style={{ marginLeft: '1rem' }}>Loading Muroro Livestock Management...</span>
  </div>
)

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  
  if (isLoading) {
    return <Loading />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}

// Public route component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  
  if (isLoading) {
    return <Loading />
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function AppContent() {
  const { isLoading } = useAuthenticationStatus()

  if (isLoading) {
    return <Loading />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/auth" element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/animals" element={
          <ProtectedRoute>
            <Animals />
          </ProtectedRoute>
        } />
        <Route path="/eggs" element={
          <ProtectedRoute>
            <Eggs />
          </ProtectedRoute>
        } />
        <Route path="/feeds" element={
          <ProtectedRoute>
            <Feeds />
          </ProtectedRoute>
        } />
        <Route path="/feeding" element={
          <ProtectedRoute>
            <Feeding />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <Router>
          <AppContent />
        </Router>
      </NhostApolloProvider>
    </NhostProvider>
  )
}

export default App