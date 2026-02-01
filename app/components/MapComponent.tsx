import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ReactNode } from "react";

// Fix for default marker icons in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon: L.Icon | undefined;

// Only initialize icon on client side
if (typeof window !== "undefined") {
    DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
}

export interface MarkerData {
    lat: number;
    lng: number;
    label?: string;
    id?: string;
}

interface MapComponentProps {
    markers?: MarkerData[];
    center?: [number, number];
    zoom?: number;
    height?: string;
}

// Component to handle map centering when markers change
const MapViewController = ({ markers }: { markers?: MarkerData[] }) => {
    const map = useMap();

    useEffect(() => {
        if (markers && markers.length > 0) {
            // Fit map to show all markers
            const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [markers, map]);

    return null;
};

export const MapComponent = ({
    markers = [],
    center = [51.505, -0.09], // Default to London
    zoom = 13,
    height = "100%"
}: MapComponentProps): ReactNode => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Use the center of all markers if available
    const mapCenter: [number, number] = markers.length > 0
        ? [
            markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
            markers.reduce((sum, m) => sum + m.lng, 0) / markers.length
        ]
        : center;

    if (!isClient) {
        return <div style={{ height, width: "100%" }}>Loading map...</div>;
    }

    return (
        <div style={{ height, width: "100%" }}>
            <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker, index) => (
                    <Marker
                        key={marker.id || index}
                        position={[marker.lat, marker.lng]}
                    >
                        {marker.label && (
                            <Popup>
                                {marker.label}
                            </Popup>
                        )}
                    </Marker>
                ))}
                <MapViewController markers={markers} />
            </MapContainer>
        </div>
    );
};
