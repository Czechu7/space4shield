using Application.Common.Models;
using Application.CQRS.Base.Queries;
using Application.CQRS.Sensors.DTOs;
using Application.CQRS.Sensors.Queries;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.CQRS.Sensors.Handlers;

public class GetAllSensorsInfoQueryHandler : GetAllQueryHandler<GetAllSensorsInfoQuery, SensorInfoDto, Sensor>
{
    public override async Task<Response<List<SensorInfoDto>>> Handle(GetAllSensorsInfoQuery request, CancellationToken cancellationToken)
    {
        try
        {
            Logger.LogInformation("Getting all sensors info with coordinates");

            var query = DbContext.Sensors.AsQueryable();

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
                    "temperature" => request.SortDescending 
                        ? query.OrderByDescending(s => s.Temperature)
                        : query.OrderBy(s => s.Temperature),
                    "humidity" => request.SortDescending 
                        ? query.OrderByDescending(s => s.Humidity)
                        : query.OrderBy(s => s.Humidity),
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
            

            var result = sensors.Select(sensor => new SensorInfoDto
            {
                Id = sensor.Id,
                SerialNumber = sensor.SerialNumber,

                Latitude = sensor.Latitude,
                Longitude = sensor.Longitude,
                Status = sensor.Status,

                LastMeasurement = sensor.LastMeasurement,
                CreatedAt = sensor.CreatedAt,


                Temperature = sensor.Temperature,
                Humidity = sensor.Humidity,
                AirPressure = sensor.AirPressure,
                PM2_5 = sensor.PM2_5,
                PM10 = sensor.PM10,
                PM1_0 = sensor.PM1_0,
                WaterLevel = sensor.WaterLevel,
                Precipitation = sensor.Precipitation,
                UVRadiation = sensor.UVRadiation

            }).ToList();
            
            Logger.LogInformation("Retrieved {Count} sensors info with sensor data", result.Count);
            
            return SuccessWithData(result, $"Retrieved {result.Count} sensors with coordinates and data");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error getting all sensors info");
            return Error(500, $"Error retrieving sensors: {ex.Message}");
        }
    }
}