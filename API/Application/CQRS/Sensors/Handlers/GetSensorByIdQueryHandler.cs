using Application.CQRS.Base.Queries;
using Application.CQRS.Sensors.DTOs;
using Application.CQRS.Sensors.Queries;
using Domain.Entities;

namespace Application.CQRS.Sensors.Handlers;

public class GetSensorByIdQueryHandler : GetByIdQueryHandler<GetSensorByIdQuery, SensorDto, Sensor>
{
}