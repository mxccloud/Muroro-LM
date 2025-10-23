import React, { useState } from 'react'
import { useSignIn, useSignUp } from '@nhost/react'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  const { signIn, isLoading: signInLoading, error: signInError } = useSignIn()
  const { signUp, isLoading: signUpLoading, error: signUpError } = useSignUp()
  const navigate = useNavigate()

  const isLoading = signInLoading || signUpLoading
  const error = signInError || signUpError

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSignUp) {
      const { needsEmailVerification } = await signUp({
        email,
        password,
        options: {
          displayName: `${firstName} ${lastName}`.trim(),
          metadata: {
            firstName,
            lastName
          }
        }
      })
      
      if (needsEmailVerification) {
        alert('Please check your email for verification link')
      } else {
        navigate('/')
      }
    } else {
      const { isSuccess } = await signIn({
        email,
        password
      })
      
      if (isSuccess) {
        navigate('/')
      }
    }
  }

  return (
    <div className="page" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <div className="card">
        <div className="page-header" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1>Muroro Livestock</h1>
          <p>{isSignUp ? 'Create your account' : 'Sign in to your account'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={isSignUp}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ 
              color: 'var(--error)', 
              backgroundColor: '#FEE2E2', 
              padding: '0.75rem', 
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error.message}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-gray)' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'transparent', border: 'none', color: 'var(--royal-blue)' }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth