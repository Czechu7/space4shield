using Application.Common.Commands;
using Application.Common.Models;
using Application.CQRS.Sensors.DTOs;
using MediatR;

namespace Application.CQRS.Sensors.Commands;

public class UpdateSensorDataBySerialCommand(string serialNumber, UpdateSensorDataDto data) : ICommand<SensorDto>
{
    public string SerialNumber { get; set; } = serialNumber;
    public UpdateSensorDataDto Data { get; set; } = data;
}