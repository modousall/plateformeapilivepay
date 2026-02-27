/**
 * LIVEPay - Utilitaire de Génération de QR Codes
 * 
 * Génère des QR codes pour les deep links de paiement
 * Permet le partage physique (affiches, reçus, cartes)
 */

// Configuration QR Code
export interface QRCodeOptions {
  size?: number;
  margin?: number;
  colorDark?: string;
  colorLight?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

const DEFAULT_OPTIONS: QRCodeOptions = {
  size: 256,
  margin: 2,
  colorDark: '#000000',
  colorLight: '#ffffff',
  errorCorrectionLevel: 'M',
};

/**
 * Génère une URL pour un service de QR Code API
 * Utilise goqr.me ou quickchart.io pour la génération
 */
export function generateQRCodeURL(
  deepLink: string,
  options: QRCodeOptions = {}
): string {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // Utilisation de goqr.me API (gratuit, pas d'authentification)
  const params = new URLSearchParams({
    type: 'qr',
    data: deepLink,
    size: `${config.size}x${config.size}`,
    margin: config.margin.toString(),
    ecc: config.errorCorrectionLevel,
  });

  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

/**
 * Génère un QR code SVG inline (sans dépendance externe)
 * Version simplifiée - pour une version complète, utiliser une librairie comme qrcode
 */
export function generateQRCodeSVG(
  data: string,
  size: number = 200
): string {
  // Note: Ceci est un placeholder
  // Pour une vraie génération SVG, utiliser la librairie 'qrcode'
  // npm install qrcode
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" 
         xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#ffffff"/>
      <text x="${size/2}" y="${size/2}" text-anchor="middle" 
            dominant-baseline="middle" font-size="12" fill="#000000">
        QR Code
      </text>
      <text x="${size/2}" y="${size/2 + 15}" text-anchor="middle" 
            dominant-baseline="middle" font-size="8" fill="#666666">
        ${data.substring(0, 30)}...
      </text>
    </svg>
  `;
}

/**
 * Génère le HTML pour un reçu de paiement avec QR code
 */
export function generatePaymentReceiptHTML(
  transferId: string,
  deepLink: string,
  amount: number,
  currency: string,
  payerName: string,
  beneficiaryName: string,
  provider: string
): string {
  const qrCodeURL = generateQRCodeURL(deepLink);
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount);
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reçu de Paiement - LIVEPay</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .receipt {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px dashed #e0e0e0;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #1a73e8;
    }
    .provider {
      color: #666;
      margin-top: 4px;
    }
    .amount {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      color: #1a73e8;
      margin: 16px 0;
    }
    .details {
      margin: 16px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .detail-label {
      color: #666;
    }
    .detail-value {
      font-weight: 500;
    }
    .qr-section {
      text-align: center;
      margin: 24px 0;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .qr-section img {
      max-width: 200px;
      height: auto;
    }
    .qr-label {
      margin-top: 12px;
      font-size: 12px;
      color: #666;
    }
    .footer {
      text-align: center;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 2px dashed #e0e0e0;
      font-size: 12px;
      color: #999;
    }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      background: #fff3cd;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="logo">LIVEPay</div>
      <div class="provider">via ${provider}</div>
    </div>

    <div class="amount">
      ${formattedAmount} ${currency}
    </div>

    <div class="details">
      <div class="detail-row">
        <span class="detail-label">Référence</span>
        <span class="detail-value">${transferId}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Statut</span>
        <span class="status">En attente</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Payeur</span>
        <span class="detail-value">${payerName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Bénéficiaire</span>
        <span class="detail-value">${beneficiaryName}</span>
      </div>
    </div>

    <div class="qr-section">
      <img src="${qrCodeURL}" alt="QR Code de paiement">
      <div class="qr-label">
        Scannez pour payer avec ${provider}
      </div>
    </div>

    <div class="footer">
      <p>Scannez le QR code pour effectuer le paiement</p>
      <p>Le lien expire dans 15 minutes</p>
      <p>© ${new Date().getFullYear()} LIVEPay - Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Génère un reçu PDF (à implémenter avec une librairie PDF)
 * Pour l'instant, retourne le HTML qui peut être converti en PDF
 */
export function generatePaymentReceiptPDF(
  transferId: string,
  deepLink: string,
  amount: number,
  currency: string,
  payerName: string,
  beneficiaryName: string,
  provider: string
): string {
  // Pour générer un vrai PDF, utiliser:
  // - @react-pdf/renderer (côté client)
  // - puppeteer (côté serveur)
  // - pdfkit (côté serveur)
  
  return generatePaymentReceiptHTML(
    transferId,
    deepLink,
    amount,
    currency,
    payerName,
    beneficiaryName,
    provider
  );
}

/**
 * Génère un lien de partage WhatsApp avec QR code
 */
export function generateWhatsAppShareLink(
  deepLink: string,
  amount: number,
  currency: string,
  recipientPhone?: string
): string {
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount);
  const message = `Bonjour, veuillez effectuer le paiement de ${formattedAmount} ${currency} en scannant ce QR code ou en cliquant sur le lien :\n\n${deepLink}`;
  
  const params = new URLSearchParams({
    text: message,
  });
  
  if (recipientPhone) {
    params.set('phone', recipientPhone.replace(/^\+/, ''));
  }
  
  return `https://wa.me/?${params.toString()}`;
}

/**
 * Génère un lien de partage SMS
 */
export function generateSMSShareLink(
  deepLink: string,
  amount: number,
  currency: string,
  recipientPhone?: string
): string {
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount);
  const message = `Paiement de ${formattedAmount} ${currency} : ${deepLink}`;
  
  // Le format varie selon les appareils
  return `sms:${recipientPhone || ''}?body=${encodeURIComponent(message)}`;
}

/**
 * Génère un lien de partage email
 */
export function generateEmailShareLink(
  deepLink: string,
  amount: number,
  currency: string,
  recipientEmail?: string,
  subject?: string
): string {
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount);
  const emailSubject = subject || `Paiement de ${formattedAmount} ${currency}`;
  const emailBody = `Bonjour,\n\nVeuillez effectuer le paiement de ${formattedAmount} ${currency} en cliquant sur le lien ci-dessous :\n\n${deepLink}\n\nMerci.`;
  
