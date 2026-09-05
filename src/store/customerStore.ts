import { create } from 'zustand';

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  crops: string;
  totalOrders: number;
  totalSpent: string;
  lastOrder: string;
  status: 'Verified' | 'Pending' | 'Active';
  registeredAt: string;
  avatarUrl?: string;
}

const DEFAULT_CUSTOMERS: CustomerRecord[] = [
  {
    id: '#CUST-9012',
    name: 'Senthil Nathan',
    phone: '+91 98421 99210',
    email: 'senthil.farmer@gmail.com',
    location: 'Coimbatore, Tamil Nadu',
    crops: 'Paddy, Sugarcane (12 Acres)',
    totalOrders: 6,
    totalSpent: '₹14,580',
    lastOrder: '28 Aug 2026',
    status: 'Verified',
    registeredAt: '12 Jan 2026',
  },
  {
    id: '#CUST-9013',
    name: 'Muruganandam K',
    phone: '+91 94432 10842',
    email: 'murugan.agro@gmail.com',
    location: 'Erode, Tamil Nadu',
    crops: 'Turmeric, Coconut (8 Acres)',
    totalOrders: 4,
    totalSpent: '₹8,920',
    lastOrder: '26 Aug 2026',
    status: 'Verified',
    registeredAt: '04 Mar 2026',
  },
  {
    id: '#CUST-9014',
    name: 'Gopalakrishnan V',
    phone: '+91 97890 33412',
    email: 'gopal.crops@gmail.com',
    location: 'Madurai, Tamil Nadu',
    crops: 'Cotton, Chillies (5 Acres)',
    totalOrders: 3,
    totalSpent: '₹5,400',
    lastOrder: '24 Aug 2026',
    status: 'Verified',
    registeredAt: '21 May 2026',
  },
  {
    id: '#CUST-9015',
    name: 'Annamalai R',
    phone: '+91 98402 77112',
    email: 'annamalai.farm@gmail.com',
    location: 'Tirunelveli, Tamil Nadu',
    crops: 'Banana, Paddy (15 Acres)',
    totalOrders: 8,
    totalSpent: '₹22,150',
    lastOrder: '29 Aug 2026',
    status: 'Verified',
    registeredAt: '08 Feb 2026',
  },
  {
    id: '#CUST-9016',
    name: 'Meenakshi Sundaram',
    phone: '+91 99441 55230',
    email: 'meenakshi.agro@gmail.com',
    location: 'Dindigul, Tamil Nadu',
    crops: 'Vegetables, Maize (6 Acres)',
    totalOrders: 2,
    totalSpent: '₹3,200',
    lastOrder: '20 Aug 2026',
    status: 'Verified',
    registeredAt: '15 Jul 2026',
  },
];

const getInitialCustomers = (): CustomerRecord[] => {
  try {
    const saved = localStorage.getItem('AgriEra_registered_customers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load customers from storage', e);
  }
  return DEFAULT_CUSTOMERS;
};

interface CustomerState {
  customers: CustomerRecord[];
  addCustomer: (customer: Omit<CustomerRecord, 'id' | 'registeredAt'> & { id?: string }) => CustomerRecord;
  getCustomerCount: () => number;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: getInitialCustomers(),

  addCustomer: (newCust) => {
    const id = newCust.id || `#CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;

    const completeRecord: CustomerRecord = {
      ...newCust,
      id,
      registeredAt: formattedDate,
      lastOrder: 'None (New Account)',
      totalOrders: newCust.totalOrders ?? 0,
      totalSpent: newCust.totalSpent ?? '₹0',
      status: 'Verified',
    };

    const updated = [completeRecord, ...get().customers];
    set({ customers: updated });

    try {
      localStorage.setItem('AgriEra_registered_customers', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist customer to storage', e);
    }

    // Emit real-time event for any active subscribers/Socket.IO listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('customer:created', {
          detail: completeRecord,
        })
      );
    }

    return completeRecord;
  },

  getCustomerCount: () => get().customers.length,
}));
