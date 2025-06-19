#include <unity.h>
#include "machineEtat.hpp"
#include "GLOBALS.hpp"

// Test MachineEtat class: transition from IDLE to SENDING
void test_machine_etat_idle_to_sending()
{
    Serial.println("Running test: test_machine_etat_idle_to_sending");
    MachineEtat machine;
    ATCommandTask task("AT+TEST", "OK", 3, 1000);

    // Initial state should be IDLE
    TEST_ASSERT_EQUAL(IDLE, task.state);

    // Update state to SENDING
    machine.updateATState(task);
    TEST_ASSERT_EQUAL(SENDING, task.state);
    Serial.println("test_machine_etat_idle_to_sending passed");
}

// Test MachineEtat class: response handling
void test_machine_etat_response_handling()
{
    Serial.println("Running test: test_machine_etat_response_handling");
    MachineEtat machine;
    ATCommandTask task("AT+TEST", "OK", 3, 1000);

    // Simulate a valid response
    task.state = WAITING_RESPONSE;
    task.responseBuffer = "OK";

    bool result = machine.analyzeResponse(task.responseBuffer, task.expectedResponse);
    TEST_ASSERT_TRUE(result); // Response should be valid
    Serial.println("test_machine_etat_response_handling passed");
}

// Test RETRY state: retryCount < MAX_RETRIES
void test_machine_etat_retry_success()
{
    Serial.println("Running test: test_machine_etat_retry_success");
    MachineEtat machine;
    ATCommandTask task("AT+TEST", "OK", 2, 1000);
    task.state = RETRY;
    task.retryCount = 0;
    bool result = machine.updateATState(task);
    TEST_ASSERT_FALSE(result); // Should return false, as it goes back to SENDING
    TEST_ASSERT_EQUAL(SENDING, task.state);
    TEST_ASSERT_EQUAL(1, task.retryCount);
    Serial.println("test_machine_etat_retry_success passed");
}

// Test RETRY state: retryCount >= MAX_RETRIES
void test_machine_etat_retry_fail()
{
    Serial.println("Running test: test_machine_etat_retry_fail");
    MachineEtat machine;
    ATCommandTask task("AT+TEST", "OK", 2, 1000);
    task.state = RETRY;
    task.retryCount = 2;
    bool result = machine.updateATState(task);
    TEST_ASSERT_FALSE(result); // Should return false, goes to ERROR
    TEST_ASSERT_EQUAL(ERROR, task.state);
    TEST_ASSERT_TRUE(task.isFinished);
    Serial.println("test_machine_etat_retry_fail passed");
}

// Test ERROR state
void test_machine_etat_error()
{
    Serial.println("Running test: test_machine_etat_error");
    MachineEtat machine;
    ATCommandTask task("AT+TEST", "OK", 2, 1000);
    task.state = ERROR;
    bool result = machine.updateATState(task);
    TEST_ASSERT_FALSE(result);           // Should return false
    TEST_ASSERT_EQUAL(IDLE, task.state); // Should go back to IDLE
    Serial.println("test_machine_etat_error passed");
}

// Test END state
void test_machine_etat_end()
{
    Serial.println("Running test: test_machine_etat_end");
    MachineEtat machine;
    ATCommandTask task("AT+TEST", "OK", 2, 1000);
    task.state = END;
    bool result = machine.updateATState(task);
    TEST_ASSERT_TRUE(result); // Should return true
    TEST_ASSERT_EQUAL(END, task.state);
    Serial.println("test_machine_etat_end passed");
}

// Test DEFAULT/PARSING state (unknown state)
void test_machine_etat_default()
{
    Serial.println("Running test: test_machine_etat_default");
    MachineEtat machine;
    ATCommandTask task("AT+TEST", "OK", 2, 1000);
    // Simulate an unknown state (PARSING)
    task.state = PARSING;
    bool result = machine.updateATState(task);
    TEST_ASSERT_FALSE(result);           // Should return false
    TEST_ASSERT_EQUAL(IDLE, task.state); // Should go back to IDLE
    Serial.println("test_machine_etat_default passed");
}