import { MarkerType } from '@/types';
import React, { useState } from 'react';
import { Marker, Popup } from 'react-map-gl/mapbox';

/**
 * Formats a timestamp into a human-readable date string (French locale).
 * @param {number} updatedAt - The timestamp to format.
 * @returns {string} The formatted date string.
 */
function formatDate(updatedAt: number): string {
    // Format date using French locale
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(updatedAt));
}

/**
 * PositionHistory component to display a list of historical GPS markers on the map.
 *
 * - Renders a marker for each historical position.
 * - Shows a popup with details when a marker is selected.
 *
 * @param {{ markers: MarkerType[] }} props - The props containing the markers array.
 * @returns {JSX.Element} The rendered markers and popups for the historical positions.
 */
const PositionHistory: React.FC<{ markers: MarkerType[] }> = ({ markers }) => {
    const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

    if (!Array.isArray(markers) || markers.length === 0) {
        return <></>;
    }

    return (
        <>
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                    onClick={() => setSelectedMarker(marker)}
                >
                    <div
                        className="relative cursor-pointer transform transition-transform duration-200 hover:scale-110"
                        data-testid="mock-marker"
                        role="button"
                        tabIndex={0}
                        aria-label={`Historical position ${index + 1}: ${marker.latitude}, ${marker.longitude}, ${formatDate(marker.updatedAt)}`}
                        onClick={() => setSelectedMarker(marker)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setSelectedMarker(marker);
                            }
                        }}
                    >
                        {/* Main marker */}
                        <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center hover:bg-blue-700 transition-colors duration-200">
                            {/* Inner dot */}
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                    </div>
                </Marker>
            ))}

            {selectedMarker && (
                <Popup
                    latitude={selectedMarker.latitude}
                    longitude={selectedMarker.longitude}
                    onClose={() => setSelectedMarker(null)}
                    closeOnClick={false}
                    offset={[0, -10]}
                    focusAfterOpen={false}
                >
                    <div className="p-2 text-sm text-black" role="dialog" aria-labelledby="history-popup-title">
                        <h3 id="history-popup-title" className="font-bold">Historical position</h3>
                        <dl className="mt-2">
                            <dt className="sr-only">IMEI</dt>
                            <dd><strong>IMEI :</strong> {selectedMarker.imei}</dd>
                            <dt className="sr-only">Date</dt>
                            <dd><strong>Date :</strong> {formatDate(selectedMarker.updatedAt)}</dd>
                            <dt className="sr-only">Coordinates</dt>
                            <dd><strong>Latitude :</strong> {selectedMarker.latitude}</dd>
                            <dd><strong>Longitude :</strong> {selectedMarker.longitude}</dd>
                        </dl>
                        <button
                            onClick={() => setSelectedMarker(null)}
                            className="mt-2 px-2 py-1 bg-gray-200 rounded text-white text-xs hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Close position information"
                        >
                            Close
                        </button>
                    </div>
                </Popup>
            )}
        </>
    );
};

export default PositionHistory;