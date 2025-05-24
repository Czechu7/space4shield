using Application.Common.Models;
using Application.CQRS.Base.Queries;
using Application.CQRS.Sensors.DTOs;
using Application.CQRS.Sensors.Queries;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace Application.CQRS.Sensors.Handlers;

public class GetSensorHistoryQueryHandler : GetPagedQueryHandler<GetSensorHistoryQuery, SensorReadingDto, SensorReading>
{
    public override async Task<Response<PagedResult<SensorReadingDto>>> Handle(GetSensorHistoryQuery request, CancellationToken cancellationToken)
    {
        try
        {
       
            var sensor = await DbContext.Sensors
                .FirstOrDefaultAsync(s => s.Id == request.SensorId, cancellationToken);

            if (sensor == null)
            {
                Logger.LogWarning("Sensor with ID {SensorId} not found", request.SensorId);
                return Error(404, $"Sensor with ID {request.SensorId} not found");
            }

  
            if (!string.IsNullOrEmpty(CurrentUserService.UserId) && 
                Guid.TryParse(CurrentUserService.UserId, out Guid userId))
            {
                if (sensor.UserId != userId)
                {
                    Logger.LogWarning("User {UserId} attempted to access history of Sensor {SensorId} belonging to another user", 
                        userId, sensor.Id);
                    return Error(403, "You do not have permission to view this sensor's history");
                }
            }
            else
            {
                Logger.LogWarning("User authentication required for sensor history access");
                return Error(401, "User authentication required");
            }

            Logger.LogInformation("Getting paged sensor readings for sensor {SensorId}, user {UserId}: Page {Page}, Size {Size}", 
                request.SensorId, userId, request.PageNumber, request.PageSize);

   
            Expression<Func<SensorReading, bool>> sensorFilter = sr => sr.SensorId == request.SensorId;
            request.Filter = sensorFilter;

     
            if (!request.IncludeInvalid)
            {
                Expression<Func<SensorReading, bool>> validFilter = sr => sr.IsValid;
                
                var parameter = Expression.Parameter(typeof(SensorReading), "sr");
                var combinedBody = Expression.AndAlso(
                    Expression.Invoke(sensorFilter, parameter),
                    Expression.Invoke(validFilter, parameter)
                );
                
                request.Filter = Expression.Lambda<Func<SensorReading, bool>>(combinedBody, parameter);
                Logger.LogInformation("Filtering out invalid readings");
            }

     
            if (request.FromDate.HasValue)
            {
                Expression<Func<SensorReading, bool>> fromDateFilter = sr => sr.ReadingDateTime >= request.FromDate.Value;
                
                var parameter = Expression.Parameter(typeof(SensorReading), "sr");
                var combinedBody = Expression.AndAlso(
                    Expression.Invoke(request.Filter, parameter),
                    Expression.Invoke(fromDateFilter, parameter)
                );
                
                request.Filter = Expression.Lambda<Func<SensorReading, bool>>(combinedBody, parameter);
                Logger.LogInformation("Filtering from date: {FromDate}", request.FromDate.Value);
            }

            if (request.ToDate.HasValue)
            {
                Expression<Func<SensorReading, bool>> toDateFilter = sr => sr.ReadingDateTime <= request.ToDate.Value;
                
                var parameter = Expression.Parameter(typeof(SensorReading), "sr");
                var combinedBody = Expression.AndAlso(
                    Expression.Invoke(request.Filter, parameter),
                    Expression.Invoke(toDateFilter, parameter)
                );
                
                request.Filter = Expression.Lambda<Func<SensorReading, bool>>(combinedBody, parameter);
                Logger.LogInformation("Filtering to date: {ToDate}", request.ToDate.Value);
            }


            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                Expression<Func<SensorReading, bool>> searchFilter = sr => 
                    sr.ReadingSource.ToLower().Contains(searchTerm);
                
                var parameter = Expression.Parameter(typeof(SensorReading), "sr");
                var combinedBody = Expression.AndAlso(
                    Expression.Invoke(request.Filter, parameter),
                    Expression.Invoke(searchFilter, parameter)
                );
                
                request.Filter = Expression.Lambda<Func<SensorReading, bool>>(combinedBody, parameter);
                Logger.LogInformation("Applying search filter: {SearchTerm}", request.SearchTerm);
            }

            return await base.Handle(request, cancellationToken);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error retrieving paged sensor readings for sensor {SensorId}", request.SensorId);
            return Error(500, $"Error retrieving sensor history: {ex.Message}");
        }
    }
}