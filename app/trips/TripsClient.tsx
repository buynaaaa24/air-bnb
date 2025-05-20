"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { safeReservation, SafeUser } from "../types";

interface TripsClientProps {
  reservations: safeReservation[];
  currentUser: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/reservations/${id}`)
      .then(() => {
        toast.success('Захиалга цуцлагдлаа');
        router.refresh();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || 'Алдаа гарлаа');
      })
      .finally(() => {
        setDeletingId('');
      });
  }, [router]);

  function onPay(reservationId: string, amount: number) {
    router.push(`/payment?reservationId=${reservationId}&amount=${amount}`);
  }

  return (
    <Container>
      <div className="mt-10">
        <Heading
          title="Миний захиалгууд"
          subtitle="Та өөрийн захиалсан хөрөнгүүдийг эндээс харна"
        />

        {reservations.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            Та одоогоор ямар нэгэн захиалга хийгээгүй байна.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {reservations.map((reservation) => (
              <div key={reservation.id}>
                <ListingCard
                  data={reservation.listing}
                  reservation={reservation}
                  actionId={reservation.id}
                  onAction={onCancel}
                  disabled={deletingId === reservation.id}
                  actionLabel="Захиалга цуцлах"
                  currentUser={currentUser}
                />
                
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default TripsClient;
