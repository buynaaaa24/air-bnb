'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const PriceRange = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const onSubmit = () => {
    if (!params) return;

    const current = new URLSearchParams(params.toString());

    if (minPrice) {
      current.set('minPrice', minPrice);
    } else {
      current.delete('minPrice');
    }
    if (maxPrice) {
      current.set('maxPrice', maxPrice);
    } else {
      current.delete('maxPrice');
    }

    const url = `?${current.toString()}`;
    router.push(url);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-5"
    >
      <input
        type="number"
        placeholder="Мин үнэ"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
        className="w-full sm:w-36 border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
        min="0"
      />
      <input
        type="number"
        placeholder="Макс үнэ"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
        className="w-full sm:w-36 border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
        min="0"
      />
      <button
        type="submit"
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-5 py-2 transition-colors"
      >
        Шүүх
      </button>
    </form>
  );
};

export default PriceRange;
