using Application.CQRS.Base.Commands;
using Application.CQRS.Sensors.Commands;
using Application.CQRS.Sensors.DTOs;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.CQRS.Sensors.Handlers;

public class UpdateSensorCommandHandler : UpdateCommandHandler<UpdateSensorCommand, SensorDto, UpdateSensorDto, Sensor>
{
    protected override async Task ValidateUpdateAsync(Sensor entity, UpdateSensorDto dto, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(CurrentUserService.UserId) && 
            Guid.TryParse(CurrentUserService.UserId, out Guid userId))
        {
            if (entity.UserId != userId)
            {
                Logger.LogWarning("User {UserId} attempted to update Sensor {SensorId} belonging to another user", 
                    userId, entity.Id);
                throw new Common.Exceptions.ApplicationException("You do not have permission to update this sensor");
            }
        }

        await base.ValidateUpdateAsync(entity, dto, cancellationToken);
    }

    protected override async Task<SensorDto> CreateResponseFromEntityAsync(Sensor entity, UpdateSensorDto dto, CancellationToken cancellationToken)
    {
        var response = Mapper.Map<SensorDto>(entity);
        return await Task.FromResult(response);
    }
}