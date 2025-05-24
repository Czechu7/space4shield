using Application.CQRS.Base.Commands;
using Application.CQRS.Sensors.DTOs;

namespace Application.CQRS.Sensors.Commands;

public class UpdateSensorCommand(Guid id, UpdateSensorDto data) : UpdateCommand<UpdateSensorDto, SensorDto>(id, data)
{
}