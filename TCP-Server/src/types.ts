export interface Position {
    latitude: number;
    longitude: number;
}


export interface DataPoint {
    imei: string;
    longitude: number;
    latitude: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IGpsGeoData {
    name: string;
    position: {
        type: 'Point';
        coordinates: [number, number];
    };
    receivedAt: Date;
}