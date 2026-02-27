/**
 * LIVEPay - Page de Paiement Intermédiaire
 * Route: GET /pay/:transferId
 * 
 * Page intermédiaire qui affiche :
 * - Les détails du transfert
 * - Le QR code de paiement
 * - Le bouton de redirection vers l'application provider
 * - Les instructions de paiement
 */

import { NextRequest } from 'next/server';
import { generateQRCodeURL } from '@/lib/qr-code';

// Données de référence (à remplacer par une base de données)
import { transfers } from '../api/v1/transfers/route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transferId: string }> }
) {
  try {
    const { transferId } = await params;
    const transfer = transfers.find(t => t.id === transferId);

    if (!transfer) {
      return new Response(getNotFoundHTML(), {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Vérifier si le lien est expiré
    const isExpired = new Date(transfer.deep_link_expires_at) < new Date();
    
    const html = getPaymentPageHTML(transfer, isExpired);
    
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('Error rendering payment page:', error);
    return new Response(getErrorHTML(), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

// ============================================================================
// GÉNÉRATION HTML
// ============================================================================

function getPaymentPageHTML(transfer: any, isExpired: boolean): string {
  const qrCodeURL = generateQRCodeURL(transfer.payment_deep_link, { size: 256 });
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(transfer.amount);
  const providerName = getProviderDisplayName(transfer.provider);
  const statusColors: Record<string, string> = {
    pending: '#fff3cd',
    processing: '#cce5ff',
    debited: '#d4edda',
    success: '#28a745',
    failed: '#f8d7da',
  };
  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    processing: 'En cours',
    debited: 'Payé',
    success: 'Complété',
    failed: 'Échoué',
  };

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paiement - LIVEPay</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 480px;
      width: 100%;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .provider-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 8px;
    }
    .content {
      padding: 32px 24px;
    }
    .amount-section {
      text-align: center;
      margin-bottom: 32px;
    }
    .amount {
      font-size: 42px;
      font-weight: bold;
      color: #1a73e8;
    }
    .currency {
      font-size: 20px;
      color: #666;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      margin-top: 12px;
    }
    .details-section {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6c757d;
      font-size: 14px;
    }
    .detail-value {
      color: #212529;
      font-weight: 500;
      font-size: 14px;
      text-align: right;
    }
    .qr-section {
      text-align: center;
      padding: 24px;
      background: white;
      border: 2px dashed #e9ecef;
      border-radius: 12px;
      margin-bottom: 24px;
    }
    .qr-section img {
      max-width: 200px;
      height: auto;
      border-radius: 8px;
    }
    .qr-label {
      margin-top: 16px;
      font-size: 14px;
      color: #6c757d;
    }
    .qr-instructions {
      font-size: 12px;
      color: #999;
      margin-top: 8px;
    }
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(26, 115, 232, 0.4);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 115, 232, 0.5);
    }
    .btn-secondary {
      background: white;
      color: #1a73e8;
      border: 2px solid #1a73e8;
    }
    .btn-secondary:hover {
      background: #f0f7ff;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .expired-banner {
      background: #f8d7da;
      color: #721c24;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding: 24px;
      color: #6c757d;
      font-size: 12px;
      border-top: 1px solid #e9ecef;
    }
    .timer {
      text-align: center;
      color: #6c757d;
      font-size: 13px;
      margin-top: 16px;
    }
    @media (max-width: 480px) {
      .amount {
        font-size: 32px;
      }
      .content {
        padding: 24px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">LIVEPay</div>
      <div class="provider-badge">${providerName}</div>
    </div>

    <div class="content">
      ${isExpired ? `
        <div class="expired-banner">
          ⚠️ Ce lien de paiement a expiré
        </div>
      ` : ''}

      <div class="amount-section">
        <div class="amount">${formattedAmount}</div>
        <div class="currency">${transfer.currency}</div>
        <div class="status-badge" style="background: ${statusColors[transfer.status]}; color: ${transfer.status === 'success' ? 'white' : '#856404'}">
          ${statusLabels[transfer.status] || transfer.status}
        </div>
      </div>

      <div class="details-section">
        <div class="detail-row">
          <span class="detail-label">Référence</span>
          <span class="detail-value">${transfer.internal_reference}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Du</span>
          <span class="detail-value">${transfer.payer.name || transfer.payer.phone}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Vers</span>
          <span class="detail-value">${transfer.beneficiary.name || transfer.beneficiary.phone}</span>
        </div>
        ${transfer.description ? `
        <div class="detail-row">
          <span class="detail-label">Description</span>
          <span class="detail-value">${transfer.description}</span>
        </div>
        ` : ''}
      </div>

      ${!isExpired && transfer.status === 'pending' ? `
      <div class="qr-section">
        <img src="${qrCodeURL}" alt="QR Code de paiement">
        <div class="qr-label">
          📱 Scannez pour payer
        </div>
        <div class="qr-instructions">
          Ouvrez l'application ${providerName} et scannez ce code
        </div>
      </div>

      <div class="action-buttons">
        <a href="${transfer.payment_deep_link}" class="btn btn-primary" target="_blank">
          🚀 Ouvrir l'application ${providerName}
        </a>
        <button class="btn btn-secondary" onclick="copyLink()">
          📋 Copier le lien
        </button>
      </div>

      <div class="timer" id="timer">
        ⏱️ Expire dans <span id="countdown">15:00</span>
      </div>
      ` : ''}

      ${transfer.status === 'success' ? `
      <div class="action-buttons">
        <div style="text-align: center; padding: 20px; color: #28a745;">
          ✅ Paiement réussi !
        </div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} LIVEPay - Tous droits réservés</p>
      <p style="margin-top: 8px;">Paiement sécurisé par ${providerName}</p>
    </div>
  </div>

  <script>
    function copyLink() {
      const link = '${transfer.payment_deep_link}';
      navigator.clipboard.writeText(link).then(() => {
        alert('Lien copié !');
      }).catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
    }

    // Compte à rebours
    const expiresAt = new Date('${transfer.deep_link_expires_at}').getTime();
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = expiresAt - now;
      
      if (distance < 0) {
        document.getElementById('countdown').textContent = 'EXPIRÉ';
        return;
      }
      
      const minutes = Math.floor(distance / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);
      
      document.getElementById('countdown').textContent = 
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  </script>
</body>
</html>
  `.trim();
}

function getNotFoundHTML(): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Non trouvé - LIVEPay</title>
  <style>
    body {
      font-family: sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
    }
    h1 { font-size: 48px; margin-bottom: 16px; }
    p { font-size: 18px; opacity: 0.9; }
  </style>
</head>
<body>
  <div>
    <h1>404</h1>
    <p>Ce paiement n'existe pas ou a été supprimé</p>
  </div>
</body>
</html>
  `.trim();
}

function getErrorHTML(): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Erreur - LIVEPay</title>
  <style>
    body {
      font-family: sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
    }
    h1 { font-size: 48px; margin-bottom: 16px; }
    p { font-size: 18px; opacity: 0.9; }
  </style>
</head>
<body>
  <div>
    <h1>Erreur</h1>
    <p>Une erreur est survenue. Veuillez réessayer.</p>
  </div>
</body>
</html>
  `.trim();
}

function getProviderDisplayName(provider: string): string {
  const names: Record<string, string> = {
    wave: 'Wave',
    orange_money: 'Orange Money',
    mtn_momo: 'MTN Mobile Money',
    moov_money: 'Moov Money',
    free_money: 'Free Money',
  };
  return names[provider] || provider;
}
