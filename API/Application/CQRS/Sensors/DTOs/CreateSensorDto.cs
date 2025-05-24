using System.ComponentModel.DataAnnotations;
using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CQRS.Sensors.DTOs;

public class CreateSensorDto : IMapBidirectional<Sensor>
{
    [Required]
    [StringLength(100)]
    public string SerialNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Street { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [StringLength(10)]
    public string PostalCode { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

}