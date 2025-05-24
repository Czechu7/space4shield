using System.ComponentModel.DataAnnotations;
using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CQRS.Sensors.DTOs;

public class UpdateSensorDataDto : IMapBidirectional<Sensor>
{
    [Range(-100.0, 100.0)]
    public double? Temperature { get; set; }

    [Range(0.0, 100.0)]
    public double? Humidity { get; set; }

    [Range(300.0, 1100.0)]
    public double? AirPressure { get; set; }

    [Range(0.0, 1000.0)]
    public double? PM1_0 { get; set; }

    [Range(0.0, 1000.0)]
    public double? PM2_5 { get; set; }

    [Range(0.0, 1000.0)]
    public double? PM10 { get; set; }

    [Range(0.0, 10000.0)]
    public double? WaterLevel { get; set; }

    [Range(0.0, 1000.0)]
    public double? Precipitation { get; set; }

    [Range(0.0, 20.0)]
    public double? UVRadiation { get; set; }

    [StringLength(50)]
    public string ReadingSource { get; set; } = "External";
}