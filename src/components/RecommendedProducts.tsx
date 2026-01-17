"use client"

import { useState } from "react"
import { 
  ShoppingBag, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star
} from "lucide-react"

const NavButton = ({ onClick, disabled, icon }: { onClick: () => void; disabled: boolean; icon: React.ReactNode }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm
      flex items-center justify-center text-gray-600
      hover:bg-[#ec008c] hover:text-white hover:border-[#ec008c]
      transition-all duration-300
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600
    `}
  >
    {icon}
  </button>
)

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  tag?: string | null;
  tagColor?: string;
}

export function RecommendedProducts({ products }: { products: Product[] }) {
  const [start, setStart] = useState(0);
  const visibleCount = 4;

  const showPrev = () => {
    if (start > 0) setStart(start - 1);
  };

  const showNext = () => {
    if (start + visibleCount < products.length) setStart(start + 1);
  };

  const visibleProducts = products.slice(start, start + visibleCount);

  return (
    <section className="py-20 bg-white rounded-t-[60px] relative overflow-hidden font-[family-name:var(--font-outfit)]">
      
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-8">
          <span className="font-[family-name:var(--font-patrick)] text-[#ec008c] text-2xl">
            Our Products
          </span>
          <h2 className="font-[family-name:var(--font-outfit)] text-5xl text-[#1a1a2e] mt-2">
            Best Selling
          </h2>
        </div>

        <div className="flex justify-end items-center gap-4 mb-6">
          <div className="flex gap-2">
            <NavButton onClick={showPrev} disabled={start === 0} icon={<ChevronLeft size={20} />} />
            <NavButton onClick={showNext} disabled={start + visibleCount >= products.length} icon={<ChevronRight size={20} />} />
          </div>
          {/* Optional: View All Link */}
          <button className="hidden md:flex items-center gap-2 font-bold text-gray-600 hover:text-[#ec008c] transition-colors ml-2">
            View All <ArrowRight size={20} />
          </button>
        </div>

        {/* 3. PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 relative border border-gray-100 h-full flex flex-col">
              
              {/* Tag */}
              {product.tag && (
                <span className={`absolute top-6 left-6 z-10 text-white text-xs font-bold px-3 py-1 rounded-full ${product.tagColor}`}>
                  {product.tag}
                </span>
              )}
              
              {/* Wishlist Button */}
              <button className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all">
                <Heart size={16} />
              </button>

              {/* Image Area */}
              <div className="relative aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden group-hover:bg-gray-100 transition-colors">
                 {/* <Image src={product.image} alt={product.name} fill className="object-cover" /> */}
                 <div className="w-full h-full flex items-center justify-center text-gray-300 font-[family-name:var(--font-rampart)] text-6xl opacity-30">?</div>
              </div>

              {/* Details */}
              <div className="mt-auto">
                <div className="flex text-yellow-400 mb-2 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-[#ec008c] transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xl text-[#1a1a2e]">
                    {product.price}
                  </span>
                  <button className="w-10 h-10 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center group-hover:bg-[#ec008c] transition-colors shadow-lg">
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
