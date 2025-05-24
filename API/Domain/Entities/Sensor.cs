using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Common;
using Newtonsoft.Json;

namespace Domain.Entities;

public class Sensor : BaseEntity
{
    [Required]
    [StringLength(100)]
    public string SerialNumber { get; set; } = string.Empty;

    [Required]
    public Guid UserId { get; set; }

    // Adres
    [Required]
    [StringLength(200)]
    public string Street { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [StringLength(10)]
    public string PostalCode { get; set; } = string.Empty;

    // Współrzędne geograficzne
    [Required]
    [Range(-90.0, 90.0)]
    public double Latitude { get; set; }

    [Required]
    [Range(-180.0, 180.0)]
    public double Longitude { get; set; }

    // Dane sensorowe - wartości nullable bo mogą być czasowo niedostępne
    [Range(-100.0, 100.0)]
    public double? Temperature { get; set; } // °C

    [Range(0.0, 100.0)]
    public double? Humidity { get; set; } // %

    [Range(300.0, 1100.0)]
    public double? AirPressure { get; set; } // hPa

    [Range(0.0, 1000.0)]
    public double? PM1_0 { get; set; } // μg/m³

    [Range(0.0, 1000.0)]
    public double? PM2_5 { get; set; } // μg/m³

    [Range(0.0, 1000.0)]
    public double? PM10 { get; set; } // μg/m³

    [Range(0.0, 10000.0)]
    public double? WaterLevel { get; set; } // mm

    [Range(0.0, 1000.0)]
    public double? Precipitation { get; set; } // mm

    [Range(0.0, 20.0)]
    public double? UVRadiation { get; set; } // UV Index


    public DateTime? LastMeasurement { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = "Active"; // Active, Inactive, Maintenance

    [StringLength(500)]
    public string? Description { get; set; }

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    public virtual ICollection<SensorReading> SensorReadings { get; set; } = new List<SensorReading>();
}