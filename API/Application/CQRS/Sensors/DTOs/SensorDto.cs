using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CQRS.Sensors.DTOs;

public class SensorDto : IMapFrom<Sensor>
{
    public Guid Id { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? Temperature { get; set; }
    public double? Humidity { get; set; }
    public double? AirPressure { get; set; }
    public double? PM1_0 { get; set; }
    public double? PM2_5 { get; set; }
    public double? PM10 { get; set; }
    public double? WaterLevel { get; set; }
    public double? Precipitation { get; set; }
    public double? UVRadiation { get; set; }
    public DateTime? LastMeasurement { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ModifiedAt { get; set; }
}