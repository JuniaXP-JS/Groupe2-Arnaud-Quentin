#include <unity.h>
#include "STEP_GNSS.hpp"
#include "machineEtat.hpp"
#include "GLOBALS.hpp"
#ifdef UNIT_TEST
#include "SIM7080G_SERIAL.hpp"
#endif

// Declare fakeMillis before its use
unsigned long fakeMillis = 0;

// Define the millis mock only for tests
#ifdef UNIT_TEST
unsigned long test_millis()
{
    return fakeMillis;
}
#define millis test_millis
#endif

// External variables
extern int iterationList;
extern ATCommandTask gnssPowerOnCommand;
extern ATCommandTask gnssPowerOffCommand;
extern bool afficherDepuisMemoire;
extern StepGNSSState gnssStepState;
extern unsigned long periodGNSS;
extern MessageCoord listeCoordonnees[MAX_COORDS];
extern int nbCoordonnees;

// Test-specific hooks/counters
#ifdef UNIT_TEST
int sendATCalled = 0;
String lastSendATCmd;
void mySendATHook(const String &cmd, long timeout)
{
    sendATCalled++;
    lastSendATCmd = cmd;
}
#endif

void reset_gnss_test_env()
{
    gnssStepState = GNSS_POWER_ON;
    gnssPowerOnCommand.state = IDLE;
    gnssPowerOffCommand.state = IDLE;
    afficherDepuisMemoire = false;
    iterationList = 0;
    periodGNSS = 0;
    nbCoordonnees = 0;
    for (int i = 0; i < MAX_COORDS; ++i)
    {
        listeCoordonnees[i] = MessageCoord();
    }
#ifdef UNIT_TEST
    sendATCalled = 0;
    lastSendATCmd = "";
#endif
    fakeMillis = 0;
}

// Mock of DisplayLatLngInfo
// Tests
void test_gnss_info_sends_commands_and_displays()
{
    reset_gnss_test_env();
    gnssStepState = GNSS_INFO;
    periodGNSS = 0;
    fakeMillis = 4000; // Simulate elapsed time
    nbCoordonnees = 0;
    for (int i = 0; i < MAX_COORDS; ++i)
    {
        listeCoordonnees[i] = MessageCoord();
    }

        step_gnss_function();
    
        // Should have called Send_AT for GNSS info
    #ifdef UNIT_TEST
        TEST_ASSERT_TRUE(sendATCalled > 0);
    #endif
        // Should stay in GNSS_INFO if nbCoordonnees < 5
        TEST_ASSERT_EQUAL(GNSS_INFO, gnssStepState);
}

void test_gnss_info_too_many_coords_goes_to_power_off()
{
    reset_gnss_test_env();
    gnssStepState = GNSS_INFO;
    nbCoordonnees = 10;
    fakeMillis = 4000;
    for (int i = 0; i < nbCoordonnees; ++i)
    {
        listeCoordonnees[i] = MessageCoord();
    }
    step_gnss_function();
    // Should switch to GNSS_POWER_OFF if the list is too big
    TEST_ASSERT_EQUAL(GNSS_POWER_OFF, gnssStepState);
}

void test_gnss_power_on_transition()
{
    reset_gnss_test_env();
    gnssStepState = GNSS_POWER_ON;
    gnssPowerOnCommand.state = END; // Simulate command finished
    step_gnss_function();
    TEST_ASSERT_EQUAL(GNSS_INFO, gnssStepState);
}

void test_gnss_power_off_transition()
{
    reset_gnss_test_env();
    gnssStepState = GNSS_POWER_OFF;
    gnssPowerOffCommand.state = END; // Simulate command finished
    step_gnss_function();
    TEST_ASSERT_EQUAL(GNSS_DONE, gnssStepState);
}

void test_gnss_done_transition()
{
    reset_gnss_test_env();
    gnssStepState = GNSS_DONE;
    step_gnss_function();
    TEST_ASSERT_EQUAL(GNSS_POWER_ON, gnssStepState);
}

void test_gnss_info_waits_for_period()
{
    reset_gnss_test_env();
    gnssStepState = GNSS_INFO;
    periodGNSS = 1000;
    fakeMillis = 2000; // Not enough time elapsed
    nbCoordonnees = 0;
    for (int i = 0; i < MAX_COORDS; ++i)
    {
        listeCoordonnees[i] = MessageCoord();
    }

    step_gnss_function();

    // Should not call DisplayLatLngInfo if not enough time has elapsed
    TEST_ASSERT_EQUAL(GNSS_INFO, gnssStepState);
}

void setUp(void)
{
#ifdef UNIT_TEST
    SendATTestHook = mySendATHook;
#endif
}

void tearDown(void)
{
#ifdef UNIT_TEST
    SendATTestHook = nullptr;
#endif
}
