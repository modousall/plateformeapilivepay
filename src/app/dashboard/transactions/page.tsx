"use client"

import { useState, useEffect } from 'react'
import { History, Download, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPaymentLinks, PaymentLink } from '@/lib/payment-links'
import { useLanguage } from '@/lib/language'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function TransactionsPage() {
  const { t } = useLanguage()
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [filteredLinks, setFilteredLinks] = useState<PaymentLink[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [providerFilter, setProviderFilter] = useState<string>('all')

  useEffect(() => {
    const data = getPaymentLinks()
    setLinks(data)
    setFilteredLinks(data)
  }, [])

  useEffect(() => {
    let filtered = links

    if (searchTerm) {
      filtered = filtered.filter(link =>
        link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.buyerName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(link => link.status === statusFilter)
    }

    if (providerFilter !== 'all') {
      filtered = filtered.filter(link => link.provider === providerFilter)
    }

    setFilteredLinks(filtered)
  }, [searchTerm, statusFilter, providerFilter, links])

  const getStatusBadge = (status: PaymentLink['status']) => {
    const variants = {
      pending: 'secondary',
      paid: 'default',
      expired: 'destructive',
      cancelled: 'outline',
    } as const

    const labels = {
      pending: t('links.pending'),
      paid: t('links.paid'),
      expired: t('links.expired'),
      cancelled: t('links.cancelled'),
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const totalVolume = filteredLinks
    .filter(l => l.status === 'paid')
    .reduce((sum, l) => sum + l.amount, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <History className="h-8 w-8" />
            {t('links.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Historique complet de vos transactions
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLinks.length}</div>
            <p className="text-xs text-muted-foreground">Liens de paiement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredLinks.filter(l => l.status === 'paid').length}
            </div>
            <p className="text-xs text-muted-foreground">Transactions réussies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredLinks.filter(l => l.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">En attente de paiement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('fr-FR').format(totalVolume)} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Transactions payées</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Rechercher</Label>
              <Input
                placeholder="Nom, description, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">{t('links.pending')}</SelectItem>
                  <SelectItem value="paid">{t('links.paid')}</SelectItem>
                  <SelectItem value="expired">{t('links.expired')}</SelectItem>
                  <SelectItem value="cancelled">{t('links.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Opérateur</Label>
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {filteredLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucune transaction</h3>
              <p className="text-muted-foreground mt-1">
                Aucune transaction ne correspond à vos filtres
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Opérateur</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">
                      {format(link.createdAt, 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{link.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {link.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {link.buyerName ? (
                        <div>
                          <div>{link.buyerName}</div>
                          <div className="text-xs text-muted-foreground">{link.buyerPhone}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <span>💙</span>
                        <span>Wave</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {new Intl.NumberFormat('fr-FR').format(link.amount)} FCFA
                    </TableCell>
                    <TableCell>{getStatusBadge(link.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(link.deepLink)}>
                        Copier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
