import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
    minPrice?: number;   // ADD
    maxPrice?: number;   // ADD
}


export default async function getListings(
    params: IListingsParams
) {
    try {
        const {
            userId,
            roomCount,
            guestCount,
            bathroomCount,
            locationValue,
            startDate,
            endDate,
            category,
            minPrice, // 👈 added
            maxPrice, // 👈 added
         } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }

        if (category) {
            query.category = category;
        }

        if (roomCount) {
            query.roomCount = {
                gte: +roomCount
            };
        }

        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            };
        }
        
        if (guestCount) {
            query.guestCount = {
                gte: +guestCount
            };
        }
        
        if (locationValue) {
            query.locationValue = locationValue;
        }

        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: startDate },
                                startDate: { lte: startDate },
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { gte: endDate }
                            }
                        ]
                    }
                }
            };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) {
                query.price.gte = +minPrice;
            }
            if (maxPrice !== undefined) {
                query.price.lte = +maxPrice;
            }
        }

        const listings = await prisma.listing.findMany({
            include: {
                reservations: true
            },
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const SafeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return SafeListings;
    } catch (error: any) {
        throw new Error(error);
    }
}
