#pragma once

#include <Arduino.h>
#include "GLOBALS.hpp"
#include "SIM7080G_SERIAL.hpp"
#include "SIM7080G_CATM1.hpp"
#include "machineEtat.hpp"
// #include "ROM.hpp"
#include "GnssUtils.hpp"
#include "pipeline.hpp"
#include "STEP_SEND_4G.hpp"
#include "COMPOSE_JSON/STEP_COMPOSE_JSON.hpp"
#include "SIM7080G_GNSS.hpp"

enum PipelineGLOBAL
{
    STEP_INIT_GLOBAL,
    STEP_GNSS,
    STEP_COMPOSE_JSON,
    STEP_SEND_4G,
    STEP_END_GLOBAL
};

void step_gnss_function();
extern PipelineGLOBAL currentStepGLOBAL;
extern StepSend4GState currentStep4G;
extern bool afficherDepuisMemoire;

void pipelineGlobal();