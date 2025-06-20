/**
 * @file SIM7080G_POWER.cpp
 * @brief Fonctions pour gérer l'alimentation et l'identification du module SIM7080G sur ESP32.
 *
 * Ce fichier centralise toutes les fonctions liées à la gestion de l'alimentation du module SIM7080G :
 * - Allumer, éteindre, redémarrer ou faire un reset matériel du module.
 * - Récupérer le niveau de batterie via la commande AT+CBC.
 * - Extraire l'IMEI du module à partir de la réponse brute d'une commande AT.
 *
 * Ces fonctions sont essentielles pour contrôler l'état du module et obtenir des informations système importantes.
 */

#include <Arduino.h>
#include "SIM7080G_POWER.hpp"

/**
 * @brief Allume le module SIM7080G.
 *
 * Configure la broche d'alimentation, initialise la liaison série et envoie des commandes d'identification.
 */
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

/**
 * @brief Éteint le module SIM7080G.
 *
 * Envoie la commande AT pour éteindre le module et attend la confirmation.
 */
void turn_off_SIM7080G()
{
  Sim7080G.println("AT+CPOWD=1");
  delay(2000);
  Serial.println("TURN OFF");
}

/**
 * @brief Redémarre le module SIM7080G.
 *
 * Éteint puis rallume le module pour effectuer un redémarrage logiciel.
 */
void reboot_SIM7080G()
{
  turn_off_SIM7080G();
  turn_on_SIM7080G();
}

/**
 * @brief Effectue un reset matériel du module SIM7080G.
 *
 * Maintient la broche d'alimentation à l'état bas pendant 15 secondes puis réinitialise la liaison série.
 */
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

/**
 * @brief Récupère le niveau de batterie du module SIM7080G.
 *
 * Envoie la commande AT+CBC et retourne la réponse brute.
 * @return Chaîne contenant la réponse de la commande AT+CBC.
 */
String getBatteryLevel()
{
  return Send_AT("AT+CBC"); // Send command AT+CBC
}

/**
 * @brief Extrait l'IMEI à partir de la réponse brute d'une commande AT.
 *
 * Parcourt chaque ligne de la réponse pour trouver une ligne de 15 chiffres correspondant à l'IMEI.
 * @param rawResponse Réponse brute de la commande AT+GSN.
 * @return L'IMEI sous forme de chaîne, ou une chaîne vide si non trouvé.
 */
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
