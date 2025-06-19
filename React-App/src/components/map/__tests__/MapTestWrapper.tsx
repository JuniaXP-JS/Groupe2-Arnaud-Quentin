import React from 'react';

export const MapTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div data-testid="mock-map">{children}</div>
);