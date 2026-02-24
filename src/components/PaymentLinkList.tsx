'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language';
import { PaymentLink, deletePaymentLink as deleteLinkFn, getPaymentLinks, markAsPaid } from '@/lib/payment-links';
import { PaymentProvider } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, Check, Trash2, Eye, Link as LinkIcon, Plus, MessageCircle, ExternalLink, CheckCircle } from 'lucide-react';
import { PaymentLinkForm } from './PaymentLinkForm';
import { PAYMENT_PROVIDERS } from '@/lib/config';

interface PaymentLinkListProps {
  onLinkCreated?: (link: PaymentLink) => void;
}

export function PaymentLinkList({ onLinkCreated }: PaymentLinkListProps) {
  const { t } = useLanguage();
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<PaymentLink | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterProvider, setFilterProvider] = useState<string>('all');

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = () => {
    const data = getPaymentLinks();
    setLinks(data);
  };

  const handleDelete = () => {
    if (linkToDelete) {
      deleteLinkFn(linkToDelete.id);
      loadLinks();
      setLinkToDelete(null);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (link: PaymentLink) => {
    const providerName = t(`providers.${link.provider}`);
    const message = `Bonjour ${link.buyerName || 'cher client'},\n\nVoici votre lien de paiement LIVEPAY :\n${link.deepLink}\n\nMontant : ${link.amount} FCFA\nMoyen de paiement : ${providerName}\nDescription : ${link.description}`;
    const encodedMessage = encodeURIComponent(message);
    const phone = link.buyerPhone?.replace(/[^0-9+]/g, '') || '';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleMarkAsPaid = (id: string) => {
    markAsPaid(id);
    loadLinks();
  };

  const getStatusBadge = (status: PaymentLink['status']) => {
    const variants = {
      pending: 'secondary',
      paid: 'default',
      expired: 'destructive',
      cancelled: 'outline',
    } as const;

    const labels: Record<string, string> = {
      pending: t('links.pending'),
      paid: t('links.paid'),
      expired: t('links.expired'),
      cancelled: t('links.cancelled'),
    };

    return (
      <Badge variant={variants[status]}>
        {status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
        {labels[status]}
      </Badge>
    );
  };

  const getProviderBadge = (provider: PaymentProvider) => {
    return (
      <Badge variant="outline" className="flex items-center gap-1 w-fit">
        <span>{PAYMENT_PROVIDERS[provider].icon}</span>
        <span>{t(`providers.${provider}`)}</span>
      </Badge>
    );
  };

  const filteredLinks = filterProvider === 'all' 
    ? links 
    : links.filter(l => l.provider === filterProvider);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              <CardTitle>{t('links.title')}</CardTitle>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('links.newLink')}
            </Button>
          </div>
          <CardDescription>
            {t('app.tagline')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select value={filterProvider} onValueChange={setFilterProvider}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par opérateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les opérateurs</SelectItem>
                {(Object.keys(PAYMENT_PROVIDERS) as PaymentProvider[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    <span className="flex items-center gap-2">
                      <span>{PAYMENT_PROVIDERS[p].icon}</span>
                      <span>{t(`providers.${p}`)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {links.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t('links.noLinks')}</h3>
              <p className="text-muted-foreground mt-1">
                {t('links.noLinksDesc')}
              </p>
              <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('links.newLink')}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('links.name')}</TableHead>
                  <TableHead>{t('links.provider')}</TableHead>
                  <TableHead>{t('links.amount')}</TableHead>
                  <TableHead>{t('links.buyerName')}</TableHead>
                  <TableHead>{t('links.status')}</TableHead>
                  <TableHead>{t('links.createdAt')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{link.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {link.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getProviderBadge(link.provider)}</TableCell>
                    <TableCell className="font-mono font-medium">
                      {link.amount} FCFA
                    </TableCell>
                    <TableCell>
                      {link.buyerName ? (
                        <div>
                          <div className="font-medium">{link.buyerName}</div>
                          {link.buyerPhone && (
                            <div className="text-xs text-muted-foreground">{link.buyerPhone}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(link.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {link.createdAt.toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {link.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t('links.paid')}
                            onClick={() => handleMarkAsPaid(link.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t('links.whatsapp')}
                          onClick={() => handleShareWhatsApp(link)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleCopy(link.deepLink, link.id)}
                            >
                              {copiedId === link.id ? (
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 mr-2" />
                              )}
                              {t('links.copyLink')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(link.deepLink, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {t('links.open')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleShareWhatsApp(link)}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {t('links.whatsapp')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLinkToDelete(link)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PaymentLinkForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onLinkCreated={(link) => {
          loadLinks();
          onLinkCreated?.(link);
        }}
      />

      <AlertDialog open={!!linkToDelete} onOpenChange={() => setLinkToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('links.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('links.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              {t('links.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
