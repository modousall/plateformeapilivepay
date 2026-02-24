"use client"

import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Building, 
  User, 
  CreditCard, 
  Bell, 
  Globe,
  Shield,
  Palette,
  Download,
  Trash2,
  Save,
  Upload,
  CheckCircle,
  Smartphone,
  Mail,
  Key
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from '@/lib/language'
import { useAuth } from '@/contexts/AuthContext'
import { MERCHANT_CONFIG, UEMOACountry, PAYMENT_PROVIDERS, PaymentProvider } from '@/lib/config'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from '@/contexts/ToastContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { exportToCSV, exportToJSON, generateReportSummary } from '@/lib/export'
import { getPaymentLinks } from '@/lib/payment-links'
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const { success, error } = useToast()
  
  const [merchantInfo, setMerchantInfo] = useState({
    businessName: MERCHANT_CONFIG.businessName,
    accountNumber: MERCHANT_CONFIG.accountNumber,
    b2bIdentifier: MERCHANT_CONFIG.b2bIdentifier,
    phoneNumber: MERCHANT_CONFIG.phoneNumber,
    country: MERCHANT_CONFIG.country,
    address: '',
    ninea: '',
    registreCommerce: '',
  })
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    avatar: '',
  })

  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Africa/Dakar',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    dailyReport: false,
    weeklyReport: true,
    monthlyReport: true,
    darkMode: false,
    compactMode: false,
  })

  const [enabledProviders, setEnabledProviders] = useState<Record<string, boolean>>({
    wave: true,
    orange_money: true,
    mtn_momo: true,
    moov_money: true,
    free_money: false,
    pispi: true,
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const countries: { code: UEMOACountry; name: string }[] = [
    { code: 'SN', name: 'Sénégal' },
    { code: 'CI', name: "Côte d'Ivoire" },
    { code: 'ML', name: 'Mali' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'NE', name: 'Niger' },
    { code: 'TG', name: 'Togo' },
    { code: 'BJ', name: 'Bénin' },
    { code: 'GW', name: 'Guinée-Bissau' },
  ]

  const handleSaveProfile = () => {
    success('Profil enregistré', 'Vos informations ont été mises à jour')
  }

  const handleSaveMerchant = () => {
    success('Informations marchand enregistrées', 'Votre configuration a été mise à jour')
  }

  const handleSaveProviders = () => {
    success('Moyens de paiement mis à jour', 'Vos opérateurs ont été configurés')
  }

  const handleSavePreferences = () => {
    success('Préférences enregistrées', 'Vos paramètres ont été appliqués')
  }

  const handleExportData = (format: 'csv' | 'json') => {
    const links = getPaymentLinks()
    if (format === 'csv') {
      exportToCSV(links, 'livepay_transactions')
    } else {
      exportToJSON(links, 'livepay_transactions')
    }
    success('Export démarré', 'Vos données sont en cours de téléchargement')
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDeleteAccount = () => {
    logout()
    success('Compte supprimé', 'Votre compte a été supprimé')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            {t('nav.settings')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Configurez votre compte et vos préférences
          </p>
        </div>
        <Button onClick={handleSavePreferences}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer tout
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full md:grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="merchant" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Marchand</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Paiement</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Apparence</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Confidentialité</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Données</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Zone danger</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Changer la photo</Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF ou PNG. Max 1MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+221 7X XXX XX XX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select value={preferences.timezone} onValueChange={(v) => setPreferences({...preferences, timezone: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dakar">Dakar (GMT)</SelectItem>
                      <SelectItem value="Africa/Abidjan">Abidjan (GMT)</SelectItem>
                      <SelectItem value="Africa/Bamako">Bamako (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Une courte description..."
                  rows={4}
                />
              </div>

              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Merchant Tab */}
        <TabsContent value="merchant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations marchand</CardTitle>
              <CardDescription>
                Configurez les informations de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nom commercial</Label>
                  <Input
                    id="businessName"
                    value={merchantInfo.businessName}
                    onChange={(e) => setMerchantInfo({ ...merchantInfo, businessName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Select
                    value={merchantInfo.country}
                    onValueChange={(value) => setMerchantInfo({ ...merchantInfo, country: value as UEMOACountry })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Numéro de compte</Label>
                  <Input
                    id="accountNumber"
                    value={merchantInfo.accountNumber}
                    onChange={(e) => setMerchantInfo({ ...merchantInfo, accountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Téléphone professionnel</Label>
                  <Input
                    id="phoneNumber"
                    value={merchantInfo.phoneNumber}
                    onChange={(e) => setMerchantInfo({ ...merchantInfo, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ninea">Numéro NINEA</Label>
                  <Input
                    id="ninea"
                    value={merchantInfo.ninea}
                    onChange={(e) => setMerchantInfo({ ...merchantInfo, ninea: e.target.value })}
                    placeholder="Numéro d'identification fiscale"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registreCommerce">Registre de Commerce</Label>
                  <Input
                    id="registreCommerce"
                    value={merchantInfo.registreCommerce}
                    onChange={(e) => setMerchantInfo({ ...merchantInfo, registreCommerce: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète</Label>
                <Textarea
                  id="address"
                  value={merchantInfo.address}
                  onChange={(e) => setMerchantInfo({ ...merchantInfo, address: e.target.value })}
                  rows={2}
                />
              </div>

              <Separator />

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Identifiants de paiement</h3>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">Identifiant B2B Wave</p>
                  <p className="font-mono text-sm text-blue-700 break-all bg-white p-2 rounded">
                    {merchantInfo.b2bIdentifier}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">Numéro de compte</p>
                  <p className="font-mono text-sm text-blue-700 bg-white p-2 rounded">
                    {merchantInfo.accountNumber}
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveMerchant}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les informations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Moyens de paiement acceptés</CardTitle>
              <CardDescription>
                Sélectionnez les opérateurs que vous souhaitez accepter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {(Object.keys(PAYMENT_PROVIDERS) as PaymentProvider[]).map((provider) => (
                  <div
                    key={provider}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{PAYMENT_PROVIDERS[provider].icon}</span>
                      <div>
                        <p className="font-medium">{t(`providers.${provider}`)}</p>
                        <p className="text-xs text-muted-foreground">
                          {PAYMENT_PROVIDERS[provider].countries.length} pays
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={enabledProviders[provider]}
                      onCheckedChange={(checked) => 
                        setEnabledProviders({ ...enabledProviders, [provider]: checked })
                      }
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleSaveProviders}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les moyens de paiement
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Devise</CardTitle>
              <CardDescription>
                Devise de facturation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select defaultValue="xof">
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xof">FCFA (XOF)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Le FCFA est la devise unique des pays de l'UEMOA
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Canaux de notification</CardTitle>
              <CardDescription>
                Configurez comment vous souhaitez recevoir les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez les notifications par email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications dans l'application
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertes par SMS (frais applicables)
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, smsNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rapports programmés</CardTitle>
              <CardDescription>
                Recevez des résumés périodiques de votre activité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Rapport quotidien</Label>
                  <p className="text-sm text-muted-foreground">
                    Récapitulatif quotidien à 8h00
                  </p>
                </div>
                <Switch
                  checked={preferences.dailyReport}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, dailyReport: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Rapport hebdomadaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Statistiques chaque lundi
                  </p>
                </div>
                <Switch
                  checked={preferences.weeklyReport}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, weeklyReport: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Rapport mensuel</Label>
                  <p className="text-sm text-muted-foreground">
                    Bilan mensuel complet
                  </p>
                </div>
                <Switch
                  checked={preferences.monthlyReport}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, monthlyReport: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSavePreferences} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les préférences
          </Button>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apparence de l'interface</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de LIVEPAY
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mode sombre</Label>
                  <p className="text-sm text-muted-foreground">
                    Interface sombre pour réduire la fatigue oculaire
                  </p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Mode compact</Label>
                  <p className="text-sm text-muted-foreground">
                    Réduire l'espacement des éléments
                  </p>
                </div>
                <Switch
                  checked={preferences.compactMode}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, compactMode: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Langue de l'interface</Label>
                <Select value={preferences.language} onValueChange={(v) => setPreferences({...preferences, language: v})}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confidentialité et sécurité</CardTitle>
              <CardDescription>
                Gérez vos paramètres de confidentialité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session publique</Label>
                    <p className="text-sm text-muted-foreground">
                      Rester connecté sur cet appareil
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Sécurité supplémentaire pour votre compte
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Visibilité du profil</Label>
                <Select defaultValue="private">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Privé</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export des données</CardTitle>
              <CardDescription>
                Téléchargez vos données de transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Format CSV</CardTitle>
                    <CardDescription>
                      Compatible Excel, Google Sheets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => handleExportData('csv')} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter en CSV
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Format JSON</CardTitle>
                    <CardDescription>
                      Pour traitement programmé
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => handleExportData('json')} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter en JSON
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Données incluses</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Toutes les transactions</li>
                  <li>Informations clients</li>
                  <li>Statistiques détaillées</li>
                  <li>Historique complet</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import des données</CardTitle>
              <CardDescription>
                Importez des données depuis un autre système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input type="file" accept=".csv,.json" className="max-w-xs" />
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Formats supportés : CSV, JSON
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Zone de danger
              </CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                <div className="space-y-1">
                  <Label className="text-destructive">Supprimer le compte</Label>
                  <p className="text-sm text-muted-foreground">
                    Cette action est irréversible. Toutes vos données seront supprimées.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <Label>Résilier l'abonnement</Label>
                  <p className="text-sm text-muted-foreground">
                    Annuler votre abonnement premium
                  </p>
                </div>
                <Button variant="outline">Résilier</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Supprimer le compte ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes vos données, transactions et configurations seront définitivement supprimées.
              <br /><br />
              Veuillez taper <strong>DELETE</strong> pour confirmer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAccount} className="bg-destructive">
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
