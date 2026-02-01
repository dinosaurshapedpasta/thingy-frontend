import { useEffect, useState, useRef, useMemo, memo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
// @ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ReactNode } from "react";

// Fix for default marker icons in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon: L.Icon | undefined;
let RedIcon: L.Icon | undefined;

// Only initialize icon on client side
if (typeof window !== "undefined") {
    DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    // Create red marker icon using a data URL
    const redIconUrl = 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" width="25" height="41">
            <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#dc2626"/>
            <circle cx="12.5" cy="12.5" r="5" fill="white"/>
        </svg>
    `);

    RedIcon = L.icon({
        iconUrl: redIconUrl,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    });

    L.Marker.prototype.options.icon = DefaultIcon;
}

// Helper function to get icon based on color
const getMarkerIcon = (color?: 'red' | 'blue' | 'green' | 'default'): L.Icon | undefined => {
    if (typeof window === "undefined") return undefined;

    switch (color) {
        case 'red':
            return RedIcon;
        default:
            return DefaultIcon;
    }
};

export interface MarkerData {
    lat: number;
    lng: number;
    label?: string;
    id?: string;
    color?: 'red' | 'blue' | 'green' | 'default';
}

interface MapComponentProps {
    markers?: MarkerData[];
    center?: [number, number];
    zoom?: number;
    height?: string;
    routeStart?: [number, number]; // [lat, lng] for route start point
    routeEnd?: [number, number];   // [lat, lng] for route end point
    showRoute?: boolean;           // Whether to display the route
}

// Function to fetch route from OSRM
const fetchRoute = async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // Convert GeoJSON coordinates [lng, lat] to Leaflet format [lat, lng]
            return data.routes[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
            );
        }
        return [];
    } catch (error) {
        console.error('Error fetching route:', error);
        return [];
    }
};

// Component to handle map centering when markers change
const MapViewController = ({ markers }: { markers?: MarkerData[]; }) => {
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

// Memoized inner map component to prevent re-initialization
const InnerMap = memo(({
    mapCenter,
    zoom,
    markers,
    routeCoordinates
}: {
    mapCenter: [number, number];
    zoom: number;
    markers: MarkerData[];
    routeCoordinates: [number, number][];
}) => {
    return (
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
                    icon={getMarkerIcon(marker.color)}
                >
                    {marker.label && (
                        <Popup>
                            {marker.label}
                        </Popup>
                    )}
                </Marker>
            ))}
            {routeCoordinates.length > 0 && (
                <Polyline
                    positions={routeCoordinates}
                    color="#2563eb"
                    weight={4}
                    opacity={0.7}
                />
            )}
            <MapViewController markers={markers} />
        </MapContainer>
    );
});

export const MapComponent = ({
    markers = [],
    center = [51.505, -0.09], // Default to London
    zoom = 13,
    height = "100%",
    routeStart,
    routeEnd,
    showRoute = true
}: MapComponentProps): ReactNode => {
    const [isClient, setIsClient] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
    const hasInitialized = useRef(false);
    const containerId = useMemo(() => `map-${Math.random().toString(36).substr(2, 9)}`, []);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            setIsClient(true);
        }

        // Cleanup on unmount
        return () => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
            }
        };
    }, [containerId]);

    // Fetch route when start/end points change
    useEffect(() => {
        if (showRoute && routeStart && routeEnd) {
            fetchRoute(routeStart, routeEnd).then(coords => {
                setRouteCoordinates(coords);
            });
        } else {
            setRouteCoordinates([]);
        }
    }, [routeStart, routeEnd, showRoute]);

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
        <div id={containerId} style={{ height, width: "100%" }}>
            {isClient && (
                <InnerMap
                    mapCenter={mapCenter}
                    zoom={zoom}
                    markers={markers}
                    routeCoordinates={routeCoordinates}
                />
            )}
        </div>
    );
};
