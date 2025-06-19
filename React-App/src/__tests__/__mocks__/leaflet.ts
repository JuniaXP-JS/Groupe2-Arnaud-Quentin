import { vi } from 'vitest';

const mapMethods = {
    setView: vi.fn().mockReturnThis(),
    addLayer: vi.fn().mockReturnThis(),
    removeLayer: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    getZoom: vi.fn().mockReturnValue(13),
    getBounds: vi.fn().mockReturnValue({
        getNorthEast: () => ({ lat: 51, lng: 4 }),
        getSouthWest: () => ({ lat: 50, lng: 3 }),
    }),
};

const markerMethods = {
    addTo: vi.fn().mockReturnThis(),
    setLatLng: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    setIcon: vi.fn().mockReturnThis(),
    remove: vi.fn(),
};

const polylineMethods = {
    addTo: vi.fn().mockReturnThis(),
    setStyle: vi.fn().mockReturnThis(),
    remove: vi.fn(),
};

const map = vi.fn().mockImplementation(() => mapMethods);
const marker = vi.fn().mockImplementation(() => markerMethods);
const polyline = vi.fn().mockImplementation(() => polylineMethods);
const icon = vi.fn().mockImplementation(() => ({}));
const tileLayer = vi.fn().mockImplementation(() => ({
    addTo: vi.fn().mockReturnThis(),
}));

export default {
    map,
    marker,
    polyline,
    icon,
    tileLayer,
    DomUtil: {
        create: vi.fn().mockReturnValue({}),
    },
    DomEvent: {
        disableScrollPropagation: vi.fn(),
        disableClickPropagation: vi.fn(),
    },
    latLng: vi.fn().mockImplementation((lat, lng) => ({ lat, lng })),
    control: {
        layers: vi.fn().mockImplementation(() => ({
            addTo: vi.fn().mockReturnThis(),
            addBaseLayer: vi.fn(),
            addOverlay: vi.fn(),
        })),
    },
};