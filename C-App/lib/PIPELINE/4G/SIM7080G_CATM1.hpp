#ifndef SIM7080G_CATM1
#define SIM7080G_CATM1

#include <Arduino.h>
#include "GLOBALS.hpp"
#include "pipeline.hpp"
#include "PIPELINE_GLOBAL.hpp"

void step_catm1_function();
String findSelect(String data, String nameStart, int numberPassAfterNameStart, String symbolToSelectStart, String symbolToEnd);
#endif
