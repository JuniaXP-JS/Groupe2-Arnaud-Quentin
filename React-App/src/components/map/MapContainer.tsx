import React, { useEffect, useRef, useState } from 'react';
import RealTimePosition from './RealTimePosition';
import PositionHistory from './PositionHistory';
import MapControls from './MapControls';
import { useSidebar } from '../../components/ui/sidebar';
import Map, { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapContainerProps } from '../../types';
import { getLatestMarker } from '../../utils/gps';

/**
 * MapContainer component displays a Mapbox map with GPS data.
 * It toggles between real-time position and position history views.
 * The map centers and zooms on the latest GPS marker accordingly.
 *
 * @param {Array} gpsData - Array of GPS markers with latitude and longitude.
 * @param {boolean} isLoading - Flag indicating if GPS data is loading.
 * @returns React component rendering the map and controls.
 */
const MapContainer: React.FC<MapContainerProps> = ({ gpsData, isLoading }) => {
  // Toggle between showing position history or real-time position
  const [showHistory, setShowHistory] = useState(false);

  // Sidebar collapsed state from custom hook to trigger map resize
  const { state } = useSidebar();
  const isSidebarCollapsed = state === 'collapsed';

  // Reference to Mapbox map instance to control zoom and center
  const mapRef = useRef<MapRef>(null);

  // Default map center if no GPS data available
  const defaultCenter = { latitude: 50.6366, longitude: 3.0634, zoom: 12 };

  // Check if GPS data array is valid and non-empty
  const hasData = Array.isArray(gpsData) && gpsData.length > 0;

  // Track if map has already centered on latest marker once (avoid repeated jumps)
  const [hasCentered, setHasCentered] = useState(false);

  // Get the latest GPS marker from data or null if no data
  const latestMarker = hasData ? getLatestMarker(gpsData) : null;

  /**
   * Initial view state of the map on first render.
   * Centers on latest GPS marker with zoom depending on view mode,
   * or falls back to default center.
   */
  const initialViewState = latestMarker
    ? {
      latitude: latestMarker.latitude,
      longitude: latestMarker.longitude,
      zoom: showHistory ? 12 : 14,
    }
    : defaultCenter;

  /**
   * Resize the map instance when the sidebar collapses or expands.
   * This ensures the map properly fills the available container space.
   */
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 200);
    }
  }, [isSidebarCollapsed]);

  /**
   * Jump to the latest GPS marker on initial load without animation.
   * This centers the map immediately once GPS data is available.
   */
  useEffect(() => {
    if (hasData && mapRef.current && !hasCentered && latestMarker) {
      mapRef.current.jumpTo({
        center: [latestMarker.longitude, latestMarker.latitude],
        zoom: showHistory ? 12 : 14,
      });
      setHasCentered(true);
    }
  }, [hasData, latestMarker, showHistory, hasCentered]);

  // Store previous showHistory state to detect toggling between modes
  const previousShowHistory = useRef(showHistory);

  /**
   * Animate the map with flyTo when toggling between position history and real-time mode.
   * The animation centers the map on the latest GPS marker with appropriate zoom.
   */
  useEffect(() => {
    if (!mapRef.current || !hasData) return;

    if (previousShowHistory.current !== showHistory) {
      if (latestMarker) {
        mapRef.current.flyTo({
          center: [latestMarker.longitude, latestMarker.latitude],
          zoom: showHistory ? 12 : 14,
          speed: 1.2,
          curve: 1.5,
          essential: true,
        });
      }
      previousShowHistory.current = showHistory;
    }
  }, [showHistory, hasData, latestMarker]);

  return (
    <div
      className="relative h-full w-full transition-all duration-200 ease-in-out rounded-xl overflow-hidden"
      aria-label="GPS tracking map"
    >
      {isLoading && (
        <div
          className="bg-[rgb(230,228,224)] rounded-xl h-full w-full relative"
          role="status"
          aria-live="polite"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full"
              aria-label="Loading map data"
            />
          </div>
          <span className="sr-only">Loading GPS map, please wait</span>
        </div>
      )}
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_KEY}
        style={{ width: '100%', height: '100%' }}
      >
        {hasData ? (
          showHistory ? (
            <PositionHistory markers={gpsData} />
          ) : (
            <RealTimePosition markers={gpsData} />
          )
        ) : null}
      </Map>
      <MapControls toggleHistory={() => setShowHistory(!showHistory)} showHistory={showHistory} />
    </div>
  );
};

export default MapContainer;
