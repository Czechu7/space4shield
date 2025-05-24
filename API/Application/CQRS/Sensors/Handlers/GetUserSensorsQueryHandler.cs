using Application.Common.Models;
using Application.CQRS.Sensors.DTOs;
using Application.CQRS.Sensors.Queries;
using Application.CQRS.Base;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Sensors.Handlers;

public class GetUserSensorsQueryHandler : QueryHandlerBase<GetUserSensorsQuery, PagedResult<SensorDto>, Sensor>
{
    protected override async Task<PagedResult<SensorDto>> HandleQuery(GetUserSensorsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(CurrentUserService.UserId) || 
            !Guid.TryParse(CurrentUserService.UserId, out Guid userId))
        {
            throw new UnauthorizedAccessException("User authentication required");
        }

        var query = DbContext.Sensors
            .Where(s => s.UserId == userId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            query = query.Where(s => 
                s.SerialNumber.Contains(request.SearchTerm) ||
                s.City.Contains(request.SearchTerm) ||
                s.Street.Contains(request.SearchTerm) ||
                (s.Description != null && s.Description.Contains(request.SearchTerm)));
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
        }
        else
        {
            query = query.OrderBy(s => s.CreatedAt);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        
        var sensors = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var sensorDtos = Mapper.Map<List<SensorDto>>(sensors);

        return new PagedResult<SensorDto>
        {
            Items = sensorDtos,

            
        };
    }
}