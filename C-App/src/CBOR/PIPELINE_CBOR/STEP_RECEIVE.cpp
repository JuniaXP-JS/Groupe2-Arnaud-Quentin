#include "pipeline.hpp"

void STEP_RECEIVE_FUNCTION()
{
    if (stepReceiveFunctionBoolean)
    {
        receive();
        stepReceiveFunctionBoolean = false; // Set to false to avoid re-entering this step immediately
    }
    else if (receiveMessage)
    {
        // If we are still receiving messages, we can stay in this step
        currentStepCBOR = STEP_RECEIVE_PIPELINE;
        receiveMessage = false; // Reset the flag to avoid re-entering this step immediately
    }
    else
    {
        // Move to the next step
        currentStepCBOR = STEP_CLOSE_CONNEXION;
    }
}