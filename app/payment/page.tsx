'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { safeReservation, SafeUser } from "../types";
import toast, { Toaster } from 'react-hot-toast';

interface PaymentPageProps {
  currentUser: SafeUser | null;
}

export default function PaymentPage({ currentUser }: PaymentPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reservationId = searchParams?.get('reservationId') || '';
  const amountParam = searchParams?.get('amount') || '0';

const [form, setForm] = useState({
  userId: '67d7c458a09d8afc6782fb64',  // Hardcoded user ID here
  reservationId,
  amount: amountParam,
  currency: 'MNT',
  paymentMethod: '',
  transactionId: '',
  bank: '',
});

// You can remove the useEffect that sets userId from currentUser since it's hardcoded now


  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      setForm((prev) => ({
        ...prev,
        userId: currentUser.id,
        reservationId,
        amount: amountParam,
      }));
    }
  }, [currentUser, reservationId, amountParam]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    const payload = {
      ...form,
      amount: Number(form.amount),
      status: 'completed',
    };

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success('Амжилттай захиалагдлаа');

      setForm((prev) => ({
        ...prev,
        paymentMethod: '',
        transactionId: '',
        bank: '',
      }));

      setTimeout(() => {
        router.push('/trips');
      }, 1500);
    } else {
      const data = await response.json();
      toast.error(data.error || 'Алдаа гарлаа');
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Төлбөр төлөх</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">User ID</label>
            <input
              type="text"
              name="userId"
              value={form.userId}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Reservation ID</label>
            <input
              type="text"
              name="reservationId"
              value={form.reservationId}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Currency</label>
            <input
              type="text"
              name="currency"
              value={form.currency}
              disabled
              className="w-full bg-gray-100 cursor-not-allowed border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transaction">Transaction</option>
            </select>
          </div>

          {form.paymentMethod === 'transaction' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Select Bank</label>
                <select
                  name="bank"
                  value={form.bank}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select bank</option>
                  <option value="khanbank">Khan Bank</option>
                  <option value="golomt">Golomt Bank</option>
                  <option value="state">State Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 bg-blue-600 text-white text-lg font-semibold py-3 rounded-md hover:bg-blue-700 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Захиалга үүсгэх
          </button>
        </form>
      </div>
    </div>
  );
}
