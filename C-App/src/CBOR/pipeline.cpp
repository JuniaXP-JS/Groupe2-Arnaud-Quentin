/**
 * @file pipeline.cpp
 * @brief Implémente le pipeline d'envoi des données GPS au format CBOR.
 *
 * Ce fichier définit un pipeline qui permet de passer d'étape en étape pour gérer l'envoi de données GPS au format CBOR.
 * Chaque étape du pipeline correspond à une action précise (initialisation, vérification de la connexion, ouverture, écriture, réception, fermeture, etc.).
 * La fonction principale pipelineSwitchCBOR() fait avancer l'automate d'état en appelant la fonction correspondant à l'étape courante.
 *
 * Ce mécanisme permet d'automatiser et de sécuriser l'envoi des données GPS, en s'assurant que chaque étape est bien réalisée avant de passer à la suivante.
 */
#include "pipeline.hpp"

// DEFINITION OF VARIABLES ESSENTIAL FOR THE PROPER FUNCTIONING OF THIS PIPELINE

/**
 * @brief État courant du pipeline CBOR (étape de l'automate).
 * Permet de savoir quelle fonction exécuter dans le pipeline.
 */
PipelineCBOR currentStepCBOR = STEP_INIT_CBOR;

/**
 * @brief Buffer contenant les données GPS encodées au format CBOR à envoyer.
 */
std::vector<uint8_t> cborDataPipeline;

/**
 * @brief Machine d'état utilisée pour gérer l'avancement et la validation des commandes AT dans le pipeline.
 */
MachineEtat machineCBOR;

/**
 * @brief Commande AT courante à envoyer ou en cours de traitement.
 */
String command;

/**
 * @brief Pointeur vers la tâche ATCommandTask utilisée pour l'envoi de la commande AT+CASEND (envoi des données CBOR).
 */
ATCommandTask *taskCBOR_CASEND = nullptr;

/**
 * @brief Indique si le pipeline CBOR est terminé (true = pipeline prêt à être relancé).
 */
boolean endCBOR = true;

/**
 * @brief Indique si la commande AT+CEREG? doit être réinitialisée (utilisé lors de la vérification de la connexion réseau).
 */
boolean resetCommandCEREG = false;

/**
 * @brief Indique si la commande AT+CAOPEN doit être réinitialisée (utilisé lors de l'ouverture de la connexion TCP).
 */
boolean resetCommandOPEN_CONNEXION = false;

/**
 * @brief Pointeur vers la tâche ATCommandTask actuellement en cours dans le pipeline.
 */
ATCommandTask *currentTaskCBOR = nullptr;

/**
 * @brief Tâche ATCommandTask pour fermer la connexion TCP (commande AT+CACLOSE).
 */
ATCommandTask taskCBOR_CLOSE("AT+CACLOSE=0", "OK", 15, 100);

// PIPELINE
void pipelineSwitchCBOR(const char *dataMessage)
{

    switch (currentStepCBOR)
    {

    case STEP_INIT_CBOR:
        STEP_INIT_CBOR_FUNCTION(dataMessage);
        break;

    case STEP_VERIFIER_CONNEXION:
        STEP_VERIFIER_CONNEXION_FUNCTION();
        break;

    case STEP_OPEN_CONNEXION:
        STEP_OPEN_CONNEXION_FUNCTION();
        break;

    case STEP_DEFINE_BYTE:
        STEP_DEFINE_BYTE_FUNCTION();
        break;

    case STEP_WRITE:
        STEP_WRITE_FUNCTION();
        break;

    case STEP_RECEIVE:
        STEP_RECEIVE_FUNCTION();
        break;

    case STEP_RECEIVE_PIPELINE:
        STEP_RECEIVE_PIPELINE_FUNCTION();
        break;

    case STEP_CLOSE_CONNEXION:
        STEP_CLOSE_CONNEXION_FUNCTION();
        break;

    case STEP_END:
        STEP_END_FUNCTION();
        break;
    }
}

boolean chrono(uint16_t time)
{
    return ((millis() - PERIODE_CBOR) > time);
}
