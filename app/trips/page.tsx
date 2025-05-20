import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservation";
import TripsClient from "./TripsClient";

const TripsPage = async () => {
  const currentUser = await getCurrentUser();

  // Check if the user is logged in
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Нэвтрээгүй хэрэглэгч" subtitle="Нэвтэрнэ үү!" />
      </ClientOnly>
    );
  }

  // Fetch reservations for the logged-in user (excluding own listings)
  const reservations = await getReservations({
    userId: currentUser.id,
  });

  // If no reservations exist, show an empty state
  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="Захиалга олдсонгүй"
          subtitle="Эхлээд захиалга хийнэ үү"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <TripsClient reservations={reservations} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default TripsPage;
