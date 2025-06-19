#include "pipeline.hpp"
// ATCommandTask taskCBOR_CLOSE("AT+CACLOSE=0", "OK", 15, 100);
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