  const params = new URLSearchParams({
    subject: emailSubject,
    body: emailBody,
  });
  
  if (recipientEmail) {
    params.set('to', recipientEmail);
  }
  
  return `mailto:?${params.toString()}`;
}

/**
 * Génère une carte de paiement HTML à intégrer
 */
export function generatePaymentCardHTML(
  deepLink: string,
  amount: number,
  currency: string,
  description?: string,
  provider?: string
): string {
  const qrCodeURL = generateQRCodeURL(deepLink);
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount);
  const providerName = provider ? provider.replace('_', ' ').toUpperCase() : 'MOBILE MONEY';
  
  return `
<div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; max-width: 320px; font-family: sans-serif;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
    <span style="font-size: 12px; color: #666; background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">
      ${providerName}
    </span>
    <span style="font-size: 20px; font-weight: bold; color: #1a73e8;">
      ${formattedAmount} ${currency}
    </span>
  </div>
  
  ${description ? `<p style="margin: 0 0 16px 0; color: #333; font-size: 14px;">${description}</p>` : ''}
  
  <div style="text-align: center;">
    <img src="${qrCodeURL}" alt="QR Code" style="max-width: 160px; height: auto;">
  </div>
  
  <div style="text-align: center; margin-top: 12px;">
    <a href="${deepLink}" 
       style="display: inline-block; background: #1a73e8; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500;">
      Payer maintenant
    </a>
  </div>
  
  <p style="margin: 12px 0 0 0; font-size: 11px; color: #999; text-align: center;">
    Expire dans 15 minutes
  </p>
</div>
  `.trim();
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  generateQRCodeURL,
  generateQRCodeSVG,
  generatePaymentReceiptHTML,
  generatePaymentReceiptPDF,
  generateWhatsAppShareLink,
  generateSMSShareLink,
  generateEmailShareLink,
  generatePaymentCardHTML,
};
