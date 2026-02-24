'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { createPaymentLink } from '@/lib/payment-links';
import { PaymentLink } from '@/lib/types';
import { PaymentProvider } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Copy, Check, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PAYMENT_PROVIDERS } from '@/lib/config';

interface PaymentLinkFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLinkCreated: (link: PaymentLink) => void;
}

export function PaymentLinkForm({ open, onOpenChange, onLinkCreated }: PaymentLinkFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState<PaymentProvider>('wave');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState<PaymentLink | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const link = createPaymentLink({
      name,
      amount: parseInt(amount.replace(/\s/g, ''), 10),
      description,
      provider,
      buyerPhone,
      buyerName,
      buyerEmail: buyerEmail || undefined,
    });

    setGeneratedLink(link);
    onLinkCreated(link);
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShareWhatsApp = (link: PaymentLink) => {
    const providerName = t(`providers.${link.provider}`);
    const message = `Bonjour ${link.buyerName || 'cher client'},\n\nVoici votre lien de paiement LIVEPAY :\n${link.deepLink}\n\nMontant : ${link.amount} FCFA\nMoyen de paiement : ${providerName}\nDescription : ${link.description}\n\nMerci de votre confiance !`;
    const encodedMessage = encodeURIComponent(message);
    const phone = link.buyerPhone?.replace(/[^0-9+]/g, '') || '';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleClose = () => {
    setName('');
    setAmount('');
    setDescription('');
    setProvider('wave');
    setBuyerPhone('');
    setBuyerName('');
    setBuyerEmail('');
    setGeneratedLink(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            {t('links.newLink')}
          </DialogTitle>
          <DialogDescription>
            {t('app.tagline')}
          </DialogDescription>
        </DialogHeader>

        {!generatedLink ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('links.name')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('links.namePlaceholder')}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">{t('links.amount')}</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t('links.amountPlaceholder')}
                    required
                    min="1"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="provider">{t('links.provider')}</Label>
                  <Select value={provider} onValueChange={(v) => setProvider(v as PaymentProvider)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('links.providerPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">{t('links.description')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('links.descriptionPlaceholder')}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="buyerName">{t('links.buyerName')}</Label>
                  <Input
                    id="buyerName"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder={t('links.buyerNamePlaceholder')}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="buyerPhone">{t('links.buyerPhone')}</Label>
                  <Input
                    id="buyerPhone"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder={t('links.buyerPhonePlaceholder')}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="buyerEmail">{t('links.buyerEmail')}</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder={t('links.buyerEmailPlaceholder')}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('links.cancel')}
              </Button>
              <Button type="submit">{t('links.generate')}</Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 text-center">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ✓ {t('notifications.linkCreated')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('links.copyLink')}</Label>
                <div className="flex gap-2">
                  <Input value={generatedLink.deepLink} readOnly className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(generatedLink.deepLink, 'deepLink')}
                  >
                    {copiedField === 'deepLink' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleShareWhatsApp(generatedLink)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t('links.whatsapp')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCopy(generatedLink.deepLink, 'deepLink2')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t('links.copy')}
                </Button>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('links.name')}</span>
                  <span className="font-medium">{generatedLink.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('links.amount')}</span>
                  <span className="font-medium">{generatedLink.amount} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('links.provider')}</span>
                  <span className="font-medium flex items-center gap-1">
                    <span>{PAYMENT_PROVIDERS[generatedLink.provider].icon}</span>
                    <span>{t(`providers.${generatedLink.provider}`)}</span>
                  </span>
                </div>
                {generatedLink.buyerName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('links.buyerName')}</span>
                    <span className="font-medium">{generatedLink.buyerName}</span>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>{t('common.close')}</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
