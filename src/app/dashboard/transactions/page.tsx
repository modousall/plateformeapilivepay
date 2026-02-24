"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink
} from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { INITIAL_TRANSACTIONS } from "@/app/lib/mock-data"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions] = useState(INITIAL_TRANSACTIONS)

  const filteredTransactions = transactions.filter(tr => 
    tr.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tr.productDescription.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Historique</h1>
          <p className="text-muted-foreground mt-1">
            Consultez toutes vos transactions Wave.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un client ou un produit..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tr) => (
                <TableRow key={tr.id} className="group">
                  <TableCell className="text-sm">
                    {format(tr.createdAt, "d MMM yyyy, HH:mm", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{tr.customerName}</div>
                    <div className="text-xs text-muted-foreground">{tr.whatsappNumber}</div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{tr.productDescription}</TableCell>
                  <TableCell className="font-mono font-medium">{tr.amount} FCFA</TableCell>
                  <TableCell>
                    <Badge 
                      variant={tr.status === 'paid' ? 'default' : tr.status === 'pending' ? 'secondary' : 'destructive'}
                      className="capitalize gap-1"
                    >
                      {tr.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                      {tr.status === 'pending' && <Clock className="w-3 h-3" />}
                      {tr.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                      {tr.status === 'paid' ? 'Payé' : tr.status === 'pending' ? 'En attente' : 'Échoué'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(tr.waveLink, '_blank')}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Voir le lien Wave
                        </DropdownMenuItem>
                        <DropdownMenuItem>Relancer WhatsApp</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucune transaction trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}