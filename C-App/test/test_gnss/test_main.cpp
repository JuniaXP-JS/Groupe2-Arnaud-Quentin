#include <unity.h>
#include <Arduino.h>

void setUp(void);
void tearDown(void);

void test_gnss_info_sends_commands_and_displays();
void test_gnss_info_too_many_coords_goes_to_power_off();
void test_gnss_power_on_transition();
void test_gnss_power_off_transition();
void test_gnss_done_transition();
void test_gnss_info_waits_for_period();

void setup()
{
    UNITY_BEGIN();
    RUN_TEST(test_gnss_info_sends_commands_and_displays);
    RUN_TEST(test_gnss_info_too_many_coords_goes_to_power_off);
    RUN_TEST(test_gnss_power_on_transition);
    RUN_TEST(test_gnss_power_off_transition);
    RUN_TEST(test_gnss_done_transition);
    RUN_TEST(test_gnss_info_waits_for_period);
    UNITY_END();
}

void loop() {}