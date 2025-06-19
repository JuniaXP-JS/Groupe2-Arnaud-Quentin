#ifndef DISPLAY_LAT_LNG
#define DISPLAY_LAT_LNG

#include <Arduino.h>
#include "SIM7080G_GNSS.hpp"
#include "PARSER_TIMESTAMP.hpp"
// #include "ROM.hpp"

Gnss getGNSSValid();
void addGNSSInDataGNSS(Gnss gnss);
void shiftLeftDataGNSS(DataGNSS *array, int &nbCoordonnees);
#endif