#include "pipeline.hpp"

/**
 * @file STEP_RECEIVE.cpp
 * @brief Gère la réception de la réponse après l'envoi des données CBOR.
 *
 * Cette fonction appelle la fonction receive() pour traiter la réponse du module SIM7080G après l'envoi des données CBOR.
 * Elle utilise des indicateurs pour savoir si la réception est terminée ou si elle doit rester dans cette étape.
 * Une fois la réception terminée, elle passe à l'étape suivante du pipeline (STEP_CLOSE_CONNEXION).
 */
void STEP_RECEIVE_FUNCTION()
{
    if (stepReceiveFunctionBoolean)
    {
        receive();
        stepReceiveFunctionBoolean = false;
    }
    else if (receiveMessage)
    {
        currentStepCBOR = STEP_RECEIVE_PIPELINE;
        receiveMessage = false;
    }
    else
    {
        currentStepCBOR = STEP_CLOSE_CONNEXION;
    }
}