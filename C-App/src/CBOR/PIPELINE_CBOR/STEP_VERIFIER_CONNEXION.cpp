#include "pipeline.hpp"

ATCommandTask taskCBOR_CEREG("AT+CEREG?", "+CEREG: 0,5", 15, 100);
/**
 * @file STEP_VERIFIER_CONNEXION.cpp
 * @brief Vérifie l’état de la connexion réseau avant d’envoyer les données CBOR.
 *
 * Cette fonction envoie la commande AT+CEREG? pour s’assurer que le module est bien enregistré sur le réseau (attend la réponse "+CEREG: 0,5").
 * Si la connexion n’est pas encore validée, elle met à jour l’état de la machine d’état et attend la fin de la commande.
 * Une fois la connexion confirmée, elle passe à l’étape suivante du pipeline (STEP_OPEN_CONNEXION) et réinitialise les états nécessaires.
 */
void STEP_VERIFIER_CONNEXION_FUNCTION()
{

    if (chrono(100))
    {
        Serial.println("[STEP_VERIFIER_CONNEXION] init iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        if (resetCommandCEREG)
        {
        }
        if (!taskCBOR_CEREG.isFinished)
        {
            machineCBOR.updateATState(taskCBOR_CEREG);
            currentTaskCBOR = &taskCBOR_CEREG;
            PERIODE_CBOR = millis();
        }
        else
        {
            Serial.println("[STEP_VERIFIER_CONNEXION] success");
            currentStepCBOR = STEP_OPEN_CONNEXION;
            PERIODE_CBOR = millis();
            taskCBOR_CEREG.state = IDLE;
            taskCBOR_CEREG.isFinished = false;
            resetCommandCEREG = false;
        }
    }
}
