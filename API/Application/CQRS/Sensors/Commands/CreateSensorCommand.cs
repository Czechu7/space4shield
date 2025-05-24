using Application.Common.Models;
using Application.CQRS.Base.Commands;
using Application.CQRS.Sensors.DTOs;

namespace Application.CQRS.Sensors.Commands;

public class CreateSensorCommand(CreateSensorDto data) : CreateCommand<CreateSensorDto, SensorDto>(data)
{
}