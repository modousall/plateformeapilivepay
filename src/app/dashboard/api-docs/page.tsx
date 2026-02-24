"use client"

import { useState } from 'react'
import { 
  Book, 
  Code, 
  Key, 
  Webhook, 
  Shield, 
  CreditCard, 
  Users, 
  FileJson,
  Copy,
  Check,
  Terminal,
  Lock,
  Zap,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function ApiDocumentationPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const endpoints = [
    {
      category: 'Marchands',
      items: [
        { method: 'GET', path: '/v1/merchants', description: 'Lister les marchands' },
        { method: 'POST', path: '/v1/merchants', description: 'Créer un marchand (Onboarding)' },
        { method: 'GET', path: '/v1/merchants/:id', description: 'Récupérer un marchand' },
        { method: 'PUT', path: '/v1/merchants/:id', description: 'Mettre à jour un marchand' },
        { method: 'DELETE', path: '/v1/merchants/:id', description: 'Supprimer un marchand' },
      ]
    },
    {
      category: 'Paiements',
      items: [
        { method: 'POST', path: '/v1/payments', description: 'Initier un paiement' },
        { method: 'GET', path: '/v1/payments', description: 'Lister les paiements' },
        { method: 'GET', path: '/v1/payments/:id', description: 'Récupérer un paiement' },
        { method: 'POST', path: '/v1/payouts', description: 'Initier un décaissement' },
        { method: 'POST', path: '/v1/refunds', description: 'Initier un remboursement' },
      ]
    },
    {
      category: 'Webhooks',
      items: [
        { method: 'POST', path: '/v1/webhooks', description: 'Recevoir un webhook' },
        { method: 'GET', path: '/v1/webhooks', description: 'Lister les webhooks' },
        { method: 'POST', path: '/v1/webhooks', description: 'Créer un webhook' },
      ]
    },
    {
      category: 'API Keys',
      items: [
        { method: 'POST', path: '/v1/api-keys', description: 'Créer une clé API' },
        { method: 'GET', path: '/v1/api-keys', description: 'Lister les clés API' },
        { method: 'DELETE', path: '/v1/api-keys/:id', description: 'Révoquer une clé API' },
      ]
    },
  ]

  const curlCreatePayment = `# Initier un paiement
curl -X POST https://api.livepay.sn/v1/payments \\
  -H "Authorization: Bearer live_pk_xxx..." \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: unique-request-id-123" \\
  -d '{
    "merchant_id": "merch_xxx",
    "amount": 10000,
    "currency": "XOF",
    "provider": "wave",
    "customer_phone": "+221700000000",
    "customer_name": "Jean Dupont",
    "description": "Commande #123"
  }'

# Response 201 Created:
{
  "data": {
    "id": "pay_xxx",
    "status": "pending",
    "amount": 10000,
    "fee_amount": 250,
    "net_amount": 9750,
    "deep_link": "https://pay.wave.com/m/...",
    "expires_in": 900
  }
}`

  const curlListPayments = `# Lister les paiements avec pagination
curl -X GET "https://api.livepay.sn/v1/payments?first=20&merchant_id=merch_xxx&status=success" \\
  -H "Authorization: Bearer live_pk_xxx..."

# Response 200 OK:
{
  "data": [...],
  "pagination": {
    "has_next_page": true,
    "has_previous_page": false,
    "start_cursor": "pay_xxx",
    "end_cursor": "pay_yyy",
    "total_count": 150
  }
}`

  const webhookExample = `{
  "event": "payment.success",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "pay_xxx",
    "merchant_id": "merch_xxx",
    "amount": 10000,
    "currency": "XOF",
    "status": "success",
    "provider": "wave",
    "external_reference": "EXT-XXX",
    "completed_at": "2024-01-15T10:30:00Z"
  }
}

# Headers:
# x-livepay-signature: whsec_xxx
# x-livepay-event: payment.success`

  const errorExample = `{
  "error": {
    "error_code": "request-validation-error",
    "error_message": "La requête contient des champs invalides",
    "error_type": "validation_error",
    "details": [
      {
        "field": "amount",
        "message": "Le champ 'amount' doit être supérieur ou égal à 100",
        "code": "too_small"
      }
    ],
    "request_id": "req_xxx",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <Book className="h-8 w-8" />
          Documentation API
        </h1>
        <p className="text-muted-foreground mt-1">
          API REST d'agrégateur de paiements Mobile Money & PI-SPI
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base URL</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-muted px-2 py-1 rounded block">
              https://api.livepay.sn/v1
            </code>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authentification</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-muted px-2 py-1 rounded block">
              Bearer {`{api_key}`}
            </code>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-muted px-2 py-1 rounded block">
              1000 req/min
            </code>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList className="grid w-full md:grid-cols-5">
          <TabsTrigger value="endpoints" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Authentification
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Erreurs
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Exemples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Endpoints API</CardTitle>
              <CardDescription>
                Liste complète des endpoints disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {endpoints.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      {category.category === 'Marchands' && <Users className="h-5 w-5" />}
                      {category.category === 'Paiements' && <CreditCard className="h-5 w-5" />}
                      {category.category === 'Webhooks' && <Webhook className="h-5 w-5" />}
                      {category.category === 'API Keys' && <Key className="h-5 w-5" />}
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((endpoint, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Badge className={
                              endpoint.method === 'GET' ? 'bg-blue-600' :
                              endpoint.method === 'POST' ? 'bg-green-600' :
                              endpoint.method === 'PUT' ? 'bg-yellow-600' :
                              'bg-red-600'
                            }>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm">{endpoint.path}</code>
                          </div>
                          <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-6" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Authentification API
              </CardTitle>
              <CardDescription>
                Comment authentifier vos requêtes API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Clés API</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  LIVEPAY utilise des clés API pour authentifier les requêtes. 
                  Il existe deux types de clés :
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <h4 className="font-medium mb-2">Publishable Key (Clé Publique)</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded block mb-2">
                      live_pk_xxx...
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Utilisable dans le frontend (applications mobiles, sites web)
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <h4 className="font-medium mb-2">Secret Key (Clé Secrète)</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded block mb-2">
                      live_sk_xxx...
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Garder secrète, utiliser uniquement côté serveur
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Header d'authentification</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Incluez votre clé API dans le header Authorization :
                </p>
                <code className="block p-3 bg-muted rounded-lg text-sm">
                  Authorization: Bearer live_pk_xxx...
                </code>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Idempotence</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Pour éviter les doublons, utilisez le header Idempotency-Key :
                </p>
                <code className="block p-3 bg-muted rounded-lg text-sm">
                  Idempotency-Key: unique-request-id-123
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestion des Erreurs
              </CardTitle>
              <CardDescription>
                Format standardisé des réponses d'erreur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Format des erreurs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Toutes les erreurs suivent un format standard :
                </p>
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                    {errorExample}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => handleCopy(errorExample, 'error')}
                  >
                    {copiedField === 'error' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Codes HTTP</h3>
                <div className="space-y-2">
                  {[
                    { code: 400, desc: 'Bad Request - Requête invalide' },
                    { code: 401, desc: 'Unauthorized - Clé API invalide' },
                    { code: 403, desc: 'Forbidden - Accès refusé' },
                    { code: 404, desc: 'Not Found - Ressource non trouvée' },
                    { code: 409, desc: 'Conflict - Conflit de données' },
                    { code: 422, desc: 'Unprocessable Entity - Validation échouée' },
                    { code: 429, desc: 'Too Many Requests - Rate limit dépassé' },
                    { code: 500, desc: 'Internal Server Error - Erreur serveur' },
                    { code: 503, desc: 'Service Unavailable - Service indisponible' },
                  ].map((item) => (
                    <div key={item.code} className="flex items-center justify-between p-2 rounded border">
                      <Badge variant="destructive">{item.code}</Badge>
                      <span className="text-sm text-muted-foreground">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>
                Recevez des notifications en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Événements disponibles</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {[
                    { event: 'payment.success', desc: 'Paiement réussi' },
                    { event: 'payment.failed', desc: 'Paiement échoué' },
                    { event: 'payment.refunded', desc: 'Paiement remboursé' },
                    { event: 'payout.completed', desc: 'Décaissement terminé' },
                    { event: 'payout.failed', desc: 'Décaissement échoué' },
                    { event: 'merchant.verified', desc: 'Marchand vérifié' },
                  ].map((item) => (
                    <div key={item.event} className="p-3 rounded-lg border">
                      <code className="text-sm font-medium">{item.event}</code>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Payload Webhook</h3>
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                    {webhookExample}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => handleCopy(webhookExample, 'webhook')}
                  >
                    {copiedField === 'webhook' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Vérification de signature</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Vérifiez la signature HMAC-SHA256 des webhooks reçus :
                </p>
                <code className="block p-3 bg-muted rounded-lg text-sm">
                  x-livepay-signature: whsec_xxx...
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Créer un paiement (cURL)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                    {curlCreatePayment}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => handleCopy(curlCreatePayment, 'curl1')}
                  >
                    {copiedField === 'curl1' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" />
                  Lister les paiements (cURL)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                    {curlListPayments}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => handleCopy(curlListPayments, 'curl2')}
                  >
                    {copiedField === 'curl2' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
