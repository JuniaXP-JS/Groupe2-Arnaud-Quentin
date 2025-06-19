#include "pipeline.hpp"

ATCommandTask taskCBOR_CEREG("AT+CEREG?", "+CEREG: 0,5", 15, 100);
void STEP_VERIFIER_CONNEXION_FUNCTION()
{

    if (chrono(100))
    {
        Serial.println("[STEP_VERIFIER_CONNEXION] init iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        if (resetCommandCEREG)
        {
        }
        if (!taskCBOR_CEREG.isFinished)
        {
            machineCBOR.updateATState(taskCBOR_CEREG);
            currentTaskCBOR = &taskCBOR_CEREG;
            PERIODE_CBOR = millis();
        }
        else
        {
            Serial.println("[STEP_VERIFIER_CONNEXION] success");
            currentStepCBOR = STEP_OPEN_CONNEXION;
            PERIODE_CBOR = millis();
            taskCBOR_CEREG.state = IDLE;
            taskCBOR_CEREG.isFinished = false;
            resetCommandCEREG = false;
        }
    }
}
