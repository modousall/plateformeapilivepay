"use client"

import Link from "next/link"
import { 
  Wallet, 
  Zap, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  PlusCircle,
  Smartphone
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-2xl font-headline font-bold text-primary">WaveLink</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Fonctionnalités</Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">Comment ça marche</Link>
            <Button asChild>
              <Link href="/dashboard">Espace Marchand</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-700">
            <Zap className="h-4 w-4 fill-primary" />
            La solution préférée des e-commerçants au Sénégal
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Vendez sur les Marketplaces, encaissez via Wave.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            Générez des liens de paiement sécurisés et notifiez vos clients automatiquement sur WhatsApp. Simple, rapide et fiable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <Button size="lg" asChild className="h-14 px-8 text-lg font-headline">
              <Link href="/dashboard">Commencer gratuitement <ArrowRight className="ml-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-headline">
              Voir la démo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-muted/30 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-bold">Tout ce dont vous avez besoin</h2>
            <p className="text-muted-foreground text-lg">Optimisé pour Facebook Marketplace, Instagram et WhatsApp Business.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl space-y-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/10">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <PlusCircle className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold">Lien Wave Unique</h3>
              <p className="text-muted-foreground leading-relaxed">Générez un lien de paiement unique pour chaque transaction, associé au montant exact de la commande.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl space-y-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/10">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold">Automation WhatsApp</h3>
              <p className="text-muted-foreground leading-relaxed">Envoyez automatiquement le lien et le récapitulatif de commande via l'API Wasender en un clic.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl space-y-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/10">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold">Suivi en temps réel</h3>
              <p className="text-muted-foreground leading-relaxed">Soyez notifié dès que le client paie et suivez le statut (payé, en attente) sur votre tableau de bord.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground">
              <Wallet className="h-3 w-3" />
            </div>
            <span className="text-xl font-headline font-bold text-primary">WaveLink</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 WaveLink. Tous droits réservés. Dédié aux entrepreneurs du Sénégal.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Termes</Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}