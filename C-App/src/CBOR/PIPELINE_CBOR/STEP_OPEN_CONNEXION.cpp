#include "pipeline.hpp"

ATCommandTask taskCBOR_OPEN_CONNEXION("AT+CAOPEN=0,0,\"TCP\"," + (String)PINGGY_LINK + "," + (String)PINGGY_PORT, "OK", 15, 8000);
/**
 * @file STEP_OPEN_CONNEXION.cpp
 * @brief Ouvre la connexion TCP pour l'envoi des données CBOR.
 *
 * Cette fonction envoie la commande AT+CAOPEN pour ouvrir une connexion TCP vers le serveur cible.
 * Elle attend la réponse "OK" pour valider l'ouverture de la connexion.
 * Si la connexion n'est pas encore ouverte, elle met à jour l'état de la machine d'état et attend la fin de la commande.
 * Une fois la connexion ouverte, elle passe à l'étape suivante du pipeline (STEP_DEFINE_BYTE) et réinitialise les états nécessaires.
 */
void STEP_OPEN_CONNEXION_FUNCTION()
{

    if (chrono(100))
    {
        Serial.println("[STEP_OPEN_CONNEXION] init ########################################INIT INIT ");

        if (resetCommandOPEN_CONNEXION)
        {
        }
        if (!taskCBOR_OPEN_CONNEXION.isFinished)
        {
            machineCBOR.updateATState(taskCBOR_OPEN_CONNEXION);
            currentTaskCBOR = &taskCBOR_OPEN_CONNEXION;
            PERIODE_CBOR = millis();
        }
        else
        {
            Serial.println("[STEP_OPEN_CONNEXION] success");
            currentStepCBOR = STEP_DEFINE_BYTE;
            PERIODE_CBOR = millis();
            taskCBOR_OPEN_CONNEXION.state = IDLE;
            taskCBOR_OPEN_CONNEXION.isFinished = false;
            resetCommandOPEN_CONNEXION = false;
        }
    }
}