#include "machineEtat.hpp"

// Constructor to initialize the ATCommandTask structure
ATCommandTask::ATCommandTask(String cmd, String expected, int maxRetries, unsigned long timeout)
    : state(IDLE), command(cmd), expectedResponse(expected), responseBuffer(""), lastSendTime(0),
      retryCount(0), MAX_RETRIES(maxRetries), TIMEOUT(timeout), isFinished(false), result(""),
      onErrorCallback(nullptr) {}

// State machine constructor
MachineEtat::MachineEtat() {}
unsigned long periodRandom = millis();
// State machine implementation
bool MachineEtat::updateATState(ATCommandTask &task)
{
    bool responseFound = false; // Added a boolean
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
            String response = Sim7080G.readStringUntil('\n'); // Read a full line
            response.trim();                                  // Clean spaces and line breaks

            Serial.println("[RESPONSE] " + response);

            // Add the line to the response buffer
            task.responseBuffer += response + "\n";

            // Check if the response contains the expected string
            bool responseOK = MachineEtat::analyzeResponse(task.responseBuffer, task.expectedResponse);
            if (responseOK)
            {
                responseFound = true;   // Mark the response as found
                task.isFinished = true; // ⬅️ Mark the task as finished
                task.state = END;
                Serial.println("[SUCCESS] Valid response for " + String(task.command));
                return true;
                // Immediately exit the while loop
            }
        }

        // Timeout only if no response was found within the determined time
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
            return false; // TO DO: replace with isBlocked or function that reboots
        }

    case ERROR:
        Serial.println("[ERROR] Problem with " + String(task.command));
        if (task.onErrorCallback)
        {
            task.onErrorCallback(task); // Call the command-specific callback
        }
        else
        {
            // Default behavior if no callback is defined
            Serial.println("[ERROR] No specific error handler, returning to IDLE.");
            task.state = IDLE;
            task.retryCount = 0;
            task.responseBuffer = "";
            task.isFinished = false;
        }
        return false;

    case END:
        return true; // The task is finished

    default:

        Serial.println("[DEFAULT] Unrecognized state for " + String(task.command));
        task.state = IDLE;
        return false; // The task had a problem
    }

    return false;
}

bool MachineEtat::analyzeResponse(const String &response, const String &expected)
{
    Serial.println("[ANALYZE] Analyzing response: " + response);
    if (response.length() == 0)
        return false; // Ignore if response is empty

    if (response.indexOf(expected) >= 0)
    {
        Serial.println("[MATCH] Complete response detected!");
        return true;
    }

    // Check if the response contains "OK" at the end, which is often an indicator
    if (response.endsWith("OK") || response.indexOf("ERROR") >= 0)
    {
        Serial.println("[INFO] Response detected but not complete...");
        return false;
    }

    return false;
}
