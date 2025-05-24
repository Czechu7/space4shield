using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CQRS.Sensors.DTOs;

public class SensorReadingDto : IMapFrom<SensorReading>
{
    public Guid Id { get; set; }
    public Guid SensorId { get; set; }
    public DateTime ReadingDateTime { get; set; }
    public double? Temperature { get; set; }
    public double? Humidity { get; set; }
    public double? AirPressure { get; set; }
    public double? PM1_0 { get; set; }
    public double? PM2_5 { get; set; }
    public double? PM10 { get; set; }
    public double? WaterLevel { get; set; }
    public double? Precipitation { get; set; }
    public double? UVRadiation { get; set; }
    public string ReadingSource { get; set; } = string.Empty;
    public bool IsValid { get; set; }
    public DateTime CreatedAt { get; set; }
}