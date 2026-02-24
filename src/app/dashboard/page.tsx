"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { INITIAL_TRANSACTIONS } from "@/app/lib/mock-data"
import Link from "next/link"

export default function DashboardOverview() {
  const [transactions] = useState(INITIAL_TRANSACTIONS)

  const stats = [
    {
      title: "Volume Total",
      value: "40,000 FCFA",
      description: "Revenus cumulés",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Transactions",
      value: transactions.length.toString(),
      description: "Nombre total de ventes",
      icon: CreditCard,
      color: "text-indigo-600",
    },
    {
      title: "Clients",
      value: "2",
      description: "Unique clients contactés",
      icon: Users,
      color: "text-turquoise-600",
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Tableau de Bord</h1>
        <p className="text-muted-foreground mt-1">
          Suivez vos liens de paiement et l'activité de vos clients.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm border-none bg-white/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transactions Récentes</CardTitle>
                <CardDescription>Vos dernières demandes de paiement générées.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/transactions">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Client</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead className="pr-6">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tr) => (
                  <TableRow key={tr.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6">
                      <div className="font-medium">{tr.customerName}</div>
                      <div className="text-xs text-muted-foreground">{tr.whatsappNumber}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{tr.productDescription}</TableCell>
                    <TableCell className="font-mono">{tr.amount} FCFA</TableCell>
                    <TableCell className="pr-6">
                      <Badge 
                        variant={tr.status === 'paid' ? 'default' : tr.status === 'pending' ? 'secondary' : 'destructive'}
                        className="capitalize gap-1 px-2"
                      >
                        {tr.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                        {tr.status === 'pending' && <Clock className="w-3 h-3" />}
                        {tr.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                        {tr.status === 'paid' ? 'Payé' : tr.status === 'pending' ? 'En attente' : 'Échoué'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-sm flex flex-col justify-center items-center p-8 bg-primary/5">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-headline font-semibold">Besoin d'un lien ?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Générez un lien de paiement Wave et envoyez-le sur WhatsApp en un clic.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard/create">Créer une demande</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}