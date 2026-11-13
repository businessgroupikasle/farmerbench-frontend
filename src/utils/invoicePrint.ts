/**
 * Utility to generate and trigger native browser print preview for AgriEra Order Invoices.
 */

export interface PrintableInvoiceData {
  id: string;
  customer?: string;
  phone?: string;
  email?: string;
  date?: string;
  status?: string;
  payment?: string;
  paymentMethod?: string;
  shippingAddress?: string;
  amount?: string | number;
  items?: Array<{
    name?: string;
    title?: string;
    qty?: number | string;
    quantity?: number | string;
    price?: number | string;
    unitPrice?: number | string;
    total?: number | string;
    selectedAttributes?: {
      packSize?: string;
    };
  }>;
  itemsPrice?: number;
  discountPrice?: number;
  shippingPrice?: number;
  totalPrice?: number;
  couponCode?: string;
  createdAt?: string;
  user?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export const generatePrintableInvoiceHtml = (order: PrintableInvoiceData): string => {
  const rawId = String(order.id || '').trim();
  const orderId = rawId.startsWith('#')
    ? rawId
    : (rawId.length > 8 ? `#GL-${rawId.slice(0, 5).toUpperCase()}` : `#GL-${rawId || 'INV01'}`);

  const customerName =
    order.customer ||
    order.user?.name ||
    'Valued Farmer';

  const customerPhone =
    order.phone ||
    order.user?.phone ||
    '';

  const customerEmail =
    order.email ||
    order.user?.email ||
    '';

  const address = typeof order.shippingAddress === 'string'
    ? order.shippingAddress
    : 'Standard Farm Gate Delivery Address';

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : order.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const paymentStatus = (order.payment || (order.status?.toLowerCase().includes('paid') ? 'Paid' : 'Paid')).toUpperCase();
  const paymentMethod = order.paymentMethod === 'CASH_ON_DELIVERY' || order.payment === 'COD'
    ? 'Cash on Delivery'
    : 'Online / UPI (Razorpay)';

  // Process items
  const rawItems = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];
  let calculatedSubtotal = 0;

  const normalizedItems = rawItems.map((it, idx) => {
    const title = it.title || it.name || `Agricultural Input Item ${idx + 1}`;
    const pack = it.selectedAttributes?.packSize ? ` (${it.selectedAttributes.packSize})` : '';
    const qty = Number(it.qty || it.quantity || 1);
    const unitPriceNum = Number(String(it.unitPrice || it.price || 0).replace(/[^0-9.]/g, '')) || 0;
    const lineTotal = Number(String(it.total || (unitPriceNum * qty)).replace(/[^0-9.]/g, '')) || (unitPriceNum * qty);
    calculatedSubtotal += lineTotal;
    return {
      index: idx + 1,
      title: `${title}${pack}`,
      qty,
      unitPrice: unitPriceNum.toFixed(2),
      total: lineTotal.toFixed(2),
    };
  });

  const rawAmount = typeof order.amount === 'number'
    ? order.amount
    : (Number(String(order.amount || 0).replace(/[^0-9.]/g, '')) || 0);

  const totalPayable = order.totalPrice || rawAmount || calculatedSubtotal || 0;
  const itemsSubtotal = order.itemsPrice || calculatedSubtotal || totalPayable;
  const discountAmount = order.discountPrice || 0;
  const deliveryCharges = order.shippingPrice || 0;

  const discountedItemsTotal = Math.max(0, itemsSubtotal - discountAmount);
  // GST 5% inclusive split calculation
  const gst = Number(((discountedItemsTotal * 5) / 105).toFixed(2));
  const net = Number((discountedItemsTotal - gst).toFixed(2));
  const cgst = (gst / 2).toFixed(2);
  const sgst = (gst - Number(cgst)).toFixed(2);

