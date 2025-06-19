#include <Arduino.h>
#include "SIM7080G_POWER.hpp"

void turn_on_SIM7080G()
{
  digitalWrite(PIN_PWRKEY, LOW);
  delay(200);
  digitalWrite(PIN_PWRKEY, OUTPUT_OPEN_DRAIN);
  delay(3000);
  Sim7080G.begin(Sim7080G_BAUDRATE, SERIAL_8N1, 20, 21);
  Sim7080G.println("AT+GSN");
  Sim7080G.println("AT+SIMCOMATI");
}

void turn_off_SIM7080G()
{
  Sim7080G.println("AT+CPOWD=1");
  delay(2000);
  Serial.println("TURN OFF");
}

void reboot_SIM7080G()
{
  turn_off_SIM7080G();
  turn_on_SIM7080G();
}

void hard_reset_SIM7080G()
{
  digitalWrite(PIN_PWRKEY, LOW);
  delay(15000);
  digitalWrite(PIN_PWRKEY, OUTPUT_OPEN_DRAIN);
  delay(3000);
  Sim7080G.begin(Sim7080G_BAUDRATE, SERIAL_8N1, 20, 21);
  Sim7080G.println("AT+GSN");
  Sim7080G.println("AT+SIMCOMATI");
}

String getBatteryLevel()
{
  return Send_AT("AT+CBC"); // Send command AT+CBC
}

String
getIMEI(const String &rawResponse)
{
  Serial.println("Réponse AT brute reçue :");
  Serial.println("[" + rawResponse + "]");

  // On coupe la réponse en lignes
  int start = 0;
  int end = rawResponse.indexOf('\n');
  while (end != -1)
  {
    String line = rawResponse.substring(start, end);
    line.trim(); // Supprime les \r, \n, espaces

    // L'IMEI est normalement une ligne de 15 chiffres
    if (line.length() == 15 && line.toInt() != 0)
    {
      Serial.println("IMEI détecté : " + line);
      return line;
    }

    start = end + 1;
    end = rawResponse.indexOf('\n', start);
  }

  Serial.println("Aucune ligne contenant un IMEI trouvée.");
  return "";
}
