#include <Arduino.h>
#include "GLOBALS.hpp"

String
convertTimestampToLocalTime(String utcTimestamp, int timeOffset);

tm convertTimestampToLocalTimeTm(String utcTimestamp, int timeOffset);

tm parserTimeStamp(String utcTimestamp);