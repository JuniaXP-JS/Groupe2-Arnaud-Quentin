#pragma once

void step_send_4g_function();

enum StepSend4GState
{
    STEP_SETUP_CATM1,
    STEP_SEND_CBOR
};