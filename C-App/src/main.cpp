/**
 * @file main.cpp
 * @brief Point d'entrée principal du firmware "Around the World" pour ESP32C3.
 *
 * Ce fichier initialise le module SIM7080G, configure les timers et lance la boucle principale.
 * Il gère la récupération de l'IMEI, la configuration des broches et l'exécution périodique du pipeline global.
 */

#include <Arduino.h>
#include "SIM7080G_POWER.hpp"
#include "SIM7080G_SERIAL.hpp"
#include "SIM7080G_CATM1.hpp"
#include "machineEtat.hpp"
#include "pipeline.hpp"
#include "GnssUtils.hpp"
#include <EEPROM.h>
#include "PIPELINE_GLOBAL.hpp"
// #include "ROM.hpp"
#include "receiveCBOR.hpp"
#include "RECEIVE.hpp"
#include "GLOBALS.hpp"

#define EEPROM_SIZE 256

/**
 * @brief Fonction exécutée périodiquement pour lancer le pipeline global.
 *
 * Appelée toutes les 500 ms dans la boucle principale.
 * @see pipelineGlobal()
 */
void everyX();

/**
 * @brief Fonction d'initialisation Arduino.
 *
 * Configure la broche d'alimentation du SIM7080G, initialise la liaison série,
 * redémarre le module SIM7080G, affiche un message de bienvenue et récupère l'IMEI.
 */
void setup();

/**
 * @brief Boucle principale Arduino.
 *
 * Appelle la fonction everyX() à chaque itération.
 */
void loop();

// Implémentation

/**
 * @brief Exécute le pipeline global toutes les 500 ms.
 *
 * Vérifie si 500 ms se sont écoulées depuis le dernier appel, puis exécute pipelineGlobal().
 * Met à jour le timer periodEveryX.
 */
void everyX()
{
  if ((millis() - periodEveryX) > 500)
  {
    pipelineGlobal();
    periodEveryX = millis();
  }
}

/**
 * @brief Initialise le matériel et les variables globales.
 *
 * Configure la broche d'alimentation, initialise la communication série,
 * redémarre le module SIM7080G, affiche un message de bienvenue et récupère l'IMEI.
 */
void setup()
{
  pinMode(PIN_PWRKEY, OUTPUT);
  Serial.begin(115200); // init port uart // on a aussi un port uart qui pointe vers notre pc
  reboot_SIM7080G();
  Serial.println("Around the World"); // CTRL + ALT + S

  String gsnRaw = Send_AT("AT+GSN");
  imei = getIMEI(gsnRaw);
  period10min = millis();
  periodEveryX = millis();
}

/**
 * @brief Boucle principale Arduino.
 *
 * Appelle everyX() à chaque itération pour exécuter les tâches périodiques.
 */
void loop()
{
  everyX();
}