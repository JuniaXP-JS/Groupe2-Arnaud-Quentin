#include <unity.h>
#include "machineEtat.hpp"

void test_machineEtat_class_exists()
{
    MachineEtat m;
    ATCommandTask task("AT+TEST", "OK", 3, 1000);
    bool result = m.analyzeResponse("OK", "OK");
    TEST_ASSERT_TRUE(result); // Expect true for a valid OK response
}
