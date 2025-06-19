#include <unity.h>
#include "RECEIVE_FROM_SERVEUR_TCP/RECEIVE.hpp"
#ifdef UNIT_TEST
#include "SIM7080G_SERIAL.hpp"
#endif
#include <vector>

// Variables to track mock calls
#ifdef UNIT_TEST
int sendATCalled = 0;
String lastSendATCmd = "";
std::vector<String> sendATCalls;

void mySendATHook(const String &message, long delay)
{
    sendATCalled++;
    lastSendATCmd = message;
    sendATCalls.push_back(message);
}
#endif

void setUp(void)
{
#ifdef UNIT_TEST
    sendATCalled = 0;
    lastSendATCmd = "";
    sendATCalls.clear();
    SendATTestHook = mySendATHook;
#endif
}

void tearDown(void)
{
#ifdef UNIT_TEST
    SendATTestHook = nullptr;
#endif
}

void test_receive_compiles()
{
#ifdef UNIT_TEST
    sendATCalled = 0;
    lastSendATCmd = "";
    sendATCalls.clear();
#endif
    receive(); // Call the function to test
#ifdef UNIT_TEST
    TEST_ASSERT_TRUE(sendATCalled > 0);                       // Check that Send_AT was called
    TEST_ASSERT_TRUE(sendATCalls[0].startsWith("AT+CAOPEN")); // Check the first call
    TEST_ASSERT_TRUE(sendATCalls[1].startsWith("AT+CARECV")); // Check the second call
#else
    TEST_ASSERT_TRUE(true); // Always pass if not in UNIT_TEST
#endif
}