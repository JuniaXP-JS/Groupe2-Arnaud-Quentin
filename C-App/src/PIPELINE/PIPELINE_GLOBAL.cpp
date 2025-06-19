#include "PIPELINE_GLOBAL.hpp"

// Ensure PipelineGLOBAL is only defined once and included properly
// Make sure the enum and variable are correctly declared
// Example enum (move to PIPELINE_GLOBAL.hpp if not already there):

PipelineGLOBAL currentStepGLOBAL = PipelineGLOBAL::STEP_INIT_GLOBAL;
// bool afficherDepuisMemoire = false;
// bool oneRun = true;

// PIPELINE

/**
 * @var PipelineGLOBAL currentStepGLOBAL
 * @brief Variable globale indiquant l'étape courante du pipeline global.
 */

/**
 * @brief Fonction principale du pipeline global.
 *
 * Exécute l'étape courante du pipeline en fonction de la machine d'état :
 * - STEP_INIT_GLOBAL : Initialisation du pipeline.
 * - STEP_GNSS : Acquisition des données GNSS.
 * - STEP_COMPOSE_JSON : Composition du message JSON.
 * - STEP_SEND_4G : Envoi des données via 4G.
 * - STEP_END_GLOBAL : Fin du pipeline et attente avant redémarrage.
 */
void pipelineGlobal()
{

  switch (currentStepGLOBAL)
  {

  case STEP_INIT_GLOBAL:
    Serial.println("---------------------- Lancement Pipelie GLOBAL -------------------------------");
    currentStepGLOBAL = PipelineGLOBAL::STEP_GNSS;
    break;

  case STEP_GNSS:
    step_gnss_function();
    break;

  case STEP_COMPOSE_JSON:
    step_compose_json_function();
    break;

  case STEP_SEND_4G:
    step_send_4g_function();
    break;

  case STEP_END_GLOBAL:
    Serial.println("===================================== STEP_END_GLOBAL =====================================");
    if ((millis() - period10min) > periodeAjustement)
    {
      endCBOR = true;
      currentStepGLOBAL = PipelineGLOBAL::STEP_INIT_GLOBAL;
      tableauJSONString = "";
      stepReceiveFunctionBoolean = true;
    }
    break;
  }
}