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

// Read a Float_gnss
// Float_gnss readFloatGnss(int addr) {
//   Float_gnss f;
//   f.ent = EEPROM.read(addr);
//   f.dec = readUInt32(addr + 1);
//   return f;
// }

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
  Serial.println("in writeFixedString");
  Serial.println("String str : " + str);
  Serial.println("addr : " + String(addr) + " max string length : " + String(maxLength) + " str.length : " + str.length());

  for (int i = 0; i < maxLength; i++)
  {
    Serial.print("------------------> FOR LOOP : ");

    Serial.println(str[i]);
  }
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

// // Read a fixed-size String
// String readFixedString(int addr, int maxLength) {
//   char buf[maxLength + 1];
//   for (int i = 0; i < maxLength; i++) {
//     buf[i] = EEPROM.read(addr + i);
//   }
//   buf[maxLength] = '\0';
//   return String(buf);
// }
String readFixedString(int addr, int maxLength)
{
  char buf[maxLength + 1];
  // Serial.println("---------in readFixedString ############");
  for (int i = 0; i < maxLength; i++)
  {
    char c = EEPROM.read(addr + i);
    // Replace non-printable characters with a dot
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
  EEPROM.commit(); // Don't forget to persist in flash
}

String readSimIdFromEEPROM()
{
  return readFixedString(ADDR_SIM_ID, 10);
}

String getEsp32Id()
{
  uint64_t chipid = ESP.getEfuseMac();
  char idBuffer[13]; // 12 hex characters + '\0'
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

// String readEspIdFromEEPROM() {
//   return readFixedString(ADDR_SIM_ID, 10);
// }

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

  // Split the response into lines
  int start = 0;
  int end = rawResponse.indexOf('\n');
  while (end != -1)
  {
    String line = rawResponse.substring(start, end);
    line.trim(); // Remove \r, \n, spaces

    // The IMEI is normally a 15-digit line
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
  // EEPROM.begin(EEPROM_SIZE);

  String simId = readSimIdFromEEPROM();
  Float_gnss lat = readFloatGnss(ADDR_LATITUDE, true);
  Float_gnss lng = readFloatGnss(ADDR_LONGITUDE, false);
  String imei = readFixedString(100, 15);
  // Serial.println("---------here is the SIM ID message =================================");
  // Serial.println(simId);
  // Serial.println("------------------------------------------------> result < -------------------------");
  // // String ts = readFixedString(ADDR_TIMESTAMP, 20);
  // String simId = readEspIdFromEEPROM();

  // Formatting with precision
  String latitude = String(lat.ent) + "." + String(lat.dec);
  String longitude = String(lng.ent) + "." + String(lng.dec);

  // String result = "{name:'test', position{Latitude: " + latitude + ", Longitude: " + longitude + "}}";
  // String result = "{\"name\":\"test\",\"position\":{\"latitude\":" + latitude + ",\"longitude\":" + longitude + "}}";
  String result = "{\"name\":\"" + imei + "\",\"position\":{\"latitude\":" + latitude + ",\"longitude\":" + longitude + "}}";
  // Serial.println(result);

  // Serial.println("result to be converted to CBOR Latitude: " + result);
  return result;
}
