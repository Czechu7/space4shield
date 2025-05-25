---
sidebar_position: 1
title: Instalacja
---

# Instalacja EcoSense

W tym przewodniku opisano krok po kroku, jak zainstalować i uruchomić swoje pierwsze urządzenie EcoSense.

## Wymagania sprzętowe {#requirements}

### Podstawowa konfiguracja:

- **Mikrokontroler** (jeden z poniższych):
  - ESP32
  - ESP8266 (zalecany)
  - Arduino Nano 33 IoT
  - Raspberry Pi Pico W
- **Zasilanie**:
  - Złącze micro-USB lub USB-C (zależnie od płytki)
  - Opcjonalnie: panel słoneczny 5V z kontrolerem ładowania i baterią

### Czujniki (opcjonalnie):

- **Meteorologiczne**:
  - BME280/BME680 (temperatura, wilgotność, ciśnienie)
  - DHT22/DHT11 (temperatura, wilgotność)
  - BMP280 (ciśnienie atmosferyczne)
- **Jakość powietrza**:
  - SDS011 (PM2.5, PM10)
  - CCS811 (CO₂, TVOC)
  - MQ-135 (CO₂, NH4, NOx)
- **Poziom wody**:
  - HC-SR04 (ultradźwiękowy czujnik odległości)
  - Czujnik pływakowy
- **Inne**:
  - BH1750 (natężenie światła)
  - Anemometr (prędkość wiatru)
  - Czujnik deszczu

## Zakup lub przygotowanie

Możesz:

1. Zakupić gotowy zestaw EcoSense w [sklepie](https://localhost)
2. Zamówić komponenty indywidualnie (lista kompatybilnych części: [lista komponentów](https://localhost))
3. Wydrukować obudowę na drukarce 3D (pliki: [obudowa](https://localhost))

## Instrukcja montażu sprzętu

### 1. Podstawowy montaż płytki (schemat połączeń)

### 2. Przygotowanie obudowy

## Instalacja oprogramowania

## Rozwiązywanie problemów

Jeśli napotkasz problemy podczas instalacji:

- Sprawdź połączenia elektryczne
- Zweryfikuj, czy urządzenie ma dostęp do sieci WiFi
- Sprawdź logi urządzenia (przez Serial Monitor w Arduino IDE)
- Odwiedź [forum pomocy](https://localhost)

## Następne kroki

Po pomyślnej instalacji, przejdź do [konfiguracji urządzenia](/Getting%20Started/Configuration) aby dostosować je do swoich potrzeb.
