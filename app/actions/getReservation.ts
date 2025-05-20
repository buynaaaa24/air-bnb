import prisma from "@/app/libs/prismadb";

interface SafeReservation {
    id: string;
    userId: string;
    listingId: string;
    createdAt: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    listing: {
        id: string;
        userId: string;
        title: string;
        description: string;
        imageSrc: string;
        category: string;
        roomCount: number;
        bathroomCount: number;
        guestCount: number;
        locationValue: string;
        price: number;
        createdAt: string;
    };
    
    price: number;
}

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}


export default async function getReservations(
    params: IParams
): Promise<SafeReservation[]> {
    try {
        const { listingId, userId, authorId } = params;

        const query: any = {};

        if (listingId) {
            query.listingId = listingId;
        }

        if (userId) {
            query.userId = userId;
        }

        // If authorId is provided and is the same as userId,
        // exclude listings owned by the user to prevent self-renting
        if (authorId && userId && authorId === userId) {
            query.listing = {
                userId: {
                    not: authorId,
                },
            };
        } else if (authorId) {
            // If authorId is provided (but different from userId), include listings by that author
            query.listing = {
                userId: authorId,
            };
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const safeReservations: SafeReservation[] = reservations.map((reservation) => ({
            id: reservation.id,
            userId: reservation.userId,
            listingId: reservation.listingId,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            totalPrice: reservation.totalPrice,
            status: reservation.status,
            listing: {
                id: reservation.listing.id,
                userId: reservation.listing.userId,
                title: reservation.listing.title,
                description: reservation.listing.description,
                imageSrc: reservation.listing.imageSrc,
                category: reservation.listing.category,
                roomCount: reservation.listing.roomCount,
                bathroomCount: reservation.listing.bathroomCount,
                guestCount: reservation.listing.guestCount,
                locationValue: reservation.listing.locationValue,
                price: reservation.listing.price,
                createdAt: reservation.listing.createdAt.toISOString(),
            },
            price: reservation.listing.price,
        }));

        return safeReservations;
    } catch (error: any) {
        throw new Error(error);
    }
}
