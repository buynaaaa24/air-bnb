import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getListingById from "@/app/actions/getListingbyId";
import getReservations from "@/app/actions/getReservation";

interface IParams {
    listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
    const { listingId } = params; // Extract listingId from params
    if (!listingId) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }

    // Pass the extracted listingId to your functions
    const listing = await getListingById({ listingId });
    const reservations = await getReservations({ listingId });
    const currentUser = await getCurrentUser();

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <ListingClient
                listing={listing}
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
};

export default ListingPage;
