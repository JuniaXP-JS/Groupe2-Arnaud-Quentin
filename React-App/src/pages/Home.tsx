import { useEffect, useState } from "react";
import axios from "axios";
import MapContainer from "../components/map/MapContainer";
import { LineChart } from "../components/charts/LineChart";
import { MarkerType } from "@/types";
import { Announcer, useAnnouncer } from "../components/ui/Announcer";

const Home: React.FC = () => {
    const [gpsData, setGpsData] = useState<MarkerType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { message, announce } = useAnnouncer();

    const fetchGpsData = async () => {
        try {
            setIsLoading(true);
            announce("Chargement des données GPS en cours");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/gps`,
                { withCredentials: true }
            );
            const data = response.data;

            // Filter duplicates based on latitude, longitude, updatedAt
            const uniqueData = [];
            const seen = new Set();
            for (const item of data) {
                const key = `${item.latitude}_${item.longitude}_${new Date(item.updatedAt).getTime()}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueData.push({
                        updatedAt: new Date(item.updatedAt).getTime(),
                        latitude: item.latitude,
                        longitude: item.longitude,
                        imei: item.imei,
                    });
                }
            }
            setGpsData(uniqueData);
            announce(
                `Données GPS chargées avec succès. ${uniqueData.length} positions trouvées`
            );
        } catch (error) {
            console.error("Error fetching GPS data:", error);
            announce("Erreur lors du chargement des données GPS");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGpsData();
    }, []);

    return (
        <div className="h-full w-full flex flex-col overflow-hidden">
            <Announcer message={message} />

            <div
                className="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 px-1 pb-4"
                role="region"
                aria-label="Dashboard content"
                style={{ scrollbarGutter: 'stable' }}
            >
                <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center drop-shadow-sm mt-4">
                    Tableau de bord GPS
                </h1>
                <section
                    className="bg-white shadow-md rounded-xl p-4 flex-shrink-0"
                    aria-labelledby="map-section"
                >
                    <h2
                        id="map-section"
                        className="text-xl font-bold mb-3 text-black"
                    >
                        Carte des positions GPS
                    </h2>
                    <div className="h-[400px] w-full">
                        {/* Only render MapContainer if gpsData is a non-empty array */}
                        {Array.isArray(gpsData) && gpsData.length > 0 ? (
                            <MapContainer gpsData={gpsData} isLoading={isLoading} />
                        ) : (
                            <div className="text-gray-500 text-center py-8" role="status">
                                <p>Aucune donnée GPS disponible</p>
                            </div>
                        )}
                    </div>
                </section>

                <section aria-labelledby="chart-section" className="flex-shrink-0">
                    <div className="bg-white rounded-xl p-4">
                        {isLoading ? (
                            <div role="status" aria-live="polite" className="py-8">
                                <div className="flex items-center justify-center">
                                    <div
                                        className="spinner-border animate-spin inline-block w-6 h-6 border-4 border-gray-300 border-t-blue-600 rounded-full mr-3"
                                        role="status"
                                        aria-label="Loading chart data"
                                    />
                                    <p>Chargement...</p>
                                </div>
                                <span className="sr-only">
                                    Chargement des données GPS, veuillez patienter
                                </span>
                            </div>
                        ) : (
                            <>
                                <h2
                                    id="chart-section"
                                    className="text-xl font-bold mb-3 text-black"
                                >
                                    Évolution quotidienne des données GPS
                                </h2>
                                {/* Only render LineChart if gpsData is a non-empty array */}
                                {Array.isArray(gpsData) && gpsData.length > 0 ? (
                                    <div className="h-[300px]">
                                        <LineChart
                                            data={gpsData}
                                            xAxisTitle="Date"
                                            yAxisTitle="Nombre"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-8" role="status">
                                        <p>Aucune donnée GPS disponible</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
