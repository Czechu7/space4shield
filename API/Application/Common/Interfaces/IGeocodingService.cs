namespace Application.Common.Interfaces;

public interface IGeocodingService
{
    Task<GeocodingResult> GetCoordinatesAsync(string street, string city, string postalCode, string country = "Poland");
}

public class GeocodingResult
{
    public bool Success { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? ErrorMessage { get; set; }
    public string? FormattedAddress { get; set; }
}