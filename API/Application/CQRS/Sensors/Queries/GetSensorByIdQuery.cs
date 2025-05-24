using Application.CQRS.Base.Queries;
using Application.CQRS.Sensors.DTOs;

namespace Application.CQRS.Sensors.Queries;

public class GetSensorByIdQuery(Guid id) : GetByIdQuery<SensorDto>(id)
{
}