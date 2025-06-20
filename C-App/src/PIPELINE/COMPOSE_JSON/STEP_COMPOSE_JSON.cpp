/**
 * @file STEP_COMPOSE_JSON.cpp
 * @brief Génère le tableau JSON à partir des coordonnées GNSS collectées.
 *
 * Ce fichier est responsable de la création du tableau JSON contenant toutes les coordonnées GNSS à envoyer.
 * Pour chaque coordonnée, il construit une chaîne JSON avec l'IMEI, la latitude et la longitude, puis assemble toutes ces chaînes dans un tableau JSON global.
 * Ce tableau est ensuite prêt à être envoyé au serveur distant lors de l'étape suivante du pipeline.
 */

#include "PIPELINE_GLOBAL.hpp"

/**
 * @brief Compose le tableau JSON à partir des coordonnées GNSS.
 *
 * Pour chaque coordonnée GNSS collectée, cette fonction crée une chaîne JSON contenant l'IMEI, la latitude et la longitude.
 * Elle assemble ensuite toutes ces chaînes dans un tableau JSON global (tableauJSONString), prêt à être envoyé au serveur.
 */
void step_compose_json_function()
{
    for (int i = 0; i < nbCoordonnees; ++i)
    {
        String latitude = dataGNSS[i].gnss.coordonnees.latitude.full;
        String longitude = dataGNSS[i].gnss.coordonnees.longitude.full;

        listeCoordonnees[i].data = String("{\"imei\":\"") + imei +
                                   "\",\"latitude\":" + latitude +
                                   ",\"longitude\":" + longitude + "}";
    }
    tableauJSONString = "[";
    for (int i = 0; i < nbCoordonnees; ++i)
    {
        tableauJSONString += listeCoordonnees[i].data;
        if (i < nbCoordonnees - 1)
            tableauJSONString += ",";
    }
    tableauJSONString += "]";

    Serial.println("Sending coordinates to the remote server +++++++++++++++++");
    Serial.println(tableauJSONString);

    currentStepGLOBAL = PipelineGLOBAL::STEP_SEND_4G;
}