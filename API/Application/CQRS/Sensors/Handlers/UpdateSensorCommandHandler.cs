using Application.CQRS.Base.Commands;
using Application.CQRS.Sensors.Commands;
using Application.CQRS.Sensors.DTOs;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.CQRS.Sensors.Handlers;

public class UpdateSensorCommandHandler : UpdateCommandHandler<UpdateSensorCommand, SensorDto, UpdateSensorDataDto, Sensor>
{
    protected override async Task ValidateUpdateAsync(Sensor entity, UpdateSensorDataDto dto, CancellationToken cancellationToken)
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
    }

    protected override async Task HandleUpdateAsync(Sensor entity, UpdateSensorDataDto dto, CancellationToken cancellationToken)
    {
        // Zapisz poprzednie dane do historii jeśli istnieją jakiekolwiek dane pomiarowe
        if (HasSensorData(entity))
        {
            await SaveCurrentDataToHistory(entity, cancellationToken);
        }
    }

    protected override async Task<SensorDto> CreateResponseFromEntityAsync(Sensor entity, UpdateSensorDataDto dto, CancellationToken cancellationToken)
    {
        var response = Mapper.Map<SensorDto>(entity);
        return await Task.FromResult(response);
    }

    private bool HasSensorData(Sensor entity)
    {
        return entity.Temperature.HasValue ||
               entity.Humidity.HasValue ||
               entity.AirPressure.HasValue ||
               entity.PM1_0.HasValue ||
               entity.PM2_5.HasValue ||
               entity.PM10.HasValue ||
               entity.WaterLevel.HasValue ||
               entity.Precipitation.HasValue ||
               entity.UVRadiation.HasValue;
    }

    private async Task SaveCurrentDataToHistory(Sensor entity, CancellationToken cancellationToken)
    {
        var sensorReading = new SensorReading
        {
            SensorId = entity.Id,
            ReadingDateTime = entity.LastMeasurement ?? DateTime.UtcNow,
            Temperature = entity.Temperature,
            Humidity = entity.Humidity,
            AirPressure = entity.AirPressure,
            PM1_0 = entity.PM1_0,
            PM2_5 = entity.PM2_5,
            PM10 = entity.PM10,
            WaterLevel = entity.WaterLevel,
            Precipitation = entity.Precipitation,
            UVRadiation = entity.UVRadiation,
            ReadingSource = "Manual",
            IsValid = true
        };

        await DbContext.Set<SensorReading>().AddAsync(sensorReading, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);

        Logger.LogInformation("Saved sensor data to history for Sensor {SensorId} before update", entity.Id);
    }
}