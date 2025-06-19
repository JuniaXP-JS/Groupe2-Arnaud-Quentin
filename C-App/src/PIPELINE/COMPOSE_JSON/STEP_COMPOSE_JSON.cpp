#include "PIPELINE_GLOBAL.hpp"

void step_compose_json_function()
{
    // String imei = readSimIdFromEEPROM(); // or getEsp32Id();

    // Create the JSON string for each coordinate from dataGNSS
    for (int i = 0; i < nbCoordonnees; ++i)
    {
        // Retrieve coordinates from dataGNSS
        String latitude = dataGNSS[i].gnss.coordonnees.latitude.full;
        String longitude = dataGNSS[i].gnss.coordonnees.longitude.full;

        listeCoordonnees[i].data = String("{\"imei\":\"") + imei +
                                   "\",\"latitude\":" + latitude +
                                   ",\"longitude\":" + longitude + "}";
    }
    // Create the tableauJSONString JSON (array of messages)
    tableauJSONString = "[";
    for (int i = 0; i < nbCoordonnees; ++i)
    {
        tableauJSONString += listeCoordonnees[i].data;
        if (i < nbCoordonnees - 1)
            tableauJSONString += ",";
    }
    tableauJSONString += "]";

    Serial.println("Sending coordinates to the remote server +++++++++++++++++");
    Serial.println(tableauJSONString);

    currentStepGLOBAL = PipelineGLOBAL::STEP_SEND_4G;

    // Sending or processing tableauJSONString
    // pipelineSwitchCBOR(tableauJSONString.c_str());
}