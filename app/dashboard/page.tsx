import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import DashboardClient from "./DashboardClient";
import getReservations from "../actions/getReservation";
import PriceRange from "../components/PriceRange"; // ADD

interface DashboardPageProps {
  searchParams: {
    minPrice?: string;
    maxPrice?: string;
  }
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title="Нэвтрээгүй хэрэглэгч"
          subtitle="Нэвтэрнэ үү!"
        />
      </ClientOnly>
    );
  }

  const reservations = await getReservations({ userId: currentUser.id });

  const listings = await getListings({
    userId: currentUser.id,
    minPrice: searchParams.minPrice ? +searchParams.minPrice : undefined,
    maxPrice: searchParams.maxPrice ? +searchParams.maxPrice : undefined,
  });

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="Таны өмч олдсонгүй"
          subtitle="Та одоогоор ямар ч үл хөдлөх хөрөнгө оруулаагүй байна"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="px-4">
    
        <DashboardClient
          listings={listings}
          currentUser={currentUser}
      
        />
      </div>
    </ClientOnly>
  );
};

export default DashboardPage;
