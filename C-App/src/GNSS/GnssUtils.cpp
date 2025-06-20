/**
 * @file GnssUtils.cpp
 * @brief Utilitaires pour la gestion et la validation des coordonnées GNSS.
 *
 * Ce fichier permet de récupérer les coordonnées GPS à partir du module GNSS.
 * La fonction principale, getGNSSValid(), appelle getGnssResponse() qui se charge de parser la réponse brute et de renvoyer une structure Gnss.
 *
 * La validité des coordonnées latitude et longitude est vérifiée : on considère qu'elles sont valides si elles sont différentes de 0.
 * (On peut aussi, comme montré en commentaire, vérifier qu'elles sont différentes de 47 et 4, qui sont des valeurs par défaut, afin d'attendre de vraies coordonnées GPS.)
 *
 * Une section (commentée) permettrait aussi de vérifier la précision HDOP, mais pour simplifier, ce critère est désactivé afin de toujours récupérer des coordonnées.
 *
 * Les fonctions shiftLeftDataGNSS() et addGNSSInDataGNSS() servent à gérer un tableau de coordonnées GNSS :
 * - shiftLeftDataGNSS() décale toutes les coordonnées d'une case vers la gauche pour faire de la place.
 * - addGNSSInDataGNSS() ajoute une nouvelle coordonnée GNSS dans le tableau, en supprimant la plus ancienne si le tableau est plein.
 */
#include "GnssUtils.hpp"

Gnss getGNSSValid()
{
    Gnss responseGNSS = getGnssResponse();

    Float_gnss lat = responseGNSS.coordonnees.latitude;
    Float_gnss lng = responseGNSS.coordonnees.longitude;
    // Float_gnss hdop = responseGNSS.hdop;
    String ts = responseGNSS.timeStamp;

    bool latValide = ((lat.ent != 0) || lat.dec != 0);
    bool lngValide = ((lng.ent != 0) || lng.dec != 0);
    // bool latValide = ((lat.ent != 0) || lat.dec != 0) && (lat.ent != 47);
    // bool lngValide = ((lng.ent != 0) || lng.dec != 0) && (lng.ent != 4);

    // Vérification de la précision HDOP seulement si l'option est active
    bool hdopValide = true;
    if (gnssOptions.precisionActive)
    {
        // hdopValide = (hdop.ent < gnssOptions.precision);
    }

    if (latValide && lngValide && hdopValide)
    {
        responseGNSS.coordonnees.latitude.full = String(lat.ent) + "." + String(lat.dec);
        responseGNSS.coordonnees.longitude.full = String(lng.ent) + "." + String(lng.dec);
        responseGNSS.isValid = true;
    }
    // else if (gnssOptions.precisionActive && !hdopValide)
    // {
    //     Serial.print("[GNSS] Point ignoré : HDOP trop élevé (");
    //     // Serial.print(hdop.full);
    //     Serial.print(" >= ");
    //     Serial.print(gnssOptions.precision);
    //     Serial.println(")");
    // }

    return responseGNSS;
}

void shiftLeftDataGNSS(DataGNSS *array, int &nbCoordonnees)
{
    for (int i = 1; i < nbCoordonnees; ++i)
    {
        array[i - 1] = array[i];
    }
    nbCoordonnees--;
}

void addGNSSInDataGNSS(Gnss gnss)
{
    if (nbCoordonnees >= MAX_COORDS)
    {
        shiftLeftDataGNSS(dataGNSS, nbCoordonnees);
    }
    if (nbCoordonnees < MAX_COORDS)
    {
        dataGNSS[nbCoordonnees].gnss = gnss;
        nbCoordonnees++;
    }
}
