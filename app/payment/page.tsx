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
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  const reservationId = searchParams?.get('reservationId') || '';
  const amountParam = searchParams?.get('amount') || '0';

  const [form, setForm] = useState({
    userId: '67d7c458a09d8afc6782fb64',
    reservationId,
    amount: amountParam,
    currency: 'MNT',
    paymentMethod: '',
    transactionId: '',
    bank: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [doorCode, setDoorCode] = useState<string | null>(null);

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

  function generate4DigitCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error("Та эхлээд нөхцөлийг зөвшөөрнө үү.");
      return;
    }

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
      toast.success('Амжилттай төлөгдлөө!');
      const code = generate4DigitCode();
      setDoorCode(code);
      setPaymentSuccess(true);  // Set success flag
    } else {
      const data = await response.json();
      toast.error(data.error || 'Алдаа гарлаа');
    }


    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Төлбөрийн мэдээлэл</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="hidden" name="userId" value={form.userId} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Захиалгын дугаар</label>
            <input
              type="text"
              name="reservationId"
              value={form.reservationId}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 text-sm rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дүн (₮)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 text-sm rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Төлбөрийн төрөл</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 text-sm rounded-lg px-4 py-3"
            >
              <option value="" disabled>Сонгох</option>
              <option value="card">Карт (Visa)</option>
              <option value="transaction">Гүйлгээ (банк)</option>
            </select>
          </div>

          {form.paymentMethod === 'card' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Картын дугаар</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  maxLength={16}
                  placeholder="XXXX XXXX XXXX XXXX"
                  required
                  className="w-full border border-gray-300 text-sm rounded-lg px-4 py-3"
                />
              </div>
              <div className="flex space-x-3">
                <input
                  type="text"
                  name="cardExpiry"
                  value={form.cardExpiry}
                  onChange={handleChange}
                  maxLength={5}
                  placeholder="MM/YY"
                  required
                  className="w-1/2 border border-gray-300 text-sm rounded-lg px-4 py-3"
                />
                <input
                  type="text"
                  name="cardCvc"
                  value={form.cardCvc}
                  onChange={handleChange}
                  maxLength={3}
                  placeholder="CVC"
                  required
                  className="w-1/2 border border-gray-300 text-sm rounded-lg px-4 py-3"
                />
              </div>
            </>
          )}

          {form.paymentMethod === 'transaction' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Банк сонгох</label>
                <select
                  name="bank"
                  value={form.bank}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 text-sm rounded-lg px-4 py-3"
                >
                  <option value="" disabled>Сонгоно уу</option>
                  <option value="khanbank">Хаан банк</option>
                  <option value="golomt">Голомт банк</option>
                  <option value="state">Төрийн банк</option>
                  <option value="tdb">Худалдаа хөгжил банк</option>
                  <option value="mbank">М банк</option>
                  <option value="khas">Хас банк</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Гүйлгээний дугаар</label>
                <input
                  type="text"
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  maxLength={12}
                  required
                  className="w-full border border-gray-300 text-sm rounded-lg px-4 py-3"
                />
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              Би нөхцөлүүдийг зөвшөөрч байна
            </label>
          </div>

         <button
            type="submit"
            disabled={isLoading || !agreedToTerms}
            onClick={paymentSuccess ? () => router.push('/trips') : undefined}
            className={`w-full ${
              paymentSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white font-semibold rounded-lg py-3 text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isLoading || !agreedToTerms ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {paymentSuccess ? 'Үргэлжлүүлэх' : 'Төлбөр төлөх'}
          </button>

        </form>

        {doorCode && (
          <div className="mt-6 text-center bg-green-100 text-green-800 font-semibold py-3 px-4 rounded-lg">
            Танай хаалганы код: <span className="text-xl">{doorCode}</span>
          </div>
        )}
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 max-w-lg shadow-xl text-sm max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Үйлчилгээний нөхцөл</h2>
            <p className="mb-2 text-gray-700">
              Та энэхүү төлбөрийг гүйцэтгэснээр үйлчилгээний нөхцөлийг зөвшөөрч буйд тооцогдоно. Хэрэглэгчийн мэдээлэл, буцаалт болон гомдлын тухай бодлогыг сайтар уншина уу.
            </p>
            <p className="mb-2 text-gray-700 font-semibold">⚠️ Төлбөр буцаагдахгүй:</p>
            <p className="mb-2 text-gray-700">
              Төлбөрийг хийсний дараа ямар ч нөхцөлд буцаалт хийх боломжгүй. Иймд төлбөр хийхээс өмнө бүх мэдээллийг нягтлан шалгана уу.
            </p>
            <p className="mb-2 text-gray-700 font-semibold">📜 Монгол Улсын Түрээсийн хууль:</p>
            <p className="mb-4 text-gray-700">
              Түрээсийн гэрээ нь Иргэний хуулийн 281-296-р зүйлүүдэд заасан журмын дагуу хэрэгжинэ. Түрээслэгч нь ашиглалтын хугацаанд эд хөрөнгийг зөв зохистой ашиглах, түрээсийн төлбөрөө хугацаанд нь төлөх үүрэгтэй. Түрээслүүлэгч нь өмчлөлийн эрх, баталгаат ашиглалтын нөхцөлийг хангасан байх шаардлагатай.
            </p>
            <p className="mb-4 text-gray-700">
              Үйлчилгээ ашигласнаар та дээрх нөхцөл болон хууль, журамд нийцсэн гэрээний үндсэн дээр хариуцлага хүлээхийг зөвшөөрч байна.
            </p>
            <p className="mb-4 text-gray-700">
              Уг үйлчилгээнээс үйлдэлтэй бусад тулгарч болох асуудалд хариуцлага хүлээхгүй!!!.
            </p>
            <div className="text-right">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Зөвшөөрөх
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
