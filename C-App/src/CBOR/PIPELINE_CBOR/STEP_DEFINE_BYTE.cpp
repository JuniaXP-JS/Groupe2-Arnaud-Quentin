#include "pipeline.hpp"

void STEP_DEFINE_BYTE_FUNCTION()
{
    if (chrono(1000))
    {
        Serial.println("[STEP_DEFINE_BYTE] init [STEP_DEFINE_BYTE] init [STEP_DEFINE_BYTE] init [STEP_DEFINE_BYTE] init [STEP_DEFINE_BYTE] init ");
        Serial.println(taskCBOR_CASEND->command);
        if (machineCBOR.updateATState(*taskCBOR_CASEND))
        {
            PERIODE_CBOR = millis();
            Serial.println("[STEP_DEFINE_BYTE] success");
            currentStepCBOR = STEP_WRITE;
        }
    }
}