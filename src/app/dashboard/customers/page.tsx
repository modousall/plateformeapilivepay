"use client"

import { useState, useEffect } from 'react'
import { Users, Mail, Phone, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPaymentLinks } from '@/lib/payment-links'
import { useLanguage } from '@/lib/language'

interface Customer {
  name: string
  email?: string
  phone?: string
  totalSpent: number
  transactions: number
  lastTransaction: Date
}

export default function CustomersPage() {
  const { t } = useLanguage()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const links = getPaymentLinks()
    const customerMap = new Map<string, Customer>()

    links.filter(l => l.status === 'paid').forEach(link => {
      const key = link.buyerPhone || link.buyerEmail || link.buyerName || 'anonymous'
      
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: link.buyerName || 'Client anonyme',
          email: link.buyerEmail,
          phone: link.buyerPhone,
          totalSpent: 0,
          transactions: 0,
          lastTransaction: link.createdAt,
        })
      }

      const customer = customerMap.get(key)!
      customer.totalSpent += link.amount
      customer.transactions += 1
      if (link.createdAt > customer.lastTransaction) {
        customer.lastTransaction = link.createdAt
      }
    })

    setCustomers(Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent))
  }, [])

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <Users className="h-8 w-8" />
          {t('nav.customers')}
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre base de clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Clients uniques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meilleur Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.length > 0 ? formatFCFA(customers[0]?.totalSpent) : '0 FCFA'}
            </div>
            <p className="text-xs text-muted-foreground">Plus gros montant dépensé</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.transactions > 1).length}
            </div>
            <p className="text-xs text-muted-foreground">Clients récurrents</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
          <CardDescription>
            {filteredCustomers.length} client{filteredCustomers.length > 1 ? 's' : ''} trouvé{filteredCustomers.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun client trouvé</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCustomers.map((customer, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{customer.name}</p>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        )}
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transactions:</span>
                        <span className="font-medium">{customer.transactions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total dépensé:</span>
                        <span className="font-medium text-green-600">{formatFCFA(customer.totalSpent)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Dernier achat:</span>
                        <span className="font-medium">
                          {customer.lastTransaction.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