  const itemsRows = normalizedItems.length > 0
    ? normalizedItems.map((it) => `
      <tr>
        <td style="padding: 10px 12px; text-align: center; border-bottom: 1px solid #E2E8F0; color: #64748B;">${it.index}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; color: #0F291B; font-weight: 600;">${escapeHtml(it.title)}</td>
        <td style="padding: 10px 12px; text-align: center; border-bottom: 1px solid #E2E8F0; color: #334155;">${it.qty}</td>
        <td style="padding: 10px 12px; text-align: right; border-bottom: 1px solid #E2E8F0; color: #334155;">&#8377;${it.unitPrice}</td>
        <td style="padding: 10px 12px; text-align: right; border-bottom: 1px solid #E2E8F0; color: #0F291B; font-weight: 700;">&#8377;${it.total}</td>
      </tr>
    `).join('')
    : `
      <tr>
        <td style="padding: 10px 12px; text-align: center; border-bottom: 1px solid #E2E8F0; color: #64748B;">1</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; color: #0F291B; font-weight: 600;">Certified Farm Bio-Inputs & Nutrients</td>
        <td style="padding: 10px 12px; text-align: center; border-bottom: 1px solid #E2E8F0; color: #334155;">1</td>
        <td style="padding: 10px 12px; text-align: right; border-bottom: 1px solid #E2E8F0; color: #334155;">&#8377;${totalPayable.toFixed(2)}</td>
        <td style="padding: 10px 12px; text-align: right; border-bottom: 1px solid #E2E8F0; color: #0F291B; font-weight: 700;">&#8377;${totalPayable.toFixed(2)}</td>
      </tr>
    `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tax Invoice ${orderId} - AgriEra</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.5;
      background: #FFFFFF;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #0F4726;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      color: #0F4726;
      margin: 0 0 2px 0;
      letter-spacing: -0.02em;
    }
    .brand-meta {
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
    }
    .invoice-meta-block {
      text-align: right;
    }
    .invoice-id {
      font-size: 20px;
      font-weight: 800;
      color: #0F291B;
      margin: 0 0 4px 0;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      background: #DCFCE7;
      color: #15803D;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 22px;
      gap: 24px;
    }
    .details-col {
      flex: 1;
    }
    .details-label {
      font-size: 10.5px;
      font-weight: 800;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 5px;
    }
    .details-name {
      font-weight: 800;
      font-size: 14.5px;
      color: #0F291B;
      margin-bottom: 2px;
    }
    .details-text {
      font-size: 12px;
      color: #475569;
      line-height: 1.4;
    }
    .table-container {
      margin-bottom: 18px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    .items-table th {
      background: #F1F5F9;
      color: #334155;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 9px 12px;
      border-bottom: 2px solid #CBD5E1;
    }
    .summary-section {
      display: flex;
      justify-content: flex-end;
      margin-top: 14px;
    }
    .summary-box {
      width: 310px;
      font-size: 12.5px;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 12px 16px;
      background: #FAFAFA;
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
      padding: 3.5px 0;
      color: #475569;
    }
    .summary-grand-total {
      display: flex;
      justify-content: space-between;
      border-top: 2px solid #0F4726;
      padding-top: 8px;
      margin-top: 6px;
      font-size: 15.5px;
      font-weight: 900;
      color: #0F4726;
    }
    .footer-note {
      margin-top: 40px;
      border-top: 1px dashed #CBD5E1;
      padding-top: 14px;
      text-align: center;
      font-size: 11px;
      color: #64748B;
      line-height: 1.5;
    }
    .footer-signature {
      display: flex;
      justify-content: space-between;
      margin-top: 35px;
      font-size: 11.5px;
      color: #475569;
    }
    @media print {
      body {
        padding: 0;
        background: transparent;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="brand-title">AgriEra Agro Pvt Ltd</div>
        <div class="brand-meta">
          GSTIN: 33AAACF4921L1Z9 &bull; CIN: U01111TN2026PTC104928<br />
          Authorized Agricultural Bio-Nutrient & Certified Input Distributor<br />
          Farm Innovation Hub, Coimbatore, Tamil Nadu - 641001
        </div>
      </div>
      <div class="invoice-meta-block">
        <div class="invoice-id">TAX INVOICE ${orderId}</div>
        <div class="brand-meta">Date: ${escapeHtml(dateStr)}</div>
        <div style="margin-top: 4px;">
          <span class="status-badge">${escapeHtml(paymentStatus)}</span>
        </div>
      </div>
    </div>

    <!-- Customer & Delivery Row -->
    <div class="details-row">
      <div class="details-col">
        <div class="details-label">Billed & Shipped To:</div>
        <div class="details-name">${escapeHtml(customerName)}</div>
        ${customerPhone ? `<div class="details-text"><strong>Phone:</strong> ${escapeHtml(customerPhone)}</div>` : ''}
        ${customerEmail ? `<div class="details-text"><strong>Email:</strong> ${escapeHtml(customerEmail)}</div>` : ''}
        <div class="details-text" style="margin-top: 3px;"><strong>Delivery Address:</strong> ${escapeHtml(address)}</div>
      </div>
      <div class="details-col" style="max-width: 220px; text-align: right;">
        <div class="details-label">Payment Information</div>
        <div class="details-text" style="color: #0F4726; font-weight: 700; margin-top: 3px;">${escapeHtml(paymentMethod)}</div>
        <div class="details-text" style="margin-top: 4px;">Supply Type: Interstate / Intra-State B2C</div>
        <div class="details-text" style="margin-top: 2px;">Place of Supply: Tamil Nadu (33)</div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="table-container">
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th style="text-align: left;">Product / Service Description</th>
            <th style="width: 60px; text-align: center;">Qty</th>
            <th style="width: 110px; text-align: right;">Unit Price (&#8377;)</th>
            <th style="width: 120px; text-align: right;">Amount (&#8377;)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    <!-- Financial Breakdown -->
    <div class="summary-section">
      <div class="summary-box">
        <div class="summary-line">
          <span>Items Subtotal:</span>
          <span>&#8377;${itemsSubtotal.toFixed(2)}</span>
        </div>
        ${discountAmount > 0 ? `
          <div class="summary-line" style="color: #15803D; font-weight: 600;">
            <span>Coupon Discount${order.couponCode ? ` (${escapeHtml(order.couponCode)})` : ''}:</span>
            <span>- &#8377;${discountAmount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="summary-line">
          <span>Taxable Value (Net):</span>
          <span>&#8377;${net.toFixed(2)}</span>
        </div>
        <div class="summary-line">
          <span>CGST (2.5%):</span>
          <span>&#8377;${cgst}</span>
        </div>
        <div class="summary-line">
          <span>SGST (2.5%):</span>
          <span>&#8377;${sgst}</span>
        </div>
        <div class="summary-line">
          <span>Delivery / Freight:</span>
          <span style="font-weight: ${deliveryCharges === 0 ? '700' : '400'}; color: ${deliveryCharges === 0 ? '#15803D' : '#475569'};">
            ${deliveryCharges === 0 ? 'FREE' : `&#8377;${deliveryCharges.toFixed(2)}`}
          </span>
        </div>
        <div class="summary-grand-total">
          <span>Total Payable:</span>
          <span>&#8377;${totalPayable.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Signatures -->
    <div class="footer-signature">
      <div>
        <strong>Farmer / Customer Declaration:</strong><br />
        Goods received in good condition and original seal intact.
      </div>
      <div style="text-align: right;">
        <strong>For AgriEra Agro Pvt Ltd</strong><br />
        <span style="display: inline-block; margin-top: 18px; border-top: 1px solid #94A3B8; padding-top: 2px;">
          Authorized Signatory
        </span>
      </div>
    </div>

    <!-- Footer Disclaimer -->
    <div class="footer-note">
      This is a system-generated electronic tax invoice complying with Section 31 of CGST Act, 2017.<br />
      For customer support or queries regarding this order, call +91 94455 66778 or email support@agriera.in.
    </div>
  </div>
</body>
</html>`;
};

const escapeHtml = (str: string): string => {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Triggers the native browser print preview dialog for the given order invoice.
 * Uses a sandboxed hidden iframe to keep the current UI modal in place while
 * rendering a crisp, standalone A4 tax invoice print preview.
 */
export const triggerPrintInvoice = (order: PrintableInvoiceData): void => {
  if (!order) return;
  const html = generatePrintableInvoiceHtml(order);

  const iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0;');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    // Fallback: window print
    window.print();
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Allow styles, fonts and layout to settle before opening print preview dialog
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error('Print preview failed:', err);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2500);
    }
  }, 250);
};

