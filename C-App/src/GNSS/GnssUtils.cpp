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
