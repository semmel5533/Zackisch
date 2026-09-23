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
        ? `Im Restaurant${order.tableNumber ? ` (Tisch ${order.tableNumber})` : ""}`
        : `Dine-in${order.tableNumber ? ` (Table ${order.tableNumber})` : ""}`
      : isDe
      ? "Zum Mitnehmen"
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
  <title>${escapeHtml(title)} - #${escapeHtml(order.orderNumber)}</title>
  <style>
    @page { margin: 15mm; size: portrait; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 32px 20px;
      line-height: 1.5;
      font-size: 14px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      border: 1px solid #e5e5e5;
      border-radius: 16px;
      padding: 32px;
      background: #fff;
    }
    .header {
      border-bottom: 2px solid #111;
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 4px;
      color: #000;
    }
    .brand-sub {
      font-size: 12px;
      color: #666;
      margin: 0;
    }
    .btn-print {
      background: #000;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-print:hover { opacity: 0.85; }
    .badge-number {
      font-size: 28px;
      font-weight: 900;
      font-variant-numeric: tabular-nums;
      margin: 0 0 16px;
      letter-spacing: -0.02em;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 20px;
      margin-bottom: 24px;
      background: #f9f9f9;
      padding: 16px;
      border-radius: 12px;
    }
    .meta-item { display: flex; flex-direction: column; }
    .meta-label { font-size: 11px; text-transform: uppercase; tracking: 0.05em; color: #666; font-weight: 700; }
    .meta-value { font-size: 13px; font-weight: 600; color: #111; margin-top: 2px; }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .items-table th {
      text-align: left;
      border-bottom: 1px solid #e5e5e5;
      padding: 8px 4px;
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .items-table td {
      padding: 12px 4px;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: top;
    }
    .col-qty { width: 36px; font-weight: 700; font-variant-numeric: tabular-nums; }
    .col-name { font-weight: 500; }
    .item-options { font-size: 12px; color: #666; margin-top: 2px; }
    .col-price { width: 90px; text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 16px 4px;
      border-top: 2px solid #111;
      margin-bottom: 24px;
    }
    .total-label { font-size: 16px; font-weight: 800; }
    .total-price { font-size: 22px; font-weight: 900; font-variant-numeric: tabular-nums; }
    .notice-box {
      border: 1px solid #e5e5e5;
      background: #fafafa;
      border-radius: 10px;
      padding: 14px;
      font-size: 12px;
      color: #555;
      line-height: 1.45;
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
      .container { border: none; padding: 0; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="brand-title">${escapeHtml(title)}</h1>
        <p class="brand-sub">${escapeHtml(organization.name)}</p>
      </div>
      <button class="btn-print no-print" onclick="window.print()">
        ${isDe ? "Drucken / Als PDF speichern" : "Print / Save as PDF"}
      </button>
    </div>

    <div class="badge-number">
      #${escapeHtml(order.orderNumber)}
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">${isDe ? "Betrieb" : "Venue"}</span>
        <span class="meta-value">${escapeHtml(organization.name)}</span>
        ${organization.address ? `<span style="font-size:11px;color:#666;">${escapeHtml(organization.address)}</span>` : ""}
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
        <span class="meta-value" style="color:#059669;">${isDe ? "Erfolgreich bezahlt" : "Paid successfully"}</span>
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
        ? "Dies ist eine Bestell- und Zahlungsbestätigung über die technische Zahlungsabwicklung via zakkig.com. Die steuerliche Bewirtungsquittung bzw. offizielle Rechnung wird auf Wunsch direkt vom Betrieb ausgestellt und kann dort angefordert werden."
        : "This is an order and payment confirmation for technical payment processing via zakkig.com. The official tax invoice or receipt is issued directly by the venue upon request."}
    </div>

    <div class="footer-note">
      zakkig.com · ${isDe ? "QR-Bestell- und Bezahlsystem" : "QR Ordering and Payment System"}
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
