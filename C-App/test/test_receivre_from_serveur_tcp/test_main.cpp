#include <Arduino.h>
#include <unity.h>

void test_receive_compiles();

void setup()
{
    UNITY_BEGIN();
    RUN_TEST(test_receive_compiles);
    UNITY_END();
}

void loop() {}