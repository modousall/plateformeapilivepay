/**
 * LIVEPay - Liste des Transferts
 * Page simplifiée pour Super Admin
 */

"use client"

import { useState, useEffect } from "react"
import { CreditCard, Search, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { COLLECTIONS } from "@/lib/firebase/models"
import Link from "next/link"

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransfers()
  }, [])

  async function loadTransfers() {
    try {
      const transfersRef = collection(db, COLLECTIONS.TRANSFERS)
      const q = query(transfersRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const transfersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setTransfers(transfersList)
      setLoading(false)
    } catch (error) {
      console.error('Error loading transfers:', error)
      setLoading(false)
    }
  }

  const filteredTransfers = transfers.filter(t => {
    const search = filter.toLowerCase()
    return (
      t.internalReference?.toLowerCase().includes(search) ||
      t.payer?.name?.toLowerCase().includes(search) ||
      t.payer?.phone?.toLowerCase().includes(search) ||
      t.beneficiary?.name?.toLowerCase().includes(search) ||
      t.beneficiary?.phone?.toLowerCase().includes(search)
    )
  })

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      debited: 'bg-purple-100 text-purple-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    }

    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En cours',
      debited: 'Payé',
      success: 'Complété',
      failed: 'Échoué',
      expired: 'Expiré',
    }

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {labels[status] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
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
                Transferts
              </h1>
              <p className="text-sm text-gray-500">
                {transfers.length} transfert(s)
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-1">
                ← Retour
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par référence, payeur, bénéficiaire..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Transfers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Tous les transferts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransfers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {filter ? 'Aucun transfert trouvé' : 'Aucun transfert pour le moment'}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transfer.internalReference}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">
                            {transfer.payer?.name || transfer.payer?.phone}
                          </span>
                          {' → '}
                          <span className="font-medium">
                            {transfer.beneficiary?.name || transfer.beneficiary?.phone}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {formatAmount(transfer.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {transfer.provider?.replace('_', ' ')}
                        </p>
                      </div>
                      {getStatusBadge(transfer.status)}
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/pay/${transfer.id}`}
                          target="_blank"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
