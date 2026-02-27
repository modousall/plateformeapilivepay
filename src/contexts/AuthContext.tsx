/**
 * Contexte d'Authentification Firebase
 * Gère l'authentification du Super Admin
 */

"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface User {
  uid: string
  email: string | null
  displayName: string | null
  isSuperAdmin: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isSuperAdmin = firebaseUser.email === 'modousall1@gmail.com'
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          isSuperAdmin,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Vérification simple pour le Super Admin
      // Dans un environnement de production, activer Firebase Authentication
      if (email === 'modousall1@gmail.com' && password === 'Passer123@') {
        // Mode développement - pas de vraie auth Firebase
        console.log('Login Super Admin réussi (mode développement)')
        return
      }
      
      // Si Firebase Auth est activé, utiliser la vraie authentification
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Si c'est une erreur de configuration Firebase, accepter quand même le Super Admin
      if (error.code === 'auth/configuration-not-found' && email === 'modousall1@gmail.com') {
        console.log('Firebase Auth non configuré - Mode développement accepté')
        return
      }
      
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
