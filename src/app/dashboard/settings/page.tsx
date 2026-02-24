"use client"

import { useState } from "react"
import { 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  CreditCard,
  ChevronRight,
  Calculator
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CURRENT_MERCHANT, INITIAL_TRANSACTIONS } from "@/app/lib/mock-data"
import { suggestPricingPlan, SuggestPricingPlanOutput } from "@/ai/flows/suggest-pricing-plan-flow"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [pricingSuggestion, setPricingSuggestion] = useState<SuggestPricingPlanOutput | null>(null)

  const handleAnalyzePricing = async () => {
    setIsAnalyzing(true)
    try {
      // Calculate real stats from mock data
      const totalVolume = INITIAL_TRANSACTIONS.reduce((acc, curr) => acc + curr.amount, 0)
      const totalCount = INITIAL_TRANSACTIONS.length
      
      const result = await suggestPricingPlan({
        totalTransactions: totalCount,
        totalSalesVolume: totalVolume,
        periodDescription: "le mois dernier (données simulées)"
      })
      setPricingSuggestion(result)
    } catch (error) {
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre compte Wave B2B et vos préférences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="profile">Compte Marchand</TabsTrigger>
          <TabsTrigger value="billing">Modèle Économique</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Identité Wave B2B</CardTitle>
              <CardDescription>Vos identifiants officiels pour la génération de liens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="business-name">Nom de l'entreprise</Label>
                <Input id="business-name" defaultValue={CURRENT_MERCHANT.businessName} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="wave-number">Numéro Wave</Label>
                  <Input id="wave-number" defaultValue={CURRENT_MERCHANT.wavePhone} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="b2b-id">Identifiant B2B</Label>
                  <Input id="b2b-id" defaultValue={CURRENT_MERCHANT.b2bId} readOnly />
                </div>
              </div>
              <div className="p-4 bg-blue-50 text-blue-800 rounded-lg flex items-start gap-3 border border-blue-100">
                <ShieldCheck className="h-5 w-5 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Statut vérifié</p>
                  <p className="opacity-80">Votre compte est configuré pour accepter les paiements via Wave Business.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="bg-primary p-6 text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-headline font-bold">Conseiller Intelligent WaveLink</h3>
              </div>
              <p className="text-sm opacity-90">
                Laissez notre IA analyser vos transactions récentes pour optimiser vos frais.
              </p>
            </div>
            <CardContent className="pt-6 space-y-6">
              {!pricingSuggestion ? (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center text-primary">
                    <Calculator className="h-8 w-8" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <h4 className="font-semibold">Prêt pour une analyse ?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Nous comparerons le modèle à la commission vs l'abonnement mensuel.
                    </p>
                  </div>
                  <Button onClick={handleAnalyzePricing} disabled={isAnalyzing}>
                    {isAnalyzing ? "Analyse en cours..." : "Lancer l'analyse IA"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline font-bold">Résultat de l'analyse</h4>
                    <Badge variant="outline" className="border-primary text-primary">
                      {pricingSuggestion.suggestedPlan === 'monthly_subscription' ? "Abonnement" : "Commission"}
                    </Badge>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <p className="text-sm italic">"{pricingSuggestion.reasoning}"</p>
                  </div>
                  {pricingSuggestion.estimatedBenefit && (
                    <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                      <CreditCard className="h-4 w-4" />
                      {pricingSuggestion.estimatedBenefit}
                    </div>
                  )}
                  <div className="pt-4 flex gap-2">
                    <Button className="flex-1">Changer de plan</Button>
                    <Button variant="outline" onClick={() => setPricingSuggestion(null)}>Recommencer</Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 py-4">
              <p className="text-xs text-muted-foreground italic text-center w-full">
                Les suggestions sont basées sur des taux hypothétiques (2% commission vs 10,000 FCFA/mois).
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Wasender API</CardTitle>
              <CardDescription>Configuration de l'envoi automatisé WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Connecter Wasender</p>
                    <p className="text-xs text-muted-foreground">Utilisez vos propres API pour plus d'autonomie.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connecter</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}