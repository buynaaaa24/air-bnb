import React, { useState } from 'react';

const AcceptReservationButton = ({ reservationId }: { reservationId: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/acceptReservation', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Something went wrong');
      } else {
        alert('Reservation accepted! Move to payment.');
      }
    } catch (error) {
      setError('Error accepting reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleAccept} disabled={loading}>
        {loading ? 'Accepting...' : 'Accept Reservation'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AcceptReservationButton;
