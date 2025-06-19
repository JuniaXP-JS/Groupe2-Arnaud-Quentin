import React, { useState } from 'react';
import { Marker, Popup } from 'react-map-gl/mapbox';
import { RealTimePositionProps } from '../../types';
import { getLatestMarker } from '../../utils/gps';

/**
 * Formats a timestamp into a human-readable date string (French locale).
 *
 * @param {number} updatedAt - The timestamp to format.
 * @returns {string} The formatted date string.
 */
function formatDate(updatedAt: number): string {
    const date = new Date(updatedAt);
    if (isNaN(date.getTime())) {
        console.warn('Invalid date value in RealTimePosition:', updatedAt);
        return 'Date invalide';
    }

    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}
/**
 * RealTimePosition component to display the latest GPS marker on the map.
 *
 * - Shows a single marker for the most recent position.
 * - Displays a popup with details when the marker is selected.
 *
 * @param {RealTimePositionProps} props - The props containing the markers array.
 * @returns {JSX.Element} The rendered marker and popup for the latest position, or an empty fragment if no marker.
 */
const RealTimePosition: React.FC<RealTimePositionProps> = ({ markers }) => {
    const latestMarker = getLatestMarker(markers);
    const [openPopupImei, setOpenPopupImei] = useState<string | null>(null);

    if (!latestMarker) return <></>;

    return (
        <>
            <Marker
                latitude={latestMarker.latitude}
                longitude={latestMarker.longitude}
                onClick={() => setOpenPopupImei(latestMarker.imei)}
            >
                <div
                    className="relative cursor-pointer transform transition-transform duration-200 hover:scale-110"
                    onClick={() => setOpenPopupImei(latestMarker.imei)}
                    data-testid="mock-marker"
                    role="button"
                    tabIndex={0}
                    aria-label={`Position actuelle: ${latestMarker.latitude}, ${latestMarker.longitude}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setOpenPopupImei(latestMarker.imei);
                        }
                    }}
                >
                    {/* Pulse animation ring */}
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping" />
                    {/* Main marker */}
                    <div className="relative w-6 h-6 bg-red-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                        {/* Inner dot */}
                        <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                </div>
            </Marker>

            {openPopupImei === latestMarker.imei && (
                <Popup
                    latitude={latestMarker.latitude}
                    longitude={latestMarker.longitude}
                    onClose={() => setOpenPopupImei(null)}
                    closeOnClick={false}
                    offset={[0, -10]}
                    focusAfterOpen={false}
                >
                    <div className="p-2 text-sm text-black" role="dialog" aria-labelledby="popup-title">
                        <h3 id="popup-title" className="font-bold">Position en temps réel</h3>
                        <dl className="mt-2">
                            <dt className="sr-only">IMEI</dt>
                            <dd><strong>IMEI :</strong> {latestMarker.imei}</dd>
                            <dt className="sr-only">Date</dt>
                            <dd><strong>Date :</strong> {formatDate(latestMarker.updatedAt)}</dd>
                            <dt className="sr-only">Coordonnées</dt>
                            <dd><strong>Latitude :</strong> {latestMarker.latitude}</dd>
                            <dd><strong>Longitude :</strong> {latestMarker.longitude}</dd>
                        </dl>
                        <button
                            onClick={() => setOpenPopupImei(null)}
                            className="mt-2 px-2 py-1 bg-gray-200 rounded text-black text-xs hover:bg-gray-300"
                            aria-label="Fermer les informations de position"
                        >
                            Fermer
                        </button>
                    </div>
                </Popup>
            )}
        </>
    );
};

export default RealTimePosition;