#ifndef MACHINE_ETAT_HPP
#define MACHINE_ETAT_HPP

#include <Arduino.h>
#include "SIM7080G_SERIAL.hpp"
#include "GLOBALS.hpp"

// Definition of state machine states
enum ATState
{
    IDLE,
    SENDING,
    WAITING_RESPONSE,
    PARSING,
    RETRY,
    ERROR,
    END
};

// Structure to manage an AT task
struct ATCommandTask
{
    ATState state;
    String command;
    String expectedResponse;
    String responseBuffer;
    unsigned long lastSendTime;
    int retryCount;
    const int MAX_RETRIES;
    const unsigned long TIMEOUT;
    bool isFinished; // Added to block re-execution
    String result;

    // Added error callback
    void (*onErrorCallback)(ATCommandTask &task) = nullptr;

    ATCommandTask(String cmd, String expected, int maxRetries, unsigned long timeout);
};

// State machine class
class MachineEtat
{
public:
    MachineEtat();
    bool updateATState(ATCommandTask &task);
    bool analyzeResponse(const String &response, const String &expected);
};

#endif
