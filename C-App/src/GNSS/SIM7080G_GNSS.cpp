/**
 * @file SIM7080G_GNSS.cpp
 * @brief Fonctions pour piloter et parser le module GNSS du SIM7080G.
 *
 * Ce fichier permet d'exécuter différentes commandes AT via Send_AT pour :
 * - allumer ou éteindre le module GNSS,
 * - récupérer les coordonnées GPS,
 * - obtenir des informations détaillées sur l'état du module GNSS.
 *
 * On y trouve aussi des fonctions de parsing pour extraire les différentes valeurs (latitude, longitude, timestamp, etc.) à partir des réponses brutes du module.
 *
 * Enfin, la fonction principale getGnssResponse() construit une structure Gnss contenant toutes les valeurs utiles (coordonnées, statut, timestamp, altitude, etc.)
 * afin de pouvoir les réutiliser facilement dans le reste de l'application, comme vu dans les autres fichiers GNSS.
 */
#include "SIM7080G_GNSS.hpp"

DataGNSS dataGNSS[MAX_COORDS];
String gnssTurnOn()
{
    return Send_AT("AT+CGNSPWR=1"); // Sends the AT+CBC command
}

String gnssTurnOff()
{
    return Send_AT("AT+CGNSPWR=0"); // Sends the AT+CBC command
}

String check_GNSS_Status()
{
    return Send_AT("AT+CGNSPWR?");
}

String get_GNSS_Info()
{
    return Send_AT("AT+CGNSINF");
}
String get_GNSS_Mode()
{
    return Send_AT("AT+CGNSMOD=1,0,0,1,0");
}

String getValueOfGnssData(String gnssData, int16_t choiceValue)
{
    int index = 0; // Counter to keep track of the number of extracted values
    int start = 0; // Start position to extract a value
    int end = 0;   // End position of the extracted value

    String values[19]; // Array to store the different values separated by commas

    // Loop to go through the entire string and extract the values one by one
    while ((end = gnssData.indexOf(',', start)) != -1 && index < 19)
    {
        // Extract the substring between "start" and the first comma found
        values[index++] = gnssData.substring(start, end);
        // Move "start" after the comma for the next extraction
        start = end + 1;
    }

    return values[choiceValue];
}

String getRunStatus(String gnssData)
{
    return getValueOfGnssData(gnssData, 0);
}

String getFixStatus(String gnssData)
{
    return getValueOfGnssData(gnssData, 1);
}

String getTimeStamp(String gnssData)
{
    return getValueOfGnssData(gnssData, 2);
}

String getLat(String gnssData)
{
    return getValueOfGnssData(gnssData, 3);
}

String getLng(String gnssData)
{
    return getValueOfGnssData(gnssData, 4);
}

String getAltitude(String gnssData)
{
    return getValueOfGnssData(gnssData, 5);
}

/**
 * @brief Extrait la valeur HDOP (précision horizontale) depuis la réponse AT+CGNSINF, sous forme de Float_gnss.
 * @param gnssData La chaîne complète retournée par AT+CGNSINF.
 * @return La valeur HDOP sous forme de Float_gnss.
 */
Float_gnss getHdopFromGnssData(const String &gnssData)
{
    String hdopStr = getValueOfGnssData(gnssData, 10); // 11e champ = HDOP
    return parseGNSS(hdopStr);
}

Coord parserLatLng(String lat, String lng)
{
    Coord coord;
    coord.latitude = parseGNSS(lat);
    coord.longitude = parseGNSS(lng);
    return coord;
}

Float_gnss parseGNSS(String coord)
{
    Float_gnss result;

    int pointIndex = coord.indexOf('.');

    if (pointIndex == -1)
    {
        Serial.println("Error: Invalid format!");
        return result;
    }

    result.ent = coord.substring(0, pointIndex).toInt();

    int commaIndex = coord.indexOf(',', pointIndex);
    if (commaIndex == -1)
        result.dec = coord.substring(pointIndex + 1);
    else
        result.dec = coord.substring(pointIndex + 1, commaIndex);

    result.full = coord.substring(0, (commaIndex == -1 ? coord.length() : commaIndex));

    Serial.println("Integer coordinate: " + String(result.ent));
    Serial.println("Decimal coordinate (full): " + result.dec);
    Serial.println("Extracted full coordinate: " + result.full);

    return result;
}

/**
 * @brief Récupère et parse les données GNSS du module SIM7080G.
 *
 * Cette fonction exécute la commande AT+CGNSINF pour obtenir les informations GNSS brutes,
 * puis utilise les fonctions de parsing pour extraire les différentes valeurs (latitude, longitude, timestamp, etc.).
 * Elle construit et retourne une structure Gnss contenant toutes les valeurs utiles pour le reste de l'application.
 *
 * @return Une structure Gnss remplie avec les coordonnées, le statut, le timestamp, l'altitude, etc.
 */
Gnss getGnssResponse()
{
    Gnss gnss;
    String gnssData = get_GNSS_Info();
    Coord coord = parserLatLng(getLat(gnssData), getLng(gnssData));
    gnss.runStatus = getRunStatus(gnssData);
    gnss.fixStatus = getFixStatus(gnssData);
    gnss.timeStamp = getTimeStamp(gnssData);
    gnss.coordonnees = coord;
    gnss.altitude = getAltitude(gnssData);
    // gnss.hdop = getHdopFromGnssData(gnssData);

    return gnss;
}
