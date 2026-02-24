"use client"

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, Mail, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useLanguage } from '@/lib/language'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  type: 'payment' | 'system' | 'alert'
  title: string
  message: string
  date: Date
  read: boolean
}

export default function NotificationsPage() {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    paymentReceived: true,
    paymentFailed: true,
    dailyReport: false,
    weeklyReport: true,
  })

  useEffect(() => {
    // Demo notifications
    setNotifications([
      {
        id: '1',
        type: 'payment',
        title: 'Paiement reçu',
        message: 'Vous avez reçu un paiement de 15 000 FCFA via Wave',
        date: new Date(),
        read: false,
      },
      {
        id: '2',
        type: 'payment',
        title: 'Paiement reçu',
        message: 'Vous avez reçu un paiement de 8 500 FCFA via Orange Money',
        date: new Date(Date.now() - 3600000),
        read: false,
      },
      {
        id: '3',
        type: 'alert',
        title: 'Lien expiré',
        message: 'Le lien de paiement #LNK-123 a expiré',
        date: new Date(Date.now() - 86400000),
        read: true,
      },
      {
        id: '4',
        type: 'system',
        title: 'Nouvelle fonctionnalité',
        message: 'MTN Mobile Money est maintenant disponible',
        date: new Date(Date.now() - 172800000),
        read: true,
      },
    ])
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment':
        return <Check className="h-4 w-4 text-green-600" />
      case 'alert':
        return <Bell className="h-4 w-4 text-orange-600" />
      case 'system':
        return <Mail className="h-4 w-4 text-blue-600" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <Bell className="h-8 w-8" />
          {t('nav.notifications')}
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos notifications et alertes
        </p>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox" className="relative">
            Boîte de réception
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Tout marquer comme lu
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune notification</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-colors ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${!notification.read ? 'text-blue-700' : ''}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <Badge variant="default" className="h-2 w-2 p-0">
                                <span className="sr-only">Nouveau</span>
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {notification.date.toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez comment vous souhaitez recevoir vos notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Canaux de notification</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez les notifications par email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications dans l'application
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Types de notification</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Paiements reçus</Label>
                    <p className="text-sm text-muted-foreground">
                      Notification lors de chaque paiement
                    </p>
                  </div>
                  <Switch
                    checked={settings.paymentReceived}
                    onCheckedChange={(checked) => setSettings({ ...settings, paymentReceived: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Paiements échoués</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertes pour les paiements échoués
                    </p>
                  </div>
                  <Switch
                    checked={settings.paymentFailed}
                    onCheckedChange={(checked) => setSettings({ ...settings, paymentFailed: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapport quotidien</Label>
                    <p className="text-sm text-muted-foreground">
                      Récapitulatif quotidien par email
                    </p>
                  </div>
                  <Switch
                    checked={settings.dailyReport}
                    onCheckedChange={(checked) => setSettings({ ...settings, dailyReport: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapport hebdomadaire</Label>
                    <p className="text-sm text-muted-foreground">
                      Statistiques hebdomadaires
                    </p>
                  </div>
                  <Switch
                    checked={settings.weeklyReport}
                    onCheckedChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
