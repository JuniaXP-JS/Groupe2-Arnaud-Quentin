#include "receiveCBOR.hpp"
using json = nlohmann::json;

bool START_PIPELINE = false;
void lireEtDecoderCBOR()
{
    String reponse = Send_AT("AT+CARECV=0,100", 3000);
    Serial.println("=========== BRUTE RESPONSE ===========");
    Serial.println(reponse);

    int lastIndex = reponse.lastIndexOf("+CARECV:");
    if (lastIndex == -1)
    {
        Serial.println("No +CARECV found");
        return;
    }

    int endOfLine = reponse.indexOf('\n', lastIndex);
    String carecvLine = (endOfLine != -1) ? reponse.substring(lastIndex, endOfLine) : reponse.substring(lastIndex);
    carecvLine.trim();
    Serial.println("Selected line: " + carecvLine);

    if (carecvLine.indexOf(": 0") != -1)
    {
        Serial.println("No bytes to decode");
        return;
    }

    int commaIndex = carecvLine.indexOf(',');
    if (commaIndex == -1)
    {
        Serial.println("Missing comma");
        return;
    }

    String brut = carecvLine.substring(commaIndex + 1);
    brut.trim();
    Serial.println("Raw binary data: " + brut);

    std::vector<uint8_t> buffer;
    Serial.println("Affichage des octets reçus :");
    for (int i = 0; i < brut.length(); i++)
    {
        uint8_t val = (uint8_t)brut[i];
        Serial.print("Index ");
        Serial.print(i);
        Serial.print(" : ");
        Serial.print(val);
        Serial.print(" (0x");
        if (val < 16)
            Serial.print("0");
        Serial.print(val, HEX);
        Serial.println(")");
        buffer.push_back(val);
    }

    Serial.print("Buffer size: ");
    Serial.println(buffer.size());

    // Affichage du buffer en hexadécimal
    Serial.print("Buffer HEX: ");
    for (auto b : buffer)
    {
        if (b < 16)
            Serial.print("0");
        Serial.print(b, HEX);
        Serial.print(" ");
    }
    Serial.println();

    try
    {
        json j = json::from_cbor(buffer);
        lastReceivedCBOR = j;
        Serial.print("Decoded CBOR: ");
        Serial.println(j.dump().c_str());

        if (j.contains("start") && j["start"] == true)
        {
            Serial.println("Pipeline activated!");
            receiveMessage = true;
        }
    }
    catch (const std::exception &e)
    {
        Serial.print("CBOR decoding error: ");
        Serial.println(e.what());
    }
}