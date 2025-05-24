import requests
import json
import random
import os
from datetime import datetime

# --- Konfiguracja ---
WEATHERSTACK_API_KEY =  os.getenv("WEATHERSTACK_API_KEY")
WEATHERSTACK_BASE_URL = "http://api.weatherstack.com"
CITY = "Kielce"

LOCAL_API_BASE_URL = "https://c4e5-217-75-53-226.ngrok-free.app/api/sensors"
OUTPUT_FILE_NAME = "weather_data.json"

# Procentowe odchyłki
TEMPERATURE_DEVIATION_PERCENT = 3.0
HUMIDITY_PRESSURE_DEVIATION_PERCENT = 0.2

# --- Krok 1: Pobierz dane pogodowe z Weatherstack ---
def get_weather_data(api_key, base_url, city):
    params = {
        'access_key': api_key,
        'query': city,
        'units': 'm'
    }
    full_url = f"{base_url}/current"
    print(f"Pobieranie danych pogodowych z: {full_url} dla {city}...")
    try:
        response = requests.get(full_url, params=params)
        response.raise_for_status()
        weather_data = response.json()
        if "error" in weather_data:
            print(f"Błąd API Weatherstack: {weather_data['error'].get('info', 'Nieznany błąd')}")
            return None
        if 'current' not in weather_data:
            print(f"Odpowiedź z Weatherstack nie zawiera klucza 'current'. Otrzymano: {weather_data}")
            return None
        print("Dane pogodowe pobrane pomyślnie.")
        return weather_data
    except requests.exceptions.HTTPError as http_err:
        print(f"Błąd HTTP podczas pobierania danych pogodowych: {http_err}")
        print(f"   Treść odpowiedzi: {response.text if response else 'Brak odpowiedzi'}")
    except requests.exceptions.RequestException as req_err:
        print(f"Błąd połączenia podczas pobierania danych pogodowych: {req_err}")
    except json.JSONDecodeError:
        print("Błąd dekodowania JSON z odpowiedzi Weatherstack.")
        print(f"   Otrzymana treść: {response.text if response else 'Brak odpowiedzi'}")
    return None

# --- Krok 2: Zapisz wyniki do pliku ---
def save_data_to_file(data, filename):
    if data:
        print(f"Zapisywanie danych pogodowych do pliku: {filename}...")
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            print(f"Dane zapisane pomyślnie do {filename}.")
        except IOError as e:
            print(f"Błąd zapisu do pliku {filename}: {e}")

# --- Krok 3: Pobierz listę sensorów z lokalnego API ---
def get_sensor_list(api_url):
    full_url = f"{api_url}/All-info"
    print(f"Pobieranie listy sensorów z: {full_url}...")
    try:
        response = requests.get(full_url)
        response.raise_for_status()
        response_json = response.json()
        if response_json.get("success") and "data" in response_json:
            sensors_actual_list = response_json["data"]
            if isinstance(sensors_actual_list, list):
                print(f"Lista sensorów pobrana pomyślnie. Znaleziono {len(sensors_actual_list)} sensorów.")
                return sensors_actual_list
            else:
                print(f"Klucz 'data' w odpowiedzi API nie zawiera listy. Otrzymano typ: {type(sensors_actual_list)}.")
                print(f"   Zawartość 'data': {sensors_actual_list}")
                return None
        else:
            message = response_json.get("message", "Brak wiadomości w odpowiedzi.")
            status_code = response_json.get("statusCode", "Brak statusu w odpowiedzi.")
            success_status = response_json.get("success", "Brak flagi 'success'.")
            print(f"API sensorów zwróciło błąd lub niepoprawny format. Sukces: {success_status}, Wiadomość: '{message}' (Status: {status_code})")
            print(f"   Pełna odpowiedź: {response_json}")
            return None
    except requests.exceptions.HTTPError as http_err:
        print(f"Błąd HTTP podczas pobierania listy sensorów: {http_err}")
        print(f"   Treść odpowiedzi: {response.text if response else 'Brak odpowiedzi'}")
    except requests.exceptions.RequestException as req_err:
        print(f"Błąd połączenia podczas pobierania listy sensorów: {req_err}")
    except json.JSONDecodeError:
        print("Błąd dekodowania JSON z odpowiedzi listy sensorów.")
        print(f"   Otrzymana treść: {response.text if response else 'Brak odpowiedzi'}")
    return None

