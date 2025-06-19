#ifndef SIM7080G_SERIAL_HPP
#define SIM7080G_SERIAL_HPP

#include <Arduino.h> // Include Arduino library
#include "GLOBALS.hpp"
#include "SIM7080G_POWER.hpp"

// Declaration of external variables (if used in several files)

// Declaration of functions
String Send_AT(String message, long delay = 1000);

#ifdef UNIT_TEST
extern void (*SendATTestHook)(const String &, long);
#endif

#endif // SIM7080G_SERIAL_HPP
