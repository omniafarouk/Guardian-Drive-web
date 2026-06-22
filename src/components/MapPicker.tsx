import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import { FaMapMarkerAlt } from "react-icons/fa";
import L from "leaflet";
import { getLocationName } from "../services/locationService";

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
    latitude?: number;
    longitude?: number;
    readOnly?: boolean;
    onLocationSelect?: (
        lat: number,
        lng: number,
        // address: string
    ) => void;
}

interface LocationMarkerProps {
    latitude?: number;
    longitude?: number;
    readOnly: boolean;
    onSelect?: (
        lat: number,
        lng: number,
        // address: string
    ) => void;
}

function LocationMarker({
    latitude,
    longitude,
    readOnly,
    onSelect,
}: LocationMarkerProps) {
    const map = useMapEvents({
        click: async (e) => {
            if (readOnly || !onSelect) return;

            const { lat, lng } = e.latlng;

            try {

                onSelect(lat, lng);
            } catch {
                onSelect(lat, lng);
            }
        },
    });

    // keep map centered when editing existing trip
    useEffect(() => {
        if (latitude != null && longitude != null) {
            map.setView([latitude, longitude], map.getZoom());
        }
    }, [latitude, longitude, map]);

    if (latitude == null || longitude == null) return null;

    return (
        <Marker
            position={[latitude, longitude]}
            icon={markerIcon}
        />
    );
}
function MapInteractionController({ readOnly }: { readOnly: boolean }) {
    const map = useMap();

    useEffect(() => {
        if (readOnly) {
            map.dragging.disable();
            map.scrollWheelZoom.disable();
            map.doubleClickZoom.disable();
            map.touchZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
        } else {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
            map.doubleClickZoom.enable();
            map.touchZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();
        }
    }, [readOnly, map]);

    return null;
}
export default function MapPicker({
    latitude,
    longitude,
    onLocationSelect,
    readOnly = false,
}: MapPickerProps) {
    const center: [number, number] =
        latitude && longitude
            ? [latitude, longitude]
            : [30.0444, 31.2357];
    // console.log(readOnly)
    return (
        <MapContainer
            //center={[30.0444, 31.2357]}
            center={center}
            zoom={10}
            style={{
                height: "300px",
                width: "100%",
            }}
        // dragging={!readOnly}
        // scrollWheelZoom={!readOnly}
        // doubleClickZoom={!readOnly}
        // touchZoom={!readOnly}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapInteractionController readOnly={readOnly} />
            <LocationMarker
                latitude={latitude}
                longitude={longitude}
                readOnly={readOnly}
                onSelect={onLocationSelect}
            />
        </MapContainer>
    );
}