---
sidebar_position: 1
title: Czujniki
---

# Czujniki kompatybilne z EcoSense

EcoSense obsługuje szeroką gamę czujników, które można łatwo podłączyć do systemu.
W poniższej sekcji znajdziesz informacje o kompatybilnych czujnikach i ich specyfikacji.

## Typy wspieranych czujników

System EcoSense pozwala na monitoring różnych parametrów środowiskowych:

- **Meteorologiczne** - temperatura, wilgotność, ciśnienie atmosferyczne, opady
- **Hydrologiczne** - poziom wody, przepływ, temperatura wody
- **Jakości powietrza** - pyły zawieszone (PM2.5, PM10), CO₂, TVOC, ozon
- **Gleby** - wilgotność, temperatura, pH, składniki odżywcze
- **Promieniowania** - UV, nasłonecznienie
- **Inne** - hałas, pole magnetyczne, wibracje

## Popularne czujniki i ich specyfikacja

### Czujniki temperatury, wilgotności i ciśnienia

#### BME280 / BME680 (I²C, SPI)

**Specyfikacja:**

- Temperatura: -40°C do +85°C (±1.0°C dokładności)
- Wilgotność: 0-100% (±3% dokładności)
- Ciśnienie: 300-1100 hPa (±1 hPa dokładności)
- BME680 dodatkowo: gaz (VOC)
- Interfejs: I²C lub SPI
- Napięcie: 3.3V lub 5V (z konwerterem poziomów)
- Podłączenie:

```

```

#### DHT22 / DHT11 (1-wire)

**Specyfikacja:**

Temperatura: -40°C do +80°C (±0.5°C dokładności) dla DHT22
Wilgotność: 0-100% (±2-5% dokładności)
Interfejs: 1-wire
Napięcie: 3.3-5V
Czas próbkowania: min. 2 sekundy
Podłączenie:

```

```

### Czujniki jakości powietrza

#### SDS011 (Pyły zawieszone PM2.5 i PM10)

**Specyfikacja:**

Zakres pomiaru: PM2.5 i PM10, 0-999.9 μg/m³
Dokładność: ±15%
Rozdzielczość: 0.3 μg/m³
Interfejs: UART
Napięcie: 5V
Żywotność: ~8000 godzin pracy
Podłączenie:

```

```

#### CCS811 (CO₂ i TVOC)

**Specyfikacja:**

Zakres pomiaru CO₂: 400-8192 ppm
Zakres pomiaru TVOC: 0-1187 ppb
Interfejs: I²C
Napięcie: 3.3V
Wymaga okresu rozgrzewki i kalibracji
Podłączenie:

```

```

### Czujniki poziomu wody

#### HC-SR04 (Ultradźwiękowy czujnik odległości)

**Specyfikacja:**

Zakres pomiaru: 2-400 cm
Dokładność: ±3 mm
Kąt pomiaru: 15°
Napięcie: 5V (niektóre modele 3.3V)
Częstotliwość pracy: 40 kHz
Podłączenie:

```

```

### Czujnik pływakowy

#### Float Sensor

**Specyfikacja:**

Typ: przełącznik kontaktronowy
Stan: normalnie otwarty/zamknięty (zależnie od modelu)
Napięcie: max. 100V DC
Prąd: max. 0.5A
Materiał: plastik, stal nierdzewna
Podłączenie:

```

```
