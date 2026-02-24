"use client"

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Wallet, CreditCard } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPaymentLinks, getStats } from '@/lib/payment-links'
import { useLanguage } from '@/lib/language'
import { PAYMENT_PROVIDERS, PaymentProvider } from '@/lib/config'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#2563EB', '#F97316', '#EAB308', '#3B82F6', '#A855F7', '#16A34A']

export default function ReportsPage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<any>(null)
  const [providerData, setProviderData] = useState<any[]>([])
  const [periodData, setPeriodData] = useState<any[]>([])

  useEffect(() => {
    const s = getStats()
    setStats(s)

    // Prepare data by provider
    const pData = (Object.keys(s.byProvider) as PaymentProvider[]).map((provider, index) => ({
      name: t(`providers.${provider}`),
      icon: PAYMENT_PROVIDERS[provider].icon,
      total: s.byProvider[provider].total,
      paid: s.byProvider[provider].paid,
      volume: s.byProvider[provider].volume,
      color: COLORS[index % COLORS.length],
    }))
    setProviderData(pData)

    // Prepare period data (last 7 days simulation)
    const links = getPaymentLinks()
    const today = new Date()
    const periodData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'short' })
      
      const dayLinks = links.filter(link => {
        const linkDate = new Date(link.createdAt)
        return linkDate.toDateString() === date.toDateString()
      })
      
      const volume = dayLinks
        .filter(l => l.status === 'paid')
        .reduce((sum, l) => sum + l.amount, 0)
      
      periodData.push({
        name: dateStr,
        volume: volume,
        transactions: dayLinks.length,
      })
    }
    setPeriodData(periodData)
  }, [])

  if (!stats) return null

  const formatFCFA = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          {t('nav.reports')}
        </h1>
        <p className="text-muted-foreground mt-1">
          Statistiques et analyses de vos transactions
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalVolume')}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFCFA(stats.totalVolume)}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.revenue')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalLinks')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.sales')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Liens payés / Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.paid > 0 ? formatFCFA(Math.round(stats.totalVolume / stats.paid)) : '0 FCFA'}
            </div>
            <p className="text-xs text-muted-foreground">Par transaction payée</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Volume by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution sur 7 jours</CardTitle>
            <CardDescription>Volume de transactions et nombre de liens</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={periodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="volume" name="Volume (FCFA)" fill="#2563EB" />
                <Bar yAxisId="right" dataKey="transactions" name="Transactions" fill="#16A34A" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Volume by Provider */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par moyen de paiement</CardTitle>
            <CardDescription>Volume de transactions par opérateur</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={providerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="volume"
                >
                  {providerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatFCFA(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stats by Provider Table */}
      <Card>
        <CardHeader>
          <CardTitle>Détail par moyen de paiement</CardTitle>
          <CardDescription>
            Statistiques complètes pour chaque opérateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providerData.map((provider) => (
              <Card key={provider.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-2xl">{provider.icon}</span>
                    {provider.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{provider.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payés:</span>
                    <span className="font-medium text-green-600">{provider.paid}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="font-medium text-blue-600">{formatFCFA(provider.volume)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
