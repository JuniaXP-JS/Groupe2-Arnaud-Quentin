#include "pipeline.hpp"

/**
 * @file STEP_DEFINE_BYTE.cpp
 * @brief Définit la taille des données CBOR à envoyer et prépare l'étape d'écriture.
 *
 * Cette fonction vérifie si la commande AT+CASEND (qui indique la taille des données CBOR à envoyer) a bien été acceptée par le module.
 * Elle utilise la machine d'état pour surveiller la réponse à cette commande.
 * Si la commande est validée, elle passe à l'étape suivante du pipeline (STEP_WRITE) et réinitialise le timer du pipeline CBOR.
 * Cette étape est essentielle pour s'assurer que le module est prêt à recevoir les données CBOR.
 */
void STEP_DEFINE_BYTE_FUNCTION()
{
    if (chrono(1000))
    {
        Serial.println("[STEP_DEFINE_BYTE] init [STEP_DEFINE_BYTE] init [STEP_DEFINE_BYTE] init [STEP_DEFINE_BYTE] init [STEP_DEFINE_BYTE] init ");
        Serial.println(taskCBOR_CASEND->command);
        if (machineCBOR.updateATState(*taskCBOR_CASEND))
        {
            PERIODE_CBOR = millis();
            Serial.println("[STEP_DEFINE_BYTE] success");
            currentStepCBOR = STEP_WRITE;
        }
    }
}