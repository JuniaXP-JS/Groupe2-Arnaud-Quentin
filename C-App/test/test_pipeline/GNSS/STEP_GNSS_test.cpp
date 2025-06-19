#include <unity.h>
#include "STEP_GNSS.hpp"

void test_gnss_state_enum_values()
{
    TEST_ASSERT_EQUAL(GNSS_POWER_ON, 0);
    TEST_ASSERT_EQUAL(GNSS_INFO, 1);
    TEST_ASSERT_EQUAL(GNSS_POWER_OFF, 2);
    TEST_ASSERT_EQUAL(GNSS_DONE, 3);
}

void test_gnss_step_state_global()
{
    gnssStepState = GNSS_POWER_ON;
    step_gnss_function();
    TEST_ASSERT_TRUE(true); // Just check function is callable
}
