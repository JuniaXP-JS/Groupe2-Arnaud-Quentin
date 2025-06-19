#ifndef SIM7080G_GNSS_HPP
#define SIM7080G_GNSS_HPP

#include <Arduino.h>
#include "GLOBALS.hpp"
#include "SIM7080G_SERIAL.hpp"

String
gnssTurnOn();
String gnssTurnOff();
String check_GNSS_Status();

String get_GNSS_Info();
String get_GNSS_Mode();
String getRunStatus(String gnssData);
String getAltitude(String gnssData);
String getLng(String gnssData);
String getLat(String gnssData);
String getTimeStamp(String gnssData);
String getFixStatus(String gnssData);
String getValueOfGnssData(String gnssData, int16_t choiceValue);
struct Float_gnss
{
    uint8_t ent;
    String dec;
    String full;
};
struct Coord
{
    Float_gnss latitude;
    Float_gnss longitude;
};
struct Gnss
{
    String runStatus;
    String fixStatus;
    String timeStamp;
    Coord coordonnees;
    String altitude;
    Float_gnss hdop;
    bool isValid = false;
};
struct DataGNSS
{
    Gnss gnss;
};

extern DataGNSS dataGNSS[MAX_COORDS];

Coord parserLatLng(String lat, String lng);
Float_gnss parseGNSS(String coord);
Gnss getGnssResponse();

#endif