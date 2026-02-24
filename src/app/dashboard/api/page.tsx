"use client"

import { useState } from 'react'
import { Key, Code, Webhook, Copy, Check, Shield, Book, Terminal, FileJson, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from '@/lib/language'
import { Textarea } from "@/components/ui/textarea"
import { SUPER_ADMIN_CONFIG, MERCHANT_CONFIG } from '@/lib/config'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { QRCode } from '@/components/QRCode'

export default function ApiPage() {
  const { t } = useLanguage()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [webhookEnabled, setWebhookEnabled] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('https://your-domain.com/webhooks/livepay')

  // Demo API keys
  const apiKey = `live_pk_${MERCHANT_CONFIG.b2bIdentifier}_${SUPER_ADMIN_CONFIG.email.split('@')[0]}`
  const apiSecret = 'live_sk_' + Math.random().toString(36).substring(2, 40)
  const webhookSecret = 'whsec_' + Math.random().toString(36).substring(2, 40)

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const curlCreateExample = `# Créer un lien de paiement
curl -X POST https://api.livepay.sn/v1/payment-links \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 10000,
    "description": "Commande #123",
    "provider": "wave",
    "buyer_phone": "+221700000000",
    "buyer_name": "Jean Dupont"
  }'

# Response:
{
  "success": true,
  "data": {
    "id": "link_xxx",
    "deep_link": "https://pay.wave.com/m/...",
    "status": "pending"
  }
}`

  const curlListExample = `# Lister les liens de paiement
curl -X GET "https://api.livepay.sn/v1/payment-links?limit=10&status=paid" \\
  -H "Authorization: Bearer ${apiKey}"

# Response:
{
  "success": true,
  "data": [...],
  "count": 10
}`

  const jsSdkExample = `import { LivePay } from '@livepay/sdk';

const client = new LivePay('${apiKey}');

// Créer un lien de paiement
const link = await client.paymentLinks.create({
  amount: 10000,
  description: 'Commande #123',
  provider: 'wave',
  buyer_phone: '+221700000000'
});

console.log('Lien de paiement:', link.deep_link);

// Lister les liens
const links = await client.paymentLinks.list({ 
  limit: 10,
  status: 'paid'
});

// Récupérer un lien
const link = await client.paymentLinks.get('link_id');

// Statistiques
const stats = await client.stats.get({
  start_date: '2024-01-01',
  end_date: '2024-12-31'
});`

  const pythonExample = `import requests

API_KEY = '${apiKey}'
BASE_URL = 'https://api.livepay.sn/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Créer un lien de paiement
response = requests.post(
    f'{BASE_URL}/payment-links',
    headers=headers,
    json={
        'amount': 10000,
        'description': 'Commande #123',
        'provider': 'wave',
        'buyer_phone': '+221700000000'
    }
)

link = response.json()['data']
print(f"Lien de paiement: {link['deep_link']}")

# Lister les liens
response = requests.get(
    f'{BASE_URL}/payment-links',
    headers=headers,
    params={'limit': 10}
)`

  const phpExample = `<?php
$apiKey = '${apiKey}';
$baseUrl = 'https://api.livepay.sn/v1';

$headers = [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
];

// Créer un lien de paiement
$data = [
    'amount' => 10000,
    'description' => 'Commande #123',
    'provider' => 'wave',
    'buyer_phone' => '+221700000000'
];

$ch = curl_init("$baseUrl/payment-links");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$link = json_decode($response, true)['data'];

echo "Lien de paiement: " . $link['deep_link'];
?>`

  const webhookPayload = `{
  "event": "payment.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "link_xxx",
    "name": "Commande #123",
    "amount": 10000,
    "currency": "FCFA",
    "status": "paid",
    "provider": "wave",
    "deep_link": "https://pay.wave.com/m/...",
    "buyer": {
      "name": "Jean Dupont",
      "phone": "+221700000000"
    },
    "paid_at": "2024-01-15T10:30:00Z",
    "created_at": "2024-01-15T10:00:00Z"
  }
}`

  const webhookVerifyExample = `// Vérifier la signature du webhook
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Usage dans un serveur Express
app.post('/webhooks/livepay', (req, res) => {
  const signature = req.headers['x-livepay-signature'];
  const payload = JSON.stringify(req.body);
  
  if (verifyWebhookSignature(payload, signature, webhookSecret)) {
    const event = req.body.event;
    
    switch (event) {
      case 'payment.completed':
        console.log('Paiement reçu:', req.body.data);
        break;
      case 'payment.failed':
        console.log('Paiement échoué:', req.body.data);
        break;
    }
    
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
});`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <Code className="h-8 w-8" />
          {t('nav.api')} & Intégrations
        </h1>
        <p className="text-muted-foreground mt-1">
          Intégrez LIVEPAY à vos applications avec notre API REST
        </p>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid md:grid-cols-5">
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Clés API</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span className="hidden sm:inline">Documentation</span>
          </TabsTrigger>
          <TabsTrigger value="sdks" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span className="hidden sm:inline">SDKs</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span className="hidden sm:inline">Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="postman" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            <span className="hidden sm:inline">Postman</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Clés API
              </CardTitle>
              <CardDescription>
                Gérez vos clés d'accès à l'API LIVEPAY
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Clé API Publique (Publishable Key)</Label>
                <div className="flex gap-2">
                  <Input value={apiKey} readOnly className="font-mono" />
                  <Button variant="outline" onClick={() => handleCopy(apiKey, 'apiKey')}>
                    {copiedField === 'apiKey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Utilisez cette clé dans votre frontend (applications mobiles, sites web)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Clé API Secrète (Secret Key)</Label>
                <div className="flex gap-2">
                  <Input value={apiSecret} readOnly type="password" className="font-mono" />
                  <Button variant="outline" onClick={() => handleCopy(apiSecret, 'apiSecret')}>
                    {copiedField === 'apiSecret' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Gardez cette clé secrète. Ne jamais la partager ou l'exposer dans le code frontend.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Webhook className="h-4 w-4" />
                  Secret Webhook
                </Label>
                <div className="flex gap-2">
                  <Input value={webhookSecret} readOnly type="password" className="font-mono" />
                  <Button variant="outline" onClick={() => handleCopy(webhookSecret, 'webhookSecret')}>
                    {copiedField === 'webhookSecret' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Utilisé pour vérifier la signature des webhooks reçus
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Régénérer les clés
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Configurer les alertes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Accès API Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Pour obtenir un accès API en production, contactez l'administrateur :
              </p>
              <div className="space-y-2">
                <p className="font-medium">{SUPER_ADMIN_CONFIG.name}</p>
                <p className="text-sm text-muted-foreground">{SUPER_ADMIN_CONFIG.email}</p>
                <p className="text-sm text-muted-foreground">{MERCHANT_CONFIG.phoneNumber}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation API</CardTitle>
              <CardDescription>
                Guide complet pour intégrer l'API LIVEPAY
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Base URL</h3>
                  <code className="block p-3 bg-muted rounded-lg text-sm">
                    https://api.livepay.sn/v1
                  </code>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Authentification</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    L'API utilise l'authentification par token Bearer. Incluez votre clé API dans le header :
                  </p>
                  <code className="block p-3 bg-muted rounded-lg text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Endpoints</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">POST</Badge>
                          <code className="text-sm">/v1/payment-links</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Créer un nouveau lien de paiement</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-600">GET</Badge>
                          <code className="text-sm">/v1/payment-links</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Lister tous les liens de paiement</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-600">GET</Badge>
                          <code className="text-sm">/v1/payment-links/:id</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Récupérer un lien de paiement</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-600">PATCH</Badge>
                          <code className="text-sm">/v1/payment-links/:id</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Mettre à jour un lien de paiement</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-600">DELETE</Badge>
                          <code className="text-sm">/v1/payment-links/:id</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Supprimer un lien de paiement</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-600">GET</Badge>
                          <code className="text-sm">/v1/stats</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Obtenir les statistiques</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-600">POST</Badge>
                          <code className="text-sm">/v1/webhooks</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Recevoir les notifications webhook</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdks" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  JavaScript / TypeScript SDK
                </CardTitle>
                <CardDescription>
                  Installation: <code className="bg-muted px-2 py-1 rounded">npm install @livepay/sdk</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea value={jsSdkExample} readOnly className="font-mono text-xs h-80" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Python
                </CardTitle>
                <CardDescription>
                  Installation: <code className="bg-muted px-2 py-1 rounded">pip install requests</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea value={pythonExample} readOnly className="font-mono text-xs h-64" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  PHP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea value={phpExample} readOnly className="font-mono text-xs h-64" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  cURL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Créer un lien de paiement</Label>
                  <Textarea value={curlCreateExample} readOnly className="font-mono text-xs h-48 mt-2" />
                </div>
                <div>
                  <Label>Lister les liens</Label>
                  <Textarea value={curlListExample} readOnly className="font-mono text-xs h-32 mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Configuration des Webhooks
              </CardTitle>
              <CardDescription>
                Recevez des notifications en temps réel sur les événements de paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activer les webhooks</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications sur les événements de paiement
                  </p>
                </div>
                <Switch checked={webhookEnabled} onCheckedChange={setWebhookEnabled} />
              </div>

              <div className="space-y-2">
                <Label>URL du webhook</Label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/webhooks/livepay"
                />
                <p className="text-xs text-muted-foreground">
                  Cette URL recevra les notifications POST pour chaque événement
                </p>
              </div>

              <div className="space-y-2">
                <Label>Événements disponibles</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {[
                    { event: 'payment.completed', desc: 'Un paiement a été effectué avec succès' },
                    { event: 'payment.failed', desc: 'Un paiement a échoué' },
                    { event: 'payment.expired', desc: 'Un lien de paiement a expiré' },
                    { event: 'payment.refunded', desc: 'Un remboursement a été effectué' },
                  ].map((item) => (
                    <div key={item.event} className="flex items-center gap-2 p-3 rounded-lg border">
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                      <div>
                        <code className="text-sm font-medium">{item.event}</code>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button>Enregistrer la configuration</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exemple de payload Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={webhookPayload} readOnly className="font-mono text-xs h-64" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Vérification de signature
              </CardTitle>
              <CardDescription>
                Vérifiez l'authenticité des webhooks reçus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={webhookVerifyExample} readOnly className="font-mono text-xs h-64" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code pour tests Webhook</CardTitle>
              <CardDescription>
                Scannez ce QR code pour tester vos webhooks avec ngrok
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <QRCode value={webhookUrl} size={150} />
              <div className="space-y-2">
                <p className="text-sm">URL publique de test :</p>
                <code className="block p-2 bg-muted rounded text-sm">{webhookUrl}</code>
                <p className="text-xs text-muted-foreground">
                  Utilisez ngrok pour exposer votre serveur local :<br />
                  <code className="bg-muted px-2 py-1 rounded">ngrok http 3000</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="postman" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Collection Postman
              </CardTitle>
              <CardDescription>
                Importez notre collection Postman pour tester l'API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button>
                  <FileJson className="h-4 w-4 mr-2" />
                  Télécharger la collection
                </Button>
                <Button variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  Voir la documentation Postman
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <h3 className="font-semibold mb-2">Variables d'environnement</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configurez ces variables dans Postman :
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">base_url</Label>
                    <Input value="https://api.livepay.sn/v1" readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">api_key</Label>
                    <Input value={apiKey} readOnly />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Endpoints inclus</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>POST /payment-links - Créer un lien de paiement</li>
                  <li>GET /payment-links - Lister les liens</li>
                  <li>GET /payment-links/:id - Récupérer un lien</li>
                  <li>PATCH /payment-links/:id - Mettre à jour un lien</li>
                  <li>DELETE /payment-links/:id - Supprimer un lien</li>
                  <li>GET /stats - Obtenir les statistiques</li>
                  <li>POST /webhooks - Tester les webhooks</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
