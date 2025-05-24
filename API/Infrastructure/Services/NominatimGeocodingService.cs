using Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Web;
using System.Globalization;

namespace Infrastructure.Services;

public class NominatimGeocodingService : IGeocodingService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<NominatimGeocodingService> _logger;
    private const string BaseUrl = "https://nominatim.openstreetmap.org/search";

    public NominatimGeocodingService(HttpClient httpClient, ILogger<NominatimGeocodingService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "Space4Shield-Sensor-App/1.0");
    }

    public async Task<GeocodingResult> GetCoordinatesAsync(string street, string city, string postalCode, string country = "Poland")
    {
        try
        {
            await DelayBetweenRequests(); 

            var addressParts = new List<string>();
            
            if (!string.IsNullOrEmpty(street))
                addressParts.Add(street);
            
            if (!string.IsNullOrEmpty(city))
                addressParts.Add(city);
            
            if (!string.IsNullOrEmpty(postalCode))
                addressParts.Add(postalCode);
            
            addressParts.Add(country);
            
            var address = string.Join(", ", addressParts);
            var encodedAddress = HttpUtility.UrlEncode(address);

            var url = $"{BaseUrl}?q={encodedAddress}&format=json&limit=1&countrycodes=pl&addressdetails=1";
            
            _logger.LogInformation("Geocoding request for address: {Address}, URL: {Url}", address, url);

            var response = await _httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Geocoding API returned status code: {StatusCode}", response.StatusCode);
                return new GeocodingResult
                {
                    Success = false,
                    ErrorMessage = $"Geocoding service returned status code: {response.StatusCode}"
                };
            }

            var jsonContent = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("Geocoding response: {Response}", jsonContent);
            
            if (string.IsNullOrEmpty(jsonContent) || jsonContent == "[]")
            {
                _logger.LogWarning("No geocoding results found for address: {Address}", address);
                return new GeocodingResult
                {
                    Success = false,
                    ErrorMessage = "Address not found"
                };
            }

            var results = JsonSerializer.Deserialize<NominatimResult[]>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (results == null || results.Length == 0)
            {
                return new GeocodingResult
                {
                    Success = false,
                    ErrorMessage = "No results found"
                };
            }

            var result = results[0];
            
            _logger.LogInformation("Raw coordinates from Nominatim: Lat='{Lat}', Lon='{Lon}'", result.Lat, result.Lon);

   
            if (double.TryParse(result.Lat, NumberStyles.Float, CultureInfo.InvariantCulture, out double latitude) && 
                double.TryParse(result.Lon, NumberStyles.Float, CultureInfo.InvariantCulture, out double longitude))
            {
                _logger.LogInformation("Geocoding successful for address: {Address} -> {Lat}, {Lon}", 
                    address, latitude, longitude);

                return new GeocodingResult
                {
                    Success = true,
                    Latitude = latitude,
                    Longitude = longitude,
                    FormattedAddress = result.DisplayName
                };
            }
            else
            {
                _logger.LogWarning("Failed to parse coordinates: Lat='{Lat}', Lon='{Lon}'", result.Lat, result.Lon);
                return new GeocodingResult
                {
                    Success = false,
                    ErrorMessage = $"Invalid coordinates format returned: Lat='{result.Lat}', Lon='{result.Lon}'"
                };
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error during geocoding for address: {Street}, {City}, {PostalCode}", 
                street, city, postalCode);
            
            return new GeocodingResult
            {
                Success = false,
                ErrorMessage = $"Network error: {ex.Message}"
            };
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON parsing error during geocoding for address: {Street}, {City}, {PostalCode}", 
                street, city, postalCode);
            
            return new GeocodingResult
            {
                Success = false,
                ErrorMessage = $"Response parsing error: {ex.Message}"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during geocoding for address: {Street}, {City}, {PostalCode}", 
                street, city, postalCode);
            
            return new GeocodingResult
            {
                Success = false,
                ErrorMessage = $"Geocoding error: {ex.Message}"
            };
        }
    }

    private async Task DelayBetweenRequests()
    {
        await Task.Delay(1000); 
    }
}

public class NominatimResult
{
    public string Lat { get; set; } = string.Empty;
    public string Lon { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    

    public string? Type { get; set; }
    public string? Class { get; set; }
    public double? Importance { get; set; }
}