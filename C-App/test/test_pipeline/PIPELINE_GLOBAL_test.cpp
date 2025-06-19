#include <unity.h>
#include "PIPELINE_GLOBAL.hpp"

void test_pipelineglobal_enum_values()
{
    TEST_ASSERT_EQUAL(STEP_INIT_GLOBAL, 0);
    TEST_ASSERT_EQUAL(STEP_GNSS, 1);
    TEST_ASSERT_EQUAL(STEP_COMPOSE_JSON, 2);
    TEST_ASSERT_EQUAL(STEP_SEND_4G, 3);
    TEST_ASSERT_EQUAL(STEP_END_GLOBAL, 4);
}

void test_pipelineglobal_state_transition()
{
    currentStepGLOBAL = STEP_INIT_GLOBAL;
    pipelineGlobal();
    TEST_ASSERT_EQUAL(STEP_GNSS, currentStepGLOBAL);
}

void test_pipelineglobal_dummy()
{
    TEST_ASSERT_TRUE(true); 
}
