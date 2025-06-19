#include "pipeline.hpp"
#include "SIM7080G_SERIAL.hpp"

void STEP_INIT_CBOR_FUNCTION(const char *dataMessage)
{
    if (chrono(100))
    {
        // Serial.println("[STEP_INIT_CBOR] ");
        const char *message = dataMessage;
        Serial.println("[STEP_INIT_CBOR] message: " + String(message));
        // json j = message;
        json j = json::parse(message);

        // 2. Convert to CBOR
        cborDataPipeline = json::to_cbor(j);
        // HEX CBOR LOG
        // Serial.println("[CBOR DUMP]");
        for (uint8_t b : cborDataPipeline)
        {
            if (b < 16)
                Serial.print("0");
            Serial.print(b, HEX);
            Serial.print(" ");
        }
        Serial.println(); // end of line
        Serial.println(cborDataPipeline.size());
        Send_AT("AT+CACFG?", 500); // or better: a proper ATCommandTask
        String newCommand = String("AT+CASEND=0,") + String(cborDataPipeline.size());
        Serial.println(newCommand);

        // Recreate the taskCBOR_CASEND object
        if (taskCBOR_CASEND != nullptr)
        {
            Serial.println("----------- taskCBOR_SEND ----------------------|||||||||||");
            delete taskCBOR_CASEND; // If the object already existed, delete it to avoid a memory leak
        }
        taskCBOR_CASEND = new ATCommandTask(newCommand, ">", 3, 5000);
        taskCBOR_CASEND->onErrorCallback = [](ATCommandTask &task)
        {
            gnssPowerOnCommand.state = IDLE; // Reset the state of the task
            Serial.println("[STEP_INIT_CBOR] Erreur lors de l'envoi de la commande AT : " + task.command);
            Serial.println("[STEP_INIT_CBOR] État de la tâche : " + String(task.state));
            Serial.println("Appel callback d'erreur pour gérer l'échec de la tâche.");
            // if (machineCBOR.updateATState(taskCBOR_CLOSE))
            // {
            Serial.println("[STEP_CLOSE_CONNEXION] success");
            // taskCBOR_CLOSE.state = IDLE;
            // taskCBOR_CLOSE.isFinished = false;
            taskCBOR_CASEND->responseBuffer = ""; // Reset the response buffer
            taskCBOR_CASEND->state = IDLE;        // Reset the state of the task
            taskCBOR_CASEND->retryCount = 0;      // Reset the retry count
            taskCBOR_CASEND->isFinished = false;  // Reset the finished state

            // reboot_SIM7080G(); // reboot SIM7080G en cas d'erreur
            // delay(5000);       // Wait for the module to reboot
            endCBOR = true;
            currentStepGLOBAL = PipelineGLOBAL::STEP_INIT_GLOBAL;
            tableauJSONString = "";
            // }
        };

        currentStepCBOR = STEP_VERIFIER_CONNEXION;
        PERIODE_CBOR = millis();
        Serial.println("end of step init __________________________==================>" + String(currentStepCBOR));
    }
}