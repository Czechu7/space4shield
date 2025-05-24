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


            var hasAnyData = HasAnyDataToPersist(request.Data);

            if (hasAnyData)
            {

                await SaveSensorHistoryAsync(sensor, request.Data, cancellationToken);


                UpdateSensorData(sensor, request.Data);

                sensor.LastMeasurement = DateTime.UtcNow;
                _dbContext.Sensors.Update(sensor);
                await _dbContext.SaveChangesAsync(cancellationToken);


                await _notificationService.SendDataUpdateNotificationAsync("SensorData", "Updated",
                    new { SensorId = sensor.Id, SerialNumber = sensor.SerialNumber });
                await _notificationService.SendNotificationToUserAsync(sensor.UserId.ToString(),
                    $"Sensor {sensor.SerialNumber} data updated");

                _logger.LogInformation("Sensor data updated for serial number {SerialNumber}", request.SerialNumber);
            }
            else
            {
                _logger.LogInformation("No data provided for sensor {SerialNumber}", request.SerialNumber);
            }

            var result = _mapper.Map<SensorDto>(sensor);
            return Response<SensorDto>.SuccessWithData(result, "Sensor data processed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating sensor data for serial number {SerialNumber}", request.SerialNumber);
            return Response<SensorDto>.ErrorResponse(500, $"Error updating sensor data: {ex.Message}");
        }
    }

    private async Task SaveSensorHistoryAsync(Sensor sensor, UpdateSensorDataDto data, CancellationToken cancellationToken)
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
            ReadingSource = data.ReadingSource ?? "API",
            IsValid = true
        };

        await _dbContext.SensorReadings.AddAsync(sensorReading, cancellationToken);

        _logger.LogInformation("Sensor reading saved to history for sensor {SerialNumber}", sensor.SerialNumber);
    }

    private void UpdateSensorData(Sensor sensor, UpdateSensorDataDto data)
    {

        if (data.Temperature.HasValue)
        {
            _logger.LogDebug("Updating Temperature: {Old} -> {New}", sensor.Temperature, data.Temperature.Value);
            sensor.Temperature = data.Temperature.Value;
        }

        if (data.Humidity.HasValue)
        {
            _logger.LogDebug("Updating Humidity: {Old} -> {New}", sensor.Humidity, data.Humidity.Value);
            sensor.Humidity = data.Humidity.Value;
        }

        if (data.AirPressure.HasValue)
        {
            _logger.LogDebug("Updating AirPressure: {Old} -> {New}", sensor.AirPressure, data.AirPressure.Value);
            sensor.AirPressure = data.AirPressure.Value;
        }

        if (data.PM1_0.HasValue)
        {
            _logger.LogDebug("Updating PM1_0: {Old} -> {New}", sensor.PM1_0, data.PM1_0.Value);
            sensor.PM1_0 = data.PM1_0.Value;
        }

        if (data.PM2_5.HasValue)
        {
            _logger.LogDebug("Updating PM2_5: {Old} -> {New}", sensor.PM2_5, data.PM2_5.Value);
            sensor.PM2_5 = data.PM2_5.Value;
        }

        if (data.PM10.HasValue)
        {
            _logger.LogDebug("Updating PM10: {Old} -> {New}", sensor.PM10, data.PM10.Value);
            sensor.PM10 = data.PM10.Value;
        }

        if (data.WaterLevel.HasValue)
        {
            _logger.LogDebug("Updating WaterLevel: {Old} -> {New}", sensor.WaterLevel, data.WaterLevel.Value);
            sensor.WaterLevel = data.WaterLevel.Value;
        }

        if (data.Precipitation.HasValue)
        {
            _logger.LogDebug("Updating Precipitation: {Old} -> {New}", sensor.Precipitation, data.Precipitation.Value);
            sensor.Precipitation = data.Precipitation.Value;
        }

        if (data.UVRadiation.HasValue)
        {
            _logger.LogDebug("Updating UVRadiation: {Old} -> {New}", sensor.UVRadiation, data.UVRadiation.Value);
            sensor.UVRadiation = data.UVRadiation.Value;
        }
    }


    private bool HasAnyDataToPersist(UpdateSensorDataDto data)
    {
        return data.Temperature.HasValue ||
               data.Humidity.HasValue ||
               data.AirPressure.HasValue ||
               data.PM1_0.HasValue ||
               data.PM2_5.HasValue ||
               data.PM10.HasValue ||
               data.WaterLevel.HasValue ||
               data.Precipitation.HasValue ||
               data.UVRadiation.HasValue;
    }
}