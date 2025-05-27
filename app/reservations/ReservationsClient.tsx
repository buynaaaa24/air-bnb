'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

import { safeReservation, SafeUser } from "../types";

import Heading from "../components/Heading";
import Container from "../components/Container";
import ListingCard from "../components/listings/ListingCard";

interface ReservationsClientProps {
    reservations: safeReservation[];
    currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser
}) => {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState('');

    const onSeeMore = (id: string) => {
        setLoadingId(id);
        router.push('/dashboard'); 
    };

    return (
        <Container>
            <div className="p-8">
                <Heading
                    title="Захиалгууд"
                    subtitle="Таны захиалагдсан байрууд"
                />
                <div
                    className="
                        mt-10
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        xl:grid-cols-5
                        2xl:grid-cols-6
                        gap-8
                    "
                >
                    {reservations.map((reservation) => (
                        <ListingCard
                            key={reservation.id}
                            data={reservation.listing}
                            reservation={reservation}
                            actionId={reservation.id}
                            onAction={onSeeMore}
                            disabled={loadingId === reservation.id}
                            actionLabel="Дэлгэрэнгүй харах"
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default ReservationsClient;
