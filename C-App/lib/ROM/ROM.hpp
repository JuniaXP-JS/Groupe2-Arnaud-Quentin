#ifndef ROM
#define ROM

#include <Arduino.h>
#include <EEPROM.h>
#include "SIM7080G_GNSS.hpp"

// Size of EEPROM used
#define EEPROM_SIZE 256

// Fixed addresses for data
#define ADDR_SIM_ID 0
#define ADDR_LATITUDE 10
#define ADDR_LONGITUDE 20
#define ADDR_TIMESTAMP 30

// Function to write a uint32_t to EEPROM
void writeUInt32(int addr, uint32_t val);

// Function to read a uint32_t from EEPROM
uint32_t readUInt32(int addr);

// Write a Float_gnss to EEPROM
void writeFloatGnss(int addr, const Float_gnss &f);

// Read a Float_gnss from EEPROM
// Float_gnss readFloatGnss(int addr);
Float_gnss readFloatGnss(int addr, boolean lat);

// Write a fixed-size String
void writeFixedString(int addr, const String &str, int maxLength);

// Read a fixed-size String
String readFixedString(int addr, int maxLength);

void afficherCoordonneesDepuisEEPROM(bool *afficher);

String getCoordonneesDepuisEEPROM();

void writeIMEI();

void writeEspIdIfNotSet();

void resetSimIdEEPROM();

String parseGSNResponse(const String &rawResponse);

void writeSimIdToEEPROM(const String &simId);

String readSimIdFromEEPROM();

#endif
