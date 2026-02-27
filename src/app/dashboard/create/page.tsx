/**
 * LIVEPay - Créer un Transfert (Wave uniquement)
 */

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link as LinkIcon, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentLinkForm } from '@/components/PaymentLinkForm'
import { PaymentLink } from '@/lib/types'
import { useLanguage } from '@/lib/language'

export default function CreatePaymentLinkPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [recentLinks, setRecentLinks] = useState<PaymentLink[]>([])

  const handleLinkCreated = (link: PaymentLink) => {
    setRecentLinks([link, ...recentLinks].slice(0, 5))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <LinkIcon className="h-8 w-8" />
          {t('links.newLink')}
        </h1>
        <p className="text-muted-foreground mt-1">
          Paiement par Wave - Sénégal & Côte d'Ivoire
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-blue-500 transition-colors cursor-pointer" onClick={() => setIsFormOpen(true)}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <PlusCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>{t('links.createRequest')}</CardTitle>
            <CardDescription>
              Créez un nouveau lien de paiement Wave
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Supporté</CardTitle>
            <CardDescription>
              Wave uniquement pour le moment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-blue-50">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <p className="font-medium">Wave</p>
                <p className="text-sm text-muted-foreground">Sénégal & Côte d'Ivoire</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {recentLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Liens récemment créés</CardTitle>
            <CardDescription>
              Vos {recentLinks.length} derniers liens de paiement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="space-y-1">
                    <p className="font-medium">{link.name}</p>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{link.amount} FCFA</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span>💙</span>
                        <span>Wave</span>
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(link.deepLink)}>
                    Copier le lien
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <PaymentLinkForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onLinkCreated={handleLinkCreated}
      />
    </div>
  )
}
