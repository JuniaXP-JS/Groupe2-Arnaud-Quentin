/**
 * @file SIM7080G_CATM1.cpp
 * @brief Gère l'établissement et la gestion de la connexion 4G (CAT-M1) avec le module SIM7080G.
 *
 * Ce fichier implémente un pipeline d'étapes pour configurer et établir la connexion 4G (CAT-M1) :
 * - Activation du mode CAT-M1 et configuration du profil réseau.
 * - Vérification de l'enregistrement réseau et de l'état PDP.
 * - Récupération d'informations sur la connexion (APN, opérateur, signal, etc.).
 * - Passage à l'étape suivante du pipeline une fois la connexion établie.
 *
 * Il permet ainsi de s'assurer que le module 4G est prêt à transmettre les données au serveur distant.
 */

#include "SIM7080G_CATM1.hpp"
#include "SIM7080G_SERIAL.hpp"

ATCommandTask taskCATM1_CEREG("AT+CEREG?", "+CEREG: 0,5", 15, 100);
ATCommandTask taskCATM1_CGDCONT("AT+CGDCONT=1,\"IP\",\"iot.1nce.net\"", "OK", 10, 100);
MachineEtat machineCATM1;

enum StepCATM1State
{
    CATM1_POWER_ON,
    CATM1_CGDCONT,
    CATM1_INFO,
    CATM1_POWER_OFF,
    CATM1_DONE
};

StepCATM1State currentStepCATM1 = CATM1_POWER_ON;

String findSelect(String data, String nameStart, int numberPassAfterNameStart, String symbolToSelectStart, String symbolToEnd)
{
    Serial.print("millis de findSelect" + (String)millis());
    int indexStart = data.indexOf(nameStart, 0);
    int indexAfterStart = indexStart + numberPassAfterNameStart;
    int indexSymbolStart = data.indexOf(symbolToSelectStart, indexAfterStart);
    int numberBetween_symbolStart_symbolEnd = data.indexOf(symbolToEnd, indexSymbolStart + 1);
    String result = data.substring(indexSymbolStart + 1, numberBetween_symbolStart_symbolEnd);
    Serial.println(" voici le findSelect");
    Serial.println("=============data : " + data);
    Serial.println("indexStart: " + (String)indexStart);
    Serial.println("indexAfterStart: " + (String)indexAfterStart);
    Serial.println("indexSymbolStart: " + (String)indexSymbolStart);
    Serial.println("numberBetween_symbolStart_symbolEnd: " + (String)numberBetween_symbolStart_symbolEnd);
    Serial.println("résultat : " + result);
    return result;
}

void step_catm1_function()
{
    switch (currentStepCATM1)
    {
    case CATM1_POWER_ON:
        Serial.println("[CATM1_POWER_ON]");
        Send_AT("AT+CNMP=38");
        Send_AT("AT+CMNB=1");

        Send_AT("AT+CNACT=0,0");
        currentStepCATM1 = CATM1_CGDCONT;

        break;

    case CATM1_CGDCONT:
        if (machineCATM1.updateATState(taskCATM1_CGDCONT))
        {
            Send_AT("AT+CGNAPN");
            Send_AT("AT+CNCFG=0,1,iot.1nce.net");
            currentStepCATM1 = CATM1_INFO;
        }
        break;

    case CATM1_INFO:
        Serial.println("[CATM1_INFO]");
        if (machineCATM1.updateATState(taskCATM1_CEREG))
        {
            String resultPDP = findSelect(Send_AT("AT+CNACT=0,1", 15000), "PDP", 4, ",", " ");
            if (resultPDP == "ACTIVE")
            {
                Serial.print("ACTIVE detecté");
            }

            Send_AT("AT+CGATT?");
            Send_AT("AT+CNACT?", 3000);
            String resultCNACT = findSelect(Send_AT("AT+CNACT?", 3000), "+CNACT:", 12, "\"", ".");
            if (resultCNACT == "10")
            {
                Serial.println("10 detecté");
            }
            Send_AT("AT+GSN");
            Send_AT("AT+CCID");
            Send_AT("AT+COPS?");
            Send_AT("AT+CEREG?");
            Send_AT("AT+CSQ");
            currentStepCATM1 = CATM1_DONE;
        }
        break;

    case CATM1_POWER_OFF:
        Serial.println("[CATM1_POWER_OFF]");
        currentStepCATM1 = CATM1_DONE;
        break;

    case CATM1_DONE:
        Serial.println("[CATM1_DONE]");
        currentStep4G = STEP_SEND_CBOR;
        break;
    }
}
