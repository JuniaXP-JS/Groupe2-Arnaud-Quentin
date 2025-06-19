#ifndef PIPELINE
#define PIPELINE

#include <Arduino.h>
#include "machineEtat.hpp"
#include "GLOBALS.hpp"
#include "PIPELINE_GLOBAL.hpp"
#include "STEP_GNSS.hpp"
#include "RECEIVE.hpp"
#include <vector>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

enum ProcessStep
{
    STEP_INIT,
    STEP_WAIT_SIM,
    STEP_CONFIG_CATM1,
    STEP_WAIT_CNACT,
    STEP_DONE
};

enum PipelineCBOR
{
    STEP_INIT_CBOR,
    STEP_VERIFIER_CONNEXION,
    STEP_OPEN_CONNEXION,
    STEP_DEFINE_BYTE,
    STEP_WRITE,
    STEP_RECEIVE,
    STEP_RECEIVE_PIPELINE, // Pour recevoir les messages CBOR
    STEP_CLOSE_CONNEXION,
    STEP_END

};

// FONCTION de test pour envoyer un message minimal
// void sendMinimalCBORMessage();

// FONCTION qui est appelé depuis le main.cpp pour envoyer un message CBOR au serveur distant
// void sendMessageCBOR(const char *dataMessage);

// FONCTION pour appeler la pipeline
void pipelineSwitchCBOR(const char *dataMessage);

// FONCTION pour gérer le temps d'execution des étapes
boolean chrono(uint16_t time);

// Les fonctions dans la pipeline
void STEP_INIT_CBOR_FUNCTION(const char *dataMessage);
void STEP_VERIFIER_CONNEXION_FUNCTION();
void STEP_OPEN_CONNEXION_FUNCTION();
void STEP_DEFINE_BYTE_FUNCTION();
void STEP_WRITE_FUNCTION();
void STEP_RECEIVE_FUNCTION();
void STEP_RECEIVE_PIPELINE_FUNCTION();
void STEP_CLOSE_CONNEXION_FUNCTION();
void STEP_END_FUNCTION();

extern ATCommandTask taskCBOR_CLOSE;

// DEFINITION DE VARIABLES GLOBALES
extern std::vector<uint8_t> cborDataPipeline;
extern ATCommandTask *taskCBOR_CASEND;
extern PipelineCBOR currentStepCBOR;
extern MachineEtat machineCBOR;
extern ATCommandTask *currentTaskCBOR;
extern boolean endCBOR;
extern boolean resetCommandCEREG;
extern boolean resetCommandOPEN_CONNEXION;
extern String command;
#endif