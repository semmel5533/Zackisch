import type { Order, Organization } from "./types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export function generateOrderConfirmationHtml(
  order: Order,
  organization: Organization,
  locale: string = "de",
): string {
  const isDe = locale.startsWith("de");
  const title = isDe
    ? "Bestell- und Zahlungsbestätigung"
    : "Order and Payment Confirmation";
  const dateStr = new Date(
    order.createdAt ||
      order._creationTime ||
      (order.$createdAt ? new Date(order.$createdAt).getTime() : Date.now()),
  ).toLocaleString(isDe ? "de-DE" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const orderType =
    order.type === "dine-in"
      ? isDe
        ? order.tableNumber
          ? `An Tisch ${order.tableNumber}`
          : "Am Tisch"
        : order.tableNumber
        ? `At table ${order.tableNumber}`
        : "Dine-in"
      : isDe
      ? "Zum Abholen"
      : "Takeaway";

  let parsedItems: Array<{
    name: string;
    quantity: number;
    price: number;
    options?: Array<{ name: string; choice: string; price?: number }>;
  }> = [];

  try {
    if (typeof order.items === "string") {
      parsedItems = JSON.parse(order.items);
    } else if (Array.isArray(order.items)) {
      parsedItems = order.items;
    }
  } catch {
    parsedItems = [];
  }

  const itemsHtml = parsedItems
    .map((item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      const optionsHtml =
        item.options && item.options.length > 0
          ? `<div class="item-options">${item.options
              .map((opt) => escapeHtml(`${opt.name}: ${opt.choice}`))
              .join(", ")}</div>`
          : "";

      return `
        <tr>
          <td class="col-qty">${item.quantity}×</td>
          <td class="col-name">
            <strong>${escapeHtml(item.name)}</strong>
            ${optionsHtml}
          </td>
          <td class="col-price">${formatCents(itemTotal)} €</td>
        </tr>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${isDe ? "de" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - ${isDe ? "Bestellnummer" : "Order number"} ${escapeHtml(order.orderNumber)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page { margin: 15mm; size: portrait; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 32px 20px;
      line-height: 1.5;
      font-size: 14px;
    }
    a {
      color: #000;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    a:hover {
      opacity: 0.8;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      border: 1px solid #e5e5e5;
      border-radius: 20px;
      padding: 32px;
      background: #fff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0;
      color: #000;
      line-height: 1.25;
    }
    .btn-pdf {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #000;
      color: #fff;
      border: none;
      height: 40px;
      padding: 0 18px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.15s ease;
    }
    .btn-pdf:hover { opacity: 0.85; }
    @media (max-width: 520px) {
      body { padding: 16px 12px; }
      .container { padding: 24px 18px; border-radius: 16px; }
      .header { flex-direction: column; align-items: stretch; gap: 14px; }
      .btn-pdf { width: 100%; height: 44px; font-size: 14px; }
    }
    .waveline {
      display: block;
      width: 100%;
      height: 12px;
      overflow: hidden;
      color: #000;
    }
    .badge-number {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px;
      letter-spacing: -0.02em;
      color: #000;
    }
    .badge-number .num {
      font-family: 'Inter', sans-serif;
      font-weight: 900;
      font-variant-numeric: tabular-nums;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 20px;
      margin-bottom: 24px;
      background: #f9f9f9;
      padding: 18px;
      border-radius: 12px;
    }
    .meta-item { display: flex; flex-direction: column; }
    .meta-label { font-size: 12px; color: #666; font-weight: 600; }
    .meta-value { font-size: 13px; font-weight: 600; color: #111; margin-top: 2px; }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    .items-table th {
      text-align: left;
      border-bottom: 1px solid #e5e5e5;
      padding: 8px 4px;
      font-size: 13px;
      font-weight: 700;
      color: #111;
    }
    .items-table td {
      padding: 12px 4px;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: top;
    }
    .col-qty {
      width: 36px;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .col-name { font-weight: 500; }
    .item-options { font-size: 12px; color: #666; margin-top: 2px; }
    .col-price {
      width: 90px;
      text-align: right;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 12px 4px 0;
      margin-bottom: 24px;
    }
    .total-label { font-size: 16px; font-weight: 700; color: #000; }
    .total-price {
      font-family: 'Inter', sans-serif;
      font-size: 22px;
      font-weight: 900;
      font-variant-numeric: tabular-nums;
      color: #000;
    }
    .notice-box {
      border: 1px solid #e5e5e5;
      background: #fafafa;
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 12px;
      color: #555;
      line-height: 1.5;
    }
    .notice-box strong { color: #111; }
    .footer-note {
      text-align: center;
      font-size: 11px;
      color: #888;
      margin-top: 20px;
    }
    @media print {
      body { padding: 0; background: #fff; }
      .container { border: none; padding: 0; max-width: 100%; border-radius: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-title">${escapeHtml(title)}</h1>
      <button class="btn-pdf no-print" onclick="window.print()">
        <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor" style="vertical-align:-2px;margin-right:6px;"><path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0Zm-101.66,13.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,140.69V32a8,8,0,0,0-16,0V140.69L93.66,114.34a8,8,0,0,0-11.32,11.32Z"/></svg>
        <span>${isDe ? "PDF speichern" : "Save as PDF"}</span>
      </button>
    </div>

    <!-- Iconic WaveLine divider -->
    <svg class="waveline" width="100%" height="12" style="margin:16px 0 20px;">
      <defs>
        <pattern id="doc-wave-1" width="16" height="12" patternUnits="userSpaceOnUse">
          <path d="M 0 6 Q 4 1.5, 8 6 T 16 6" fill="none" stroke="#000" stroke-width="2.25" stroke-linecap="round" />
        </pattern>
      </defs>
      <rect width="100%" height="12" fill="url(#doc-wave-1)" />
    </svg>

    <div class="badge-number">
      ${isDe ? "Bestellnummer" : "Order number"} <span class="num">${escapeHtml(order.orderNumber)}</span>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">${isDe ? "Betrieb" : "Venue"}</span>
        <span class="meta-value">${escapeHtml(organization.name)}</span>
        ${organization.address ? `<span style="font-size:11px;color:#666;margin-top:2px;">${escapeHtml(organization.address)}</span>` : ""}
      </div>
      <div class="meta-item">
        <span class="meta-label">${isDe ? "Bestellart" : "Order Type"}</span>
        <span class="meta-value">${escapeHtml(orderType)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">${isDe ? "Datum & Uhrzeit" : "Date & Time"}</span>
        <span class="meta-value">${escapeHtml(dateStr)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">${isDe ? "Zahlungsstatus" : "Payment Status"}</span>
        <span class="meta-value">${isDe ? "Erfolgreich bezahlt" : "Paid successfully"}</span>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>${isDe ? "Menge" : "Qty"}</th>
          <th>${isDe ? "Position" : "Item"}</th>
          <th style="text-align:right;">${isDe ? "Betrag" : "Amount"}</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Iconic WaveLine divider -->
    <svg class="waveline" width="100%" height="12" style="margin:16px 0 12px;">
      <defs>
        <pattern id="doc-wave-2" width="16" height="12" patternUnits="userSpaceOnUse">
          <path d="M 0 6 Q 4 1.5, 8 6 T 16 6" fill="none" stroke="#000" stroke-width="2.25" stroke-linecap="round" />
        </pattern>
      </defs>
      <rect width="100%" height="12" fill="url(#doc-wave-2)" />
    </svg>

    <div class="total-row">
      <div>
        <div class="total-label">${isDe ? "Gesamtsumme" : "Total Amount"}</div>
        <div style="font-size:11px;color:#666;">${isDe ? "inkl. gesetzlicher MwSt." : "incl. VAT"}</div>
      </div>
      <div class="total-price">${formatCents(order.total)} €</div>
    </div>

    <div class="notice-box">
      <strong>${isDe ? "Wichtiger Hinweis:" : "Important note:"}</strong>
      ${isDe
        ? 'Dies ist eine Bestell- und Zahlungsbestätigung über die technische Zahlungsabwicklung via <a href="https://www.zakkig.com" target="_blank" rel="noopener noreferrer" style="color: #000; font-weight: 500; text-decoration: underline; text-underline-offset: 3px;">zakkig.com</a>. Die steuerliche Bewirtungsquittung bzw. offizielle Rechnung wird auf Wunsch direkt vom Betrieb ausgestellt und kann dort angefordert werden.'
        : 'This is an order and payment confirmation for technical payment processing via <a href="https://www.zakkig.com" target="_blank" rel="noopener noreferrer" style="color: #000; font-weight: 500; text-decoration: underline; text-underline-offset: 3px;">zakkig.com</a>. The official tax invoice or receipt is issued directly by the venue upon request.'}
    </div>

    <div class="footer-note">
      <a href="https://www.zakkig.com" target="_blank" rel="noopener noreferrer" style="color: #000; font-weight: 500; text-decoration: underline; text-underline-offset: 3px;">zakkig.com</a> · ${isDe ? "QR-Bestell- und Bezahlsystem" : "QR Ordering and Payment System"}
    </div>
  </div>
</body>
</html>`;
}

export function downloadOrderConfirmation(
  order: Order,
  organization: Organization,
  locale: string = "de",
): void {
  const html = generateOrderConfirmationHtml(order, organization, locale);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bestell-und-zahlungsbestaetigung-${order.orderNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
