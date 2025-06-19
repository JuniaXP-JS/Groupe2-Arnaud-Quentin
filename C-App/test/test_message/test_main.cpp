#include <Arduino.h>
#include <unity.h>

// Prototypes of the test functions
void test_machine_etat_idle_to_sending();
void test_machine_etat_response_handling();
void test_machine_etat_retry_success();
void test_machine_etat_retry_fail();
void test_machine_etat_error();
void test_machine_etat_end();
void test_machine_etat_default();

void setup()
{
    UNITY_BEGIN();
    RUN_TEST(test_machine_etat_idle_to_sending);
    RUN_TEST(test_machine_etat_response_handling);
    RUN_TEST(test_machine_etat_retry_success);
    RUN_TEST(test_machine_etat_retry_fail);
    RUN_TEST(test_machine_etat_error);
    RUN_TEST(test_machine_etat_end);
    RUN_TEST(test_machine_etat_default);
    UNITY_END();
}

void loop() {}