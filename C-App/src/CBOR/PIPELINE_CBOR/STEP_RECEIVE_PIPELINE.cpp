#include "pipeline.hpp"

/**
 * @file STEP_RECEIVE_PIPELINE.cpp
 * @brief Traite les messages CBOR reçus après l'envoi des données.
 *
 * Cette fonction analyse le contenu du dernier message CBOR reçu (lastReceivedCBOR) et adapte dynamiquement les options du pipeline :
 * - ajuste la période d'envoi si l'option "periode" est reçue,
 * - démarre le pipeline si l'option "start" est reçue,
 * - met à jour la précision GNSS si l'option "precision" est reçue.
 *
 * Elle affiche les informations reçues sur le port série pour le débogage.
 * À la fin du traitement, elle prépare la fermeture de la connexion en passant à l'étape STEP_CLOSE_CONNEXION.
 */
void STEP_RECEIVE_PIPELINE_FUNCTION()
{
    Serial.println("[STEP_RECEIVE_PIPELINE] Waiting for CBOR messages.......................................");

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