#pragma once

#include "machineEtat.hpp" 

void step_gnss_function();

enum StepGNSSState
{
    GNSS_POWER_ON,
    GNSS_INFO,
    GNSS_POWER_OFF,
    GNSS_DONE
};

extern StepGNSSState gnssStepState;
extern ATCommandTask gnssPowerOnCommand;
extern ATCommandTask gnssPowerOffCommand;
