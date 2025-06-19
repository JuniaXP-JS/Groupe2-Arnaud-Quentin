#ifndef ARGALI_PINOUT_HPP
#define ARGALI_PINOUT_HPP

// Définition des constantes
#define PIN_PWRKEY 7
#define Sim7080G Serial1
#define Sim7080G_BAUDRATE 57600
#define PINGGY_LINK "rnqrg-185-223-151-250.a.free.pinggy.link"
#define PINGGY_PORT 32913
#define MAX_COORDS 10
#include <Arduino.h>
#include <vector>
#include <nlohmann/json.hpp>
using json = nlohmann::json;
// #include "SIM7080G_GNSS.hpp"

struct MessageCoord
{
    String data;
    bool endCBOR = true; // true = prêt à envoyer, false = en cours de traitement
};

extern MessageCoord listeCoordonnees[MAX_COORDS];
extern int nbCoordonnees;
extern int gnssPrecision;
extern String tableauJSONString;
extern String imei;

// extern std::vector<MessageCoord> listeCoordonnees;

extern unsigned long PERIODE_CBOR; // déclaration "extern"
extern unsigned long periodEveryX;
extern unsigned long period10min;
extern unsigned long periodGNSS;

extern unsigned long periodeAjustement;
extern bool oneRun;
extern bool receiveMessage;
extern bool stepReceiveFunctionBoolean;
extern json lastReceivedCBOR;

struct GnssOptions
{
    bool precisionActive = false; // true = on utilise la précision, false = on ignore
    int precision = 3;            // valeur de la précision (ex: HDOP max accepté)
    // Ajoute ici d'autres options si besoin
};

extern GnssOptions gnssOptions;
#endif // ARGALI_PINOUT_HPP
