#include "pipeline.hpp"

void STEP_RECEIVE_PIPELINE_FUNCTION()
{
    Serial.println("[STEP_RECEIVE_PIPELINE] Waiting for CBOR messages.......................................");
    // periodeAjustement = 5000UL; // 5 secondes
    // Serial.print("periodeAjustement = ");
    // Serial.println(periodeAjustement);

    Serial.print("lastReceivedCBOR = ");
    Serial.println(lastReceivedCBOR.dump().c_str());

    // Gestion dynamique des options reçues
    if (lastReceivedCBOR.contains("periode"))
    {
        periodeAjustement = lastReceivedCBOR["periode"];
        Serial.print("[CBOR] Nouvelle periodeAjustement = ");
        Serial.println(periodeAjustement);
    }
    if (lastReceivedCBOR.contains("start"))
    {
        if (lastReceivedCBOR["start"] == true)
        {
            Serial.println("[CBOR] Option start reçue : démarrage pipeline !");
            START_PIPELINE = true;
        }
    }
    if (lastReceivedCBOR.contains("precision"))
    {
        gnssOptions.precision = lastReceivedCBOR["precision"]["valeur"];
        gnssOptions.precisionActive = lastReceivedCBOR["precision"]["active"];
        Serial.print("[CBOR] Nouvelle précision GNSS = ");
        Serial.println(gnssOptions.precision);
        Serial.print("[CBOR] Précision GNSS active = ");
        Serial.println(gnssOptions.precisionActive ? "true" : "false");
    }
    // Ajoute ici d'autres options à gérer selon tes besoins

    stepReceiveFunctionBoolean = true;
    currentStepCBOR = STEP_CLOSE_CONNEXION;
}