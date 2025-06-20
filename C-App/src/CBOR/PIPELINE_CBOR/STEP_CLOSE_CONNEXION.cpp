#include "pipeline.hpp"
// ATCommandTask taskCBOR_CLOSE("AT+CACLOSE=0", "OK", 15, 100);
/**
 * @file STEP_CLOSE_CONNEXION.cpp
 * @brief Ferme la connexion TCP après l'envoi des données CBOR.
 *
 * Cette fonction envoie la commande AT+CACLOSE pour fermer la connexion TCP avec le serveur.
 * Elle utilise la machine d'état pour vérifier que la fermeture est bien prise en compte.
 * Une fois la connexion fermée, elle réinitialise l'état de la tâche et passe à l'étape finale du pipeline (STEP_END).
 */
void STEP_CLOSE_CONNEXION_FUNCTION()
{
    if (chrono(100))
    {
        Serial.println("[STEP_CLOSE_CONNEXION] init");

        if (machineCBOR.updateATState(taskCBOR_CLOSE))
        {
            Serial.println("[STEP_CLOSE_CONNEXION] success");
            taskCBOR_CLOSE.state = IDLE;
            taskCBOR_CLOSE.isFinished = false;
            currentStepCBOR = STEP_END;
        }
    }
}