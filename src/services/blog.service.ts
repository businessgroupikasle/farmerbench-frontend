import { apiClient } from './api';
import { ApiResponse } from '@formerbench/shared';
import { BlogPost, CreateBlogInput, UpdateBlogInput, BlogQueryParams, BlogCategory, BlogStatus } from '../types/blog';

const STORAGE_KEY = 'AgriEra_blogs_cms_data';

// Pre-seeded high quality database articles
const SEED_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How to Choose the Right Fertilizer for Your Crop?',
    slug: 'how-to-choose-the-right-fertilizer-for-your-crop',
    excerpt: 'A comprehensive guide on evaluating NPK ratios, soil pH testing, and balancing organic compost with targeted micronutrient feeding.',
    content: `<p>Choosing the right fertilizer is one of the most critical decisions for achieving vigorous crop growth, robust root architecture, and maximum seasonal harvest. Different crops require distinct nutrient proportions at key developmental stages—from vegetative leaf expansion to flower initiation and fruit setting.</p>

<h2 class="blog-section-heading">1. Understanding Your Crop's Nutrient Needs</h2>
<p>Every crop requires a balanced formulation of primary macronutrients—Nitrogen (N), Phosphorus (P), and Potassium (K)—supplemented by secondary and micronutrients such as Calcium, Magnesium, Zinc, and Boron. For instance, leafy greens require elevated Nitrogen for chlorophyll synthesis, while root vegetables and fruiting crops demand higher Phosphorus and Potassium levels for root elongation and cellular sugar transport.</p>

<h2 class="blog-section-heading">2. Know the Main Fertilizer Categories</h2>
<p>Fertilizers are classified into three primary categories depending on their source and release mechanisms:</p>
<ul class="blog-article-list">
  <li><strong>Organic & Bio-Fertilizers:</strong> Formulated from microbial inoculants, seaweed extracts, and fermented compost that replenish organic carbon and boost mycorrhizal root colonization.</li>
  <li><strong>Inorganic Mineral Fertilizers:</strong> Highly soluble formulations engineered for rapid bioavailability and immediate correction of acute nutrient deficiencies.</li>
  <li><strong>Slow-Release Humic Blends:</strong> Bio-stimulated granules coated with humic and fulvic acids to prevent nitrogen leaching and volatilization.</li>
</ul>

<div class="blog-expert-tip-box">
  <div class="blog-tip-icon">💡</div>
  <div>
    <h4 class="blog-tip-title">Expert Agronomist Tip</h4>
    <p class="blog-tip-text">Combining humic acid granules with inorganic fertilizer reduces overall chemical application rates by up to 25% while enhancing fertilizer uptake efficiency.</p>
  </div>
</div>

<h2 class="blog-section-heading">3. Decoding the NPK Ratio</h2>
<p>The three numbers printed on fertilizer packaging indicate the percentage concentration of Nitrogen (N), Phosphate (P₂O₅), and Potash (K₂O). For example, a <strong>10-26-26</strong> ratio delivers 10% Nitrogen for controlled vegetative foliage and 26% each of Phosphorus and Potassium to support prolific flowering and seed plumpness.</p>

<h2 class="blog-section-heading">4. Soil Testing: The Golden Rule Before Application</h2>
<p>Always conduct a comprehensive soil fertility and electrical conductivity (EC) test prior to basal fertilizer application. Testing reveals baseline pH, existing organic carbon, and residual salinity, preventing fertilizer lockup and unnecessary input costs.</p>

<h2 class="blog-section-heading">5. Optimal Application Techniques</h2>
<p>Depending on crop spacing and irrigation infrastructure, select the most effective delivery method:</p>
<ul class="blog-article-list">
  <li><strong>Fertigation:</strong> Injecting 100% water-soluble nutrients through micro-drip networks directly into the active root feeding zone.</li>
  <li><strong>Foliar Sprays:</strong> Applying chelated micronutrients directly onto leaf stomata during critical morning hours for rapid absorption.</li>
  <li><strong>Basal Banding:</strong> Placing slow-release pellets 5cm below and beside the seed line during sowing.</li>
</ul>

<h2 class="blog-section-heading">6. Final Recommendations</h2>
<p>Adhering to split application schedules tailored to soil texture ensures steady nutrient availability without risking root burn. Monitor leaf color variations weekly and adjust irrigation schedules in tandem with fertigation cycles.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80',
    author: 'AgriEra Agri Expert',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    authorBio: 'Senior agronomist with 12+ years of on-field experience in crop nutrition, precision fertigation, and sustainable soil stewardship across diverse agricultural zones.',
    category: 'Crop Nutrition',
    tags: ['Fertilizers', 'NPK Ratio', 'Soil Health', 'Crop Yield', 'Fertigation'],
    status: 'PUBLISHED',
    readingTime: '8 min read',
    views: 1420,
    publishedAt: '2024-05-20T10:00:00.000Z',
    createdAt: '2024-05-20T09:30:00.000Z',
    updatedAt: '2024-05-20T10:00:00.000Z',
    metaTitle: 'How to Choose the Right Fertilizer for Your Crop | AgriEra',
    metaDescription: 'Learn how to analyze NPK ratios, select between organic and mineral fertilizers, and implement precision fertigation for higher crop yields.',
  },
  {
    id: 'blog-2',
    title: 'Simple Ways to Improve Soil Health Naturally',
    slug: 'simple-ways-to-improve-soil-health-naturally',
    excerpt: 'Discover practical regenerative farming methods, green manuring, and microbial inoculants to restore degraded topsoil and boost water retention.',
    content: `<p>Healthy, living soil is the cornerstone of profitable and resilient farming. Degraded soil with low organic matter requires excessive chemical inputs and struggles during dry spells. By adopting natural soil restoration practices, farmers can rebuild long-term fertility and microbial diversity.</p>

