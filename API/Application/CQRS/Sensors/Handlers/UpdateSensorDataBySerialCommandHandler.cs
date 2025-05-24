using Application.Common.Interfaces;
using Application.Common.Models;
using Application.CQRS.Sensors.Commands;
using Application.CQRS.Sensors.DTOs;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.CQRS.Sensors.Handlers;

public class UpdateSensorDataBySerialCommandHandler : IRequestHandler<UpdateSensorDataBySerialCommand, Response<SensorDto>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdateSensorDataBySerialCommandHandler> _logger;
    private readonly INotificationService _notificationService;

    public UpdateSensorDataBySerialCommandHandler(
        IApplicationDbContext dbContext,
        IMapper mapper,
        ILogger<UpdateSensorDataBySerialCommandHandler> logger,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _logger = logger;
        _notificationService = notificationService;
    }

    public async Task<Response<SensorDto>> Handle(UpdateSensorDataBySerialCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var sensor = await _dbContext.Sensors
                .FirstOrDefaultAsync(s => s.SerialNumber == request.SerialNumber, cancellationToken);

            if (sensor == null)
            {
                _logger.LogWarning("Sensor with serial number {SerialNumber} not found", request.SerialNumber);
                return Response<SensorDto>.ErrorResponse(404, $"Sensor with serial number '{request.SerialNumber}' not found");
            }

            await SaveSensorHistoryAsync(sensor, request.Data, cancellationToken);

            var hasChanges = UpdateSensorData(sensor, request.Data);

            if (hasChanges)
            {
                sensor.LastMeasurement = DateTime.UtcNow;
                _dbContext.Sensors.Update(sensor);
                await _dbContext.SaveChangesAsync(cancellationToken);

 
                await _notificationService.SendDataUpdateNotificationAsync("SensorData", "Updated", new { SensorId = sensor.Id, SerialNumber = sensor.SerialNumber });
                await _notificationService.SendNotificationToUserAsync(sensor.UserId.ToString(), $"Sensor {sensor.SerialNumber} data updated");

                _logger.LogInformation("Sensor data updated for serial number {SerialNumber}", request.SerialNumber);
            }

            var result = _mapper.Map<SensorDto>(sensor);
            return Response<SensorDto>.SuccessWithData(result, "Sensor data updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating sensor data for serial number {SerialNumber}", request.SerialNumber);
            return Response<SensorDto>.ErrorResponse(500, $"Error updating sensor data: {ex.Message}");
        }
    }

    private async Task SaveSensorHistoryAsync(Sensor sensor, UpdateSensorDataDto data, CancellationToken cancellationToken)
    {

        var hasDataChanges = HasSensorDataChanges(sensor, data);

        if (hasDataChanges)
        {
            var sensorReading = new SensorReading
            {
                SensorId = sensor.Id,
                ReadingDateTime = DateTime.UtcNow,
                Temperature = data.Temperature ?? sensor.Temperature,
                Humidity = data.Humidity ?? sensor.Humidity,
                AirPressure = data.AirPressure ?? sensor.AirPressure,
                PM1_0 = data.PM1_0 ?? sensor.PM1_0,
                PM2_5 = data.PM2_5 ?? sensor.PM2_5,
                PM10 = data.PM10 ?? sensor.PM10,
                WaterLevel = data.WaterLevel ?? sensor.WaterLevel,
                Precipitation = data.Precipitation ?? sensor.Precipitation,
                UVRadiation = data.UVRadiation ?? sensor.UVRadiation,
                ReadingSource = data.ReadingSource,
                IsValid = true
            };

            await _dbContext.SensorReadings.AddAsync(sensorReading, cancellationToken);
        }
    }

    private bool HasSensorDataChanges(Sensor sensor, UpdateSensorDataDto data)
    {
        return (data.Temperature.HasValue && data.Temperature != sensor.Temperature) ||
               (data.Humidity.HasValue && data.Humidity != sensor.Humidity) ||
               (data.AirPressure.HasValue && data.AirPressure != sensor.AirPressure) ||
               (data.PM1_0.HasValue && data.PM1_0 != sensor.PM1_0) ||
               (data.PM2_5.HasValue && data.PM2_5 != sensor.PM2_5) ||
               (data.PM10.HasValue && data.PM10 != sensor.PM10) ||
               (data.WaterLevel.HasValue && data.WaterLevel != sensor.WaterLevel) ||
               (data.Precipitation.HasValue && data.Precipitation != sensor.Precipitation) ||
               (data.UVRadiation.HasValue && data.UVRadiation != sensor.UVRadiation);
    }

    private bool UpdateSensorData(Sensor sensor, UpdateSensorDataDto data)
    {
        bool hasChanges = false;

        if (data.Temperature.HasValue)
        {
            sensor.Temperature = data.Temperature.Value;
            hasChanges = true;
        }

        if (data.Humidity.HasValue)
        {
            sensor.Humidity = data.Humidity.Value;
            hasChanges = true;
        }

        if (data.AirPressure.HasValue)
        {
            sensor.AirPressure = data.AirPressure.Value;
            hasChanges = true;
        }

        if (data.PM1_0.HasValue)
        {
            sensor.PM1_0 = data.PM1_0.Value;
            hasChanges = true;
        }

        if (data.PM2_5.HasValue)
        {
            sensor.PM2_5 = data.PM2_5.Value;
            hasChanges = true;
        }

        if (data.PM10.HasValue)
        {
            sensor.PM10 = data.PM10.Value;
            hasChanges = true;
        }

        if (data.WaterLevel.HasValue)
        {
            sensor.WaterLevel = data.WaterLevel.Value;
            hasChanges = true;
        }

        if (data.Precipitation.HasValue)
        {
            sensor.Precipitation = data.Precipitation.Value;
            hasChanges = true;
        }

        if (data.UVRadiation.HasValue)
        {
            sensor.UVRadiation = data.UVRadiation.Value;
            hasChanges = true;
        }

        return hasChanges;
    }
}