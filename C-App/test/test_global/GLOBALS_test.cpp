#include <unity.h>
#include "GLOBALS.hpp"

void test_globals_nbCoordonnees_init()
{
    TEST_ASSERT_EQUAL(0, nbCoordonnees);
}

void test_globals_periode_cbor()
{
    TEST_ASSERT_TRUE(PERIODE_CBOR > 0);
}