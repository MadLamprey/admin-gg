'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-outfit',
});

export function Footer() {
  return (
    <footer className={`
      relative mt-20 pt-20 pb-10 
      bg-gray-100 text-gray-700
      ${outfit.className}
    `}>
      
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[60px] w-full fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">

        <div className="md:col-span-2 lg:col-span-1 flex flex-col items-start">
          <Image 
            src="/logo.png" 
            alt="GiggleGlory" 
            width={160} 
            height={60} 
            className="mb-4"
          />
          <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">
            Your one-stop shop for Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          
          <div className="flex space-x-3">
             <SocialIcon icon={<Twitter size={18} />} color="hover:text-[#00d3d5]" />
             <SocialIcon icon={<Facebook size={18} />} color="hover:text-[#3b5998]" />
             <SocialIcon icon={<Instagram size={18} />} color="hover:text-[#ec008c]" />
             <SocialIcon icon={<Youtube size={18} />} color="hover:text-[#ff0000]" />
          </div>
        </div>

        <div>
          <h4 className="font-bold text-[#00d3d5] text-xl mb-5">Your Order</h4>
          <ul className="space-y-2 font-sm">
            <FooterLink href="#" color="text-[#00d3d5]">Track Order</FooterLink>
            <FooterLink href="#" color="text-[#00d3d5]">Shipping Info</FooterLink>
            <FooterLink href="#" color="text-[#00d3d5]">Returns</FooterLink>
            <FooterLink href="#" color="text-[#00d3d5]">Cancellations</FooterLink>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xl text-[#f7941d] mb-5">Company</h4>
          <ul className="space-y-2 font-sm">
            <FooterLink href="#" color="text-[#f7941d]">About Us</FooterLink>
            <FooterLink href="#" color="text-[#f7941d]">Contact</FooterLink>
            <FooterLink href="#" color="text-[#f7941d]">Careers</FooterLink>
            <FooterLink href="#" color="text-[#f7941d]">Store Locator</FooterLink>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xl text-[#ec008c] mb-5">Legal</h4>
          <ul className="space-y-2 font-sm">
            <FooterLink href="#" color="text-[#ec008c]">Privacy Policy</FooterLink>
            <FooterLink href="#" color="text-[#ec008c]">Terms of Service</FooterLink>
            <FooterLink href="#" color="text-[#ec008c]">Cookie Policy</FooterLink>
            <FooterLink href="#" color="text-[#ec008c]">Disclaimer</FooterLink>
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <div className="bg-[#fff0f6] p-6 rounded-[20px] shadow-sm">
            <h4 className="font-black text-lg text-[#ec008c] mb-2">Join the Fun!</h4>
            <p className="text-xs text-gray-600 mb-4 font-medium">
              Sign up sign up for something
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-4 pr-12 py-3 rounded-xl border-none text-sm font-bold text-gray-800 shadow-sm focus:ring-2 focus:ring-[#ec008c] outline-none"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ec008c] text-white p-2 rounded-lg hover:bg-[#d60080] transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-200 pt-8 text-center">
        <p className="text-xs font-bold text-gray-400">
          © 2025 GiggleGlory.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, color }: { href: string; children: React.ReactNode; color: string }) {
  return (
    <li>
      <Link href={href} className={`text-gray-500 hover:pl-2 transition-all duration-300 hover:${color}`}>
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, color }: { icon: React.ReactNode; color: string }) {
  return (
    <a href="#" className={`
      w-10 h-10 flex items-center justify-center 
      bg-white rounded-full shadow-sm text-gray-400
      transition-all duration-300 hover:-translate-y-1 hover:shadow-md
      ${color}
    `}>
      {icon}
    </a>
  );
}
