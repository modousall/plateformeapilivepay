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
        // Créer un cookie de session pour le middleware Next.js
        document.cookie = `__session=${firebaseUser.uid}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`
      } else {
        setUser(null)
        // Supprimer le cookie de session
        document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Utilisation de Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password)
      // L'utilisateur est maintenant connecté via Firebase
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Messages d'erreur plus clairs
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Email ou mot de passe incorrect')
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('Aucun utilisateur trouvé avec cet email')
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Mot de passe incorrect')
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Trop de tentatives. Veuillez réessayer plus tard')
      } else {
        throw new Error('Échec de la connexion. Veuillez réessayer.')
      }
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
