using System.ComponentModel.DataAnnotations;
using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CQRS.Sensors.DTOs;

public class UpdateSensorDto : IMapBidirectional<Sensor>
{
    [StringLength(200)]
    public string? Street { get; set; }

    [StringLength(100)]
    public string? City { get; set; }

    [StringLength(10)]
    public string? PostalCode { get; set; }

    [Range(-90.0, 90.0)]
    public double? Latitude { get; set; }

    [Range(-180.0, 180.0)]
    public double? Longitude { get; set; }

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

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(50)]
    public string? Status { get; set; }
}