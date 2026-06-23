import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import MapPicker from '../../../../components/MapPicker';
import { Col, Form } from 'react-bootstrap';
import { BASE_URL } from '../../../../services/apiService';

interface LiveTrackingProps {
    tripId: number;
    status: string; // "ONGOING", "COMPLETED", "CANCELLED", etc.
}

export default function LiveTripTracking({ tripId, status }: LiveTrackingProps) {
    const [currentLocation, setCurrentLocation] = useState<any>(null);

    useEffect(() => {
        // Guard clause: Only open a socket channel if the trip is actively ongoing
        if (!tripId || status !== "ONGOING") {
            return;
        }

        console.log(`Connecting to live tracking server for Trip: ${tripId}...`);

        // 1. Establish connection ONLY when this specific conditional tree mounts
        const socket: Socket = io(BASE_URL, {
            autoConnect: true
        });

        // 2. Join the tracking scope room channel
        socket.emit("join_trip_room", { tripId });

        // 3. Catch inbound position frames
        socket.on("driver_location_update", (data) => {
            if (data?.latitude && data?.longitude) {
                setCurrentLocation(data);
            }
        });

        // ==========================================
        // CLEANUP RETURN FUNCTION (The Magic Part)
        // ==========================================
        // React executes this block automatically the moment the user leaves the page 
        // or if the trip status dynamically updates to "COMPLETED".
        return () => {
            console.log(`Leaving page or trip ended. Cleaning up socket for Trip: ${tripId}...`);
            socket.emit("leave_trip_room", { tripId });
            socket.disconnect(); // Completely closes the TCP connection socket link
        };
    }, [tripId, status]); // Re-runs or cleans up if trip ID or status changes

    // If it's not ongoing, we don't display the live engine layer at all
    if (status !== "ONGOING") {
        return <div className="text-muted small">Live tracking is unavailable for inactive trips.</div>;
    }

    return (
        <Col className="col-md-12">
            <Form.Group className="mb-3">
                <Form.Label>Live Tracking</Form.Label>

                {currentLocation ? (
                    <div
                        style={{
                            height: "300px",
                            width: "100%",
                            overflow: "hidden",
                            border: "1px solid #789cdf",
                            borderRadius: "10px",
                            marginBottom: "5px"
                        }}>
                        <MapPicker
                            label="Live Position Telemetry"
                            latitude={currentLocation.latitude}
                            longitude={currentLocation.longitude}
                            readOnly
                        />
                    </div>
                ) : (
                    <div className="p-3 bg-light text-muted text-center rounded small">
                        Connecting to vehicle tracking stream...
                    </div>
                )}
            </Form.Group>
        </Col>
    );
}