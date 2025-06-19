import { CSSProperties, ReactNode } from 'react';

/**
 * Type for a single marker.
 */
export interface MarkerType {
    latitude: number;
    longitude: number;
    imei: string;
    updatedAt: number;
}

/**
 * Props for the PositionHistory component.
 */
export interface PositionHistoryProps {
    markers: MarkerType[];
}

/**
 * Props for the RealTimePosition component.
 */
export interface RealTimePositionProps {
    markers: MarkerType[];
}

/**
 * Props for the MapControls component.
 */
export interface MapControlsProps {
    toggleHistory: () => void;
    showHistory: boolean;
}

// Props for the Map component from react-map-gl
export interface MapProps {
    children?: ReactNode;
    style?: CSSProperties;
    initialViewState?: any;
    mapStyle?: string;
    mapboxAccessToken?: string;
    [key: string]: any;
}

// Props for the Marker component from react-map-gl
export interface MarkerProps {
    children?: ReactNode;
    longitude: number;
    latitude: number;
    [key: string]: any;
}

// Props for the Popup component from react-map-gl
export interface PopupProps {
    children?: ReactNode;
    longitude: number;
    latitude: number;
    onClose?: () => void;
    closeButton?: boolean;
    [key: string]: any;
}

// Interface for MapRef methods
export interface MapRefMethods {
    jumpTo(options: { center: [number, number]; zoom?: number }): void;
    flyTo(options: { center: [number, number]; zoom?: number; duration?: number }): void;
    resize(): void;
}

// Props for the MapContainer component
export interface MapContainerProps {
    gpsData: any[];
    isLoading: boolean;
}

export class MapRef {
    jumpTo(options: { center: [number, number]; zoom?: number }): void { }
    flyTo(options: { center: [number, number]; zoom?: number; duration?: number }): void { }
    resize(): void { }
}