/**
 * @file GLOBALS.cpp
 * @brief Définition des variables globales utilisées dans tout le projet.
 *
 * Ce fichier contient l'implémentation des variables globales déclarées dans GLOBALS.hpp.
 * Ces variables servent à partager des états, des buffers, des compteurs, des options de configuration et des données importantes
 * (coordonnées, IMEI, timers, options GNSS, etc.) entre les différents modules du programme.
 * Elles sont accessibles depuis l’ensemble du projet pour centraliser la gestion des informations essentielles.
 */

#include "GLOBALS.hpp"

unsigned long PERIODE_CBOR = 123UL;                ///< Timer pour le pipeline CBOR.
unsigned long periodEveryX = 123UL;                ///< Timer pour les tâches périodiques.
unsigned long period10min = 123UL;                 ///< Timer pour les tâches toutes les 10 minutes.
unsigned long periodGNSS = 123UL;                  ///< Timer pour la récupération GNSS.
unsigned long periodeAjustement = 30000UL;         ///< Période d'ajustement dynamique (ex: période d'envoi).
bool oneRun = true;                                ///< Indique si une seule exécution doit avoir lieu.
bool receiveMessage = false;                       ///< Indique si un message a été reçu.
bool stepReceiveFunctionBoolean = true;            ///< Indicateur pour la fonction de réception CBOR.

MessageCoord listeCoordonnees[MAX_COORDS];         ///< Tableau des coordonnées à envoyer.
int nbCoordonnees = 0;                             ///< Nombre de coordonnées dans le tableau.
String tableauJSONString;                          ///< Buffer pour stocker les données JSON à envoyer.
String imei;                                       ///< IMEI du module SIM7080G.
json lastReceivedCBOR;                             ///< Dernier message CBOR reçu.
GnssOptions gnssOptions;                           ///< Options de configuration
