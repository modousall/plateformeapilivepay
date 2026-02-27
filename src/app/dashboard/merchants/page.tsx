/**
 * LIVEPay - Gestion des Marchands
 * Page simplifiée pour Super Admin
 */

"use client"

import { useState, useEffect } from "react"
import { Users, Mail, Phone, Building, Calendar, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { COLLECTIONS } from "@/lib/firebase/models"
import Link from "next/link"

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMerchants()
  }, [])

  async function loadMerchants() {
    try {
      const merchantsRef = collection(db, COLLECTIONS.MERCHANTS)
      const snapshot = await getDocs(merchantsRef)
      
      const merchantsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setMerchants(merchantsList)
      setLoading(false)
    } catch (error) {
      console.error('Error loading merchants:', error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    }

    const labels: Record<string, string> = {
      verified: 'Vérifié',
      pending: 'En attente',
      rejected: 'Rejeté',
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
                Marchands
              </h1>
              <p className="text-sm text-gray-500">
                {merchants.length} marchand(s) inscrit(s)
              </p>
            </div>
            <Button size="sm" asChild>
              <Link href="/dashboard/merchants/create" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouveau marchand
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {merchants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucun marchand pour le moment
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchants.map((merchant) => (
              <Card key={merchant.id}>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      <span className="text-lg">{merchant.name}</span>
                    </div>
                    {getStatusBadge(merchant.kycStatus)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{merchant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{merchant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize">
                      {merchant.businessType || 'commerce'}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">
                        Niveau: {merchant.complianceLevel || 'standard'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
