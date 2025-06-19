#include <Arduino.h>
#include <unity.h>

// Prototypes of test functions (adapt according to your files)
void test_pipelineglobal_enum_values();
void test_pipelineglobal_state_transition();
void test_pipelineglobal_dummy();

// 4G
void test_step_catm1_function_compiles();
void test_step_send_4g_compiles();

// COMPOSE_JSON
void test_step_compose_json_compiles();

// GNSS
void test_gnss_state_enum_values();
void test_gnss_step_state_global();
void test_gnss_turn_on_off();

void setup()
{
    UNITY_BEGIN();
    // Tests from the current folder
    RUN_TEST(test_pipelineglobal_enum_values);
    RUN_TEST(test_pipelineglobal_state_transition);
    RUN_TEST(test_pipelineglobal_dummy);

    // Tests from the 4G subfolder
    RUN_TEST(test_step_catm1_function_compiles);
    RUN_TEST(test_step_send_4g_compiles);

    // Tests from the COMPOSE_JSON subfolder
    RUN_TEST(test_step_compose_json_compiles);

    // Tests from the GNSS subfolder
    RUN_TEST(test_gnss_state_enum_values);
    RUN_TEST(test_gnss_step_state_global);
    RUN_TEST(test_gnss_turn_on_off);

    UNITY_END();
}

void loop() {}