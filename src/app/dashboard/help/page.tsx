"use client"

import { useState } from 'react'
import { HelpCircle, Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from '@/lib/language'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    category: "Général",
    questions: [
      {
        q: "Qu'est-ce que LIVEPAY ?",
        a: "LIVEPAY est une plateforme de paiement Mobile Money qui permet aux e-commerçants de l'UEMOA de générer des liens de paiement pour encaisser leurs ventes via Wave, Orange Money, MTN, Moov, Free Money et le système PI-SPI."
      },
      {
        q: "Comment créer un compte LIVEPAY ?",
        a: "Cliquez sur 'S'inscrire' dans la page d'accueil, remplissez le formulaire avec vos informations et acceptez les conditions d'utilisation. Votre compte sera créé instantanément."
      },
      {
        q: "LIVEPAY est-il gratuit ?",
        a: "L'inscription et l'utilisation de base sont gratuites. Des frais de transaction peuvent s'appliquer selon les opérateurs de paiement utilisés."
      },
      {
        q: "Dans quels pays LIVEPAY est-il disponible ?",
        a: "LIVEPAY couvre tous les pays de l'UEMOA : Sénégal, Côte d'Ivoire, Mali, Burkina Faso, Niger, Togo, Bénin et Guinée-Bissau."
      },
    ]
  },
  {
    category: "Liens de paiement",
    questions: [
      {
        q: "Comment créer un lien de paiement ?",
        a: "Depuis votre tableau de bord, cliquez sur 'Nouveau Lien', renseignez le montant, la description et choisissez le moyen de paiement. Le lien sera généré instantanément."
      },
      {
        q: "Comment partager un lien de paiement ?",
        a: "Après avoir créé un lien, vous pouvez le copier et le partager par WhatsApp, SMS, email ou tout autre canal de communication. Un bouton de partage WhatsApp est également disponible."
      },
      {
        q: "Quelle est la durée de vie d'un lien de paiement ?",
        a: "Par défaut, les liens de paiement n'ont pas de date d'expiration. Vous pouvez les désactiver manuellement depuis votre tableau de bord."
      },
      {
        q: "Que se passe-t-il quand un client clique sur mon lien ?",
        a: "Le client est redirigé vers la page de paiement de l'opérateur choisi (Wave, Orange Money, etc.) où il peut effectuer le paiement de manière sécurisée."
      },
    ]
  },
  {
    category: "Paiements",
    questions: [
      {
        q: "Quels moyens de paiement sont acceptés ?",
        a: "LIVEPAY supporte Wave, Orange Money, MTN Mobile Money, Moov Money, Free Money et le système interopérable PI-SPI."
      },
      {
        q: "Comment savoir si un paiement a été effectué ?",
        a: "Vous recevez une notification en temps réel et le statut du lien passe de 'En attente' à 'Payé' dans votre tableau de bord."
      },
      {
        q: "Quand reçois-je l'argent sur mon compte ?",
        a: "Les paiements Mobile Money sont instantanés. L'argent est crédité directement sur votre compte marchand auprès de l'opérateur."
      },
      {
        q: "Puis-je rembourser un client ?",
        a: "Les remboursements doivent être gérés directement avec l'opérateur de paiement. Contactez le support pour plus d'informations."
      },
    ]
  },
  {
    category: "Sécurité",
    questions: [
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Oui, LIVEPAY utilise des protocoles de chiffrement modernes pour protéger vos données et transactions."
      },
      {
        q: "Comment activer l'authentification à deux facteurs ?",
        a: "Allez dans Paramètres > Sécurité et activez l'option 'Authentification à deux facteurs'. Vous recevrez un code par SMS à chaque connexion."
      },
      {
        q: "Que faire en cas d'activité suspecte ?",
        a: "Changez immédiatement votre mot de passe et contactez le support à support@livepay.sn"
      },
    ]
  },
  {
    category: "API & Intégration",
    questions: [
      {
        q: "Comment intégrer l'API LIVEPAY ?",
        a: "Accédez à la section API dans votre tableau de bord pour obtenir vos clés API et consulter la documentation."
      },
      {
        q: "Puis-je recevoir des webhooks ?",
        a: "Oui, vous pouvez configurer des webhooks pour recevoir des notifications automatiques lors des paiements."
      },
      {
        q: "Quel est le coût de l'API ?",
        a: "L'accès à l'API est inclus dans votre compte. Contactez l'administrateur pour un accès production."
      },
    ]
  },
];

export default function HelpPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Général")

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      fq => fq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <HelpCircle className="h-8 w-8" />
          Centre d'aide
        </h1>
        <p className="text-muted-foreground mt-1">
          Trouvez des réponses à vos questions
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <div className="space-y-6">
        {filteredFaqs.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
              <CardDescription>
                {category.questions.length} question{category.questions.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion
                type="single"
                collapsible
                value={expandedCategory || ''}
                onValueChange={(value) => setExpandedCategory(value)}
              >
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`${category.category}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {filteredFaqs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun résultat trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Besoin d'aide supplémentaire ?
          </CardTitle>
          <CardDescription>
            Notre équipe est là pour vous aider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white border">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">support@livepay.sn</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white border">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">+221 70 500 05 05</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white border">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">+221 70 500 05 05</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
