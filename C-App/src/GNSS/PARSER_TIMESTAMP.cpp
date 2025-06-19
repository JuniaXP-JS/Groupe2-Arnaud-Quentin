#include "PARSER_TIMESTAMP.hpp"

String convertTimestampToLocalTime(String utcTimestamp, int timeOffset)
{
    // Extract values from the timestamp (yyyyMMddhhmmss.sss)
    int year = utcTimestamp.substring(0, 4).toInt();     // Year (e.g.: 2025)
    int month = utcTimestamp.substring(4, 6).toInt();    // Month (e.g.: 03)
    int day = utcTimestamp.substring(6, 8).toInt();      // Day (e.g.: 18)
    int hour = utcTimestamp.substring(8, 10).toInt();    // UTC hour (e.g.: 15)
    int minute = utcTimestamp.substring(10, 12).toInt(); // Minute (e.g.: 46)
    int second = utcTimestamp.substring(12, 14).toInt(); // Second (e.g.: 53)

    // Add the time offset
    hour += timeOffset;

    // Handle day overflow if hour exceeds 23:59
    if (hour >= 24)
    {
        hour -= 24; // Go back to a valid hour
        day += 1;   // Move to the next day
    }
    else if (hour < 0)
    {
        hour += 24; // Go back to a valid hour
        day -= 1;   // Move to the previous day
    }

    // Handle month overflow
    if (day > 31)
    { // This is not perfect (no check for months with 30 days)
        day = 1;
        month += 1;
    }
    if (month > 12)
    {
        month = 1;
        year += 1;
    }

    // Format the local date and time
    String localTime = String(year) + "/" + (month < 10 ? "0" : "") + String(month) + "/" +
                       (day < 10 ? "0" : "") + String(day) + " " +
                       (hour < 10 ? "0" : "") + String(hour) + ":" +
                       (minute < 10 ? "0" : "") + String(minute) + ":" +
                       (second < 10 ? "0" : "") + String(second);

    return localTime;
}

tm parserTimeStamp(String utcTimestamp)
{

    struct tm timeStruct; // Create the tm struct

    // Fill the tm struct with the values from the timestamp
    timeStruct.tm_year = utcTimestamp.substring(0, 4).toInt() - 1900; // Year - 1900
    timeStruct.tm_mon = utcTimestamp.substring(4, 6).toInt() - 1;     // Month - 1 (January = 0)
    timeStruct.tm_mday = utcTimestamp.substring(6, 8).toInt();
    timeStruct.tm_hour = utcTimestamp.substring(8, 10).toInt();
    timeStruct.tm_min = utcTimestamp.substring(10, 12).toInt();
    timeStruct.tm_sec = utcTimestamp.substring(12, 14).toInt();

    return timeStruct;
}
