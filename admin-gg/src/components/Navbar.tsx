'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, User, Search, Heart, X } from 'lucide-react';
import { Cart } from './Cart';

import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-outfit',
});

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className={`
      z-50 w-full bg-white shadow-sm
      ${outfit.variable} font-sans
    `}>
      <div className="bg-[#f7941d] text-white py-2 text-center text-sm font-[family-name:var(--font-outfit)] tracking-wide">
        Free Shipping on Orders Over $50!
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="GiggleGlory" width={160} height={50} className="w-36 md:w-44" />
        </Link>

        <nav className="text-xs hidden md:flex items-center space-x-8">
          <NavLink href="/toys" color="hover:text-[#f7941d]">Toys & Games</NavLink>
          <NavLink href="/sports" color="hover:text-[#00d3d5]">Sports</NavLink>
          <NavLink href="/stationery" color="hover:text-[#ec008c]">Stationery</NavLink>
          <NavLink href="/books" color="hover:text-[#f7941d]">Books</NavLink>
        </nav>

        <div className="flex items-center space-x-5 text-gray-600">
          <button className="hover:text-[#f7941d] transition" onClick={() => setIsSearchOpen(!isSearchOpen)}><Search size={22} /></button>
          <Link href="/login"><button className="hover:text-[#00d3d5] transition"><User size={22} /></button></Link>
          <Link href="/wishlist"><button className="hover:text-[#ec008c] transition"><Heart size={22} /></button></Link>
          
          <div className="relative group">
            <button onClick={() => setIsCartOpen(true)} className="hover:text-[#00d3d5] transition flex items-center gap-2">
              <div className="relative">
                <ShoppingBag size={22} />
                <span className="absolute -top-2 -right-2 bg-[#ec008c] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">2</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-start justify-center pt-24 transition-all">
          <div className="flex items-center mb-4 gap-6 text-gray-500 font-[family-name:var(--font-outfit)] bg-white w-full max-w-3xl mx-4 rounded-xl shadow-lg relative p-6 animate-slide-down">
            <input
              type="text"
              autoFocus
              placeholder="Search for products..."
              className="w-full px-4 py-3 border border-[#f7941d] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] text-lg"
            />
            <button
              className="w-10 h-10 rounded-full bg-[#f7941d] text-white font-bold hover:bg-white hover:text-[#f7941d] hover:border transition flex items-center justify-center"
              onClick={() => setIsSearchOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

function NavLink({ href, children, color }: { href: string; children: React.ReactNode; color: string }) {
  return (
    <Link 
      href={href} 
      className={`font-[family-name:var(--font-outfit)] text-xl font-weight:400 text-gray-700 transition-colors duration-200 ${color}`}
    >
      {children}
    </Link>
  );
}
