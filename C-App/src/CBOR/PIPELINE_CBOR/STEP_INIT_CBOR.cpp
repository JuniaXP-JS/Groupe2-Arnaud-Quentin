#include "pipeline.hpp"
#include "SIM7080G_SERIAL.hpp"

/**
 * @file STEP_INIT_CBOR.cpp
 * @brief Initialise la première étape du pipeline CBOR.
 *
 * Cette fonction prend un message JSON, le parse et le convertit en format binaire CBOR.
 * Elle affiche le contenu CBOR en hexadécimal sur le port série pour vérification.
 * Ensuite, elle prépare la commande AT+CASEND pour envoyer la taille des données CBOR au module SIM7080G.
 * Une tâche ATCommandTask est créée pour gérer l’envoi de cette commande, avec une gestion d’erreur personnalisée :
 * en cas d’échec, l’état du pipeline est réinitialisé et on revient à l’étape d’initialisation globale.
 * Enfin, la fonction passe à l’étape suivante du pipeline (STEP_VERIFIER_CONNEXION) et réinitialise le timer du pipeline CBOR.
 *
 * @param dataMessage Message JSON à convertir et envoyer.
 */
void STEP_INIT_CBOR_FUNCTION(const char *dataMessage)
{
    if (chrono(100))
    {
        const char *message = dataMessage;
        Serial.println("[STEP_INIT_CBOR] message: " + String(message));
        json j = json::parse(message);

        // 2. Convert to CBOR
        cborDataPipeline = json::to_cbor(j);
        for (uint8_t b : cborDataPipeline)
        {
            if (b < 16)
                Serial.print("0");
            Serial.print(b, HEX);
            Serial.print(" ");
        }
        Serial.println();
        Serial.println(cborDataPipeline.size());
        Send_AT("AT+CACFG?", 500);
        String newCommand = String("AT+CASEND=0,") + String(cborDataPipeline.size());
        Serial.println(newCommand);

        if (taskCBOR_CASEND != nullptr)
        {
            delete taskCBOR_CASEND;
        }
        taskCBOR_CASEND = new ATCommandTask(newCommand, ">", 3, 5000);
        taskCBOR_CASEND->onErrorCallback = [](ATCommandTask &task)
        {
            gnssPowerOnCommand.state = IDLE; // Reset the state of the task
            Serial.println("[STEP_INIT_CBOR] Erreur lors de l'envoi de la commande AT : " + task.command);
            Serial.println("[STEP_INIT_CBOR] État de la tâche : " + String(task.state));
            Serial.println("Appel callback d'erreur pour gérer l'échec de la tâche.");

            Serial.println("[STEP_CLOSE_CONNEXION] success");
            taskCBOR_CASEND->responseBuffer = ""; // Reset the response buffer
            taskCBOR_CASEND->state = IDLE;        // Reset the state of the task
            taskCBOR_CASEND->retryCount = 0;      // Reset the retry count
            taskCBOR_CASEND->isFinished = false;  // Reset the finished state
            endCBOR = true;
            currentStepGLOBAL = PipelineGLOBAL::STEP_INIT_GLOBAL;
            tableauJSONString = "";
        };

        currentStepCBOR = STEP_VERIFIER_CONNEXION;
        PERIODE_CBOR = millis();
    }
}