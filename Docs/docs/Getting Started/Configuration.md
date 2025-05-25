---
sidebar_position: 2
title: Konfiguracja
---

# Konfiguracja EcoSense

Po zainstalowaniu urządzenia EcoSense, możesz dostosować jego działanie do swoich potrzeb.

## Metoda konfiguracji

### Podstawowe ustawienia urządzenia

| Parametr          | Opis                                            | Wartość domyślna |
| ----------------- | ----------------------------------------------- | ---------------- |
| Nazwa urządzenia  | Przyjazna nazwa urządzenia                      | [ID]             |
| Interwał pomiarów | Częstotliwość wykonywania pomiarów (w minutach) | 5                |
| Strefa czasowa    | Lokalna strefa czasowa                          | Europe/Warsaw    |

### Ustawienia czujników

Dla każdego podłączonego czujnika możesz skonfigurować:

- Włączenie/wyłączenie
- Interwał próbkowania (niezależny od głównego interwału)
- Progi alarmowe (minimum/maksimum)

### Ustawienia sieci

| Parametr   | Opis                | Wartość domyślna |
| ---------- | ------------------- | ---------------- |
| WiFi SSID  | Nazwa sieci WiFi    | -                |
| WiFi Hasło | Hasło do sieci WiFi | -                |

### Ustawienia powiadomień

| Parametr            | Opis                                        | Wartość domyślna |
| ------------------- | ------------------------------------------- | ---------------- |
| Powiadomienia email | Włącza powiadomienia email                  | Wyłączone        |
| Adres email         | Adres, na który będą wysyłane powiadomienia | -                |
| Powiadomienia push  | Włącza powiadomienia push w aplikacji       | Włączone         |

### Integracje

Możesz skonfigurować integrację z popularnymi systemami:

- **Home Assistant**
- **Domoticz**
- **Grafana**

## Weryfikacja konfiguracji

Po dokonaniu zmian w konfiguracji:

1. Zrestartuj urządzenie
2. Sprawdź, czy urządzenie połączyło się z EcoSense
3. Sprawdź, czy dane są poprawnie rejestrowane

## Rozwiązywanie problemów

Jeśli po zmianie konfiguracji urządzenie nie działa prawidłowo:

1. Sprawdź, czy czujniki są prawidłowo podłączone

## Następne kroki

Po skonfigurowaniu urządzenia, przejdź do sekcji [Czujniki](/Guides/Sensors) aby lepiej zrozumieć działanie i możliwości poszczególnych czujników.