<h2 class="blog-section-heading">1. Incorporating Green Manure & Cover Crops</h2>
<p>Sowing leguminous cover crops such as Sunn Hemp, Sesbania, or Cowpea during fallow periods fixes atmospheric nitrogen directly into the soil profile. Tilling these crops back into the topsoil prior to flowering adds immense organic biomass.</p>

<h2 class="blog-section-heading">2. Application of Vermicompost & Biochar</h2>
<p>Vermicompost supplies millions of beneficial bacteria, actinomycetes, and enzymes. When combined with biochar, it creates permanent micropores that trap nutrients and prevent leaching during heavy monsoons.</p>

<div class="blog-expert-tip-box">
  <div class="blog-tip-icon">🌱</div>
  <div>
    <h4 class="blog-tip-title">Soil Moisture Tip</h4>
    <p class="blog-tip-text">Every 1% increase in soil organic carbon allows the soil to hold an extra 20,000 gallons of water per acre.</p>
  </div>
</div>

<h2 class="blog-section-heading">3. Minimizing Deep Tillage</h2>
<p>Frequent deep plowing disrupts earthworm tunnels and oxidizes fragile humus layers. Transitioning towards minimum tillage preserves natural fungal mycorrhizal networks.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=1200&auto=format&fit=crop&q=80',
    author: 'Dr. Ramesh Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    authorBio: 'Specialist in soil microbiology and sustainable land management with active research in bio-stimulants.',
    category: 'Soil Health',
    tags: ['Soil Health', 'Organic Farming', 'Composting', 'Regenerative Agriculture'],
    status: 'PUBLISHED',
    readingTime: '6 min read',
    views: 980,
    publishedAt: '2024-05-12T10:00:00.000Z',
    createdAt: '2024-05-12T09:30:00.000Z',
    updatedAt: '2024-05-12T10:00:00.000Z',
    metaTitle: 'Simple Ways to Improve Soil Health Naturally | AgriEra',
    metaDescription: 'Explore regenerative soil enrichment techniques, microbial inoculants, and cover cropping to rebuild topsoil vitality.',
  },
  {
    id: 'blog-3',
    title: 'Common Crop Pests and How to Control Them Biologically',
    slug: 'common-crop-pests-and-how-to-control-them-biologically',
    excerpt: 'Identify early symptoms of sucking pests, caterpillars, and fungal blights with proven biological controls and neem formulations.',
    content: `<p>Integrated Pest Management (IPM) provides an environmentally sound approach to suppressing pest populations below economic injury levels without destroying beneficial predator insects.</p>

<h2 class="blog-section-heading">1. Identifying Sucking Pests Early</h2>
<p>Aphids, whiteflies, and thrips cause leaf curling, sooty mold, and viral transmission. Early deployment of yellow and blue sticky traps provides both monitoring and mass capture.</p>

<h2 class="blog-section-heading">2. Neem-Based Azadirachtin Sprays</h2>
<p>Cold-pressed pure neem oil formulated at 10,000 PPM disrupts insect feeding, egg-laying, and molting cycles without harming honeybees or earthworms.</p>

<h2 class="blog-section-heading">3. Biological Parasitoids and Predators</h2>
<p>Introducing beneficial insects like Trichogramma wasps and Chrysoperla lacewings naturally eliminates stem borer eggs and soft-bodied pest nymphs.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80',
    author: 'Kavitha Nathan',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    authorBio: 'Plant pathologist focusing on eco-friendly botanical formulations and Integrated Pest Management.',
    category: 'Plant Protection',
    tags: ['Pest Control', 'Neem Oil', 'IPM', 'Bio Pesticides'],
    status: 'PUBLISHED',
    readingTime: '7 min read',
    views: 1150,
    publishedAt: '2024-05-10T10:00:00.000Z',
    createdAt: '2024-05-10T09:30:00.000Z',
    updatedAt: '2024-05-10T10:00:00.000Z',
    metaTitle: 'Common Crop Pests & Biological Control Guide | AgriEra',
    metaDescription: 'Complete guide to identifying agricultural pests and deploying botanical extracts and bio-fungicides.',
  },
  {
    id: 'blog-4',
    title: 'Smart Drip Irrigation & Water Efficiency for Commercial Crops',
    slug: 'smart-drip-irrigation-and-water-efficiency',
    excerpt: 'Save up to 45% water while delivering precise nutrient doses directly to root zones using pressure-compensating drip systems.',
    content: `<p>Water scarcity and rising power costs make precision irrigation vital for modern horticulture and plantation crops. Smart micro-drip networks eliminate surface runoff and deep percolation losses.</p>

<h2 class="blog-section-heading">1. Pressure Compensating (PC) Drippers</h2>
<p>PC drippers ensure uniform discharge across undulating topography, providing each plant with the exact volumetric quota regardless of pipe pressure fluctuations.</p>

<h2 class="blog-section-heading">2. Soil Tensiometers and Automated Scheduling</h2>
<p>Deploying digital soil moisture tensiometers prevents over-irrigation, root suffocation, and fungal damping-off by triggering pumps only when root suction levels reach preset thresholds.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1200&auto=format&fit=crop&q=80',
    author: 'Dr. Ramesh Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    authorBio: 'Agricultural engineering specialist in pressurized micro-irrigation and groundwater recharge.',
    category: 'Irrigation',
    tags: ['Irrigation', 'Water Management', 'Smart Farming', 'Drip Systems'],
    status: 'PUBLISHED',
    readingTime: '5 min read',
    views: 870,
    publishedAt: '2024-05-02T10:00:00.000Z',
    createdAt: '2024-05-02T09:30:00.000Z',
    updatedAt: '2024-05-02T10:00:00.000Z',
    metaTitle: 'Smart Drip Irrigation & Water Efficiency | AgriEra',
    metaDescription: 'Maximize water productivity with automated drip irrigation, soil moisture sensing, and root-zone fertigation.',
  },
  {
    id: 'blog-5',
    title: 'Practices and Economics of Sustainable Agriculture',
    slug: 'practices-and-economics-of-sustainable-agriculture',
    excerpt: 'How multi-cropping, organic certification, and input reduction yield premium farm gate prices and long-term financial security.',
    content: `<p>Sustainable agriculture is not merely an ecological goal; it is a financially viable commercial model. By reducing reliance on expensive synthetic inputs and earning organic market premiums, growers achieve higher net profitability.</p>

<h2 class="blog-section-heading">1. Multi-Tier Cropping Systems</h2>
<p>Intercropping short-duration legumes beneath fruit orchards or coconut plantations provides continuous cash flow and natural weed suppression.</p>

<h2 class="blog-section-heading">2. Direct-to-Consumer & Agri-FPO Marketing</h2>
<p>Forming Farmer Producer Organizations (FPOs) eliminates middleman margins and empowers farmers with collective bargaining for wholesale bulk inputs.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
    author: 'AgriEra Agri Expert',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    authorBio: 'Senior agronomist with 12+ years of on-field experience.',
    category: 'Farming Tips',
    tags: ['Sustainable Farming', 'Farming Tips', 'Agri Economics', 'FPO'],
    status: 'PUBLISHED',
    readingTime: '6 min read',
    views: 940,
    publishedAt: '2024-04-28T10:00:00.000Z',
    createdAt: '2024-04-28T09:30:00.000Z',
    updatedAt: '2024-04-28T10:00:00.000Z',
    metaTitle: 'Practices and Economics of Sustainable Agriculture | AgriEra',
    metaDescription: 'Explore actionable sustainable farming models that cut input costs and increase farm revenue.',
  },
];

// Helper to get local stored blogs
const getStoredBlogs = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BLOGS));
      return SEED_BLOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_BLOGS;
  } catch {
    return SEED_BLOGS;
  }
};

const saveStoredBlogs = (blogs: BlogPost[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  } catch (err) {
    console.error('Failed to persist blogs in localStorage', err);
  }
};

export const blogService = {
  /**
   * Fetch all blogs with filtering, searching, and pagination
   */
  async getBlogs(params?: BlogQueryParams): Promise<ApiResponse<{ blogs: BlogPost[]; total: number; page: number; totalPages: number }>> {
    try {
      const res: any = await apiClient.get('/blogs', { params });
      if (res?.data && Array.isArray(res.data.blogs)) {
        return res;
      }
    } catch {
      // Graceful fallback to client store
    }

    const all = getStoredBlogs();
    let filtered = [...all];

    // Filter status
    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter((b) => b.status === params.status);
    } else if (!params?.status) {
      // Default public view only shows published
      filtered = filtered.filter((b) => b.status === 'PUBLISHED');
    }

    // Filter category
    if (params?.category && params.category !== 'all') {
      const catNorm = params.category.toLowerCase().replace(/[-_]/g, ' ');
      filtered = filtered.filter((b) => b.category.toLowerCase().replace(/[-_]/g, ' ') === catNorm || b.category.toLowerCase().includes(catNorm));
    }

    // Filter tag
    if (params?.tag) {
      filtered = filtered.filter((b) => b.tags?.some((t) => t.toLowerCase() === params.tag?.toLowerCase()));
    }

    // Search query
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (params?.sortBy === 'popular') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (params?.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
    }

    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 100;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      data: {
        blogs: paginated,
        total,
        page,
        totalPages,
      },
    };
  },

  /**
   * Fetch a single blog by slug or ID
   */
  async getBlog(idOrSlug: string): Promise<ApiResponse<BlogPost>> {
    try {
      const res: any = await apiClient.get(`/blogs/${idOrSlug}`);
      if (res?.data && res.data.id) {
        return res;
      }
    } catch {
      // Graceful fallback to client store
    }

    const all = getStoredBlogs();
    const cleanParam = idOrSlug.toLowerCase().trim();
    const found = all.find(
      (b) => b.id.toLowerCase() === cleanParam || b.slug.toLowerCase() === cleanParam
    );

    if (found) {
      // Increment views count locally
      found.views = (found.views || 0) + 1;
      saveStoredBlogs(all);

      return {
        success: true,
        data: found,
      };
    }

    throw new Error('Blog article not found');
  },

  /**
   * Fetch related blogs matching current article's category or tags
   */
  async getRelatedBlogs(idOrSlug: string, category?: string, limit = 3): Promise<ApiResponse<BlogPost[]>> {
    try {
      const res: any = await apiClient.get(`/blogs/${idOrSlug}/related`, { params: { limit } });
      if (res?.data && Array.isArray(res.data)) {
        return res;
      }
    } catch {
      // Fallback
    }

    const all = getStoredBlogs().filter((b) => b.status === 'PUBLISHED');
    const filtered = all.filter(
      (b) => b.id !== idOrSlug && b.slug !== idOrSlug && (!category || b.category.toLowerCase() === category.toLowerCase())
    );

    const related = filtered.slice(0, limit);
    // If not enough in category, fill with other published articles
    if (related.length < limit) {
      const remaining = all.filter((b) => b.id !== idOrSlug && b.slug !== idOrSlug && !related.some((r) => r.id === b.id));
      related.push(...remaining.slice(0, limit - related.length));
    }

    return {
      success: true,
      data: related,
    };
  },

  /**
   * Fetch category list with live blog counts
   */
  async getCategories(): Promise<ApiResponse<BlogCategory[]>> {
    const all = getStoredBlogs().filter((b) => b.status === 'PUBLISHED');
    const countMap: Record<string, { name: string; count: number }> = {};

    all.forEach((b) => {
      const cat = b.category || 'General';
      const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!countMap[slug]) {
        countMap[slug] = { name: cat, count: 0 };
      }
      countMap[slug].count += 1;
    });

    const list: BlogCategory[] = [
      { slug: 'all', name: 'All Categories', count: all.length },
      ...Object.entries(countMap).map(([slug, data]) => ({
        slug,
        name: data.name,
        count: data.count,
      })),
    ];

    return {
      success: true,
      data: list,
    };
  },

  /**
   * Create a new blog post
   */
  async createBlog(data: CreateBlogInput): Promise<ApiResponse<BlogPost>> {
    const now = new Date().toISOString();
    const slug =
      data.slug?.trim() ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newBlog: BlogPost = {
      id: 'blog-' + Date.now(),
      title: data.title,
      slug,
      excerpt: data.excerpt || data.content.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...',
      content: data.content,
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80',
      author: data.author || 'AgriEra Agri Expert',
      authorAvatar: data.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      authorBio: data.authorBio || 'Agricultural specialist at AgriEra.',
      category: data.category || 'General',
      tags: data.tags || ['Agriculture', 'Farming'],
      status: data.status || 'PUBLISHED',
      readingTime: data.readingTime || `${Math.max(1, Math.ceil(data.content.split(' ').length / 180))} min read`,
      views: 0,
      publishedAt: data.status === 'PUBLISHED' ? now : '',
      createdAt: now,
      updatedAt: now,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt,
    };

    try {
      const res = await apiClient.post<ApiResponse<BlogPost>>('/blogs', newBlog);
      if (res?.data) {
        return (res.data as any).data ? res.data : { success: true, data: (res.data as any) };
      }
    } catch {
      // Local fallback
    }

    const all = getStoredBlogs();
    const updated = [newBlog, ...all];
    saveStoredBlogs(updated);

    return {
      success: true,
      data: newBlog,
    };
  },

  /**
   * Update an existing blog post
   */
  async updateBlog(id: string, data: UpdateBlogInput): Promise<ApiResponse<BlogPost>> {
    try {
      const res = await apiClient.put<ApiResponse<BlogPost>>(`/blogs/${id}`, data);
      if (res?.data) {
        return (res.data as any).data ? res.data : { success: true, data: (res.data as any) };
      }
    } catch {
      // Local fallback
    }

    const all = getStoredBlogs();
    const idx = all.findIndex((b) => b.id === id || b.slug === id);
    if (idx === -1) {
      throw new Error('Blog not found');
    }

    const existing = all[idx];
    const now = new Date().toISOString();

    const updatedBlog: BlogPost = {
      ...existing,
      ...data,
      slug: data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : existing.slug),
      updatedAt: now,
      publishedAt: data.status === 'PUBLISHED' && !existing.publishedAt ? now : existing.publishedAt,
    };

    all[idx] = updatedBlog;
    saveStoredBlogs(all);

    return {
      success: true,
      data: updatedBlog,
    };
  },

  /**
   * Delete a blog post
   */
  async deleteBlog(id: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(`/blogs/${id}`);
    } catch {
      // Local fallback
    }

    const all = getStoredBlogs();
    const filtered = all.filter((b) => b.id !== id && b.slug !== id);
    saveStoredBlogs(filtered);

    return {
      success: true,
      data: null,
    };
  },

  /**
   * Toggle Publish / Draft status
   */
  async toggleBlogStatus(id: string, status: BlogStatus): Promise<ApiResponse<BlogPost>> {
    return this.updateBlog(id, { status });
  },
};
