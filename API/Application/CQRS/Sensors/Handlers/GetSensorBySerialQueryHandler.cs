using Application.Common.Models;
using Application.CQRS.Sensors.DTOs;
using Application.CQRS.Sensors.Queries;
using Application.CQRS.Base;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Sensors.Handlers;

public class GetSensorBySerialQueryHandler : QueryHandlerBase<GetSensorBySerialQuery, SensorDto, Sensor>
{
    protected override async Task<SensorDto> HandleQuery(GetSensorBySerialQuery request, CancellationToken cancellationToken)
    {
        var sensor = await DbContext.Sensors
            .FirstOrDefaultAsync(s => s.SerialNumber == request.SerialNumber, cancellationToken);

        if (sensor == null)
        {
            throw new Common.Exceptions.NotFoundException("Sensor", request.SerialNumber);
        }

        return Mapper.Map<SensorDto>(sensor);
    }
}