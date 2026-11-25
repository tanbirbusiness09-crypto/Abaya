import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useId } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useLocale } from '../../context/LocaleContext';
import type { Product } from '../../data/products';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const { isRtl } = useLocale();
  const uid = useId().replace(/:/g, '');
  const prevClass = `swiper-prev-${uid}`;
  const nextClass = `swiper-next-${uid}`;

  return (
    <div className="relative">
      <Swiper
        key={isRtl ? 'rtl' : 'ltr'}
        dir={isRtl ? 'rtl' : 'ltr'}
        modules={[Navigation]}
        navigation={{
          prevEl: `.${prevClass}`,
          nextEl: `.${nextClass}`,
        }}
        spaceBetween={10}
        slidesPerView={2.08}
        breakpoints={{
          480: { slidesPerView: 2.35, spaceBetween: 12 },
          640: { slidesPerView: 3.2, spaceBetween: 14 },
          1024: { slidesPerView: 5, spaceBetween: 16 },
          1280: { slidesPerView: 6, spaceBetween: 16 },
        }}
        className="!py-1"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="!h-auto">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        aria-label="Previous products"
        className={`${prevClass} hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#EAE5DF] shadow-md text-[#202020] hover:bg-[#581C32] hover:text-white hover:border-[#581C32] transition-colors absolute top-[38%] -start-3 z-10 disabled:opacity-0`}
      >
        {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
      <button
        type="button"
        aria-label="Next products"
        className={`${nextClass} hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#EAE5DF] shadow-md text-[#202020] hover:bg-[#581C32] hover:text-white hover:border-[#581C32] transition-colors absolute top-[38%] -end-3 z-10 disabled:opacity-0`}
      >
        {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