# --- Krok 4: Dla każdego serialnumbera wykonaj POST z danymi pogodowymi ---
def post_sensor_data(api_url, serial_number, weather_data_raw, 
                     temp_deviation_percent, other_param_deviation_percent):
    if not weather_data_raw or 'current' not in weather_data_raw:
        print(f"Brak danych pogodowych ('current') lub niekompletne dane dla {serial_number}. Pomijam POST.")
        return False

    current_weather = weather_data_raw['current']
    
    # --- Modyfikacja temperatury ---
    original_temp_api_val = current_weather.get('temperature')
    modified_temp = None
    if original_temp_api_val is not None:
        try:
            original_temp = float(original_temp_api_val)
            dev = original_temp * (temp_deviation_percent / 100.0)
            modified_temp = round(original_temp + random.uniform(-dev, dev), 2)
        except (ValueError, TypeError):
            print(f"Wartość temperatury '{original_temp_api_val}' nie jest liczbą. Temperatura nie zostanie wysłana lub użyta zostanie oryginalna, jeśli API na to pozwala.")
            modified_temp = original_temp_api_val # Lub None, jeśli tak ma być obsługiwane
    else:
        print(f"Brak wartości temperatury w danych pogodowych dla {serial_number}. Temperatura nie zostanie wysłana.")

    # --- Modyfikacja wilgotności ---
    original_humidity_api_val = current_weather.get('humidity')
    modified_humidity = None
    if original_humidity_api_val is not None:
        try:
            original_humidity = float(original_humidity_api_val)
            dev = original_humidity * (other_param_deviation_percent / 100.0)
            modified_humidity_val_float = original_humidity + random.uniform(-dev, dev)
            # Ograniczenie wilgotności do zakresu 0-100% i zaokrąglenie do liczby całkowitej
            modified_humidity = round(max(0, min(100, modified_humidity_val_float)))
        except (ValueError, TypeError):
            print(f"Wartość wilgotności '{original_humidity_api_val}' nie jest liczbą. Wilgotność nie zostanie wysłana lub użyta zostanie oryginalna.")
            modified_humidity = original_humidity_api_val # Lub None
    else:
        print(f"Brak wartości wilgotności w danych pogodowych dla {serial_number}. Wilgotność nie zostanie wysłana.")
        
    # --- Modyfikacja ciśnienia ---
    original_pressure_api_val = current_weather.get('pressure')
    modified_pressure = None
    if original_pressure_api_val is not None:
        try:
            original_pressure = float(original_pressure_api_val)
            dev = original_pressure * (other_param_deviation_percent / 100.0)
            modified_pressure_val_float = original_pressure + random.uniform(-dev, dev)
            # Zaokrąglenie ciśnienia do liczby całkowitej
            modified_pressure = round(modified_pressure_val_float)
        except (ValueError, TypeError):
            print(f"Wartość ciśnienia '{original_pressure_api_val}' nie jest liczbą. Ciśnienie nie zostanie wysłane lub użyte zostanie oryginalne.")
            modified_pressure = original_pressure_api_val # Lub None
    else:
        print(f"Brak wartości ciśnienia w danych pogodowych dla {serial_number}. Ciśnienie nie zostanie wysłane.")

    # --- Tworzenie payloadu ---
    payload = {
        "temperature": modified_temp,
        "humidity": modified_humidity,
        "airPressure": modified_pressure,
        "readingSource": "Weatherstack API via Python Script"
    }

    # Dodawanie UV index
    uv_index = current_weather.get('uv_index')
    if uv_index is not None:
        try:
            payload["uvRadiation"] = float(uv_index)
        except (ValueError, TypeError):
            print(f"Nie można przekonwertować UV index ('{uv_index}') na liczbę dla {serial_number}.")
    
    # Dodawanie opadów
    precipitation = current_weather.get('precip')
    if precipitation is not None:
        try:
            payload["precipitation"] = float(precipitation)
        except (ValueError, TypeError):
            print(f"Nie można przekonwertować opadów ('{precipitation}') na liczbę dla {serial_number}.")

    # Dodawanie danych o jakości powietrza (PM2.5, PM10)
    air_quality_data = current_weather.get('air_quality', {})
    if isinstance(air_quality_data, dict):
        pm2_5_str = air_quality_data.get('pm2_5')
        pm10_str = air_quality_data.get('pm10')

        if pm2_5_str is not None:
            try:
                payload["pM2_5"] = float(pm2_5_str)
            except (ValueError, TypeError):
                print(f"Nie można przekonwertować pm2_5 ('{pm2_5_str}') na liczbę dla {serial_number}.")
        
        if pm10_str is not None:
            try:
                payload["pM10"] = float(pm10_str)
            except (ValueError, TypeError):
                print(f"Nie można przekonwertować pm10 ('{pm10_str}') na liczbę dla {serial_number}.")
    else:
        print(f"Oczekiwano słownika dla 'air_quality', otrzymano: {type(air_quality_data)}. Dane PM nie zostaną dodane.")
    
    # Opcjonalnie: Usuń klucze z payloadu, jeśli ich wartość to None, jeśli API tego wymaga
    # payload = {k: v for k, v in payload.items() if v is not None}

    full_url = f"{api_url}/data/{serial_number}"
    print(f"Wysyłanie danych dla sensora {serial_number} na {full_url}...")
    print(f"   Dane do wysłania: {json.dumps(payload, indent=2)}")

    try:
        response = requests.post(full_url, json=payload)
        response.raise_for_status()
        print(f"Dane dla sensora {serial_number} wysłane pomyślnie. Status: {response.status_code}")
        try:
            print(f"   Odpowiedź serwera: {response.json()}")
        except json.JSONDecodeError:
            print(f"   Odpowiedź serwera (nie JSON): {response.text}")
        return True
    except requests.exceptions.HTTPError as http_err:
        print(f"Błąd HTTP podczas wysyłania danych dla {serial_number}: {http_err}")
        print(f"   Treść odpowiedzi: {response.text if response else 'Brak odpowiedzi'}")
    except requests.exceptions.RequestException as req_err:
        print(f"Błąd połączenia podczas wysyłania danych dla {serial_number}: {req_err}")
    return False

