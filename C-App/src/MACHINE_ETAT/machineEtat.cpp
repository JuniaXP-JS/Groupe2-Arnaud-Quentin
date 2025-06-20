/**
 * @file machineEtat.cpp
 * @brief Implémente une machine d'état pour la gestion asynchrone des commandes AT vers le module SIM7080G.
 *
 * Ce fichier contient la logique d'une machine d'état (state machine) permettant de piloter l'envoi, la réception,
 * la gestion des réponses, des timeouts et des erreurs pour toutes les commandes AT envoyées au module SIM7080G.
 * Chaque tâche ATCommandTask évolue selon plusieurs états (IDLE, SENDING, WAITING_RESPONSE, RETRY, ERROR, END)
 * afin d'assurer la robustesse et la fiabilité de la communication série avec le module.
 *
 * La machine d'état gère automatiquement les retries, les délais d'attente, l'analyse des réponses attendues,
 * et permet de définir des callbacks d'erreur spécifiques pour chaque commande.
 * Elle centralise ainsi toute la gestion asynchrone des échanges AT dans le projet.
 */

#include "machineEtat.hpp"

ATCommandTask::ATCommandTask(String cmd, String expected, int maxRetries, unsigned long timeout)
    : state(IDLE), command(cmd), expectedResponse(expected), responseBuffer(""), lastSendTime(0),
      retryCount(0), MAX_RETRIES(maxRetries), TIMEOUT(timeout), isFinished(false), result(""),
      onErrorCallback(nullptr) {}

MachineEtat::MachineEtat() {}
unsigned long periodRandom = millis();
bool MachineEtat::updateATState(ATCommandTask &task)
{
    bool responseFound = false;
    switch (task.state)
    {
    case IDLE:
        Serial.println("[IDLE] Ready to send: " + String(task.command));
        task.retryCount = 0;
        task.responseBuffer = "";
        task.state = SENDING;
        return false;

    case SENDING:
        Serial.println("[SENDING] Sending: " + String(task.command));
        Sim7080G.println(task.command);
        task.lastSendTime = millis();
        task.state = WAITING_RESPONSE;
        return false;

    case WAITING_RESPONSE:

        while (Sim7080G.available())
        {
            String response = Sim7080G.readStringUntil('\n');
            response.trim();

            Serial.println("[RESPONSE] " + response);

            task.responseBuffer += response + "\n";

            bool responseOK = MachineEtat::analyzeResponse(task.responseBuffer, task.expectedResponse);
            if (responseOK)
            {
                responseFound = true;
                task.isFinished = true;
                task.state = END;
                Serial.println("[SUCCESS] Valid response for " + String(task.command));
                return true;
            }
        }

        if (millis() - task.lastSendTime > task.TIMEOUT)
        {
            Serial.println("[TIMEOUT] No complete response for " + String(task.command));
            task.state = RETRY;
            return false;
        }
        break;

    case RETRY:
        if (task.retryCount < task.MAX_RETRIES)
        {
            task.retryCount++;
            Serial.println("[RETRY] Attempt " + String(task.retryCount) + " for " + String(task.command));
            task.state = SENDING;
            return false;
        }
        else
        {
            Serial.println("[ERROR] Failed after " + String(task.MAX_RETRIES) + " tries for " + String(task.command));
            task.state = ERROR;
            task.isFinished = true;
            return false;
        }

    case ERROR:
        Serial.println("[ERROR] Problem with " + String(task.command));
        if (task.onErrorCallback)
        {
            task.onErrorCallback(task);
        }
        else
        {
            Serial.println("[ERROR] No specific error handler, returning to IDLE.");
            task.state = IDLE;
            task.retryCount = 0;
            task.responseBuffer = "";
            task.isFinished = false;
        }
        return false;

    case END:
        return true;

    default:

        Serial.println("[DEFAULT] Unrecognized state for " + String(task.command));
        task.state = IDLE;
        return false;
    }

    return false;
}

bool MachineEtat::analyzeResponse(const String &response, const String &expected)
{
    Serial.println("[ANALYZE] Analyzing response: " + response);
    if (response.length() == 0)
        return false;

    if (response.indexOf(expected) >= 0)
    {
        Serial.println("[MATCH] Complete response detected!");
        return true;
    }

    if (response.endsWith("OK") || response.indexOf("ERROR") >= 0)
    {
        Serial.println("[INFO] Response detected but not complete...");
        return false;
    }

    return false;
}
