'use client';

import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { safeReservation, SafeUser } from "../types";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { error } from "console";
import ListingCard from "../components/listings/ListingCard";

interface TripsClientProps {
    reservations: safeReservation[];
    currentUser: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
    reservations,
    currentUser
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id:string)=> {
        setDeletingId(id);

        axios.delete(`/api/trips/${id}`)
        .then(() => {
            toast.success('Захиалга цуцлгдлаа');
            router.refresh();
        })
        .catch((error) =>{
            toast.error(error?.response?.data?.error);
        })
        .finally(() => {
            setDeletingId('');
        });
    }, [router]);

    return (
        <Container>
            <div className="p-8">
                <Heading
                    title="Миний захиалгууд"
                    subtitle="Захиалга өгсөн газрууд"
                />
            </div>
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
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel="Захиалга цуцлах"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    );
}


export default TripsClient;