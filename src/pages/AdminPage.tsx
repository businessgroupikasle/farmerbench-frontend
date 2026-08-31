import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  Boxes,
  Users,
  TicketPercent,
  CalendarCheck,
  Stethoscope,
  GraduationCap,
  MessageSquareQuote,
  BookOpen,
  Image as ImageIcon,
  BarChart3,
  UserCog,
  Settings,
  Search,
  Calendar,
  HelpCircle,
  Bell,
  ExternalLink,
  ChevronDown,
  Plus,
  X,
  Sparkles,
  TrendingUp,
  Star,
  CheckCircle2,
  FileText,
  UserPlus,
  Download,
  ShieldAlert,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  MapPin,
  Phone,
  Send,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProducts, useProductMutations } from '../hooks/useProducts';
import { useCategories, useCategoryMutations } from '../hooks/useCategories';
import './AdminPage.css';

// Assets
import growthBoosterImg from '../assets/growth-booster.jpg';
import neemOilImg from '../assets/neem-oil-bottle.jpg';
import farmingPracticesImg from '../assets/farming-practices.jpg';
import vineyardImg from '../assets/vineyard-hills.jpg';
import wheatImg from '../assets/wheat-sunburst.jpg';
import cropMonitoringImg from '../assets/crop-monitoring.jpg';
import smartIrrigationImg from '../assets/smart-irrigation.jpg';
import burntLeavesImg from '../assets/burnt-leaves.jpg';
import farmerLogo from '../assets/farmerbench-logo.png';
import { useCustomers, useCustomerMutations } from '../hooks/useCustomers';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const { data: customerData, refetch: refetchCustomers } = useCustomers();
  const { createCustomer, updateCustomer } = useCustomerMutations();
  const customers = customerData?.customers || [];

  const handleAdminLogout = () => {
    logout();
    localStorage.removeItem('formerbench_auth_token');
    localStorage.removeItem('formerbench_auth_user');
    localStorage.removeItem('farmerbench_demo_admin');
    navigate('/login');
  };

  // Active View Tab
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>('revenue');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-Time Socket.IO / Custom Event Listener for newly verified customers
  useEffect(() => {
    const handleNewCustomer = (e: any) => {
      const detail = e.detail;
      if (detail) {
        setToastMessage(`⚡ Real-Time Sync: New Verified Customer Registered — ${detail.name} (${detail.location || 'Tamil Nadu'})`);
        setTimeout(() => setToastMessage(null), 5500);
      }
    };
    window.addEventListener('customer:created', handleNewCustomer);
    return () => window.removeEventListener('customer:created', handleNewCustomer);
  }, []);

  // Filter States
  const [orderFilter, setOrderFilter] = useState('All');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [bookingTab, setBookingTab] = useState<'all' | 'new' | 'assigned' | 'completed'>('all');
  
  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Product CMS Multi-Tab Form State
  const [cmsTab, setCmsTab] = useState<'basic' | 'media' | 'highlights' | 'steps' | 'dosage' | 'specs' | 'faqs'>('basic');
  const [cmsForm, setCmsForm] = useState<any>({
    title: '',
    slug: '',
    categoryId: '',
    price: 500,
    discountPrice: 450,
    stock: 50,
    featured: false,
    description: '',
    images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'],
    features: ['Promotes faster and healthier growth', 'Improves flowering and crop yield'],
    packSizes: ['500 g', '1 kg', '5 kg'],
    benefits: ['Accelerates vegetative branching and root formation.', 'Increases tillering and fruit set.'],
    usageSteps: [
      { stepNumber: 1, title: 'Measure', description: 'Take the recommended amount as per dosage.' },
      { stepNumber: 2, title: 'Mix', description: 'Mix with water thoroughly until dissolved.' },
      { stepNumber: 3, title: 'Apply', description: 'Apply to soil or as foliar spray to plants.' },
    ],
    dosageTable: [
      { crop: 'Paddy & Cereals', foliarSpray: '2.5 ml / Litre', dripIrrigation: '500 ml / Acre' },
      { crop: 'Vegetables', foliarSpray: '2.0 ml / Litre', dripIrrigation: '500 ml / Acre' },
    ],
    ingredients: 'Cold-fermented seaweed extract, amino acids, and micronutrient chelates.',
    specifications: [
      { label: 'Product Type', value: 'Organic' },
      { label: 'Form', value: 'Granular' },
      { label: 'Suitable Crops', value: 'All Crops' },
      { label: 'Application Method', value: 'Soil Application / Foliar Spray' },
      { label: 'Shelf Life', value: '24 Months' },
      { label: 'Manufacturer', value: 'FarmerBench Agri Solutions' },
    ],
    faqs: [
      { question: 'Can I use this product in drip irrigation?', answer: 'Yes, 100% water soluble and does not clog emitters.' },
    ],
    beforeAfter: {
      beforeImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
      afterImage: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=800',
      beforeTag: 'Before',
      afterTag: 'After 30 Days',
      disclaimer: '*Results may vary depending on crop variety and soil conditions.',
    },
  });

  const openAddProductCMS = () => {
    setCmsTab('basic');
    setCmsForm({
      title: '',
      slug: '',
      categoryId: dbCategories[0]?.id || '',
      price: 500,
      discountPrice: 450,
      stock: 50,
      featured: false,
      description: 'High-potency bio-formulation crafted for superior crop yield, enhanced root growth, and soil health.',
      images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'],
      features: ['Promotes faster and healthier growth', 'Improves flowering and crop yield'],
      packSizes: ['500 g', '1 kg', '5 kg'],
      benefits: ['Accelerates vegetative branching and root formation.', 'Increases tillering and fruit set.'],
      usageSteps: [
        { stepNumber: 1, title: 'Measure', description: 'Take the recommended amount as per dosage.' },
        { stepNumber: 2, title: 'Mix', description: 'Mix with water thoroughly until dissolved.' },
        { stepNumber: 3, title: 'Apply', description: 'Apply to soil or as foliar spray to plants.' },
      ],
      dosageTable: [
        { crop: 'Paddy & Cereals', foliarSpray: '2.5 ml / Litre', dripIrrigation: '500 ml / Acre' },
        { crop: 'Vegetables', foliarSpray: '2.0 ml / Litre', dripIrrigation: '500 ml / Acre' },
      ],
      ingredients: 'Cold-fermented seaweed extract, amino acids, and micronutrient chelates.',
      specifications: [
        { label: 'Product Type', value: 'Organic' },
        { label: 'Form', value: 'Granular' },
        { label: 'Suitable Crops', value: 'All Crops' },
        { label: 'Application Method', value: 'Soil Application / Foliar Spray' },
        { label: 'Shelf Life', value: '24 Months' },
        { label: 'Manufacturer', value: 'FarmerBench Agri Solutions' },
      ],
      faqs: [
        { question: 'Can I use this product in drip irrigation?', answer: 'Yes, 100% water soluble and does not clog emitters.' },
      ],
      beforeAfter: {
        beforeImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
        afterImage: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=800',
        beforeTag: 'Before',
        afterTag: 'After 30 Days',
        disclaimer: '*Results may vary depending on crop variety and soil conditions.',
      },
    });
    setIsAddProductOpen(true);
  };

  const openEditProductCMS = (prod: any) => {
    setSelectedProduct(prod);
    setCmsTab('basic');
    const attrs = prod.attributes || {};
    setCmsForm({
      id: prod.id,
      title: prod.title || prod.name,
      slug: prod.slug,
      categoryId: prod.categoryId || dbCategories[0]?.id || '',
      price: prod.price,
      discountPrice: prod.discountPrice || prod.price,
      stock: prod.stock,
      featured: Boolean(prod.featured),
      description: prod.description || '',
      images: prod.images && prod.images.length > 0 ? prod.images : [prod.image],
      features: Array.isArray(attrs.features) && attrs.features.length > 0 ? attrs.features : ['Promotes faster and healthier growth'],
      packSizes: Array.isArray(attrs.packSizes) && attrs.packSizes.length > 0 ? attrs.packSizes : ['500 g', '1 kg', '5 kg'],
      benefits: Array.isArray(attrs.benefits) && attrs.benefits.length > 0 ? attrs.benefits : ['Accelerates vegetative branching and root formation.'],
      usageSteps: Array.isArray(attrs.usageSteps) && attrs.usageSteps.length > 0 ? attrs.usageSteps : [
        { stepNumber: 1, title: 'Measure', description: 'Take the recommended amount as per dosage.' },
        { stepNumber: 2, title: 'Mix', description: 'Mix with water thoroughly until dissolved.' },
        { stepNumber: 3, title: 'Apply', description: 'Apply to soil or as foliar spray to plants.' },
      ],
      dosageTable: Array.isArray(attrs.dosageTable) && attrs.dosageTable.length > 0 ? attrs.dosageTable : [
        { crop: 'Paddy & Cereals', foliarSpray: '2.5 ml / Litre', dripIrrigation: '500 ml / Acre' },
      ],
      ingredients: typeof attrs.ingredients === 'string' ? attrs.ingredients : 'Organic bio-stimulants and plant nutrients.',
      specifications: Array.isArray(attrs.specifications) && attrs.specifications.length > 0 ? attrs.specifications : [
        { label: 'Product Type', value: 'Organic' },
        { label: 'Form', value: 'Granular' },
      ],
      faqs: Array.isArray(attrs.faqs) && attrs.faqs.length > 0 ? attrs.faqs : [
        { question: 'Can I use this product in drip irrigation?', answer: 'Yes, 100% water soluble.' },
      ],
      beforeAfter: attrs.beforeAfter || {
        beforeImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
        afterImage: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=800',
        beforeTag: 'Before',
        afterTag: 'After 30 Days',
        disclaimer: '*Results may vary depending on crop variety and soil conditions.',
      },
    });
    setIsEditProductOpen(true);
  };

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerStatusFilter, setCustomerStatusFilter] = useState('All');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignBookingId, setAssignBookingId] = useState<string | null>(null);

  const [isCropReplyModalOpen, setIsCropReplyModalOpen] = useState(false);
  const [selectedCropItem, setSelectedCropItem] = useState<any>(null);
  const [cropPrescription, setCropPrescription] = useState('');

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // =========================================================================
  // DATA STATES
  // =========================================================================

  // 1. Orders
  const [orders, setOrders] = useState([
    {
      id: '#GL-10482',
      customer: 'Ramanathan',
      phone: '+91 98421 88321',
      email: 'ramanathan@farmmail.in',
      products: '3 items (Growth Booster, Humic Power, Neem Oil)',
      amount: '₹2,010',
      payment: 'Paid',
      paymentClass: 'paid',
      status: 'Processing',
      statusClass: 'processing',
      date: '28 Aug 2026, 10:30 AM',
      items: [
        { name: 'Growth Booster 500ml', qty: 1, price: '₹580' },
        { name: 'Humic Power Soil Conditioner 1kg', qty: 1, price: '₹650' },
        { name: 'Neem Oil 100% Cold Pressed 1L', qty: 1, price: '₹780' },
      ],
      shippingAddress: '42 South Main Road, Thanjavur, Tamil Nadu - 613001',
    },
    {
      id: '#GL-10481',
      customer: 'Meena Devi',
      phone: '+91 97892 44102',
      email: 'meenafarms@gmail.com',
      products: '1 item (Bio Power Promoter)',
      amount: '₹580',
      payment: 'COD',
      paymentClass: 'cod',
      status: 'Pending',
      statusClass: 'pending',
      date: '28 Aug 2026, 09:15 AM',
      items: [{ name: 'Bio Power Organic Growth Promoter 500ml', qty: 1, price: '₹580' }],
      shippingAddress: '15 Cauvery Nagar, Erode, Tamil Nadu - 638002',
    },
    {
      id: '#GL-10480',
      customer: 'Suresh Babu',
      phone: '+91 94432 11980',
      email: 'suresh.babu@cottonagri.com',
      products: '2 items (Trichoderma Fungicide, Seaweed Extract)',
      amount: '₹1,130',
      payment: 'Paid',
      paymentClass: 'paid',
      status: 'Shipped',
      statusClass: 'shipped',
      date: '27 Aug 2026, 04:20 PM',
      items: [
        { name: 'Trichoderma Bio-Fungicide 1kg', qty: 1, price: '₹480' },
        { name: 'Seaweed Extract Concentrated Liquid 500ml', qty: 1, price: '₹650' },
      ],
      shippingAddress: '88 Ring Road, Madurai, Tamil Nadu - 625001',
    },
    {
      id: '#GL-10479',
      customer: 'Kaliyaperumal',
      phone: '+91 94860 32115',
      email: 'kaliya.delta@yahoo.com',
      products: '4 items (Growth Booster, Neem Oil, Humic Power x2)',
      amount: '₹3,240',
      payment: 'Paid',
      paymentClass: 'paid',
      status: 'Delivered',
      statusClass: 'delivered',
      date: '27 Aug 2026, 02:10 PM',
      items: [
        { name: 'Growth Booster 500ml', qty: 1, price: '₹580' },
        { name: 'Neem Oil 100% Cold Pressed 1L', qty: 1, price: '₹780' },
        { name: 'Humic Power Soil Conditioner 1kg', qty: 2, price: '₹1,300' },
        { name: 'Trichoderma Bio-Fungicide 1kg', qty: 1, price: '₹580' },
      ],
      shippingAddress: 'Kumbakonam Road, Thiruvarur, Tamil Nadu - 610001',
    },
    {
      id: '#GL-10478',
      customer: 'Priya K',
      phone: '+91 98400 99221',
      email: 'priya.agrifarm@outlook.com',
      products: '2 items (Bio Power Promoter, Humic Power)',
      amount: '₹980',
      payment: 'Refunded',
      paymentClass: 'refunded',
      status: 'Cancelled',
      statusClass: 'cancelled',
      date: '26 Aug 2026, 11:00 AM',
      items: [{ name: 'Bio Power Organic Growth Promoter 500ml', qty: 1, price: '₹450' }],
      shippingAddress: 'Fairlands, Salem, Tamil Nadu - 636016',
    },
  ]);

  // 2. Database-Driven Products & Categories (PostgreSQL Single Source of Truth)
  const { data: productsResponse } = useProducts({ limit: 100 });
  const { data: dbCategories = [] } = useCategories();

  const { createProduct, updateProduct, deleteProduct } = useProductMutations();
  const { createCategory, deleteCategory } = useCategoryMutations();

  const products = (productsResponse?.data || []).map((p: any) => ({
    id: p.id,
    name: p.title,
    title: p.title,
    slug: p.slug,
    description: p.description,
    sku: p.slug ? `SKU-${p.slug.slice(0, 8).toUpperCase()}` : `SKU-${p.id.slice(0, 6).toUpperCase()}`,
    category: p.category?.name || (typeof p.category === 'string' ? p.category : 'General'),
    categoryId: p.categoryId || p.category?.id,
    price: p.price,
    discountPrice: p.discountPrice || p.price,
    stock: p.stock,
    sold: p.numReviews ? p.numReviews * 5 : 18,
    revenue: `₹${(((p.discountPrice || p.price) * (p.numReviews ? p.numReviews * 5 : 18)) / 1000).toFixed(1)}K`,
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    images: p.images || [],
    attributes: p.attributes || {},
    featured: p.featured,
    status: p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock' : 'In Stock',
  }));

  const categories = dbCategories.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c._count?.products ?? 0,
    description: c.description || 'Certified biological & organic agricultural inputs.',
    icon: c.name.toLowerCase().includes('pesticide') ? '🛡️' : c.name.toLowerCase().includes('fertilizer') ? '🌱' : c.name.toLowerCase().includes('seed') ? '🌾' : '🌿',
    imageUrl: c.imageUrl,
  }));

  // 4. Coupons
  const [coupons, setCoupons] = useState([
    {
      id: 'c1',
      code: 'HARVEST20',
      discount: '20% OFF',
      minOrder: '₹999',
      usage: '142 / 500',
      validUntil: '30 Sep 2026',
      status: 'Active',
    },
    {
      id: 'c2',
      code: 'ORGANIC10',
      discount: '10% OFF',
      minOrder: '₹499',
      usage: '388 / 1000',
      validUntil: '15 Oct 2026',
      status: 'Active',
    },
    {
      id: 'c3',
      code: 'MONSOON50',
      discount: 'Flat ₹50 OFF',
      minOrder: '₹600',
      usage: '89 / 200',
      validUntil: '31 Aug 2026',
      status: 'Active',
    },
    {
      id: 'c4',
      code: 'AGRIFLOW100',
      discount: 'Flat ₹100 OFF',
      minOrder: '₹1,500',
      usage: '210 / 250',
      validUntil: '20 Sep 2026',
      status: 'Active',
    },
  ]);

  // 5. Service Bookings
  const [serviceBookings, setServiceBookings] = useState([
    {
      id: 'SB-326',
      customer: 'Ramanathan',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      service: 'Crop Consultation',
      mode: 'Farm Visit',
      location: 'Thanjavur (Delta Region)',
      crop: 'Paddy / 15 Acres',
      time: 'Today 11:30 AM',
      assignedExpert: 'Unassigned',
      status: 'New',
      statusClass: 'pending',
      isNew: true,
    },
    {
      id: 'SB-325',
      customer: 'Meena Devi',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      service: 'Soil Testing & NPK Audit',
      mode: 'Phone Call',
      location: 'Erode',
      crop: 'Tomato & Vegetables',
      time: 'Today 2:00 PM',
      assignedExpert: 'Dr. V. Priya',
      status: 'Assigned',
      statusClass: 'shipped',
      isNew: false,
    },
    {
      id: 'SB-324',
      customer: 'Suresh Babu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      service: 'Pest Diagnosis & Bio Plan',
      mode: 'Video Call',
      location: 'Madurai',
      crop: 'Cotton & Pulses',
      time: 'Tomorrow 10:00 AM',
      assignedExpert: 'Dr. Murugan',
      status: 'Confirmed',
      statusClass: 'delivered',
      isNew: false,
    },
  ]);

  // 6. Crop Doctor
  const [cropDoctorRequests, setCropDoctorRequests] = useState([
    {
      id: 'CD-1',
      title: 'Tomato leaf spots & curling',
      author: 'Meena Devi',
      location: 'Erode',
      phone: '+91 97892 44102',
      time: '10 min ago',
      severity: 'High',
      severityClass: 'severity-high',
      image: burntLeavesImg,
      crop: 'Tomato (Coimbatore Selection)',
      notes: 'Brown concentric spots appearing on lower leaves after rain. Fast spreading.',
      prescription: 'Prescribe: Trichoderma 5g/L + Neem Oil 3ml/L foliar spray every 7 days.',
    },
    {
      id: 'CD-2',
      title: 'Paddy leaf yellowing & tip burn',
      author: 'Ramanathan',
      location: 'Thanjavur',
      phone: '+91 98421 88321',
      time: '32 min ago',
      severity: 'Medium',
      severityClass: 'severity-medium',
      image: wheatImg,
      crop: 'Paddy (CR 1009)',
      notes: 'Lower leaves turning yellow from margin towards center. Tillering slow.',
      prescription: 'Prescribe: Zinc EDTA 1g/L + Humic Power Soil Application 2kg/acre.',
    },
    {
      id: 'CD-3',
      title: 'Cotton bollworm & sucking pest attack',
      author: 'Suresh Babu',
      location: 'Madurai',
      phone: '+91 94432 11980',
      time: '1 hr ago',
      severity: 'High',
      severityClass: 'severity-high',
      image: cropMonitoringImg,
      crop: 'Bt Cotton / Hybrid',
      notes: 'Boll punctures visible. Small green caterpillars noticed.',
      prescription: 'Prescribe: Bio Pesticide Bacillus formulation + Neem extract 5ml/L spray.',
    },
  ]);

  // 7. Experts
  const [experts, setExperts] = useState([
    {
      id: 'exp-1',
      name: 'Dr. V. Priya M.Sc., Ph.D.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      spec: 'Soil Biology & Crop Nutrition',
      territory: 'Thanjavur & Delta District',
      rating: '4.9 ★',
      consultations: 148,
      status: 'Available',
      phone: '+91 98412 77201',
    },
    {
      id: 'exp-2',
      name: 'Dr. S. Murugan M.Sc. Agri',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      spec: 'Pest Diagnosis & Bio-Control',
      territory: 'Madurai & South Region',
      rating: '4.8 ★',
      consultations: 192,
      status: 'On Field',
      phone: '+91 94420 55104',
    },
    {
      id: 'exp-3',
      name: 'Dr. K. Anitha M.Sc.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      spec: 'Organic Horticulture & Drone Spray',
      territory: 'Erode & Western Ghats',
      rating: '5.0 ★',
      consultations: 86,
      status: 'Available',
      phone: '+91 97880 11923',
    },
  ]);

  // 8. Reviews
  const [reviews, setReviews] = useState([
    {
      id: 'REV-1',
      reviewer: 'Ramanathan',
      location: 'Thanjavur, Tamil Nadu',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      product: 'Growth Booster for All Crops',
      productImg: growthBoosterImg,
      crop: 'Paddy',
      duration: 'Used for: 30 days',
      photos: [farmingPracticesImg, vineyardImg],
      review:
        'Excellent results on my paddy crop. Plants look greener and healthier. Tillering improved a lot.',
      status: 'Pending',
    },
    {
      id: 'REV-2',
      reviewer: 'Meena Devi',
      location: 'Erode, Tamil Nadu',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      product: 'Neem Oil 100% Cold Pressed',
      productImg: neemOilImg,
      crop: 'Tomato',
      duration: 'Used for: 28 days',
      photos: [cropMonitoringImg, smartIrrigationImg],
      review:
        'Great for vegetable crops. Applied on my tomato crop through soil drenching. Flowers and fruits increased noticeably.',
      status: 'Pending',
    },
  ]);

  // 9. Blogs
  const [blogs, setBlogs] = useState([
    {
      id: 'blog-1',
      title: 'Essential Organic Practices for High-Yield Paddy Farming',
      slug: 'organic-paddy-practices',
      category: 'Farming Techniques',
      author: 'Dr. V. Priya',
      date: 'Aug 24, 2026',
      views: '1,420 views',
      image: farmingPracticesImg,
      status: 'Published',
    },
    {
      id: 'blog-2',
      title: 'Natural Pest Shield: How Cold Pressed Neem Oil Protects Crops',
      slug: 'neem-oil-pest-protection',
      category: 'Pest Control',
      author: 'Dr. S. Murugan',
      date: 'Aug 18, 2026',
      views: '980 views',
      image: cropMonitoringImg,
      status: 'Published',
    },
    {
      id: 'blog-3',
      title: 'Revitalizing Soil Health with Humic Acid & Bio Fertilizers',
      slug: 'humic-acid-soil-health',
      category: 'Soil Nutrition',
      author: 'FarmerBench Agronomists',
      date: 'Aug 10, 2026',
      views: '2,150 views',
      image: smartIrrigationImg,
      status: 'Published',
    },
  ]);

  // 11. Banners
  const [banners] = useState([
    {
      id: 'ban-1',
      title: 'FarmerBench Pure Organic Bio Products',
      placement: 'Homepage Hero Carousel',
      status: 'Active',
      link: '/products',
      cta: 'Shop Now',
    },
    {
      id: 'ban-2',
      title: 'Expert On-Field Farm Inspection & Soil Audits',
      placement: 'Services Page Banner',
      status: 'Active',
      link: '/services',
      cta: 'Book Consultation',
    },
    {
      id: 'ban-3',
      title: 'Monsoon Crop Protection — Flat 20% OFF',
      placement: 'Storefront Promo Bar',
      status: 'Active',
      link: '/products?category=bio-pesticides',
      cta: 'Claim Discount',
    },
  ]);

  // 12. Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'FarmerBench Agricultural Commerce & Services',
    supportEmail: 'support@farmerbench.agri',
    supportPhone: '+91 98400 12345',
    address: 'FarmerBench Agro Towers, Delta Zone, Thanjavur, Tamil Nadu',
    currency: 'INR (₹)',
    taxRate: '5%',
    freeShippingThreshold: '₹999',
    autoSmsAlerts: true,
  });

  // Access Control Check
  const storedUser = (() => {
    try {
      const d = localStorage.getItem('formerbench_auth_user');
      return d ? JSON.parse(d) : null;
    } catch {
      return null;
    }
  })();

  const isDemoAdmin = localStorage.getItem('farmerbench_demo_admin') === 'true';
  const isAuthorized =
    (isAuthenticated && (isAdmin || user?.role === 'ADMIN')) ||
    (storedUser && (storedUser.role === 'ADMIN' || storedUser.email?.includes('admin'))) ||
    isDemoAdmin;

  useEffect(() => {
    if (!isLoading && !isAuthorized && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isLoading, isAuthorized, isAuthenticated, navigate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Status Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: string, newClass: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, statusClass: newClass } : o))
    );
    showToast(`Order ${orderId} marked as ${newStatus}`);
  };

  const handleUpdateStock = async (prodId: string, delta: number) => {
    const current = products.find((p) => p.id === prodId);
    if (!current) return;
    const newStock = Math.max(0, current.stock + delta);
    try {
      await updateProduct({ id: prodId, data: { stock: newStock } });
      showToast(`Stock updated to ${newStock} units`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock');
    }
  };

  const handleApproveReview = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
    showToast('Review approved and published to store!');
  };

  const handleRejectReview = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)));
    showToast('Review marked as rejected.');
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from PostgreSQL?`)) {
      return;
    }
    try {
      await deleteProduct(id);
      showToast(`Product "${name}" deleted from database.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product');
    }
  };

  // Auth loading state (Only shows if no local credentials exist)
  if (isLoading && !isAuthorized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F4F7F4' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Sparkles size={32} style={{ color: '#0F4726' }} />
          <p style={{ fontWeight: 600, color: '#475569' }}>Authenticating Administrator...</p>
        </div>
      </div>
    );
  }

  // Access denied screen
  if (!isAuthorized) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#082816',
          color: '#FFFFFF',
          padding: '2rem',
          fontFamily: 'var(--font-sans, "Outfit", sans-serif)',
        }}
      >
        <div
          style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: '#0F3820',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <ShieldAlert size={34} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Admin Access Restricted
          </h2>
          <p style={{ color: '#B7D9C3', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            This FarmerBench Admin Portal is restricted to authorized administrators and managers. Non-admin users and customers use the standard dashboard view.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: '#15803D',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.85rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Go to Default Farmer Dashboard
            </button>

            <button
              onClick={() => {
                localStorage.setItem('farmerbench_demo_admin', 'true');
                window.location.reload();
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#88DF9E',
                border: '1.5px dashed #88DF9E',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              <Sparkles size={16} /> Sign In as Admin (Arun Admin)
            </button>

            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: 'transparent',
                color: '#94A3B8',
                border: 'none',
                fontSize: '0.825rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              Switch Account / Login with other credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Lists
  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'All' && o.status !== orderFilter) return false;
    if (searchQuery && !o.customer.toLowerCase().includes(searchQuery.toLowerCase()) && !o.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.sku.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredCustomers = customers.filter((c) => {
    if (customerStatusFilter !== 'All' && c.status !== customerStatusFilter) return false;
    const q = (customerSearchQuery || searchQuery).trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.crops && c.crops.toLowerCase().includes(q))
    );
  });

  return (
    <div className="admin-dashboard-wrapper">
      {/* ====================================================================
          1. LEFT SIDEBAR (Dark Forest Green)
          ==================================================================== */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <img
            src={farmerLogo}
            alt="FarmerBench Logo"
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'contain', backgroundColor: '#FFFFFF', padding: '2px' }}
          />
          <div className="admin-logo-text-wrap">
            <span className="admin-logo-title">FarmerBench</span>
            <span className="admin-logo-subtitle">Admin Panel</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="admin-sidebar-nav">
          {/* Main Dashboard Link */}
          <button
            className={`admin-nav-item ${activeNav === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveNav('Dashboard')}
          >
            <div className="admin-nav-item-left">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
          </button>

          {/* Section: COMMERCE */}
          <div className="admin-nav-group">
            <span className="admin-nav-group-title">Commerce</span>
            <button
              className={`admin-nav-item ${activeNav === 'Orders' ? 'active' : ''}`}
              onClick={() => setActiveNav('Orders')}
            >
              <div className="admin-nav-item-left">
                <ShoppingCart size={17} />
                <span>Orders</span>
              </div>
              <span className="admin-nav-badge badge-green">{orders.length}</span>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Products' ? 'active' : ''}`}
              onClick={() => setActiveNav('Products')}
            >
              <div className="admin-nav-item-left">
                <Package size={17} />
                <span>Products</span>
              </div>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Categories' ? 'active' : ''}`}
              onClick={() => setActiveNav('Categories')}
            >
              <div className="admin-nav-item-left">
                <Layers size={17} />
                <span>Categories</span>
              </div>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Inventory' ? 'active' : ''}`}
              onClick={() => setActiveNav('Inventory')}
            >
              <div className="admin-nav-item-left">
                <Boxes size={17} />
                <span>Inventory</span>
              </div>
              <span className="admin-nav-badge badge-orange">
                {products.filter((p) => p.stock <= 10).length}
              </span>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Customers' ? 'active' : ''}`}
              onClick={() => setActiveNav('Customers')}
            >
              <div className="admin-nav-item-left">
                <Users size={17} />
                <span>Customers</span>
              </div>
              <span className="admin-nav-badge badge-green">{customers.length}</span>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Coupons' ? 'active' : ''}`}
              onClick={() => setActiveNav('Coupons')}
            >
              <div className="admin-nav-item-left">
                <TicketPercent size={17} />
                <span>Coupons</span>
              </div>
            </button>
          </div>

          {/* Section: SERVICES */}
          <div className="admin-nav-group">
            <span className="admin-nav-group-title">Services</span>
            <button
              className={`admin-nav-item ${activeNav === 'Service Bookings' ? 'active' : ''}`}
              onClick={() => setActiveNav('Service Bookings')}
            >
              <div className="admin-nav-item-left">
                <CalendarCheck size={17} />
                <span>Service Bookings</span>
              </div>
              <span className="admin-nav-badge badge-green">{serviceBookings.length}</span>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Crop Doctor' ? 'active' : ''}`}
              onClick={() => setActiveNav('Crop Doctor')}
            >
              <div className="admin-nav-item-left">
                <Stethoscope size={17} />
                <span>Crop Doctor</span>
              </div>
              <span className="admin-nav-badge badge-green">{cropDoctorRequests.length}</span>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Experts' ? 'active' : ''}`}
              onClick={() => setActiveNav('Experts')}
            >
              <div className="admin-nav-item-left">
                <GraduationCap size={17} />
                <span>Experts</span>
              </div>
            </button>
          </div>

          {/* Section: CONTENT */}
          <div className="admin-nav-group">
            <span className="admin-nav-group-title">Content</span>
            <button
              className={`admin-nav-item ${activeNav === 'Reviews & Feedback' ? 'active' : ''}`}
              onClick={() => setActiveNav('Reviews & Feedback')}
            >
              <div className="admin-nav-item-left">
                <MessageSquareQuote size={17} />
                <span>Reviews & Feedback</span>
              </div>
              <span className="admin-nav-badge badge-green">
                {reviews.filter((r) => r.status === 'Pending').length}
              </span>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Blog' ? 'active' : ''}`}
              onClick={() => setActiveNav('Blog')}
            >
              <div className="admin-nav-item-left">
                <BookOpen size={17} />
                <span>Blog</span>
              </div>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Banners' ? 'active' : ''}`}
              onClick={() => setActiveNav('Banners')}
            >
              <div className="admin-nav-item-left">
                <ImageIcon size={17} />
                <span>Banners</span>
              </div>
            </button>
          </div>

          {/* Section: SYSTEM */}
          <div className="admin-nav-group">
            <span className="admin-nav-group-title">System</span>
            <button
              className={`admin-nav-item ${activeNav === 'Reports' ? 'active' : ''}`}
              onClick={() => setActiveNav('Reports')}
            >
              <div className="admin-nav-item-left">
                <BarChart3 size={17} />
                <span>Reports</span>
              </div>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Users & Roles' ? 'active' : ''}`}
              onClick={() => setActiveNav('Users & Roles')}
            >
              <div className="admin-nav-item-left">
                <UserCog size={17} />
                <span>Users & Roles</span>
              </div>
            </button>
            <button
              className={`admin-nav-item ${activeNav === 'Settings' ? 'active' : ''}`}
              onClick={() => setActiveNav('Settings')}
            >
              <div className="admin-nav-item-left">
                <Settings size={17} />
                <span>Settings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Footer User Widget */}
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-user-left">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Arun Admin"
              className="admin-user-avatar"
            />
            <div>
              <div className="admin-user-info-name">{user?.name || 'Arun Admin'}</div>
              <div className="admin-user-info-role">Super Admin</div>
            </div>
          </div>
          <button
            className="admin-sidebar-logout-btn"
            title="Sign Out of Admin Panel"
            onClick={handleAdminLogout}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ====================================================================
          2. MAIN CONTENT CONTAINER
          ==================================================================== */}
      <div className="admin-main-container">
        {/* Top Header Bar */}
        <header className="admin-top-header">
          {/* Breadcrumb */}
          <div className="admin-breadcrumb">
            <span className="admin-breadcrumb-root" onClick={() => setActiveNav('Dashboard')}>
              Admin
            </span>
            <span className="admin-breadcrumb-sep">/</span>
            <span className="admin-breadcrumb-current">{activeNav}</span>
          </div>

          {/* Search Box */}
          <div className="admin-search-box">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder={`Search in ${activeNav.toLowerCase()}...`}
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right Header Actions */}
          <div className="admin-header-actions">
            <button className="admin-date-btn">
              <Calendar size={15} style={{ color: '#15803D' }} />
              <span>28 Aug 2026</span>
              <ChevronDown size={14} style={{ color: '#94A3B8' }} />
            </button>

            <button
              className="admin-icon-btn"
              title="Help & Support"
              onClick={() => showToast('Help documentation available at docs.farmerbench.agri')}
            >
              <HelpCircle size={18} />
            </button>

            <button
              className="admin-icon-btn"
              title="Notifications"
              onClick={() => showToast('5 new pending alerts awaiting action')}
            >
              <Bell size={18} />
              <span className="admin-notif-dot">5</span>
            </button>

            <div className="admin-header-profile" onClick={() => setActiveNav('Settings')}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Arun Admin"
                className="admin-header-profile-img"
              />
              <span className="admin-header-profile-name">{user?.name || 'Arun Admin'}</span>
              <ChevronDown size={14} style={{ color: '#94A3B8' }} />
            </div>

            <Link to="/" className="admin-view-store-btn" target="_blank" rel="noopener noreferrer">
              <span>View Store</span>
              <ExternalLink size={14} />
            </Link>

            <button
              className="admin-header-logout-btn"
              title="Sign Out of Admin Panel"
              onClick={handleAdminLogout}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Live Toast alert banner */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '75px',
              right: '25px',
              backgroundColor: '#0F4726',
              color: '#FFFFFF',
              padding: '0.85rem 1.25rem',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#88DF9E' }} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="admin-content-body">
          {/* ================================================================
              VIEW 1: EXECUTIVE DASHBOARD
              ================================================================ */}
          {activeNav === 'Dashboard' && (
            <>
              {/* Welcome & Quick Action Strip */}
              <div className="admin-welcome-strip">
                <div>
                  <h1 className="admin-welcome-title">Good morning, {user?.name?.split(' ')[0] || 'Arun'}</h1>
                  <p className="admin-welcome-sub">Here's what's happening with FarmerBench today.</p>
                </div>
                <div className="admin-welcome-controls">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="admin-filter-select-btn"
                  >
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>This Month</option>
                    <option>This Year</option>
                  </select>

                  <button onClick={openAddProductCMS} className="admin-primary-btn">
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </div>

              {/* 5 KPI CARDS */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card" onClick={() => setActiveNav('Reports')} style={{ cursor: 'pointer' }}>
                  <div className="admin-kpi-top">
                    <div className="admin-kpi-icon-wrap bg-rev">
                      <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹</span>
                    </div>
                    <div className="admin-kpi-meta">
                      <span className="admin-kpi-label">Total Revenue</span>
                      <span className="admin-kpi-value">₹8,42,560</span>
                    </div>
                  </div>
                  <div className="admin-kpi-bottom">
                    <span className="admin-kpi-trend"><TrendingUp size={13} /> 12.5%</span>
                    <svg className="admin-kpi-sparkline" viewBox="0 0 60 20" fill="none">
                      <path d="M 2 16 Q 15 4, 28 14 T 58 6" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <div className="admin-kpi-card" onClick={() => setActiveNav('Orders')} style={{ cursor: 'pointer' }}>
                  <div className="admin-kpi-top">
                    <div className="admin-kpi-icon-wrap bg-ord"><ShoppingCart size={20} /></div>
                    <div className="admin-kpi-meta">
                      <span className="admin-kpi-label">Total Orders</span>
                      <span className="admin-kpi-value">1,248</span>
                    </div>
                  </div>
                  <div className="admin-kpi-bottom">
                    <span className="admin-kpi-trend"><TrendingUp size={13} /> 8.2%</span>
                    <svg className="admin-kpi-sparkline" viewBox="0 0 60 20" fill="none">
                      <path d="M 2 15 Q 18 18, 30 8 T 58 7" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <div className="admin-kpi-card" onClick={() => setActiveNav('Products')} style={{ cursor: 'pointer' }}>
                  <div className="admin-kpi-top">
                    <div className="admin-kpi-icon-wrap bg-prd"><Package size={20} /></div>
                    <div className="admin-kpi-meta">
                      <span className="admin-kpi-label">Products</span>
                      <span className="admin-kpi-value">{products.length}</span>
                    </div>
                  </div>
                  <div className="admin-kpi-bottom">
                    <span className="admin-kpi-trend"><TrendingUp size={13} /> 4 new</span>
                    <svg className="admin-kpi-sparkline" viewBox="0 0 60 20" fill="none">
                      <path d="M 2 17 Q 15 15, 32 10 T 58 5" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <div className="admin-kpi-card" onClick={() => setActiveNav('Customers')} style={{ cursor: 'pointer' }}>
                  <div className="admin-kpi-top">
                    <div className="admin-kpi-icon-wrap bg-cst"><Users size={20} /></div>
                    <div className="admin-kpi-meta">
                      <span className="admin-kpi-label">Customers</span>
                      <span className="admin-kpi-value">{customers.length}</span>
                    </div>
                  </div>
                  <div className="admin-kpi-bottom">
                    <span className="admin-kpi-trend"><TrendingUp size={13} /> {customers.length} verified</span>
                    <svg className="admin-kpi-sparkline" viewBox="0 0 60 20" fill="none">
                      <path d="M 2 18 Q 20 12, 38 11 T 58 4" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <div className="admin-kpi-card" onClick={() => setActiveNav('Service Bookings')} style={{ cursor: 'pointer' }}>
                  <div className="admin-kpi-top">
                    <div className="admin-kpi-icon-wrap bg-srv"><CalendarCheck size={20} /></div>
                    <div className="admin-kpi-meta">
                      <span className="admin-kpi-label">Service Bookings</span>
                      <span className="admin-kpi-value">326</span>
                    </div>
                  </div>
                  <div className="admin-kpi-bottom">
                    <span className="admin-kpi-trend"><TrendingUp size={13} /> 14.3%</span>
                    <svg className="admin-kpi-sparkline" viewBox="0 0 60 20" fill="none">
                      <path d="M 2 16 Q 16 6, 32 12 T 58 4" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: REVENUE OVERVIEW, ORDER STATUS & ALERT CARDS */}
              <div className="admin-mid-grid">
                {/* Revenue Overview */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3 className="admin-card-title">Revenue Overview</h3>
                      <div className="admin-chart-legend-wrap" style={{ marginTop: '0.4rem' }}>
                        <div className="admin-chart-legend-item">
                          <span className="admin-chart-legend-dot" style={{ backgroundColor: '#15803D' }} />
                          <span>Revenue <strong>₹8.42L</strong></span>
                        </div>
                        <div className="admin-chart-legend-item">
                          <span className="admin-chart-legend-dot" style={{ backgroundColor: '#94A3B8' }} />
                          <span>Orders <strong>1,248</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="admin-chart-toggle-wrap">
                      <button
                        className={`admin-chart-toggle-btn ${chartMetric === 'revenue' ? 'active' : ''}`}
                        onClick={() => setChartMetric('revenue')}
                      >
                        Revenue
                      </button>
                      <button
                        className={`admin-chart-toggle-btn ${chartMetric === 'orders' ? 'active' : ''}`}
                        onClick={() => setChartMetric('orders')}
                      >
                        Orders
                      </button>
                    </div>
                  </div>

                  <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <svg className="admin-area-chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="revenueGradMain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#15803D" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="40" y1="20" x2="680" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="60" x2="680" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="100" x2="680" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="140" x2="680" y2="140" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="175" x2="680" y2="175" stroke="#E2E8F0" strokeWidth="1" />

                      <path
                        d="M 50 170 C 90 160, 110 65, 140 70 C 170 75, 190 145, 230 140 C 270 135, 300 65, 340 70 C 370 75, 390 140, 430 135 C 470 130, 500 55, 540 60 C 580 65, 600 135, 630 120 C 650 110, 665 85, 675 75 L 675 175 L 50 175 Z"
                        fill="url(#revenueGradMain)"
                      />
                      <path
                        d="M 50 170 C 90 160, 110 65, 140 70 C 170 75, 190 145, 230 140 C 270 135, 300 65, 340 70 C 370 75, 390 140, 430 135 C 470 130, 500 55, 540 60 C 580 65, 600 135, 630 120 C 650 110, 665 85, 675 75"
                        fill="none"
                        stroke="#15803D"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="140" cy="70" r="3.5" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="340" cy="70" r="3.5" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="540" cy="60" r="3.5" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="675" cy="75" r="3.5" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" />
                    </svg>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 2rem 0 2.5rem', fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
                      <span>Aug 1</span>
                      <span>Aug 5</span>
                      <span>Aug 9</span>
                      <span>Aug 13</span>
                      <span>Aug 17</span>
                      <span>Aug 21</span>
                      <span>Aug 25</span>
                      <span>Aug 28</span>
                    </div>
                  </div>
                </div>

                {/* Donut Chart */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">Order Status</h3>
                  </div>

                  <div className="admin-donut-container">
                    <div className="admin-donut-chart-box">
                      <svg width="130" height="130" viewBox="0 0 42 42">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="5.5" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="5.5" strokeDasharray="55.6 44.4" strokeDashoffset="25" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3B82F6" strokeWidth="5.5" strokeDasharray="23.7 76.3" strokeDashoffset="-30.6" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="5.5" strokeDasharray="11.4 88.6" strokeDashoffset="-54.3" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#EA580C" strokeWidth="5.5" strokeDasharray="6.9 93.1" strokeDashoffset="-65.7" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#EF4444" strokeWidth="5.5" strokeDasharray="2.4 97.6" strokeDashoffset="-72.6" />
                      </svg>
                      <div className="admin-donut-center-text">
                        <span className="admin-donut-count">{orders.length}</span>
                        <span className="admin-donut-sub">Active</span>
                      </div>
                    </div>

                    <div className="admin-donut-legend-list">
                      <div className="admin-donut-legend-row">
                        <div className="admin-donut-legend-left">
                          <span className="admin-chart-legend-dot" style={{ backgroundColor: '#EA580C' }} />
                          <span>Pending</span>
                        </div>
                        <span className="admin-donut-legend-val">
                          {orders.filter((o) => o.status === 'Pending').length}
                        </span>
                      </div>
                      <div className="admin-donut-legend-row">
                        <div className="admin-donut-legend-left">
                          <span className="admin-chart-legend-dot" style={{ backgroundColor: '#F59E0B' }} />
                          <span>Processing</span>
                        </div>
                        <span className="admin-donut-legend-val">
                          {orders.filter((o) => o.status === 'Processing').length}
                        </span>
                      </div>
                      <div className="admin-donut-legend-row">
                        <div className="admin-donut-legend-left">
                          <span className="admin-chart-legend-dot" style={{ backgroundColor: '#3B82F6' }} />
                          <span>Shipped</span>
                        </div>
                        <span className="admin-donut-legend-val">
                          {orders.filter((o) => o.status === 'Shipped').length}
                        </span>
                      </div>
                      <div className="admin-donut-legend-row">
                        <div className="admin-donut-legend-left">
                          <span className="admin-chart-legend-dot" style={{ backgroundColor: '#10B981' }} />
                          <span>Delivered</span>
                        </div>
                        <span className="admin-donut-legend-val">
                          {orders.filter((o) => o.status === 'Delivered').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Alerts Column */}
                <div className="admin-alert-col">
                  <div className="admin-alert-card-item">
                    <div className="admin-alert-icon-box orange"><Boxes size={20} /></div>
                    <div className="admin-alert-text-box">
                      <span className="admin-alert-title">{products.filter((p) => p.stock <= 10).length} Low Stock Products</span>
                      <button onClick={() => setActiveNav('Inventory')} className="admin-alert-action-link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}>
                        Review Inventory →
                      </button>
                    </div>
                  </div>

                  <div className="admin-alert-card-item">
                    <div className="admin-alert-icon-box red"><Star size={20} /></div>
                    <div className="admin-alert-text-box">
                      <span className="admin-alert-title">{reviews.filter((r) => r.status === 'Pending').length} Reviews Awaiting Approval</span>
                      <button onClick={() => setActiveNav('Reviews & Feedback')} className="admin-alert-action-link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}>
                        Moderate Reviews →
                      </button>
                    </div>
                  </div>

                  <div className="admin-alert-card-item">
                    <div className="admin-alert-icon-box blue"><Users size={20} /></div>
                    <div className="admin-alert-text-box">
                      <span className="admin-alert-title">{serviceBookings.filter((b) => b.isNew).length} New Service Requests</span>
                      <button onClick={() => setActiveNav('Service Bookings')} className="admin-alert-action-link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}>
                        Assign Experts →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT ORDERS & TOP PRODUCTS ROW */}
              <div className="admin-two-col-grid">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">Recent Orders</h3>
                    <button onClick={() => setActiveNav('Orders')} className="admin-card-link" style={{ background: 'none', border: 'none' }}>
                      View All Orders →
                    </button>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Products</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th style={{ textAlign: 'center' }}>Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id}>
                            <td>
                              <span
                                className="admin-order-id-link"
                                onClick={() => { setSelectedOrder(ord); setIsInvoiceModalOpen(true); }}
                              >
                                {ord.id}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{ord.customer}</td>
                            <td style={{ color: '#64748B' }}>{ord.products}</td>
                            <td style={{ fontWeight: 700 }}>{ord.amount}</td>
                            <td>
                              <span className={`admin-status-badge ${ord.statusClass}`}>{ord.status}</span>
                            </td>
                            <td style={{ color: '#64748B' }}>{ord.date.split(',')[0]}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                className="admin-mini-btn"
                                onClick={() => { setSelectedOrder(ord); setIsInvoiceModalOpen(true); }}
                              >
                                <Eye size={13} /> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">Top Selling Products</h3>
                    <button onClick={() => setActiveNav('Products')} className="admin-card-link" style={{ background: 'none', border: 'none' }}>
                      View Catalog →
                    </button>
                  </div>
                  <div className="admin-top-product-list">
                    {products.slice(0, 4).map((prod) => (
                      <div key={prod.id} className="admin-top-product-row">
                        <div className="admin-top-product-left">
                          <img src={prod.image} alt={prod.name} className="admin-top-product-thumb" />
                          <div style={{ minWidth: 0 }}>
                            <div className="admin-top-product-name">{prod.name}</div>
                            <div className="admin-top-product-sold">{prod.sold} sold</div>
                          </div>
                        </div>
                        <div className="admin-top-product-revenue">{prod.revenue}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS BAR */}
              <div className="admin-quick-actions-bar">
                <span className="admin-quick-actions-title">Quick Actions</span>
                <div className="admin-quick-actions-btns">
                  <button onClick={openAddProductCMS} className="admin-quick-btn">
                    <Plus size={15} /> Add Product
                  </button>
                  <button onClick={() => setIsCouponModalOpen(true)} className="admin-quick-btn">
                    <TicketPercent size={15} /> Create Coupon
                  </button>
                  <button onClick={() => setIsBlogModalOpen(true)} className="admin-quick-btn">
                    <FileText size={15} /> Add Blog Post
                  </button>
                  <button onClick={() => setIsExpertModalOpen(true)} className="admin-quick-btn">
                    <UserPlus size={15} /> Add Expert
                  </button>
                  <button onClick={() => showToast('Sales & inventory exported to CSV')} className="admin-quick-btn">
                    <Download size={15} /> Export Report
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ================================================================
              VIEW 2: ORDERS MANAGEMENT
              ================================================================ */}
          {activeNav === 'Orders' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Orders Management</h2>
                  <p className="admin-welcome-sub">Manage, track shipments, and update customer order statuses.</p>
                </div>
                <button onClick={() => showToast('Orders refreshed from server')} className="admin-quick-btn">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="admin-filter-bar">
                <div className="admin-filter-tabs">
                  {['All', 'Processing', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      className={`admin-filter-tab-btn ${orderFilter === st ? 'active' : ''}`}
                      onClick={() => setOrderFilter(st)}
                    >
                      {st} ({st === 'All' ? orders.length : orders.filter((o) => o.status === st).length})
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                  Showing {filteredOrders.length} orders
                </div>
              </div>

              {/* Orders Table */}
              <div className="admin-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Products Details</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status & Change</th>
                      <th>Order Date</th>
                      <th style={{ textAlign: 'center' }}>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td>
                          <span
                            className="admin-order-id-link"
                            onClick={() => { setSelectedOrder(ord); setIsInvoiceModalOpen(true); }}
                          >
                            {ord.id}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{ord.customer}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{ord.email}</div>
                        </td>
                        <td style={{ color: '#475569', fontSize: '0.8rem' }}>{ord.phone}</td>
                        <td style={{ color: '#334155', maxWidth: '240px' }}>{ord.products}</td>
                        <td style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F291B' }}>{ord.amount}</td>
                        <td>
                          <span className={`admin-status-badge ${ord.paymentClass}`}>{ord.payment}</span>
                        </td>
                        <td>
                          <select
                            value={ord.status}
                            onChange={(e) => {
                              const val = e.target.value;
                              const cls = val.toLowerCase();
                              handleUpdateOrderStatus(ord.id, val, cls);
                            }}
                            className="admin-form-select"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ color: '#64748B', fontSize: '0.78rem' }}>{ord.date}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="admin-mini-btn"
                            onClick={() => { setSelectedOrder(ord); setIsInvoiceModalOpen(true); }}
                          >
                            <Eye size={13} /> View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 3: PRODUCTS MANAGEMENT
              ================================================================ */}
          {activeNav === 'Products' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Product Catalog</h2>
                  <p className="admin-welcome-sub">Manage product stock, pricing, bio-certifications, and catalog visibility.</p>
                </div>
                <button onClick={openAddProductCMS} className="admin-primary-btn">
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              {/* Filter Bar */}
              <div className="admin-filter-bar">
                <div className="admin-filter-tabs">
                  {['All', 'Fertilizers', 'Bio Stimulants', 'Bio Pesticides', 'Crop Nutrition'].map((cat) => (
                    <button
                      key={cat}
                      className={`admin-filter-tab-btn ${productCategoryFilter === cat ? 'active' : ''}`}
                      onClick={() => setProductCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                  {filteredProducts.length} Products Active
                </span>
              </div>

              {/* Products Table */}
              <div className="admin-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Stock Units</th>
                      <th>Units Sold</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={prod.image} alt={prod.name} className="admin-prod-thumb-cell" />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F291B' }}>{prod.name}</div>
                              {prod.featured && (
                                <span style={{ fontSize: '0.68rem', backgroundColor: '#FEF3C7', color: '#B45309', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                                  ★ Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#64748B', fontWeight: 600 }}>{prod.sku}</td>
                        <td>
                          <span style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {prod.category}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800 }}>₹{prod.price}</td>
                        <td style={{ color: '#16A34A', fontWeight: 700 }}>₹{prod.discountPrice}</td>
                        <td>
                          <div className="admin-stock-counter">
                            <button className="admin-stock-count-btn" onClick={() => handleUpdateStock(prod.id, -1)}>-</button>
                            <span className="admin-stock-val">{prod.stock}</span>
                            <button className="admin-stock-count-btn" onClick={() => handleUpdateStock(prod.id, 1)}>+</button>
                          </div>
                        </td>
                        <td style={{ color: '#475569', fontWeight: 600 }}>{prod.sold} sold</td>
                        <td>
                          <span
                            className={`admin-status-badge ${
                              prod.stock === 0 ? 'cancelled' : prod.stock <= 10 ? 'pending' : 'paid'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="admin-action-btn-group" style={{ justifyContent: 'center' }}>
                            <button
                              className="admin-mini-btn"
                              onClick={() => openEditProductCMS(prod)}
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                            <button
                              className="admin-mini-btn btn-danger"
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 4: CATEGORIES MANAGEMENT
              ================================================================ */}
          {activeNav === 'Categories' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Category Taxonomy</h2>
                  <p className="admin-welcome-sub">Organize your store into agricultural inputs and crop protection segments.</p>
                </div>
                <button onClick={() => setIsAddCategoryOpen(true)} className="admin-primary-btn">
                  <Plus size={16} /> Add Category
                </button>
              </div>

              <div className="admin-category-grid">
                {categories.map((cat) => (
                  <div key={cat.id} className="admin-cat-card">
                    <div>
                      <div className="admin-cat-icon-circle" style={{ fontSize: '1.5rem' }}>
                        {cat.icon}
                      </div>
                      <div className="admin-cat-name">{cat.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700, marginBottom: '0.5rem' }}>
                        /{cat.slug}
                      </div>
                      <p className="admin-cat-desc">{cat.description}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                        {cat.count} Products
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          className="admin-mini-btn"
                          onClick={() => {
                            setProductCategoryFilter(cat.name);
                            setActiveNav('Products');
                          }}
                        >
                          View Items →
                        </button>
                        <button
                          className="admin-action-btn delete"
                          title="Delete Category"
                          style={{ padding: '0.35rem 0.5rem' }}
                          onClick={async () => {
                            if (!window.confirm(`Are you sure you want to delete category "${cat.name}" from PostgreSQL?`)) return;
                            try {
                              await deleteCategory(cat.id);
                              showToast(`Category "${cat.name}" deleted.`);
                            } catch (err: any) {
                              showToast(err.message || 'Failed to delete category');
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 5: INVENTORY MANAGEMENT
              ================================================================ */}
          {activeNav === 'Inventory' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Warehouse & Stock Inventory</h2>
                  <p className="admin-welcome-sub">Live stock levels, replenishment alerts, and warehouse batch tracking.</p>
                </div>
                <button onClick={() => showToast('Stock audit report exported')} className="admin-quick-btn">
                  <Download size={15} /> Export Stock Report
                </button>
              </div>

              {/* Summary stat cards */}
              <div className="admin-kpi-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Total SKUs</span>
                  <span className="admin-kpi-value">{products.length}</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Low Stock Alerts</span>
                  <span className="admin-kpi-value" style={{ color: '#EA580C' }}>
                    {products.filter((p) => p.stock <= 10 && p.stock > 0).length}
                  </span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Out of Stock</span>
                  <span className="admin-kpi-value" style={{ color: '#EF4444' }}>
                    {products.filter((p) => p.stock === 0).length}
                  </span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Inventory Valuation</span>
                  <span className="admin-kpi-value">₹18.4 Lakhs</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Warehouse Status</span>
                  <span className="admin-kpi-value" style={{ color: '#16A34A', fontSize: '1.1rem' }}>
                    Optimal
                  </span>
                </div>
              </div>

              {/* Stock adjustment table */}
              <div className="admin-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Available Quantity</th>
                      <th>Safety Reorder Level</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <img src={p.image} alt={p.name} className="admin-prod-thumb-cell" />
                            <div>
                              <div style={{ fontWeight: 700 }}>{p.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>SKU: {p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#475569' }}>{p.category}</td>
                        <td>
                          <div className="admin-stock-counter">
                            <button className="admin-stock-count-btn" onClick={() => handleUpdateStock(p.id, -5)}>-5</button>
                            <button className="admin-stock-count-btn" onClick={() => handleUpdateStock(p.id, -1)}>-</button>
                            <span className="admin-stock-val">{p.stock}</span>
                            <button className="admin-stock-count-btn" onClick={() => handleUpdateStock(p.id, 1)}>+</button>
                            <button className="admin-stock-count-btn" onClick={() => handleUpdateStock(p.id, 10)}>+10</button>
                          </div>
                        </td>
                        <td style={{ color: '#64748B' }}>15 units</td>
                        <td>
                          <span
                            className={`admin-status-badge ${
                              p.stock === 0 ? 'cancelled' : p.stock <= 10 ? 'pending' : 'paid'
                            }`}
                          >
                            {p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock Warning' : 'In Stock'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="admin-primary-btn"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => {
                              handleUpdateStock(p.id, 50);
                              showToast(`Restocked +50 units for ${p.name}`);
                            }}
                          >
                            + Add 50 Units
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 6: CUSTOMERS & FARMERS DIRECTORY
              ================================================================ */}
          {activeNav === 'Customers' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Farmers & Customers Directory</h2>
                  <p className="admin-welcome-sub">Manage registered farmers, crop profiles, farm locations, and order histories persisted in PostgreSQL.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <button onClick={() => setIsAddCustomerOpen(true)} className="admin-primary-btn">
                    <Plus size={16} /> Add New Farmer
                  </button>
                  <button onClick={() => { refetchCustomers(); showToast('Customer database refreshed from PostgreSQL'); }} className="admin-quick-btn">
                    <RefreshCw size={14} /> Refresh
                  </button>
                  <button onClick={() => showToast('Customer database exported')} className="admin-quick-btn">
                    <Download size={14} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Customer Filter Bar */}
              <div className="admin-filter-bar">
                <div className="admin-filter-tabs">
                  {['All', 'Verified', 'Active', 'Pending'].map((st) => (
                    <button
                      key={st}
                      className={`admin-filter-tab-btn ${customerStatusFilter === st ? 'active' : ''}`}
                      onClick={() => setCustomerStatusFilter(st)}
                    >
                      {st} ({st === 'All' ? customers.length : customers.filter((c) => c.status === st).length})
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Search by name, phone, crop, region..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="admin-form-input"
                    style={{ width: '280px', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                    Showing {filteredCustomers.length} of {customers.length} farmers
                  </span>
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Farmer Profile</th>
                      <th>Contact Details</th>
                      <th>Location / Region</th>
                      <th>Crops & Acreage</th>
                      <th>Orders</th>
                      <th>Total Spend</th>
                      <th>Last Order</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                          No farmers found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              {c.avatarUrl ? (
                                <img
                                  src={c.avatarUrl}
                                  alt={c.name}
                                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                              ) : (
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E8F5E9', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                  {c.name[0]}
                                </div>
                              )}
                              <div>
                                <div style={{ fontWeight: 700, color: '#0F291B' }}>{c.name}</div>
                                <div style={{ fontSize: '0.72rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <CheckCircle2 size={11} /> {c.status || 'Verified Farmer'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.8rem', color: '#1E293B', fontWeight: 600 }}>{c.phone}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{c.email}</div>
                          </td>
                          <td style={{ color: '#475569' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <MapPin size={13} style={{ color: '#16A34A' }} /> {c.location}
                            </div>
                          </td>
                          <td style={{ color: '#334155', fontWeight: 600 }}>{c.crops}</td>
                          <td style={{ fontWeight: 700 }}>{c.totalOrders ?? c.ordersCount ?? 0} orders</td>
                          <td style={{ fontWeight: 800, color: '#0F291B' }}>{c.totalSpent || '₹0'}</td>
                          <td style={{ color: '#64748B', fontSize: '0.78rem' }}>{c.lastOrder || c.registeredAt || '31 Aug 2026'}</td>
                          <td>
                            <span className={`admin-status-badge ${c.status === 'Verified' || c.status === 'Active' ? 'paid' : 'pending'}`}>
                              {c.status || 'Verified'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="admin-action-btn-group" style={{ justifyContent: 'center' }}>
                              <button
                                className="admin-mini-btn"
                                onClick={() => {
                                  setSelectedCustomer(c);
                                  setIsEditCustomerOpen(true);
                                }}
                              >
                                <Edit3 size={13} /> Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 7: COUPONS & DISCOUNTS
              ================================================================ */}
          {activeNav === 'Coupons' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Promotions & Coupons</h2>
                  <p className="admin-welcome-sub">Create and schedule discount vouchers for seasonal harvests and festivals.</p>
                </div>
                <button onClick={() => setIsCouponModalOpen(true)} className="admin-primary-btn">
                  <Plus size={16} /> Create Coupon
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Coupon Code</th>
                      <th>Discount Offer</th>
                      <th>Minimum Spend</th>
                      <th>Redemptions</th>
                      <th>Valid Until</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coup) => (
                      <tr key={coup.id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem', backgroundColor: '#F1F5F9', padding: '0.25rem 0.65rem', borderRadius: '6px', color: '#0F4726' }}>
                            {coup.code}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800, color: '#16A34A' }}>{coup.discount}</td>
                        <td style={{ color: '#475569' }}>{coup.minOrder}</td>
                        <td style={{ fontWeight: 600 }}>{coup.usage}</td>
                        <td style={{ color: '#64748B' }}>{coup.validUntil}</td>
                        <td>
                          <span className="admin-status-badge active-badge">{coup.status}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="admin-mini-btn btn-danger"
                            onClick={() => {
                              setCoupons((prev) => prev.filter((c) => c.id !== coup.id));
                              showToast(`Coupon ${coup.code} removed`);
                            }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 8: SERVICE BOOKINGS
              ================================================================ */}
          {activeNav === 'Service Bookings' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Agronomy Service Requests</h2>
                  <p className="admin-welcome-sub">Farm visit consultations, soil testing dispatch, and video diagnostics.</p>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="admin-primary-btn"
                >
                  <CalendarCheck size={16} /> Assign Agronomist
                </button>
              </div>

              <div className="admin-filter-bar">
                <div className="admin-filter-tabs">
                  {(['all', 'new', 'assigned', 'completed'] as const).map((tb) => (
                    <button
                      key={tb}
                      className={`admin-filter-tab-btn ${bookingTab === tb ? 'active' : ''}`}
                      onClick={() => setBookingTab(tb)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {tb}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Farmer</th>
                      <th>Service Type</th>
                      <th>Consultation Mode</th>
                      <th>Location & Farm</th>
                      <th>Scheduled Slot</th>
                      <th>Assigned Agronomist</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceBookings.map((b) => (
                      <tr key={b.id}>
                        <td style={{ fontWeight: 700, color: '#16A34A' }}>{b.id}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <img src={b.avatar} alt={b.customer} className="admin-booking-avatar" />
                            <span style={{ fontWeight: 700 }}>{b.customer}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600, color: '#0F291B' }}>{b.service}</td>
                        <td>
                          <span style={{ backgroundColor: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {b.mode}
                          </span>
                        </td>
                        <td style={{ color: '#475569' }}>
                          <div>{b.location}</div>
                          <div style={{ fontSize: '0.72rem', color: '#15803D' }}>{b.crop}</div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{b.time}</td>
                        <td style={{ fontWeight: 700, color: b.assignedExpert === 'Unassigned' ? '#EA580C' : '#0F4726' }}>
                          {b.assignedExpert}
                        </td>
                        <td>
                          <span className={`admin-status-badge ${b.statusClass}`}>{b.status}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="admin-primary-btn"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => {
                              setAssignBookingId(b.id);
                              setIsAssignModalOpen(true);
                            }}
                          >
                            Assign Expert
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 9: CROP DOCTOR DIAGNOSES
              ================================================================ */}
          {activeNav === 'Crop Doctor' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Crop Health Inquiries</h2>
                  <p className="admin-welcome-sub">Diagnose crop disease photos uploaded by farmers and prescribe bio-treatments.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {cropDoctorRequests.map((cd) => (
                  <div key={cd.id} className="admin-card" style={{ border: '1px solid #CBD5E1', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '0.85rem' }}>
                      <img
                        src={cd.image}
                        alt={cd.title}
                        style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className={`admin-status-badge ${cd.severityClass}`}>{cd.severity} Severity</span>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{cd.time}</span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.35rem 0 0.15rem' }}>{cd.title}</h4>
                        <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>{cd.crop}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#475569', backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', marginBottom: '0.85rem' }}>
                      <strong>Farmer Observations:</strong> {cd.notes}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#0F4726', backgroundColor: '#E8F5E9', padding: '0.65rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600 }}>
                      {cd.prescription}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Reported by: <strong>{cd.author}</strong> ({cd.location})
                      </div>
                      <button
                        className="admin-primary-btn"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => {
                          setSelectedCropItem(cd);
                          setCropPrescription(cd.prescription.replace('Prescribe: ', ''));
                          setIsCropReplyModalOpen(true);
                        }}
                      >
                        <Send size={12} /> Prescribe / Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 10: AGRONOMY EXPERTS
              ================================================================ */}
          {activeNav === 'Experts' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Agronomists & Field Officers</h2>
                  <p className="admin-welcome-sub">Manage licensed agronomists, regional territory assignments, and ratings.</p>
                </div>
                <button onClick={() => setIsExpertModalOpen(true)} className="admin-primary-btn">
                  <UserPlus size={16} /> Register Expert
                </button>
              </div>

              <div className="admin-experts-grid">
                {experts.map((exp) => (
                  <div key={exp.id} className="admin-expert-card">
                    <div className="admin-expert-card-top">
                      <img src={exp.avatar} alt={exp.name} className="admin-expert-avatar" />
                      <div>
                        <div className="admin-expert-name">{exp.name}</div>
                        <div className="admin-expert-spec">{exp.spec}</div>
                      </div>
                    </div>

                    <div>
                      <div className="admin-expert-meta-item">
                        <span>Territory</span>
                        <strong style={{ color: '#0F291B' }}>{exp.territory}</strong>
                      </div>
                      <div className="admin-expert-meta-item">
                        <span>Farmer Rating</span>
                        <strong style={{ color: '#F59E0B' }}>{exp.rating}</strong>
                      </div>
                      <div className="admin-expert-meta-item">
                        <span>Consultations Completed</span>
                        <strong style={{ color: '#0F291B' }}>{exp.consultations}</strong>
                      </div>
                      <div className="admin-expert-meta-item">
                        <span>Contact</span>
                        <span style={{ color: '#475569' }}>{exp.phone}</span>
                      </div>
                      <div className="admin-expert-meta-item" style={{ border: 'none' }}>
                        <span>Status</span>
                        <span className={`admin-status-badge ${exp.status === 'Available' ? 'paid' : 'cod'}`}>
                          {exp.status}
                        </span>
                      </div>
                    </div>

                    <button
                      className="admin-quick-btn"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => showToast(`Direct connection opened with ${exp.name}`)}
                    >
                      <Phone size={13} /> Call Agronomist
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 11: REVIEWS & FEEDBACK
              ================================================================ */}
          {activeNav === 'Reviews & Feedback' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Product Reviews Moderation</h2>
                  <p className="admin-welcome-sub">Verify farmer crop proof photos and approve genuine feedback for the storefront.</p>
                </div>
              </div>

              <div>
                {reviews.map((rev) => (
                  <div key={rev.id} className="admin-review-card-item">
                    {/* Reviewer */}
                    <div className="admin-reviewer-col">
                      <img src={rev.avatar} alt={rev.reviewer} className="admin-reviewer-avatar" />
                      <div>
                        <div className="admin-reviewer-name">{rev.reviewer}</div>
                        <div className="admin-reviewer-loc">{rev.location}</div>
                        <div className="admin-reviewer-verified">✓ Verified Purchase</div>
                      </div>
                    </div>

                    {/* Product */}
                    <div className="admin-review-prod-col">
                      <img src={rev.productImg} alt={rev.product} className="admin-review-prod-thumb" />
                      <span>{rev.product}</span>
                    </div>

                    {/* Rating & Crop info */}
                    <div>
                      <div style={{ color: '#F59E0B', fontSize: '0.85rem', marginBottom: '0.2rem' }}>★★★★★</div>
                      <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>Crop: {rev.crop}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{rev.duration}</div>
                    </div>

                    {/* Field Photos */}
                    <div className="admin-field-photos-wrap">
                      {rev.photos.map((ph, idx) => (
                        <img key={idx} src={ph} alt="Crop proof" className="admin-field-photo-thumb" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <div className="admin-review-text-quote">"{rev.review}"</div>

                    {/* Action buttons */}
                    <div className="admin-review-actions">
                      {rev.status === 'Approved' ? (
                        <span style={{ color: '#15803D', fontWeight: 700, fontSize: '0.75rem' }}>✓ Approved</span>
                      ) : rev.status === 'Rejected' ? (
                        <span style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.75rem' }}>✕ Rejected</span>
                      ) : (
                        <>
                          <button onClick={() => handleApproveReview(rev.id)} className="admin-btn-approve">
                            Approve
                          </button>
                          <button onClick={() => handleRejectReview(rev.id)} className="admin-btn-reject">
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 12: BLOG & AGRICULTURAL INSIGHTS
              ================================================================ */}
          {activeNav === 'Blog' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Farm Blog & Articles</h2>
                  <p className="admin-welcome-sub">Publish educational agriculture guides, seasonal disease alerts, and soil tips.</p>
                </div>
                <button onClick={() => setIsBlogModalOpen(true)} className="admin-primary-btn">
                  <Plus size={16} /> Write New Article
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Published Date</th>
                      <th>Total Reads</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={b.image} alt={b.title} style={{ width: '56px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F291B' }}>{b.title}</div>
                              <div style={{ fontSize: '0.72rem', color: '#16A34A' }}>/blog/{b.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#475569', fontWeight: 600 }}>{b.category}</td>
                        <td style={{ color: '#334155' }}>{b.author}</td>
                        <td style={{ color: '#64748B' }}>{b.date}</td>
                        <td style={{ fontWeight: 700 }}>{b.views}</td>
                        <td>
                          <span className="admin-status-badge active-badge">{b.status}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Link to={`/blog/${b.slug}`} target="_blank" className="admin-mini-btn" style={{ textDecoration: 'none' }}>
                            <ExternalLink size={13} /> View Post
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 13: BANNERS & STOREFRONT ADS
              ================================================================ */}
          {activeNav === 'Banners' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Homepage & Promo Banners</h2>
                  <p className="admin-welcome-sub">Control active marketing banners and promotional announcements on the consumer store.</p>
                </div>
                <button onClick={() => showToast('New promotional banner created!')} className="admin-primary-btn">
                  <Plus size={16} /> Add Banner
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {banners.map((ban) => (
                  <div key={ban.id} className="admin-card" style={{ border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F291B' }}>{ban.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>Placement: <strong>{ban.placement}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '0.15rem' }}>Links to: {ban.link}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span className="admin-status-badge active-badge">{ban.status}</span>
                      <button className="admin-mini-btn" onClick={() => showToast('Banner updated')}>
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 14: ANALYTICS & REPORTS
              ================================================================ */}
          {activeNav === 'Reports' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Financial & Agronomy Analytics</h2>
                  <p className="admin-welcome-sub">Comprehensive exportable reports of revenue, product volume, and regional bookings.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => showToast('Full Financial Ledger CSV downloaded')} className="admin-primary-btn">
                    <Download size={15} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="admin-kpi-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Gross Revenue (Aug 2026)</span>
                  <span className="admin-kpi-value">₹8,42,560</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Total Completed Orders</span>
                  <span className="admin-kpi-value">1,248</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Average Order Value</span>
                  <span className="admin-kpi-value">₹675</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Consultations Delivered</span>
                  <span className="admin-kpi-value">326</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-label">Farmer Retention</span>
                  <span className="admin-kpi-value" style={{ color: '#16A34A' }}>68.4%</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F291B', marginBottom: '1rem' }}>Category Share breakdown</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Fertilizers & Soil Health</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F4726', margin: '0.35rem 0' }}>₹3.82 Lakhs</div>
                  <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>45.3% of total revenue</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Bio Stimulants</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F4726', margin: '0.35rem 0' }}>₹2.45 Lakhs</div>
                  <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>29.1% of total revenue</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Bio Pesticides</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F4726', margin: '0.35rem 0' }}>₹1.35 Lakhs</div>
                  <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>16.0% of total revenue</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Service Bookings</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F4726', margin: '0.35rem 0' }}>₹0.80 Lakhs</div>
                  <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>9.6% of total revenue</div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 15: USERS & ROLES
              ================================================================ */}
          {activeNav === 'Users & Roles' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Team & Staff Access Roles</h2>
                  <p className="admin-welcome-sub">Manage platform administrators, store managers, and agronomist privileges.</p>
                </div>
                <button onClick={() => showToast('Team invitation modal')} className="admin-primary-btn">
                  <UserPlus size={16} /> Invite Staff Member
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Permissions</th>
                      <th>Last Login</th>
                      <th style={{ textAlign: 'center' }}>Role Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Arun" className="admin-header-profile-img" />
                          <div>
                            <div style={{ fontWeight: 800 }}>Arun Admin</div>
                            <div style={{ fontSize: '0.72rem', color: '#15803D' }}>Owner Account</div>
                          </div>
                        </div>
                      </td>
                      <td>arun.admin@farmerbench.agri</td>
                      <td><span className="admin-status-badge paid">SUPER ADMIN</span></td>
                      <td style={{ color: '#475569' }}>Full System & Financial Access</td>
                      <td style={{ color: '#64748B' }}>Just now</td>
                      <td style={{ textAlign: 'center' }}>—</td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80" alt="Priya" className="admin-header-profile-img" />
                          <div>
                            <div style={{ fontWeight: 800 }}>Dr. V. Priya</div>
                            <div style={{ fontSize: '0.72rem', color: '#0284C7' }}>Agronomist Lead</div>
                          </div>
                        </div>
                      </td>
                      <td>priya.agri@farmerbench.agri</td>
                      <td><span className="admin-status-badge cod">AGRONOMIST</span></td>
                      <td style={{ color: '#475569' }}>Crop Doctor, Service Bookings & Blog</td>
                      <td style={{ color: '#64748B' }}>2 hours ago</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="admin-mini-btn" onClick={() => showToast('Permissions updated')}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 16: SYSTEM SETTINGS
              ================================================================ */}
          {activeNav === 'Settings' && (
            <div className="admin-settings-card">
              <div>
                <h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Platform & Store Settings</h2>
                <p className="admin-welcome-sub">Configure store branding, currency, tax rates, and SMS notification gateways.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Store settings saved successfully!');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <div className="admin-settings-section-title">General Information</div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Store Legal Name</label>
                  <input
                    className="admin-form-input"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Customer Support Email</label>
                    <input
                      className="admin-form-input"
                      value={storeSettings.supportEmail}
                      onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Toll-Free Support Phone</label>
                    <input
                      className="admin-form-input"
                      value={storeSettings.supportPhone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Headquarters Physical Address</label>
                  <textarea
                    rows={2}
                    className="admin-form-textarea"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                  />
                </div>

                <div className="admin-settings-section-title">Finance & Taxation</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Primary Currency</label>
                    <input className="admin-form-input" value={storeSettings.currency} disabled />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Standard Agri GST Rate</label>
                    <input
                      className="admin-form-input"
                      value={storeSettings.taxRate}
                      onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" className="admin-primary-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Footer Bar */}
          <footer className="admin-footer-bar">
            <div>© 2026 FarmerBench Admin Panel</div>
            <div className="admin-footer-status">
              <span>System Status:</span>
              <span className="admin-status-dot-pulse" />
              <strong style={{ color: '#0F291B' }}>All services operational</strong>
            </div>
            <div>Version 2.4.0</div>
          </footer>
        </div>
      </div>

      {/* ====================================================================
          MODALS & DIALOGS: PRODUCT CONTENT MANAGEMENT SYSTEM (CMS)
          ==================================================================== */}

      {/* Modal: Full Product CMS (Add / Edit) */}
      {(isAddProductOpen || isEditProductOpen) && (
        <div className="admin-modal-overlay" onClick={() => { setIsAddProductOpen(false); setIsEditProductOpen(false); }}>
          <div className="admin-modal-card admin-cms-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {isAddProductOpen ? '➕ Create New Agricultural Product (CMS)' : `✏️ Product CMS Editor — ${cmsForm.title}`}
              </h3>
              <button
                onClick={() => { setIsAddProductOpen(false); setIsEditProductOpen(false); }}
                className="admin-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* CMS Navigation Tabs */}
            <div className="admin-cms-tabs-bar">
              <button
                type="button"
                className={`admin-cms-tab-btn ${cmsTab === 'basic' ? 'active' : ''}`}
                onClick={() => setCmsTab('basic')}
              >
                📋 Basic & Pricing
              </button>
              <button
                type="button"
                className={`admin-cms-tab-btn ${cmsTab === 'media' ? 'active' : ''}`}
                onClick={() => setCmsTab('media')}
              >
                🖼️ Media & Gallery
              </button>
              <button
                type="button"
                className={`admin-cms-tab-btn ${cmsTab === 'highlights' ? 'active' : ''}`}
                onClick={() => setCmsTab('highlights')}
              >
                📝 Overview & Highlights
              </button>
              <button
                type="button"
                className={`admin-cms-tab-btn ${cmsTab === 'steps' ? 'active' : ''}`}
                onClick={() => setCmsTab('steps')}
              >
                🌱 Benefits & Steps
              </button>
              <button
                type="button"
                className={`admin-cms-tab-btn ${cmsTab === 'dosage' ? 'active' : ''}`}
                onClick={() => setCmsTab('dosage')}
              >
                💧 Dosage & Ingredients
              </button>
              <button
                type="button"
                className={`admin-cms-tab-btn ${cmsTab === 'specs' ? 'active' : ''}`}
                onClick={() => setCmsTab('specs')}
              >
                🔬 Specs, FAQs & Results
              </button>
            </div>

            <form
              onSubmit={async (e: any) => {
                e.preventDefault();
                const title = cmsForm.title.trim();
                const slug = cmsForm.slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
                const price = Number(cmsForm.price);
                const discountPrice = Number(cmsForm.discountPrice) || price;
                const stock = Number(cmsForm.stock);
                const categoryId = cmsForm.categoryId || dbCategories[0]?.id;
                const description = cmsForm.description.trim() || 'Premium certified organic agricultural input.';
                const images = cmsForm.images.filter((img: string) => Boolean(img.trim()));

                const attributes = {
                  features: cmsForm.features.filter((f: string) => Boolean(f.trim())),
                  packSizes: cmsForm.packSizes.filter((p: string) => Boolean(p.trim())),
                  benefits: cmsForm.benefits.filter((b: string) => Boolean(b.trim())),
                  usageSteps: cmsForm.usageSteps,
                  dosageTable: cmsForm.dosageTable,
                  ingredients: cmsForm.ingredients,
                  specifications: cmsForm.specifications,
                  faqs: cmsForm.faqs,
                  beforeAfter: cmsForm.beforeAfter,
                };

                try {
                  if (isAddProductOpen) {
                    await createProduct({
                      title,
                      slug,
                      description,
                      price,
                      discountPrice,
                      stock,
                      featured: cmsForm.featured,
                      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'],
                      categoryId,
                      attributes,
                    });
                    setIsAddProductOpen(false);
                    showToast(`Product "${title}" created and published to PostgreSQL!`);
                  } else {
                    await updateProduct({
                      id: selectedProduct.id,
                      data: {
                        title,
                        slug,
                        description,
                        price,
                        discountPrice,
                        stock,
                        featured: cmsForm.featured,
                        images: images.length > 0 ? images : selectedProduct.images,
                        categoryId,
                        attributes,
                      },
                    });
                    setIsEditProductOpen(false);
                    showToast(`Product "${title}" CMS details updated in PostgreSQL!`);
                  }
                } catch (err: any) {
                  showToast(err.message || 'Failed to save product content');
                }
              }}
            >
              <div className="admin-modal-body" style={{ minHeight: '380px' }}>
                {/* 1. BASIC & PRICING TAB */}
                {cmsTab === 'basic' && (
                  <div className="admin-cms-section">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Product Name *</label>
                      <input
                        required
                        value={cmsForm.title}
                        onChange={(e) => setCmsForm({ ...cmsForm, title: e.target.value })}
                        placeholder="e.g. Growth Booster for All Crops 500ml"
                        className="admin-form-input"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Category *</label>
                        <select
                          value={cmsForm.categoryId}
                          onChange={(e) => setCmsForm({ ...cmsForm, categoryId: e.target.value })}
                          className="admin-form-select"
                          required
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">URL Slug</label>
                        <input
                          value={cmsForm.slug}
                          onChange={(e) => setCmsForm({ ...cmsForm, slug: e.target.value })}
                          placeholder="e.g. growth-booster-for-all-crops"
                          className="admin-form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="admin-form-group">
                        <label className="admin-form-label">MRP / Base Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={cmsForm.price}
                          onChange={(e) => setCmsForm({ ...cmsForm, price: Number(e.target.value) })}
                          className="admin-form-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Discount Price (₹)</label>
                        <input
                          type="number"
                          value={cmsForm.discountPrice}
                          onChange={(e) => setCmsForm({ ...cmsForm, discountPrice: Number(e.target.value) })}
                          className="admin-form-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Warehouse Stock Units *</label>
                        <input
                          type="number"
                          required
                          value={cmsForm.stock}
                          onChange={(e) => setCmsForm({ ...cmsForm, stock: Number(e.target.value) })}
                          className="admin-form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.5rem' }}>
                      <input
                        type="checkbox"
                        id="prodFeatured"
                        checked={cmsForm.featured}
                        onChange={(e) => setCmsForm({ ...cmsForm, featured: e.target.checked })}
                      />
                      <label htmlFor="prodFeatured" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', cursor: 'pointer' }}>
                        Feature on Homepage & Recommended Badges
                      </label>
                    </div>
                  </div>
                )}

                {/* 2. MEDIA & GALLERY TAB */}
                {cmsTab === 'media' && (
                  <div className="admin-cms-section">
                    <label className="admin-form-label">Gallery Images (First image is Main Stage Image)</label>
                    {cmsForm.images.map((img: string, idx: number) => (
                      <div key={idx} className="admin-dynamic-item">
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', width: '20px' }}>
                          #{idx + 1}
                        </span>
                        <input
                          value={img}
                          onChange={(e) => {
                            const newImgs = [...cmsForm.images];
                            newImgs[idx] = e.target.value;
                            setCmsForm({ ...cmsForm, images: newImgs });
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="admin-form-input"
                        />
                        {cmsForm.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = cmsForm.images.filter((_: any, i: number) => i !== idx);
                              setCmsForm({ ...cmsForm, images: newImgs });
                            }}
                            className="admin-btn-remove-row"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCmsForm({ ...cmsForm, images: [...cmsForm.images, ''] })}
                      className="admin-btn-add-row"
                    >
                      <Plus size={14} /> Add Gallery Image URL
                    </button>
                  </div>
                )}

                {/* 3. OVERVIEW & HIGHLIGHTS TAB */}
                {cmsTab === 'highlights' && (
                  <div className="admin-cms-section">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Full Product Overview Description *</label>
                      <textarea
                        rows={4}
                        required
                        value={cmsForm.description}
                        onChange={(e) => setCmsForm({ ...cmsForm, description: e.target.value })}
                        placeholder="Detailed agronomic description..."
                        className="admin-form-textarea"
                      />
                    </div>

                    <div>
                      <label className="admin-form-label">Top Feature Checkmark Bullets (Right Panel)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
                        {cmsForm.features.map((feat: string, idx: number) => (
                          <div key={idx} className="admin-dynamic-item">
                            <input
                              value={feat}
                              onChange={(e) => {
                                const newFeats = [...cmsForm.features];
                                newFeats[idx] = e.target.value;
                                setCmsForm({ ...cmsForm, features: newFeats });
                              }}
                              placeholder="e.g. Promotes faster and healthier root growth"
                              className="admin-form-input"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeats = cmsForm.features.filter((_: any, i: number) => i !== idx);
                                setCmsForm({ ...cmsForm, features: newFeats });
                              }}
                              className="admin-btn-remove-row"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setCmsForm({ ...cmsForm, features: [...cmsForm.features, ''] })}
                          className="admin-btn-add-row"
                        >
                          <Plus size={14} /> Add Feature Bullet
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="admin-form-label">Available Pack Sizes (e.g. 500 g, 1 kg, 5 kg)</label>
                      <input
                        value={cmsForm.packSizes.join(', ')}
                        onChange={(e) =>
                          setCmsForm({
                            ...cmsForm,
                            packSizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="500 g, 1 kg, 5 kg"
                        className="admin-form-input"
                      />
                    </div>
                  </div>
                )}

                {/* 4. BENEFITS & STEPS TAB */}
                {cmsTab === 'steps' && (
                  <div className="admin-cms-section">
                    <div>
                      <label className="admin-form-label">Key Agricultural Benefits List (Benefits Tab)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
                        {cmsForm.benefits.map((b: string, idx: number) => (
                          <div key={idx} className="admin-dynamic-item">
                            <input
                              value={b}
                              onChange={(e) => {
                                const newBenefits = [...cmsForm.benefits];
                                newBenefits[idx] = e.target.value;
                                setCmsForm({ ...cmsForm, benefits: newBenefits });
                              }}
                              placeholder="e.g. Accelerates nodal tillering and root elongation..."
                              className="admin-form-input"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newBenefits = cmsForm.benefits.filter((_: any, i: number) => i !== idx);
                                setCmsForm({ ...cmsForm, benefits: newBenefits });
                              }}
                              className="admin-btn-remove-row"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setCmsForm({ ...cmsForm, benefits: [...cmsForm.benefits, ''] })}
                          className="admin-btn-add-row"
                        >
                          <Plus size={14} /> Add Benefit
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <label className="admin-form-label">How to Use Workflow Steps (Step Cards)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.35rem' }}>
                        {cmsForm.usageSteps.map((step: any, idx: number) => (
                          <div key={idx} style={{ padding: '0.75rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#15803D' }}>
                                Step #{step.stepNumber || idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newSteps = cmsForm.usageSteps.filter((_: any, i: number) => i !== idx);
                                  setCmsForm({ ...cmsForm, usageSteps: newSteps });
                                }}
                                className="admin-btn-remove-row"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem' }}>
                              <input
                                value={step.title}
                                onChange={(e) => {
                                  const newSteps = [...cmsForm.usageSteps];
                                  newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                                  setCmsForm({ ...cmsForm, usageSteps: newSteps });
                                }}
                                placeholder="Title (e.g. Mix)"
                                className="admin-form-input"
                              />
                              <input
                                value={step.description}
                                onChange={(e) => {
                                  const newSteps = [...cmsForm.usageSteps];
                                  newSteps[idx] = { ...newSteps[idx], description: e.target.value };
                                  setCmsForm({ ...cmsForm, usageSteps: newSteps });
                                }}
                                placeholder="Description (e.g. Dissolve 2ml per litre of water)"
                                className="admin-form-input"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setCmsForm({
                              ...cmsForm,
                              usageSteps: [
                                ...cmsForm.usageSteps,
                                { stepNumber: cmsForm.usageSteps.length + 1, title: 'Apply', description: 'Spray evenly over foliage.' },
                              ],
                            })
                          }
                          className="admin-btn-add-row"
                        >
                          <Plus size={14} /> Add Usage Step
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. DOSAGE & INGREDIENTS TAB */}
                {cmsTab === 'dosage' && (
                  <div className="admin-cms-section">
                    <div>
                      <label className="admin-form-label">Crop Dosage Table Rows (Dosage Tab)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
                        {cmsForm.dosageTable.map((row: any, idx: number) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 36px', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              value={row.crop}
                              onChange={(e) => {
                                const newDosage = [...cmsForm.dosageTable];
                                newDosage[idx] = { ...newDosage[idx], crop: e.target.value };
                                setCmsForm({ ...cmsForm, dosageTable: newDosage });
                              }}
                              placeholder="Crop (e.g. Paddy)"
                              className="admin-form-input"
                            />
                            <input
                              value={row.foliarSpray}
                              onChange={(e) => {
                                const newDosage = [...cmsForm.dosageTable];
                                newDosage[idx] = { ...newDosage[idx], foliarSpray: e.target.value };
                                setCmsForm({ ...cmsForm, dosageTable: newDosage });
                              }}
                              placeholder="Foliar (2.5 ml / L)"
                              className="admin-form-input"
                            />
                            <input
                              value={row.dripIrrigation}
                              onChange={(e) => {
                                const newDosage = [...cmsForm.dosageTable];
                                newDosage[idx] = { ...newDosage[idx], dripIrrigation: e.target.value };
                                setCmsForm({ ...cmsForm, dosageTable: newDosage });
                              }}
                              placeholder="Drip (500 ml / Acre)"
                              className="admin-form-input"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newDosage = cmsForm.dosageTable.filter((_: any, i: number) => i !== idx);
                                setCmsForm({ ...cmsForm, dosageTable: newDosage });
                              }}
                              className="admin-btn-remove-row"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setCmsForm({
                              ...cmsForm,
                              dosageTable: [
                                ...cmsForm.dosageTable,
                                { crop: 'Vegetables', foliarSpray: '2 ml / L', dripIrrigation: '500 ml / Acre' },
                              ],
                            })
                          }
                          className="admin-btn-add-row"
                        >
                          <Plus size={14} /> Add Dosage Row
                        </button>
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '1rem' }}>
                      <label className="admin-form-label">Active Bio-Ingredients & Chemical Composition</label>
                      <textarea
                        rows={3}
                        value={cmsForm.ingredients}
                        onChange={(e) => setCmsForm({ ...cmsForm, ingredients: e.target.value })}
                        placeholder="e.g. Cold fermented Ascophyllum nodosum marine extract (28%), amino acids..."
                        className="admin-form-textarea"
                      />
                    </div>
                  </div>
                )}

                {/* 6. SPECS, FAQS & BEFORE/AFTER TAB */}
                {cmsTab === 'specs' && (
                  <div className="admin-cms-section">
                    <div>
                      <label className="admin-form-label">Product Details Specifications (Right Card)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
                        {cmsForm.specifications.map((spec: any, idx: number) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              value={spec.label}
                              onChange={(e) => {
                                const newSpecs = [...cmsForm.specifications];
                                newSpecs[idx] = { ...newSpecs[idx], label: e.target.value };
                                setCmsForm({ ...cmsForm, specifications: newSpecs });
                              }}
                              placeholder="Label (e.g. Shelf Life)"
                              className="admin-form-input"
                            />
                            <input
                              value={spec.value}
                              onChange={(e) => {
                                const newSpecs = [...cmsForm.specifications];
                                newSpecs[idx] = { ...newSpecs[idx], value: e.target.value };
                                setCmsForm({ ...cmsForm, specifications: newSpecs });
                              }}
                              placeholder="Value (e.g. 24 Months)"
                              className="admin-form-input"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSpecs = cmsForm.specifications.filter((_: any, i: number) => i !== idx);
                                setCmsForm({ ...cmsForm, specifications: newSpecs });
                              }}
                              className="admin-btn-remove-row"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setCmsForm({
                              ...cmsForm,
                              specifications: [
                                ...cmsForm.specifications,
                                { label: 'Manufacturer', value: 'FarmerBench Agri Solutions' },
                              ],
                            })
                          }
                          className="admin-btn-add-row"
                        >
                          <Plus size={14} /> Add Specification
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <label className="admin-form-label">Product FAQs</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.35rem' }}>
                        {cmsForm.faqs.map((faq: any, idx: number) => (
                          <div key={idx} style={{ padding: '0.75rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <input
                                value={faq.question}
                                onChange={(e) => {
                                  const newFaqs = [...cmsForm.faqs];
                                  newFaqs[idx] = { ...newFaqs[idx], question: e.target.value };
                                  setCmsForm({ ...cmsForm, faqs: newFaqs });
                                }}
                                placeholder="Question (e.g. Is it safe for organic crops?)"
                                className="admin-form-input"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newFaqs = cmsForm.faqs.filter((_: any, i: number) => i !== idx);
                                  setCmsForm({ ...cmsForm, faqs: newFaqs });
                                }}
                                className="admin-btn-remove-row"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={faq.answer}
                              onChange={(e) => {
                                const newFaqs = [...cmsForm.faqs];
                                newFaqs[idx] = { ...newFaqs[idx], answer: e.target.value };
                                setCmsForm({ ...cmsForm, faqs: newFaqs });
                              }}
                              placeholder="Answer..."
                              className="admin-form-textarea"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setCmsForm({
                              ...cmsForm,
                              faqs: [...cmsForm.faqs, { question: '', answer: '' }],
                            })
                          }
                          className="admin-btn-add-row"
                        >
                          <Plus size={14} /> Add FAQ
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <label className="admin-form-label">Before / After Field Results (See the Difference)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.35rem' }}>
                        <div className="admin-form-group">
                          <label className="admin-form-label" style={{ fontSize: '0.75rem' }}>Before Image URL</label>
                          <input
                            value={cmsForm.beforeAfter?.beforeImage || ''}
                            onChange={(e) =>
                              setCmsForm({
                                ...cmsForm,
                                beforeAfter: { ...cmsForm.beforeAfter, beforeImage: e.target.value },
                              })
                            }
                            placeholder="https://..."
                            className="admin-form-input"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label" style={{ fontSize: '0.75rem' }}>After Image URL</label>
                          <input
                            value={cmsForm.beforeAfter?.afterImage || ''}
                            onChange={(e) =>
                              setCmsForm({
                                ...cmsForm,
                                beforeAfter: { ...cmsForm.beforeAfter, afterImage: e.target.value },
                              })
                            }
                            placeholder="https://..."
                            className="admin-form-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => { setIsAddProductOpen(false); setIsEditProductOpen(false); }}
                  className="admin-quick-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  {isAddProductOpen ? '🚀 Publish Product to PostgreSQL' : '💾 Save Product Content to PostgreSQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Order Invoice Details */}
      {isInvoiceModalOpen && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setIsInvoiceModalOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Invoice & Order Summary: {selectedOrder.id}</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="admin-modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selectedOrder.customer}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{selectedOrder.email} | {selectedOrder.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`admin-status-badge ${selectedOrder.statusClass}`}>{selectedOrder.status}</span>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>{selectedOrder.date}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#475569', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px' }}>
                <strong>Shipping Address:</strong> {selectedOrder.shippingAddress}
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem' }}>Items in Order:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {selectedOrder.items?.map((it: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', padding: '0.4rem 0', borderBottom: '1px dashed #E2E8F0' }}>
                    <span>{it.name} x {it.qty}</span>
                    <strong>{it.price}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#0F291B', paddingTop: '0.5rem' }}>
                <span>Total Amount:</span>
                <span>{selectedOrder.amount}</span>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={() => {
                  showToast(`Invoice for ${selectedOrder.id} printed.`);
                  setIsInvoiceModalOpen(false);
                }}
                className="admin-primary-btn"
              >
                <Download size={14} /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Crop Doctor Prescribe */}
      {isCropReplyModalOpen && selectedCropItem && (
        <div className="admin-modal-overlay" onClick={() => setIsCropReplyModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Agronomist Diagnosis & Prescription</h3>
              <button onClick={() => setIsCropReplyModalOpen(false)} className="admin-modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCropDoctorRequests((prev) =>
                  prev.map((c) => (c.id === selectedCropItem.id ? { ...c, prescription: `Prescribe: ${cropPrescription}` } : c))
                );
                setIsCropReplyModalOpen(false);
                showToast(`Treatment prescription sent to farmer ${selectedCropItem.author}!`);
              }}
            >
              <div className="admin-modal-body">
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Case: {selectedCropItem.title} ({selectedCropItem.crop})
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Agronomic Treatment & Bio-Products Formulation</label>
                  <textarea
                    rows={4}
                    required
                    value={cropPrescription}
                    onChange={(e) => setCropPrescription(e.target.value)}
                    className="admin-form-textarea"
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsCropReplyModalOpen(false)} className="admin-quick-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  <Send size={14} /> Send to Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Category */}
      {isAddCategoryOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddCategoryOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Add Store Category</h3>
              <button onClick={() => setIsAddCategoryOpen(false)} className="admin-modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={async (e: any) => {
                e.preventDefault();
                const name = e.target.catName.value.trim();
                const desc = e.target.catDesc.value.trim();
                const slug = name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)+/g, '');

                try {
                  await createCategory({
                    name,
                    slug,
                    description: desc || 'Certified sustainable agricultural category.',
                    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
                  });
                  setIsAddCategoryOpen(false);
                  showToast(`Category "${name}" created and saved to PostgreSQL!`);
                } catch (err: any) {
                  showToast(err.message || 'Failed to create category');
                }
              }}
            >
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Category Name</label>
                  <input name="catName" required placeholder="e.g. Bio Fungicides" className="admin-form-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea name="catDesc" rows={3} placeholder="Describe products in this category..." className="admin-form-textarea" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsAddCategoryOpen(false)} className="admin-quick-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Coupon */}
      {isCouponModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsCouponModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Create Discount Coupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="admin-modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                const code = e.target.coupCode.value.toUpperCase();
                const discount = e.target.coupDisc.value;
                const newC = {
                  id: `c${coupons.length + 1}`,
                  code,
                  discount: `${discount}% OFF`,
                  minOrder: '₹500',
                  usage: '0 / 500',
                  validUntil: '31 Dec 2026',
                  status: 'Active',
                };
                setCoupons([newC, ...coupons]);
                setIsCouponModalOpen(false);
                showToast(`Coupon ${code} created & active!`);
              }}
            >
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Coupon Code</label>
                  <input name="coupCode" required placeholder="e.g. MONSOON25" className="admin-form-input" style={{ textTransform: 'uppercase' }} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Discount (%)</label>
                  <input name="coupDisc" required type="number" placeholder="25" className="admin-form-input" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="admin-quick-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Expert */}
      {isExpertModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsExpertModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Register Agronomist</h3>
              <button onClick={() => setIsExpertModalOpen(false)} className="admin-modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                const name = e.target.expName.value;
                const spec = e.target.expSpec.value;
                const territory = e.target.expTerritory.value;
                const newExp = {
                  id: `exp-${experts.length + 1}`,
                  name,
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
                  spec,
                  territory,
                  rating: '5.0 ★',
                  consultations: 0,
                  status: 'Available',
                  phone: '+91 98400 33221',
                };
                setExperts([...experts, newExp]);
                setIsExpertModalOpen(false);
                showToast(`Agronomist ${name} registered successfully!`);
              }}
            >
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Full Name & Degree</label>
                  <input name="expName" required placeholder="Dr. R. Senthil M.Sc. Agri" className="admin-form-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Specialization</label>
                  <input name="expSpec" required placeholder="Soil Health & Paddy Diagnostics" className="admin-form-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Territory / District</label>
                  <input name="expTerritory" required placeholder="Delta Region / Thanjavur" className="admin-form-input" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsExpertModalOpen(false)} className="admin-quick-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Register Expert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Expert */}
      {isAssignModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAssignModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Assign Expert to Booking</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="admin-modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                const bId = e.target.assignBId.value;
                const exp = e.target.assignExp.value;

                setServiceBookings((prev) =>
                  prev.map((b) => (b.id === bId ? { ...b, assignedExpert: exp, status: 'Assigned', statusClass: 'shipped', isNew: false } : b))
                );
                setIsAssignModalOpen(false);
                showToast(`Assigned ${exp} to booking ${bId}`);
              }}
            >
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Select Service Booking</label>
                  <select name="assignBId" defaultValue={assignBookingId || 'SB-326'} className="admin-form-select">
                    {serviceBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} — {b.customer} ({b.service} - {b.location})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Choose Agronomist</label>
                  <select name="assignExp" className="admin-form-select">
                    {experts.map((exp) => (
                      <option key={exp.id} value={exp.name}>
                        {exp.name} ({exp.spec})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="admin-quick-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Blog */}
      {isBlogModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsBlogModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Publish Farming Blog Article</h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="admin-modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                const title = e.target.blogTitle.value;
                const cat = e.target.blogCat.value;
                const newB = {
                  id: `blog-${blogs.length + 1}`,
                  title,
                  slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                  category: cat,
                  author: user?.name || 'Arun Admin',
                  date: 'Just now',
                  views: '1 read',
                  image: farmingPracticesImg,
                  status: 'Published',
                };
                setBlogs([newB, ...blogs]);
                setIsBlogModalOpen(false);
                showToast(`Article "${title}" published!`);
              }}
            >
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Article Title</label>
                  <input name="blogTitle" required placeholder="e.g. Organic Methods for Soil Enrichment" className="admin-form-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <select name="blogCat" className="admin-form-select">
                    <option>Farming Techniques</option>
                    <option>Pest Control</option>
                    <option>Soil Nutrition</option>
                    <option>Organic Certification</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Article Content</label>
                  <textarea rows={4} required placeholder="Write article content & recommendations..." className="admin-form-textarea" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsBlogModalOpen(false)} className="admin-quick-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Farmer / Customer */}
      {isAddCustomerOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddCustomerOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">➕ Register New Farmer / Customer</h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="admin-modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={async (e: any) => {
                e.preventDefault();
                const name = e.target.custName.value.trim();
                const email = e.target.custEmail.value.trim().toLowerCase();
                const phone = e.target.custPhone.value.trim();
                const location = e.target.custLocation.value.trim();
                const crops = e.target.custCrops.value.trim();
                const status = e.target.custStatus.value;

                try {
                  await createCustomer({
                    name,
                    email,
                    phone,
                    location,
                    crops,
                    status,
                  });
                  setIsAddCustomerOpen(false);
                  showToast(`Farmer "${name}" successfully registered in PostgreSQL database!`);
                } catch (err: any) {
                  showToast(err.message || 'Failed to create customer');
                }
              }}
            >
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Farmer Full Name *</label>
                  <input name="custName" required placeholder="e.g. Senthil Nathan" className="admin-form-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Email Address *</label>
                  <input name="custEmail" type="email" required placeholder="farmer@gmail.com" className="admin-form-input" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Mobile Number *</label>
                    <input name="custPhone" required placeholder="+91 98421 99210" className="admin-form-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Location / Region *</label>
                    <input name="custLocation" required placeholder="e.g. Thanjavur, Tamil Nadu" className="admin-form-input" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Crops & Acreage *</label>
                    <input name="custCrops" required placeholder="e.g. Paddy / 15 Acres" className="admin-form-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Verification Status</label>
                    <select name="custStatus" defaultValue="Verified" className="admin-form-select">
                      <option value="Verified">Verified</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsAddCustomerOpen(false)} className="admin-quick-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Save & Register Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Farmer / Customer */}
      {isEditCustomerOpen && selectedCustomer && (
        <div className="admin-modal-overlay" onClick={() => setIsEditCustomerOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">✏️ Edit Farmer Profile — {selectedCustomer.name}</h3>
              <button onClick={() => setIsEditCustomerOpen(false)} className="admin-modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={async (e: any) => {
                e.preventDefault();
                const name = e.target.editCustName.value.trim();
                const phone = e.target.editCustPhone.value.trim();
                const location = e.target.editCustLocation.value.trim();
                const crops = e.target.editCustCrops.value.trim();
                const status = e.target.editCustStatus.value;

                try {
                  await updateCustomer({
                    id: selectedCustomer.id,
                    data: {
                      name,
                      phone,
                      location,
                      crops,
                      status,
                    },
                  });
                  setIsEditCustomerOpen(false);
                  showToast(`Farmer "${name}" profile updated in PostgreSQL!`);
                } catch (err: any) {
                  showToast(err.message || 'Failed to update customer');
                }
              }}
            >
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Farmer Full Name</label>
                  <input name="editCustName" defaultValue={selectedCustomer.name} required className="admin-form-input" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone</label>
                    <input name="editCustPhone" defaultValue={selectedCustomer.phone} required className="admin-form-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Location / Region</label>
                    <input name="editCustLocation" defaultValue={selectedCustomer.location} required className="admin-form-input" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Crops & Acreage</label>
                    <input name="editCustCrops" defaultValue={selectedCustomer.crops} required className="admin-form-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Status</label>
                    <select name="editCustStatus" defaultValue={selectedCustomer.status || 'Verified'} className="admin-form-select">
                      <option value="Verified">Verified</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsEditCustomerOpen(false)} className="admin-quick-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
