/**
 * LIVEPay - Dashboard Super Admin Simplifié
 * 
 * Fonctionnalités essentielles :
 * - Vue d'ensemble des statistiques
 * - Gestion des marchands (liste + création)
 * - Surveillance des transferts
 * - Accès rapide aux outils
 */

"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  Plus,
  ExternalLink,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { COLLECTIONS } from "@/lib/firebase/models"
import { useAuth } from "@/contexts/AuthContext"

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalMerchants: 0,
    totalTransfers: 0,
    totalVolume: 0,
    pendingTransfers: 0,
  })
  const [recentTransfers, setRecentTransfers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      // Charger les transferts récents
      const transfersRef = collection(db, COLLECTIONS.TRANSFERS)
      const q = query(transfersRef, orderBy('createdAt', 'desc'), limit(10))
      const snapshot = await getDocs(q)
      
      const transfers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Calculer les statistiques
      const totalVolume = transfers.reduce((sum, t) => sum + (t.amount || 0), 0)
      const pendingCount = transfers.filter(t => t.status === 'pending').length

      setStats({
        totalMerchants: 2, // À remplacer par un vrai count
        totalTransfers: transfers.length,
        totalVolume,
        pendingTransfers: pendingCount,
      })

      setRecentTransfers(transfers.slice(0, 5))
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    }

    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En cours',
      success: 'Complété',
      failed: 'Échoué',
    }

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
        {status === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
        {labels[status] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-lg font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                LIVEPay Admin
              </h1>
              <p className="text-sm text-gray-500">
                Super Admin - modousall1@gmail.com
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/merchants" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Marchands
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/transfers" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Transferts
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Déconnexion
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard/create" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouveau
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Marchands
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMerchants}</div>
              <p className="text-xs text-muted-foreground">
                Total inscrits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transferts
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransfers}</div>
              <p className="text-xs text-muted-foreground">
                Total transferts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Volume Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatAmount(stats.totalVolume)}
              </div>
              <p className="text-xs text-muted-foreground">
                Sur tous les transferts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                En Attente
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTransfers}</div>
              <p className="text-xs text-muted-foreground">
                Transferts en attente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transfers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Transferts Récents
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/transfers" className="flex items-center gap-1">
                  Voir tout
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransfers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun transfert pour le moment
              </p>
            ) : (
              <div className="space-y-4">
                {recentTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{transfer.internalReference}</p>
                        <p className="text-sm text-muted-foreground">
                          {transfer.payer?.name || transfer.payer?.phone} → {transfer.beneficiary?.name || transfer.beneficiary?.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatAmount(transfer.amount)}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {transfer.provider?.replace('_', ' ')}
                        </p>
                      </div>
                      {getStatusBadge(transfer.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gérer les Marchands</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consulter la liste des marchands inscrits et leurs détails
              </p>
              <Button className="w-full" asChild>
                <Link href="/dashboard/merchants">
                  <Users className="w-4 h-4 mr-2" />
                  Voir les marchands
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Créer un Transfert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Initier un nouveau transfert par deep link
              </p>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau transfert
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Voir les analytics détaillés et rapports
              </p>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/reports">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Voir les rapports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>LIVEPay v3.0.0 - PSP Initiateur de Paiement</p>
          <p className="mt-1">Propulsé par Firebase • Deep Links Mobile Money</p>
        </div>
      </footer>
    </div>
  )
}
