using Application.Common.Models;
using Application.CQRS.Base.Commands;
using Application.CQRS.Sensors.Commands;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.CQRS.Sensors.Handlers;

public class DeleteSensorCommandHandler : DeleteCommandHandler<DeleteSensorCommand, ResponseBase, Sensor>
{
    public override async Task<Response<ResponseBase>> Handle(DeleteSensorCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var entity = await DbContext.Sensors
                .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

            if (entity == null)
            {
                Logger.LogWarning("Sensor with ID {Id} not found", request.Id);
                return Error(404, $"Sensor with ID {request.Id} not found");
            }

            if (!string.IsNullOrEmpty(CurrentUserService.UserId) && 
                Guid.TryParse(CurrentUserService.UserId, out Guid userId) &&
                entity.UserId != userId)
            {
                Logger.LogWarning("User {UserId} attempted to delete Sensor {SensorId} belonging to another user", 
                    userId, entity.Id);
                return Error(403, "You do not have permission to delete this sensor");
            }

            await ValidateDeleteAsync(request.Id, cancellationToken);
            await Repository.DeleteAsync(request.Id);
            
            return SuccessResponse("Sensor deleted successfully");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error deleting Sensor with ID {Id}", request.Id);
            return Error(500, $"Error deleting Sensor: {ex.Message}");
        }
    }
}