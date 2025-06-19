import React from 'react';
import type { MapRef, MapProps, MarkerProps, PopupProps } from '../../types/map';

// Helper to filter out non-DOM props
const filterDOMProps = (props: Record<string, any>) => {
  const {
    initialViewState,
    mapStyle,
    mapboxAccessToken,
    reuseMaps,
    attributionControl,
    renderWorldCopies,
    ...domProps
  } = props;
  return domProps;
};

const Map = React.forwardRef<MapRef, MapProps>(({ children, ...props }) => {
  // Filter out non-DOM props
  const domProps = filterDOMProps(props);

  return (
    <div data-testid="mock-map" {...domProps}>
      {children}
    </div>
  );
});

const Marker: React.FC<MarkerProps> = ({ children, longitude, latitude, ...props }) => (
  <div data-longitude={longitude} data-latitude={latitude} {...props}>
    {children}
  </div>
);

const Popup: React.FC<PopupProps> = ({ children, longitude, latitude, onClose, closeButton, ...props }) => (
  <div
    data-testid="mock-popup"
    data-longitude={longitude}
    data-latitude={latitude}
    {...props}
  >
    {children}
    {closeButton && <button onClick={onClose}>Close</button>}
  </div>
);

// Export the mock components
export { Marker, Popup, MapRef };
export default Map;