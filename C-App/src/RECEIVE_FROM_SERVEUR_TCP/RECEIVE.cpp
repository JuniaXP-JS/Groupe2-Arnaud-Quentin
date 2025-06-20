#include "RECEIVE.hpp"

void receive()
{
  Serial.println("----- je suis dans le receive() -----");
  Send_AT("AT+CAOPEN=0,0,\"TCP\"," + (String)PINGGY_LINK + "," + (String)PINGGY_PORT); // Remplace par le port réel affiché
  // Lire 100 octets depuis la connexion
  Send_AT("AT+CARECV=0,100");

  for (int i = 0; i < 2; i++)
  {
    lireEtDecoderCBOR();
    delay(3000);
  }

  stepReceiveFunctionBoolean = false;
}