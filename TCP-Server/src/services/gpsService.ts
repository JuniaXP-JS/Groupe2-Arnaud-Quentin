import { Collection } from 'mongodb';
import { DataPoint, IGpsGeoData } from '../types';

/**
 * Insère un tableau de points GPS dans la collection MongoDB.
 *
 * @param {Object} collection - La collection MongoDB.
 * @param {Array} dataPoints - Les points GPS à insérer.
 * @returns {Promise<Object>} Le résultat de l'insertion.
 */
export async function insertDataPoints(
    collection: Collection<DataPoint>,
    dataPoints: DataPoint[]
) {
    return collection.insertMany(dataPoints);
}

/**
 * Insère un tableau de points GPS au format GeoJSON dans la collection MongoDB.
 *
 * @param {Collection<IGpsGeoData>} geoCollection - La collection MongoDB pour les points GeoJSON.
 * @param {IGpsGeoData[]} geoDataPoints - Les points GeoJSON à insérer.
 * @returns {Promise<Object>} Le résultat de l'insertion.
 */
export async function insertGeoDataPoints(
    geoCollection: Collection<IGpsGeoData>,
    geoDataPoints: IGpsGeoData[]
) {
    console.log("dans insertGeoDataPoints", JSON.stringify(geoDataPoints, null, 2));
    try {
        const result = await geoCollection.insertMany(geoDataPoints);
        console.log("Résultat insertMany geo:", result);
        return result;
    } catch (err) {
        console.error("Erreur insertGeoDataPoints:", err);
        throw err;
    }
}