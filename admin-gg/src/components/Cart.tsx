'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight 
} from 'lucide-react';

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

const MOCK_CART_ITEMS: CartItem[] = [
  { id: 1, name: "Wooden Stacking Ring", price: 24.00, image: "/prod-1.jpg", quantity: 1 },
  { id: 2, name: "Plush Elephant", price: 35.00, image: "/prod-2.jpg", quantity: 2 },
]

export function Cart({ isOpen, onClose }: CartProps) {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART_ITEMS);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) setIsAnimating(true);
    else setTimeout(() => setIsAnimating(false), 300);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => (
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    )));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div className={`relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#f0fcff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ec008c] rounded-full flex items-center justify-center text-white shadow-sm">
              <ShoppingBag size={20} />
            </div>
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl text-[#1a1a2e]">
              Your Cart <span className="text-[#00d3d5] text-lg font-sans font-bold">({items.length})</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors border border-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length > 0 ? (
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 border border-gray-100 flex items-center justify-center text-gray-300 text-2xl font-bold opacity-30">
                    ?
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-[family-name:var(--font-outfit)] font-bold text-gray-800 line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 p-1 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="font-[family-name:var(--font-outfit)] font-bold text-[#ec008c] mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 h-8">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#ec008c]"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-gray-700">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#ec008c]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-[#fff0fd] rounded-full flex items-center justify-center animate-bounce">
                <ShoppingBag size={40} className="text-[#ec008c]" />
              </div>
              <h3 className="font-[family-name:var(--font-rampart)] text-2xl text-[#1a1a2e]">Your cart is empty</h3>
              <p className="text-gray-500">Looks like you haven't added anything yet!</p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#00d3d5] hover:bg-[#00b5b7] text-white rounded-full font-bold shadow-lg transition"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 font-[family-name:var(--font-outfit)]">
            <div className="flex justify-between mb-4">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-[#1a1a2e]">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 text-center mb-4">Shipping & taxes calculated at checkout</p>
            <button className="w-full py-4 bg-[#ec008c] hover:bg-[#d60080] text-white rounded-full font-bold text-lg shadow-lg transition flex items-center justify-center gap-2 group">
              Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
