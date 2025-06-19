#include <unity.h>
#include "SIM7080G_GNSS.hpp"

void test_gnss_turn_on_off()
{
    String on = gnssTurnOn();
    String off = gnssTurnOff();
    TEST_ASSERT_TRUE(on.length() > 0);
    TEST_ASSERT_TRUE(off.length() > 0);
}
