'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { SafeListing, SafeUser } from "../types";
import Heading from "../components/Heading";
import Container from "../components/Container";

interface DashboardClientProps {
  listings: SafeListing[];
  currentUser: SafeUser | null;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();

  const handlePropertyClick = (id: string) => {
    router.push(`/listings/${id}`);
  };

  const onCancel = useCallback((id: string) => {
    axios.delete(`/api/listings/${id}`)
      .then(() => {
        toast.success('Өмч устгагдлаа');
        router.refresh();
      })
      .catch(() => {
        toast.error('Алдаа гарлаа');
      });
  }, [router]);

  const ownedListings = listings.filter(
    (listing) => listing.userId === currentUser?.id
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
    }).format(price);
  };

  return (
    <Container>
      <div className="mt-12 pt-5">
        <Heading
          title="Миний хөрөнгүүд"
          subtitle="Та өөрийн оруулсан үл хөдлөх хөрөнгүүдээ эндээс удирдана"
        />
        {ownedListings.length === 0 ? (
          <p className="mt-6 text-center text-gray-500">Таны оруулсан үл хөдлөх хөрөнгө олдсонгүй.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ownedListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => handlePropertyClick(listing.id)}
                className="bg-white shadow-lg border border-gray-300 rounded-xl p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">{listing.locationValue}</h3>
                  <p className="text-md text-gray-600 capitalize">{listing.category}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-800">{formatPrice(listing.price)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel(listing.id);
                    }}
                    className="text-sm bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
                    aria-label={`Устгах ${listing.locationValue} хөрөнгийг`}
                  >
                    Устгах
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default DashboardClient;
