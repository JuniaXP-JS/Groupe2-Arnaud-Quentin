#include "GLOBALS.hpp"

unsigned long PERIODE_CBOR = 123UL;
unsigned long periodEveryX = 123UL;
unsigned long period10min = 123UL;
unsigned long periodGNSS = 123UL;
unsigned long periodeAjustement = 30000UL; // 10 secondes
bool oneRun = true;
bool receiveMessage = false;
bool stepReceiveFunctionBoolean = true;

MessageCoord listeCoordonnees[MAX_COORDS];
int nbCoordonnees = 0;
String tableauJSONString;
String imei;
json lastReceivedCBOR;
GnssOptions gnssOptions;
