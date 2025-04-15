import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import DashboardClient from "./DashboardClient"; 
import getReservations from "../actions/getReservation";

const DashboardPage = async () => {
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

  // Pass userId as the parameter to getReservations
  const reservations = await getReservations({ userId: currentUser.id });

  const listings = await getListings({ userId: currentUser.id });

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
      <DashboardClient
        listings={listings}
        currentUser={currentUser}
        reservations={reservations}  // Pass reservations here
      />
    </ClientOnly>
  );
};

export default DashboardPage;
