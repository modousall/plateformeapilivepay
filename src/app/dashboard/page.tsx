"use client"

import { Key, PlusCircle, Shield, Zap, Layers, Wallet, Users, CreditCard, CheckCircle2, Clock, AlertCircle, Building, Crown } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PaymentLinkList } from "@/components/PaymentLinkList"
import { useLanguage } from "@/lib/language"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getPaymentLinks, getStats } from "@/lib/payment-links"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MERCHANT_CONFIG, SUPER_ADMIN_CONFIG, PAYMENT_PROVIDERS } from "@/lib/config"
import { PaymentProvider } from "@/lib/types"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardOverview() {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, totalVolume: 0, byProvider: {} as Record<string, { total: number; paid: number; volume: number }> });
  const [recentLinks, setRecentLinks] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const s = getStats();
    setStats(s);
    const links = getPaymentLinks().slice(0, 5);
    setRecentLinks(links);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      paid: 'default',
      expired: 'destructive',
      cancelled: 'secondary',
    };

    const labels: Record<string, string> = {
      pending: t('links.pending'),
      paid: t('links.paid'),
      expired: t('links.expired'),
      cancelled: t('links.cancelled'),
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status === 'paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
        {status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('app.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button asChild>
            <Link href="/">{t('nav.home')}</Link>
          </Button>
        </div>
      </div>

      {/* User Role Banner */}
      {isAdmin ? (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Crown className="h-5 w-5" />
              Super Administrateur
            </CardTitle>
            <CardDescription className="text-purple-600">
              Vous avez accès à toutes les fonctionnalités de la plateforme
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Shield className="h-5 w-5" />
              Compte Marchand
            </CardTitle>
            <CardDescription className="text-green-600">
              Bienvenue sur votre espace de vente LIVEPAY
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Super Admin Info Card - Only for admin */}
      {isAdmin && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-600" />
              Administration - {t('admin.superAdmin')}
            </CardTitle>
            <CardDescription>
              Informations de l'administrateur de la plateforme LIVEPAY
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.name')}</p>
                <p className="font-semibold text-purple-700">{SUPER_ADMIN_CONFIG.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.email')}</p>
                <p className="font-semibold text-purple-700">{SUPER_ADMIN_CONFIG.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.role')}</p>
                <p className="font-semibold text-purple-700">{SUPER_ADMIN_CONFIG.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Merchant Info Card - For all users */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            {t('merchant.title')}
          </CardTitle>
          <CardDescription>
            Vos informations de compte marchand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('merchant.businessName')}</p>
              <p className="font-semibold text-blue-700">{MERCHANT_CONFIG.businessName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('merchant.accountNumber')}</p>
              <p className="font-semibold text-blue-700">{MERCHANT_CONFIG.accountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('merchant.phoneNumber')}</p>
              <p className="font-semibold text-blue-700">{MERCHANT_CONFIG.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('merchant.country')}</p>
              <p className="font-semibold text-blue-700">{t(`countries.${MERCHANT_CONFIG.country}`)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-1">{t('merchant.b2bIdentifier')}</p>
            <p className="font-mono text-xs text-blue-700 break-all">{MERCHANT_CONFIG.b2bIdentifier}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-none bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalVolume')}</CardTitle>
            <Wallet className={cn("h-4 w-4", "text-blue-600")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{formatAmount(stats.totalVolume)}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.revenue')}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalLinks')}</CardTitle>
            <CreditCard className={cn("h-4 w-4", "text-indigo-600")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.sales')}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.clients')}</CardTitle>
            <Users className={cn("h-4 w-4", "text-green-600")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.uniqueClients')}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className={cn("h-4 w-4", "text-orange-600")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Liens en attente de paiement</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats by Provider */}
      {Object.keys(stats.byProvider).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              {t('dashboard.byProvider')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(Object.keys(stats.byProvider) as PaymentProvider[]).map((provider) => (
                <div key={provider} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{PAYMENT_PROVIDERS[provider].icon}</span>
                    <span className="font-medium text-sm">{t(`providers.${provider}`)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-medium">{stats.byProvider[provider].total}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Payés:</span>
                      <span className="font-medium text-green-600">{stats.byProvider[provider].paid}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Volume:</span>
                      <span className="font-medium">{formatAmount(stats.byProvider[provider].volume)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
              <CardDescription>Vos dernières demandes de paiement générées.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Aucune transaction récente</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Client</TableHead>
                  <TableHead>Moyen de paiement</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead className="pr-6">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLinks.map((link) => (
                  <TableRow key={link.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6">
                      <div className="font-medium">{link.buyerName || 'Client'}</div>
                      <div className="text-xs text-muted-foreground">{link.buyerPhone || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <span>{PAYMENT_PROVIDERS[link.provider].icon}</span>
                        <span>{t(`providers.${link.provider}`)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{link.description}</TableCell>
                    <TableCell className="font-mono">{link.amount} FCFA</TableCell>
                    <TableCell className="pr-6">
                      {getStatusBadge(link.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment Links List */}
      <PaymentLinkList onLinkCreated={() => loadStats()} />

      {/* Quick Actions Card */}
      <Card className="border-none shadow-sm flex flex-col justify-center items-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
            <Zap className="w-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-headline font-semibold">{t('dashboard.quickActions')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Générez un lien de paiement et envoyez-le sur WhatsApp en un clic.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
