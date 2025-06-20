/**
 * @file ROM.cpp
 * @brief Fonctions utilitaires pour la gestion de la mémoire EEPROM (ROM).
 *
 * Ce fichier contient des fonctions pour écrire et lire des entiers, des structures et des chaînes de caractères
 * dans la mémoire EEPROM de l'ESP32. Il permet notamment de stocker des identifiants, des coordonnées GNSS et des timestamps.
 *
 * @note Ce code permet de gérer la persistance des données en ROM, mais il n'est pas encore utilisé dans l'application principale.
 */

#include "ROM.hpp"
// Function to manually write a uint32_t
void writeUInt32(int addr, uint32_t val)
{
  for (int i = 0; i < 4; i++)
  {
    EEPROM.write(addr + i, (val >> (8 * (3 - i))) & 0xFF);
  }
}

// Function to read a uint32_t
uint32_t readUInt32(int addr)
{
  uint32_t val = 0;
  for (int i = 0; i < 4; i++)
  {
    val |= EEPROM.read(addr + i) << (8 * (3 - i));
  }
  return val;
}

// Store a Float_gnss
void writeFloatGnss(int addr, const Float_gnss &f)
{
  EEPROM.write(addr, f.ent);
  // writeUInt32(addr + 1, f.dec);
}

Float_gnss readFloatGnss(int addr, boolean lat)
{
  Float_gnss f;
  if (lat)
  {
    f.ent = EEPROM.read(addr);
    f.dec = readUInt32(addr + 3);
    return f;
  }
  else
  {
    f.ent = EEPROM.read(addr);
    f.dec = readUInt32(addr + 2);
    return f;
  }
}

// Write a fixed-size String (truncated if too long)
void writeFixedString(int addr, const String &str, int maxLength)
{

  for (int i = 0; i < maxLength; i++)
  {
    Serial.println("++++++++++++ FOR LOOP");
    if (i < str.length())
    {
      EEPROM.write(addr + i, str[i]);
      Serial.print("EEPROM.write: ");
      Serial.println(str[i]);
    }
    else
    {
      EEPROM.write(addr + i, 0); // padding with \0
    }
  }

  for (int i = 0; i < maxLength; i++)
  {
    char c = EEPROM.read(addr + i);
    Serial.print("Byte ");
    Serial.print(i);
    Serial.print(" : ");
    Serial.println((int)c); // Print numeric value
  }
}

String readFixedString(int addr, int maxLength)
{
  char buf[maxLength + 1];
  for (int i = 0; i < maxLength; i++)
  {
    char c = EEPROM.read(addr + i);
    buf[i] = (c >= 1 && c <= 150) ? c : '.';
  }
  buf[maxLength] = '\0';
  return String(buf);
}

void writeSimIdToEEPROM(const String &simId)
{
  Serial.println("simId String : " + simId + " string length : " + String(simId.length()));
  if (simId.length() > 30)
  {
    Serial.println("[String too long]");
    return;
  }
  writeFixedString(100, simId, 15);
  EEPROM.commit();
}

String readSimIdFromEEPROM()
{
  return readFixedString(ADDR_SIM_ID, 10);
}

String getEsp32Id()
{
  uint64_t chipid = ESP.getEfuseMac();
  char idBuffer[13];
  sprintf(idBuffer, "%04X%08X", (uint16_t)(chipid >> 32), (uint32_t)chipid);
  return String(idBuffer);
}

void writeEspIdToEEPROM()
{
  String id = getEsp32Id();
  writeFixedString(ADDR_SIM_ID, id, 10); // 10 characters max
  EEPROM.commit();                       // Important to save
}

void writeEspIdIfNotSet()
{
  if (readFixedString(ADDR_SIM_ID, 10).length() == 0)
  {
    writeEspIdToEEPROM();
  }
}

String readEspIdFromEEPROM()
{
  String id = readFixedString(ADDR_SIM_ID, 10);
  if (id.length() == 0 || id.indexOf('.') != -1)
  {
    return "UNKNOWN";
  }
  return id;
}

void resetSimIdEEPROM()
{
  for (int i = 0; i < 10; i++)
  {
    EEPROM.write(ADDR_SIM_ID + i, 0);
  }
  EEPROM.commit();
}

String parseGSNResponse(const String &rawResponse)
{
  Serial.println("Raw AT response received:");
  Serial.println("[" + rawResponse + "]");

  int start = 0;
  int end = rawResponse.indexOf('\n');
  while (end != -1)
  {
    String line = rawResponse.substring(start, end);
    line.trim();

    if (line.length() == 15 && line.toInt() != 0)
    {
      Serial.println("IMEI detected : " + line);
      return line;
    }

    start = end + 1;
    end = rawResponse.indexOf('\n', start);
  }

  Serial.println("No line containing an IMEI found.");
  return "";
}

void writeIMEI()
{
  String gsnRaw = Send_AT("AT+GSN");
  String imei = parseGSNResponse(gsnRaw);

  if (imei.length() > 0)
  {
    writeSimIdToEEPROM(imei);
  }
  else
  {
    Serial.println("Empty or not found IMEI");
  }
}

void afficherCoordonneesDepuisEEPROM(bool *afficher)
{
  if (!afficher || !(*afficher))
  {
    return;
  }

  EEPROM.begin(EEPROM_SIZE);

  Float_gnss lat = readFloatGnss(ADDR_LATITUDE, true);
  Float_gnss lng = readFloatGnss(ADDR_LONGITUDE, false);
  String ts = readFixedString(ADDR_TIMESTAMP, 20);

  Serial.println("------ EEPROM coordinates ------");
  Serial.print("Latitude : ");
  Serial.print(lat.ent);
  Serial.print(".");
  Serial.println(lat.dec);

  Serial.print("Longitude : ");
  Serial.print(lng.ent);
  Serial.print(".");
  Serial.println(lng.dec);

  Serial.print("Timestamp : ");
  Serial.println(ts);
}

String getCoordonneesDepuisEEPROM()
{

  String simId = readSimIdFromEEPROM();
  Float_gnss lat = readFloatGnss(ADDR_LATITUDE, true);
  Float_gnss lng = readFloatGnss(ADDR_LONGITUDE, false);
  String imei = readFixedString(100, 15);

  // Formatting with precision
  String latitude = String(lat.ent) + "." + String(lat.dec);
  String longitude = String(lng.ent) + "." + String(lng.dec);

  // String result = "{name:'test', position{Latitude: " + latitude + ", Longitude: " + longitude + "}}";
  // String result = "{\"name\":\"test\",\"position\":{\"latitude\":" + latitude + ",\"longitude\":" + longitude + "}}";
  String result = "{\"name\":\"" + imei + "\",\"position\":{\"latitude\":" + latitude + ",\"longitude\":" + longitude + "}}";

  return result;
}
