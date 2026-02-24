"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Send, 
  Link as LinkIcon, 
  Check, 
  MessageSquare,
  AlertCircle,
  Copy
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CURRENT_MERCHANT } from "@/app/lib/mock-data"

const formSchema = z.object({
  customerName: z.string().min(2, "Le nom du client est requis"),
  whatsappNumber: z.string().min(9, "Numéro WhatsApp invalide (ex: +22177...)"),
  productDescription: z.string().min(5, "Description trop courte"),
  amount: z.coerce.number().min(100, "Le montant minimum est de 100 FCFA"),
})

export default function CreatePaymentLink() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      whatsappNumber: "+221",
      productDescription: "",
      amount: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    
    // Simulate API delay for link generation
    setTimeout(() => {
      // Mock Wave Link Generation
      // Pattern: pay.wave.com/m/[b2b_id]/[amount]/[ref]
      const ref = values.productDescription.replace(/\s+/g, '-').substring(0, 10)
      const link = `https://pay.wave.com/m/${CURRENT_MERCHANT.b2bId}/${values.amount}/${ref}`
      
      setGeneratedLink(link)
      setIsGenerating(false)
      
      toast({
        title: "Lien généré avec succès",
        description: "Vous pouvez maintenant l'envoyer via WhatsApp.",
      })
    }, 1200)
  }

  const handleSendWhatsApp = () => {
    const values = form.getValues()
    const message = `Bonjour ${values.customerName},
Merci pour votre commande : ${values.productDescription}.
Montant à payer : ${values.amount} FCFA.
Veuillez finaliser votre paiement via le lien sécurisé suivant :
${generatedLink}
Merci pour votre confiance.`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${values.whatsappNumber.replace(/\+/g, '')}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    
    toast({
      title: "Notification WhatsApp",
      description: "Redirection vers WhatsApp en cours...",
    })

    // Simulated: Save transaction to "db"
    // In a real app, we'd call a server action here
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papier.",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Créer un Paiement</h1>
        <p className="text-muted-foreground mt-1">
          Remplissez les détails pour générer un lien unique.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Détails de la demande</CardTitle>
            <CardDescription>Informations sur le client et le produit.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du Client</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Jean Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="+221770000000" {...field} />
                      </FormControl>
                      <FormDescription>Format international requis.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description du Produit</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ex: Chaussures Nike Air Max" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant (FCFA)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Générer le lien Wave
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className={`border-none shadow-sm transition-all duration-500 ${!generatedLink ? 'opacity-50 pointer-events-none grayscale' : 'scale-105 border-primary/20'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="text-green-500 w-5 h-5" />
                Lien Prêt
              </CardTitle>
              <CardDescription>Voici votre lien de paiement Wave sécurisé.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg flex items-center justify-between gap-4 border">
                <code className="text-xs truncate text-primary font-mono">{generatedLink || "https://pay.wave.com/..."}</code>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!generatedLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Action rapide :</h4>
                <Button 
                  onClick={handleSendWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                  disabled={!generatedLink}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Notifier par WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                Info Wave B2B
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Ce lien est lié à votre compte marchand Wave :</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Compte: {CURRENT_MERCHANT.waveAccountNumber}</li>
                <li>Identifiant: {CURRENT_MERCHANT.b2bId}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}