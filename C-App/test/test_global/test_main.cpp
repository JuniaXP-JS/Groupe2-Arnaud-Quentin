#include <unity.h>
#include "GLOBALS.hpp"
#include <Arduino.h>

// Add a forward declaration for the test function
void test_globals_nbCoordonnees_init(void);
// Add a forward declaration for the missing test function
void test_globals_periode_cbor(void);

void setup()
{
    UNITY_BEGIN();
    RUN_TEST(test_globals_nbCoordonnees_init);
    RUN_TEST(test_globals_periode_cbor);
    UNITY_END();
}

void loop() {}
