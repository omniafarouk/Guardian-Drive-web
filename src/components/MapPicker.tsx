import {
    MapContainer,
    Marker,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import { FaMapMarkerAlt } from "react-icons/fa";
import L from "leaflet";

const markerIcon = new L.DivIcon({
    html: renderToString(
        <FaMapMarkerAlt
            size={32}
            color="#dc3545"
        />
    ),
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

interface MapPickerProps {
    label: string;
    onLocationSelect: (
        lat: number,
        lng: number,
        address: string
    ) => void;
}

interface LocationMarkerProps {
    onSelect: (
        lat: number,
        lng: number,
        address: string
    ) => void;
}

function LocationMarker({ onSelect }: LocationMarkerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    useMapEvents({
        async click(e) {
            setPosition(e.latlng);

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
                );

                const data = await response.json();
                // const data = await response.json();

                console.log("Nominatim response:", data);
                onSelect(
                    e.latlng.lat,
                    e.latlng.lng,
                    data.display_name ?? ""
                );
            } catch (error) {
                console.error("Failed to get address:", error);

                onSelect(
                    e.latlng.lat,
                    e.latlng.lng,
                    ""
                );
            }
        },
    });

    return position ? (
        <Marker
            position={position}
            icon={markerIcon}
        />
    ) : null;
}

export default function MapPicker({
    label,
    onLocationSelect,
}: MapPickerProps) {
    return (
        <MapContainer
            center={[30.0444, 31.2357]}
            zoom={10}
            style={{
                height: "300px",
                width: "100%",
            }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
                onSelect={onLocationSelect}
            />
        </MapContainer>
    );
}