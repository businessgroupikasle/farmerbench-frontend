import React, { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { getUploadUrl } from '../../utils/image';
import organicFarmingImage from '../../assets/categories/organic-farming.png';
import chemicalImage from '../../assets/categories/chemical.png';
import trapsImage from '../../assets/categories/traps.jpg';
import seedlingsImage from '../../assets/categories/seedlings.png';
import seedsImage from '../../assets/categories/seeds.png';
import farmEquipmentImage from '../../assets/categories/farm-equipment.png';

const FALLBACK_IMAGE = organicFarmingImage;

const CATEGORY_IMAGES: Record<string, string> = {
  'organic-farming': organicFarmingImage,
  chemical: chemicalImage,
  traps: trapsImage,
  seedlings: seedlingsImage,
  seeds: seedsImage,
  'farm-equipment': farmEquipmentImage,
};

export const HomeCategories: React.FC = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: productResponse, isLoading: productsLoading } = useProducts({ limit: 100 });
  const products = productResponse?.data || [];

  const hotCategories = useMemo(() => categories
    .filter((category) => category.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((category) => {
      const localImage = CATEGORY_IMAGES[category.slug.toLowerCase()];
      const representative = products.find((product) => product.categoryId === category.id);
      return {
        ...category,
        localImage,
        displayImage: localImage || category.imageUrl || representative?.images?.[0] || FALLBACK_IMAGE,
      };
    }), [categories, products]);

  const scroll = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * 580, behavior: 'smooth' });
  };

  if (categoriesLoading || productsLoading || hotCategories.length === 0) return null;

  return (
    <section className="home-hot-categories" id="categories" aria-labelledby="hot-categories-title">
      <div className="home-hot-categories-heading">
        <h2 id="hot-categories-title">Shop by Categories</h2>
        <span aria-hidden="true" />
      </div>

      <div className="home-hot-categories-carousel">
        <button type="button" className="home-hot-category-arrow home-hot-category-arrow--left" onClick={() => scroll(-1)} aria-label="Previous categories">
          <ChevronLeft size={23} />
        </button>

        <div className="home-hot-categories-rail" ref={railRef}>
          {hotCategories.map((category) => (
            <Link key={category.id} to={`/products?category=${category.slug}`} className="home-hot-category-card">
              <div className="home-hot-category-image">
                <img
                  src={category.localImage || getUploadUrl(category.displayImage, FALLBACK_IMAGE)}
                  alt={category.name}
                  loading="lazy"
                  onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }}
                />
              </div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>

        <button type="button" className="home-hot-category-arrow home-hot-category-arrow--right" onClick={() => scroll(1)} aria-label="Next categories">
          <ChevronRight size={23} />
        </button>
      </div>
    </section>
  );
};

export default HomeCategories;