using Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class SensorReading : BaseEntity
{
    [Required]
    public Guid SensorId { get; set; }

    [Required]
    public DateTime ReadingDateTime { get; set; }

    // Dane pomiarowe - dokładnie takie same jak w Sensor
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

    // Metadane odczytu
    [StringLength(50)]
    public string ReadingSource { get; set; } = "Automatic"; // Automatic, Manual, Calibration

    public bool IsValid { get; set; } = true; // Czy odczyt jest prawidłowy


    [ForeignKey(nameof(SensorId))]
    public virtual Sensor Sensor { get; set; } = null!;
}