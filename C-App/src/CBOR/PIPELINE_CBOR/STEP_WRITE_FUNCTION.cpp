#include "pipeline.hpp"

/**
 * @file STEP_WRITE_FUNCTION.cpp
 * @brief Envoie les données CBOR au module SIM7080G.
 *
 * Cette fonction envoie le buffer binaire CBOR via la liaison série au module SIM7080G.
 * Elle affiche sur le port série le nombre d'octets envoyés pour vérification.
 * Une fois l'envoi terminé, elle passe à l'étape suivante du pipeline (STEP_RECEIVE) et réinitialise le timer du pipeline CBOR.
 */
void STEP_WRITE_FUNCTION()
{
    if (chrono(100))
    {
        Serial.println("[STEP_WRITE] Sending CBOR...");

        Sim7080G.write(cborDataPipeline.data(), cborDataPipeline.size());

        Serial.println("[STEP_WRITE] CBOR sent");
        Serial.print("Bytes: ");
        Serial.println(cborDataPipeline.size());

        currentStepCBOR = STEP_RECEIVE;
        PERIODE_CBOR = millis();
    }
}
