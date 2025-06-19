#include "SIM7080G_SERIAL.hpp"

#ifdef UNIT_TEST
void (*SendATTestHook)(const String &, long) = nullptr;
#endif

String Send_AT(String message, long delay)
{
  unsigned long start_time = millis();
  Sim7080G.println(message);
  String uart_buffer = "";
  char tmp_char = 'A';
  while ((millis() - start_time < delay) && (uart_buffer.endsWith("OK") == false) && (uart_buffer.endsWith("ACTIVE") == false))
  {
    if (Sim7080G.available())
    {
      tmp_char = Sim7080G.read();
      uart_buffer += tmp_char;
      Serial.print(tmp_char);
    }
  }

#ifdef UNIT_TEST
  if (SendATTestHook)
    SendATTestHook(message, delay);
  // Retourne une valeur simulée pour les tests si rien n'a été reçu
  if (uart_buffer.length() == 0)
    return "MOCK_OK";
#endif

  // Serial.println("millis fin de Send_AT : " + (String) millis());
  return uart_buffer;
}