# --- Główna logika skryptu ---
if __name__ == "__main__":
    print("Rozpoczynam przetwarzanie...")

    weather_api_data = get_weather_data(WEATHERSTACK_API_KEY, WEATHERSTACK_BASE_URL, CITY)
    if weather_api_data:
        save_data_to_file(weather_api_data, OUTPUT_FILE_NAME)
    else:
        print("Nie udało się pobrać danych pogodowych. Przerywam działanie.")
        exit()

    print("-" * 30)

    sensors_list = get_sensor_list(LOCAL_API_BASE_URL)
    if not sensors_list:
        print("Nie udało się pobrać listy sensorów lub lista jest pusta. Przerywam działanie.")
        exit()

    if not all(isinstance(sensor, dict) and 'serialNumber' in sensor for sensor in sensors_list):
        print("Lista sensorów ma nieprawidłowy format. Oczekiwano listy słowników, każdy z kluczem 'serialNumber'.")
        print(f"   Przykładowy element z listy: {sensors_list[0] if sensors_list else 'Lista jest pusta'}")
        exit()

    print("-" * 30)

    successful_posts = 0
    failed_posts = 0
    if weather_api_data and 'current' in weather_api_data:
        print(f"Rozpoczynam wysyłanie danych pogodowych do {len(sensors_list)} sensorów...")
        for sensor_item in sensors_list:
            serial_number = sensor_item.get('serialNumber')
            if serial_number:
                # Przekazujemy obie wartości procentowe odchyłek do funkcji
                if post_sensor_data(LOCAL_API_BASE_URL, serial_number, weather_api_data, 
                                      TEMPERATURE_DEVIATION_PERCENT, HUMIDITY_PRESSURE_DEVIATION_PERCENT):
                    successful_posts += 1
                else:
                    failed_posts +=1
            else:
                print(f"Znaleziono wpis sensora bez klucza 'serialNumber'. Pomijam. Dane: {sensor_item}")
                failed_posts += 1
            print("---")
    else:
        print("Brak kluczowych danych pogodowych ('current' z Weatherstack) do przetworzenia dla sensorów.")

    print("-" * 30)
    print("Przetwarzanie zakończone.")
    print(f"Podsumowanie POSTów: Udane: {successful_posts}, Nieudane: {failed_posts}")