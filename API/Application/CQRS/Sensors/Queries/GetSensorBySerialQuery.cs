using Application.Common.Models;
using Application.Common.Queries;
using Application.CQRS.Sensors.DTOs;

namespace Application.CQRS.Sensors.Queries;

public class GetSensorBySerialQuery(string serialNumber) : IQuery<SensorDto>
{
    public string SerialNumber { get; set; } = serialNumber;
}