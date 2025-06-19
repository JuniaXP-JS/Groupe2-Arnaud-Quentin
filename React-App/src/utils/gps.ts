import { MarkerType } from "@/types";

/**
 * Returns the latest marker with the most recent date (and the last one in the array if there is a tie).
 *
 * @param {MarkerType[]} markers - Array of marker objects to search.
 * @returns {MarkerType | null} The marker with the latest updatedAt timestamp, or null if the array is empty.
 */
export function getLatestMarker(markers: MarkerType[]): MarkerType | null {
    if (!markers.length) return null;
    const maxDate = Math.max(...markers.map(m => m.updatedAt));
    const latestCandidates = markers.filter(m => m.updatedAt === maxDate);
    return latestCandidates[latestCandidates.length - 1];
}
