"use client"

import { useState } from 'react'
import { Shield, Key, Lock, Activity, Smartphone, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from '@/lib/language'
import { useAuth } from '@/contexts/AuthContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SecurityPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Demo activity logs
  const activityLogs = [
    {
      id: '1',
      action: 'Connexion réussie',
      ip: '41.82.123.45',
      location: 'Dakar, Sénégal',
      device: 'Chrome sur Windows',
      date: new Date(),
      success: true,
    },
    {
      id: '2',
      action: 'Création lien de paiement',
      ip: '41.82.123.45',
      location: 'Dakar, Sénégal',
      device: 'Chrome sur Windows',
      date: new Date(Date.now() - 3600000),
      success: true,
    },
    {
      id: '3',
      action: 'Tentative de connexion échouée',
      ip: '102.68.45.123',
      location: 'Abidjan, Côte d\'Ivoire',
      device: 'Safari sur iOS',
      date: new Date(Date.now() - 86400000),
      success: false,
    },
    {
      id: '4',
      action: 'Modification mot de passe',
      ip: '41.82.123.45',
      location: 'Dakar, Sénégal',
      device: 'Chrome sur Windows',
      date: new Date(Date.now() - 172800000),
      success: true,
    },
  ]

  const activeSessions = [
    {
      id: '1',
      device: 'Chrome sur Windows',
      location: 'Dakar, Sénégal',
      ip: '41.82.123.45',
      lastActive: 'À l\'instant',
      current: true,
    },
    {
      id: '2',
      device: 'Safari sur iPhone',
      location: 'Dakar, Sénégal',
      ip: '41.82.123.46',
      lastActive: 'Il y a 2 heures',
      current: false,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <Shield className="h-8 w-8" />
          {t('nav.security')}
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez la sécurité de votre compte
        </p>
      </div>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle>État de sécurité</CardTitle>
          <CardDescription>
            Aperçu de la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <div className={`w-3 h-3 rounded-full ${twoFactorEnabled ? 'bg-green-600' : 'bg-orange-600'}`} />
              <div>
                <p className="font-medium">Authentification à deux facteurs</p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled ? 'Activée' : 'Désactivée'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <div>
                <p className="font-medium">Mot de passe</p>
                <p className="text-sm text-muted-foreground">
                  Dernière modification il y a 7 jours
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <div>
                <p className="font-medium">Sessions actives</p>
                <p className="text-sm text-muted-foreground">
                  {activeSessions.length} appareil(s) connecté(s)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Mettez à jour votre mot de passe régulièrement pour plus de sécurité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 caractères, au moins une majuscule et un chiffre
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button className="w-full md:w-auto">
              Mettre à jour le mot de passe
            </Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Authentification à deux facteurs (2FA)
            </CardTitle>
            <CardDescription>
              Ajoutez une couche de sécurité supplémentaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activer le 2FA</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez un code par SMS ou via une application d'authentification
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            {twoFactorEnabled && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <p className="font-medium">L'authentification à deux facteurs est activée</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Sessions actives
            </CardTitle>
            <CardDescription>
              Gérez les appareils connectés à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • {session.ip}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dernière activité : {session.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.current && (
                      <Badge variant="default">Session actuelle</Badge>
                    )}
                    {!session.current && (
                      <Button variant="outline" size="sm">
                        Déconnecter
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Journal d'activité
            </CardTitle>
            <CardDescription>
              Historique des actions sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Appareil</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.device}</TableCell>
                    <TableCell>{log.location}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.date.toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {log.success ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Succès
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Échec
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
