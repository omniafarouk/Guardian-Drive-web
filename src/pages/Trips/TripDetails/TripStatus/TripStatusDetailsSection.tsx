import React from 'react'
import { tripStatus } from '../../../../types/enums';
import OngoingTripDetails from './OngoingTripDetails';
import type { Trip } from '../../../../types/trip';
import CompletedTripDetails from './CompletedTripDetails';
import CancelledTripDetails from './CancelledTripDetails';
export default function TripStatusDetailsSection({ trip }: { trip: Trip }) {
    switch (trip.status) {
        case tripStatus.ONGOING:
            return <OngoingTripDetails trip={trip} />;

        case tripStatus.COMPLETED:
            return <CompletedTripDetails trip={trip} />;

        case tripStatus.CANCELLED:
            return <CancelledTripDetails trip={trip} />;

        default:
            return null;
    }
}
