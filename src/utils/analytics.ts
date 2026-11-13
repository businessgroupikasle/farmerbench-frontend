declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string) || 'G-E5K8N8E4C1';

/** Initialize Google Analytics 4 (gtag.js) script dynamically if not already in document */
export function initGA() {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  // Check if gtag script is already present
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // SPA will handle page_view events explicitly
    });
  }
}

/** Track SPA Pageviews */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return;

  const pageTitle = title || document.title;
  const pageLocation = window.location.href;

  // 1. GA4 gtag config update & page_view event
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      page_path: path,
      send_to: GA_MEASUREMENT_ID,
    });
  }

  // 2. GTM dataLayer event
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'virtual_page_view',
    page_path: path,
    page_title: pageTitle,
    page_location: pageLocation,
  });
}

/** Track viewing a product detail page */
export function trackViewItem(product: {
  id: string;
  title: string;
  price: number;
  category?: string;
  brand?: string;
}) {
  const item = {
    item_id: product.id,
    item_name: product.title,
    price: product.price,
    item_category: product.category || 'Agricultural Products',
    item_brand: product.brand || 'AgriEra',
    quantity: 1,
  };

  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'INR',
      value: product.price,
      items: [item],
    });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      currency: 'INR',
      value: product.price,
      items: [item],
    },
  });
}

/** Track viewing a list of items (e.g. Products catalog or category) */
export function trackViewItemList(categoryName: string, products: Array<{ id: string; title: string; price: number }>) {
  const items = products.slice(0, 10).map((p, idx) => ({
    item_id: p.id,
    item_name: p.title,
    price: p.price,
    index: idx + 1,
    item_category: categoryName,
    item_brand: 'AgriEra',
  }));

  if (window.gtag) {
    window.gtag('event', 'view_item_list', {
      item_list_name: categoryName,
      items,
    });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item_list',
    ecommerce: {
      item_list_name: categoryName,
      items,
    },
  });
}

/** Track adding item to cart */
export function trackAddToCart(product: {
  id: string;
  title: string;
  price: number;
  category?: string;
  quantity?: number;
}) {
  const qty = product.quantity || 1;
  const item = {
    item_id: product.id,
    item_name: product.title,
    price: product.price,
    quantity: qty,
    item_category: product.category || 'Agricultural Products',
    item_brand: 'AgriEra',
  };

  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'INR',
      value: product.price * qty,
      items: [item],
    });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'INR',
      value: product.price * qty,
      items: [item],
    },
  });
}

/** Track removing item from cart */
export function trackRemoveFromCart(product: {
  id: string;
  title: string;
  price: number;
  quantity?: number;
}) {
  const qty = product.quantity || 1;
  const item = {
    item_id: product.id,
    item_name: product.title,
    price: product.price,
    quantity: qty,
  };

  if (window.gtag) {
    window.gtag('event', 'remove_from_cart', {
      currency: 'INR',
      value: product.price * qty,
      items: [item],
    });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'remove_from_cart',
    ecommerce: {
      currency: 'INR',
      value: product.price * qty,
      items: [item],
    },
  });
}

/** Track beginning checkout */
export function trackBeginCheckout(items: Array<{ id: string; title: string; price: number; quantity: number }>, totalValue: number) {
  const formattedItems = items.map((it) => ({
    item_id: it.id,
    item_name: it.title,
    price: it.price,
    quantity: it.quantity,
  }));

  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: totalValue,
      items: formattedItems,
    });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'INR',
      value: totalValue,
      items: formattedItems,
    },
  });
}

/** Track purchase completion */
export function trackPurchase(order: {
  id: string;
  totalPrice: number;
  shippingPrice?: number;
  taxPrice?: number;
  couponCode?: string | null;
  items: Array<{ productId?: string; id?: string; title: string; price: number; quantity: number }>;
}) {
  const items = order.items.map((it) => ({
    item_id: it.productId || it.id || 'item',
    item_name: it.title,
    price: it.price,
    quantity: it.quantity,
  }));

  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.totalPrice,
      currency: 'INR',
      tax: order.taxPrice || 0,
      shipping: order.shippingPrice || 0,
      coupon: order.couponCode || undefined,
      items,
    });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: order.id,
      value: order.totalPrice,
      currency: 'INR',
      tax: order.taxPrice || 0,
      shipping: order.shippingPrice || 0,
      coupon: order.couponCode || undefined,
      items,
    },
  });
}

