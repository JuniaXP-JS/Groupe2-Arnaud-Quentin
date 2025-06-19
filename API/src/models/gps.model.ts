import mongoose, { Schema, Document } from 'mongoose';

/**
 * GPS data document interface extending Mongoose Document.
 * Defines the structure and types for GPS tracking data from IoT devices.
 */
export interface IGpsData extends Document {
  /** Device IMEI identifier - unique identifier for the IoT device */
  imei: string;

  /** Longitude coordinate in decimal degrees (-180 to 180) */
  longitude: number;

  /** Latitude coordinate in decimal degrees (-90 to 90) */
  latitude: number;

  /** Timestamp when the record was created - automatically managed by timestamps */
  createdAt?: Date;

  /** Timestamp when the record was last updated - automatically managed by timestamps */
  updatedAt?: Date;

  /** Method to convert degrees to radians */
  toRadians(degrees: number): number;

  /** Method to get coordinates as GeoJSON */
  toGeoJSON(): { type: string; coordinates: number[] };
}

/**
 * Mongoose schema definition for GPS data model.
 * Defines validation rules, indexes, and field properties for GPS tracking data.
 */
const gpsDataSchema = new Schema<IGpsData>(
  {
    /** 
     * International Mobile Equipment Identity (IMEI) number.
     * 15-digit unique identifier for the IoT device.
     */
    imei: {
      type: String,
      required: [true, 'IMEI is required'],
      trim: true,
      match: [/^\d{15}$/, 'IMEI must be exactly 15 digits']
    },

    /** 
     * Longitude coordinate in decimal degrees.
     * Valid range: -180.0 to 180.0
     */
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    },

    /** 
     * Latitude coordinate in decimal degrees.
     * Valid range: -90.0 to 90.0
     */
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: 'gpsdatas' // Explicitly set collection name
  }
);

/**
 * Indexes for performance optimization.
 * - IMEI index for efficient device-specific queries
 * - Compound index for IMEI + timestamp for sorted historical data
 */
gpsDataSchema.index({ imei: 1 });
gpsDataSchema.index({ imei: 1, createdAt: -1 });

/**
 * Helper method to convert degrees to radians.
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
gpsDataSchema.methods.toRadians = function (degrees: number): number {
  return degrees * (Math.PI / 180);
};

/**
 * Instance method to get coordinates as a GeoJSON point.
 * @returns GeoJSON Point object for mapping applications
 */
gpsDataSchema.methods.toGeoJSON = function () {
  return {
    type: 'Point',
    coordinates: [this.longitude, this.latitude]
  };
};

/**
 * Static method to find GPS data by IMEI with optional date range.
 * @param imei - Device IMEI identifier
 * @param startDate - Optional start date for filtering
 * @param endDate - Optional end date for filtering
 * @returns Promise resolving to array of GPS data documents
 */
gpsDataSchema.statics.findByImei = function (
  imei: string,
  startDate?: Date,
  endDate?: Date
) {
  const query: any = { imei };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }

  return this.find(query).sort({ createdAt: -1 });
};

/**
 * Virtual property to calculate distance from a reference point.
 * Uses Haversine formula for great-circle distance calculation.
 */
gpsDataSchema.virtual('distanceFromOrigin').get(function (this: IGpsData) {
  // Default reference point (can be customized)
  const originLat = 0;
  const originLon = 0;

  const R = 6371; // Earth's radius in kilometers
  const dLat = this.toRadians(this.latitude - originLat);
  const dLon = this.toRadians(this.longitude - originLon);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRadians(originLat)) * Math.cos(this.toRadians(this.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
});

// Ensure virtual fields are serialized
gpsDataSchema.set('toJSON', { virtuals: true });

/**
 * GPS data model based on the schema.
 * Use this model for all GPS data database operations.
 */
const GpsData = mongoose.model<IGpsData>('GpsData', gpsDataSchema);

export default GpsData;
