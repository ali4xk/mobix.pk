import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('mobix_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('mobix_token', token)
    localStorage.setItem('mobix_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('mobix_token')
    localStorage.removeItem('mobix_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}