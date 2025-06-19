#include "RECEIVE.hpp"

void receive()
{
  // Connexion à ton serveur tunnelé via Pinggy
  // delay(2000);
  // setup_CATM1(); // plus disponible comme function
  Serial.println("----- je suis dans le receive() -----");
  Send_AT("AT+CAOPEN=0,0,\"TCP\"," + (String)PINGGY_LINK + "," + (String)PINGGY_PORT); // Remplace par le port réel affiché
  // delay(2000);
  // Lire 100 octets depuis la connexion
  Send_AT("AT+CARECV=0,100");

  for (int i = 0; i < 2; i++)
  {
    // Send_AT("AT+CARECV=0,100");
    lireEtDecoderCBOR();

    // lireEtDecoderCBOR();
    delay(3000);
  }

  stepReceiveFunctionBoolean = false;
}