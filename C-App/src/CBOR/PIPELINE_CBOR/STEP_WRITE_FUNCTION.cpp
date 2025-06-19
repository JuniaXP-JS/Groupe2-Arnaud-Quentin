#include "pipeline.hpp"

void STEP_WRITE_FUNCTION()
{
    if (chrono(100))
    {
        Serial.println("[STEP_WRITE] Sending CBOR...");

        // Send CBOR binary
        Sim7080G.write(cborDataPipeline.data(), cborDataPipeline.size());

        Serial.println("[STEP_WRITE] CBOR sent");
        Serial.print("Bytes: ");
        Serial.println(cborDataPipeline.size());

        // Move to the next step
        currentStepCBOR = STEP_RECEIVE;
        PERIODE_CBOR = millis();
    }
}
