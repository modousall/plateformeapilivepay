"use client"

import Link from "next/link"
import { Wallet, Zap, MessageSquare, ShieldCheck, ArrowRight, PlusCircle, Smartphone, Globe, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { WAVE_CONFIG } from "@/lib/config"

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-2xl font-headline font-bold text-blue-600">
              {t('app.name')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                {t('home.features.title')}
              </Link>
              <Link href="#providers" className="text-sm font-medium hover:text-primary transition-colors">
                Moyens de paiement
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                Comment ça marche
              </Link>
            </div>
            <LanguageSwitcher />
            <Button asChild>
              <Link href="/dashboard">{t('home.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-700">
            <Globe className="h-4 w-4" />
            {t('app.subtitle')}
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {t('home.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <Button size="lg" asChild className="h-14 px-8 text-lg font-headline bg-blue-600 hover:bg-blue-700">
              <Link href="/login">{t('home.getStarted')} <ArrowRight className="ml-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-headline">
              <CreditCard className="mr-2 h-5 w-5" />
              {t('app.name')}
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-bold">{t('home.features.title')}</h2>
            <p className="text-muted-foreground text-lg">Optimisé pour Facebook Marketplace, Instagram et WhatsApp Business.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl space-y-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-blue-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <PlusCircle className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold">{t('home.features.secure')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('home.features.secureDesc')}</p>
            </div>
            <div className="bg-white p-10 rounded-3xl space-y-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-green-200">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold">{t('home.features.fast')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('home.features.fastDesc')}</p>
            </div>
            <div className="bg-white p-10 rounded-3xl space-y-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold">{t('home.features.integrate')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('home.features.integrateDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Providers Section - Wave uniquement */}
      <section id="providers" className="py-24 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-bold">Provider Supporté</h2>
            <p className="text-muted-foreground text-lg">Wave - Sénégal & Côte d'Ivoire</p>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-200 text-center space-y-4 max-w-sm">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-5xl">💙</span>
              </div>
              <h3 className="font-semibold text-xl">Wave</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-sm bg-blue-100 px-3 py-1 rounded-full">SN</span>
                <span className="text-sm bg-blue-100 px-3 py-1 rounded-full">CI</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Plus de 10 millions d'utilisateurs en Afrique de l'Ouest
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-bold">Comment ça marche</h2>
            <p className="text-muted-foreground text-lg">3 étapes simples pour encaisser vos ventes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">1</div>
              <h3 className="text-xl font-headline font-semibold">Créez votre lien</h3>
              <p className="text-muted-foreground">Saisissez le montant, la description et choisissez le moyen de paiement</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">2</div>
              <h3 className="text-xl font-headline font-semibold">Envoyez au client</h3>
              <p className="text-muted-foreground">Partagez le lien par WhatsApp, SMS ou email</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">3</div>
              <h3 className="text-xl font-headline font-semibold">Encaissez</h3>
              <p className="text-muted-foreground">Le client paie via son moyen préféré, vous recevez l'argent instantanément</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            Prêt à démarrer avec LIVEPAY ?
          </h2>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Rejoignez les e-commerçants qui utilisent LIVEPAY pour encaisser leurs ventes via Mobile Money dans toute l'UEMOA.
          </p>
          <Button size="lg" variant="secondary" asChild className="h-14 px-8 text-lg font-headline">
            <Link href="/dashboard">
              {t('home.getStarted')} <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-xl font-headline font-bold text-blue-600">
              {t('app.name')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 LIVEPAY. {t('footer.allRightsReserved')} Dédié aux entrepreneurs de l'UEMOA.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              {t('footer.api')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
