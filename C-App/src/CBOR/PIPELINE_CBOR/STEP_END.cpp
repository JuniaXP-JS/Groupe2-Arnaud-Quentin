#include "pipeline.hpp"

/**
 * @file STEP_END.cpp
 * @brief Termine le pipeline CBOR et réinitialise les variables pour un prochain envoi.
 *
 * Cette fonction marque la fin du pipeline CBOR : elle affiche un message de fin, réinitialise l'étape courante à STEP_INIT_CBOR,
 * remet à zéro les variables et buffers utilisés pour l'envoi CBOR, et prépare la liste des coordonnées pour un nouvel envoi.
 * Si des coordonnées restent à envoyer, elle marque la première comme terminée et décale la liste.
 */
void STEP_END_FUNCTION()
{
    if (endCBOR)
    {
        Serial.println("[STEP_END] ");
        Serial.println("#######################################################END CBOR############################################");
        currentStepCBOR = STEP_INIT_CBOR;
        endCBOR = false;
        taskCBOR_CASEND = nullptr;
        command = "";
        cborDataPipeline.clear();

        if (nbCoordonnees > 0)
        {
            listeCoordonnees[0].endCBOR = true;
            for (int i = 1; i < nbCoordonnees; ++i)
            {
                listeCoordonnees[i - 1] = listeCoordonnees[i];
            }
            nbCoordonnees--;
        }
    }
}