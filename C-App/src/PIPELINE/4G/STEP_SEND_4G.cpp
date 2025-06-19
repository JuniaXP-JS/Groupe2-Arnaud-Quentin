#include "PIPELINE_GLOBAL.hpp"

StepSend4GState currentStep4G = STEP_SETUP_CATM1;

void step_send_4g_function()
{

    switch (currentStep4G)
    {
    case STEP_SETUP_CATM1:
        step_catm1_function();
        break;

    case STEP_SEND_CBOR:
        if (endCBOR)
        {
            pipelineSwitchCBOR(tableauJSONString.c_str());
        }
        else
        {
            period10min = millis();
            // listeCoordonnees.clear();
            tableauJSONString = "";
            currentStepGLOBAL = PipelineGLOBAL::STEP_END_GLOBAL;
            currentStepGLOBAL = PipelineGLOBAL::STEP_END_GLOBAL;
        }
        break;
    default:
        break;
    }
}