using Application.Common.Models;
using Application.CQRS.Base.Queries;
using Application.CQRS.Sensors.DTOs;
using Application.CQRS.Sensors.Queries;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.CQRS.Sensors.Handlers;

public class GetMySensorsAllQueryHandler : GetAllQueryHandler<GetMySensorsAllQuery, SensorDto, Sensor>
{
    public override async Task<Response<List<SensorDto>>> Handle(GetMySensorsAllQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(CurrentUserService.UserId) || 
                !Guid.TryParse(CurrentUserService.UserId, out Guid userId))
            {
                Logger.LogWarning("User authentication required for getting sensors");
                return Error(401, "User authentication required");
            }

            Logger.LogInformation("Getting all sensors for user {UserId}", userId);

            var query = DbContext.Sensors
                .Where(s => s.UserId == userId)
                .AsQueryable();

            if (!request.IncludeInactive)
            {
                query = query.Where(s => s.Status != "Inactive");
                Logger.LogInformation("Filtering out inactive sensors");
            }

            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(s => 
                    s.SerialNumber.ToLower().Contains(searchTerm) ||
                    s.City.ToLower().Contains(searchTerm) ||
                    s.Street.ToLower().Contains(searchTerm) ||
                    (s.Description != null && s.Description.ToLower().Contains(searchTerm)));
                
                Logger.LogInformation("Applying search filter: {SearchTerm}", request.SearchTerm);
            }

            if (!string.IsNullOrEmpty(request.SortBy))
            {
                query = request.SortBy.ToLower() switch
                {
                    "serialnumber" => request.SortDescending 
                        ? query.OrderByDescending(s => s.SerialNumber)
                        : query.OrderBy(s => s.SerialNumber),
                    "city" => request.SortDescending 
                        ? query.OrderByDescending(s => s.City)
                        : query.OrderBy(s => s.City),
                    "status" => request.SortDescending 
                        ? query.OrderByDescending(s => s.Status)
                        : query.OrderBy(s => s.Status),
                    "lastmeasurement" => request.SortDescending 
                        ? query.OrderByDescending(s => s.LastMeasurement)
                        : query.OrderBy(s => s.LastMeasurement),
                    "createdat" => request.SortDescending 
                        ? query.OrderByDescending(s => s.CreatedAt)
                        : query.OrderBy(s => s.CreatedAt),
                    _ => query.OrderBy(s => s.CreatedAt)
                };
                
                Logger.LogInformation("Applying sort: {SortBy} {Direction}", 
                    request.SortBy, request.SortDescending ? "DESC" : "ASC");
            }
            else
            {
                query = query.OrderBy(s => s.CreatedAt);
            }

            var sensors = await query.ToListAsync(cancellationToken);
            var result = Mapper.Map<List<SensorDto>>(sensors);
            
            Logger.LogInformation("Retrieved {Count} sensors for user {UserId}", result.Count, userId);
            
            return SuccessWithData(result, $"Retrieved {result.Count} sensors");
        }
        catch (UnauthorizedAccessException ex)
        {
            Logger.LogWarning(ex, "Unauthorized access attempt for user {UserId}", CurrentUserService.UserId);
            return Error(401, "Unauthorized access");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error getting all sensors for user {UserId}", CurrentUserService.UserId);
            return Error(500, $"Error retrieving sensors: {ex.Message}");
        }
    }
}