'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { SafeListing, SafeUser, safeReservation } from "../types";
import Heading from "../components/Heading";
import Container from "../components/Container";
import ListingCard from "../components/listings/ListingCard";

interface DashboardClientProps {
  listings: SafeListing[];
  currentUser: SafeUser | null;
  reservations: safeReservation[];
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  listings,
  currentUser,
  reservations
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
      .catch((error) => {
        toast.error(error?.response?.data?.error || 'Something went wrong!');
      });
  }, [router]);

  const onCancelReservation = useCallback((reservationId: string) => {
    axios.delete(`/api/reservations/${reservationId}`)
      .then(() => {
        toast.success('Захиалга цуцлагдлаа');
        router.refresh();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || 'Something went wrong!');
      });
  }, [router]);

  const ownedListings = listings.filter(
    (listing) => listing.userId === currentUser?.id && !reservations.some(res => res.listingId === listing.id)
  );

  const reservedListings = listings.filter(
    (listing) => listing.userId === currentUser?.id && reservations.some(res => res.listingId === listing.id)
  );

  const myOrders = reservations.filter(
    (reservation) => reservation.userId === currentUser?.id
  );

  // Format price in MNT
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
    }).format(price);
  };

  return (
    <Container>

      {/* Миний хөрөнгүүд Table */}
      <div className="mt-10">
        <Heading
          title="Миний хөрөнгүүд"
          subtitle="Таны зар оруулсан хөрөнгүүд"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left border-b">Хөрөнгийн нэр</th>
                <th className="px-4 py-2 text-left border-b">Үнэ</th>
                <th className="px-4 py-2 text-left border-b">Байршил</th>
                <th className="px-4 py-2 text-left border-b">Категори</th>
                <th className="px-4 py-2 text-left border-b">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {ownedListings.map((listing) => (
                <tr
                  key={listing.id}
                  onClick={() => handlePropertyClick(listing.id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="px-4 py-2 border-b">{listing.id}</td>
                  <td className="px-4 py-2 border-b">{formatPrice(listing.price)}</td>
                  <td className="px-4 py-2 border-b">{listing.locationValue}</td>
                  <td className="px-4 py-2 border-b">{listing.category}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => onCancel(listing.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Устгах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Захиалагдсан хөрөнгүүд Table */}
      <div className="mt-10">
        <Heading
          title="Захиалагдсан хөрөнгүүд"
          subtitle="Таны захиалагдсан хөрөнгө"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left border-b">Хөрөнгийн нэр</th>
                <th className="px-4 py-2 text-left border-b">Үнэ</th>
                <th className="px-4 py-2 text-left border-b">Байршил</th>
                <th className="px-4 py-2 text-left border-b">Категори</th>
                <th className="px-4 py-2 text-left border-b">Захиалсан огноо</th>
                <th className="px-4 py-2 text-left border-b">Дуусах огноо</th>
                <th className="px-4 py-2 text-left border-b">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {reservedListings.map((listing) => {
                const reservation = reservations.find((res) => res.listingId === listing.id);
                return (
                    <tr key={listing.id} onClick={() => handlePropertyClick(listing.id)} className="cursor-pointer hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{listing.id}</td>
                    <td className="px-4 py-2 border-b">{formatPrice(listing.price)}</td>
                    <td className="px-4 py-2 border-b">{listing.locationValue}</td>
                    <td className="px-4 py-2 border-b">{listing.category}</td>
                    <td className="px-4 py-2 border-b">{reservation?.startDate || '-'}</td>
                    <td className="px-4 py-2 border-b">{reservation?.endDate || '-'}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => {
                          if (reservation?.id) {
                            onCancelReservation(reservation.id);
                          }
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Захиалга цуцлах
                      </button>
                    </td>
                  </tr>                  
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Миний захиалга Table */}
      <div className="mt-10">
        <Heading
          title="Миний захиалга"
          subtitle="Таны хийсэн захиалга"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left border-b">Захиалгын ID</th>
                <th className="px-4 py-2 text-left border-b">Хөрөнгийн нэр</th>
                <th className="px-4 py-2 text-left border-b">Үнэ</th>
                <th className="px-4 py-2 text-left border-b">Захиалсан огноо</th>
                <th className="px-4 py-2 text-left border-b">Дуусах огноо</th>
                <th className="px-4 py-2 text-left border-b">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((reservation) => {
                const listing = listings.find((listing) => listing.id === reservation.listingId);
                return (
                  <tr key={reservation.id} className="cursor-pointer hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{reservation.id}</td>
                    <td className="px-4 py-2 border-b">{listing?.id}</td>
                    <td className="px-4 py-2 border-b">{formatPrice(listing?.price || 0)}</td>
                    <td className="px-4 py-2 border-b">{reservation.startDate}</td>
                    <td className="px-4 py-2 border-b">{reservation.endDate}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => onCancelReservation(reservation.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Захиалга цуцлах
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default DashboardClient;
