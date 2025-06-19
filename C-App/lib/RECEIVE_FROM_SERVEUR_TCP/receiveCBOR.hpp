#ifndef CBOR_RECEIVER_HPP
#define CBOR_RECEIVER_HPP

#include <Arduino.h>
#include "SIM7080G_SERIAL.hpp"
#include <nlohmann/json.hpp>
#include <vector>

extern bool START_PIPELINE;

// Function to read CBOR data from SIM7080G and activate flags if necessary
void lireEtDecoderCBOR();

#endif // CBOR_RECEIVER_HPP
