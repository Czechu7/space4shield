using Application.Common.Interfaces;
using Application.Common.Models;
using Application.CQRS.Sensors.Commands;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.CQRS.Sensors.Handlers;

public class DeleteSensorCommandHandler : IRequestHandler<DeleteSensorCommand, Response<bool>>
{
    private readonly IGenericRepository<Sensor> _sensorRepository;
    private readonly IGenericRepository<SensorReading> _sensorReadingRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<DeleteSensorCommandHandler> _logger;

    public DeleteSensorCommandHandler(
        IGenericRepository<Sensor> sensorRepository,
        IGenericRepository<SensorReading> sensorReadingRepository,
        ICurrentUserService currentUserService,
        ILogger<DeleteSensorCommandHandler> logger)
    {
        _sensorRepository = sensorRepository;
        _sensorReadingRepository = sensorReadingRepository;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    public async Task<Response<bool>> Handle(DeleteSensorCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Attempting to delete sensor {SensorId}", request.SensorId);

            // Sprawdź czy sensor istnieje
            var sensor = await _sensorRepository.GetByIdAsync(request.SensorId, includeInactive: true);

            if (sensor == null)
            {
                _logger.LogWarning("Sensor with ID {SensorId} not found", request.SensorId);
                return Response<bool>.ErrorResponse(404, $"Sensor with ID {request.SensorId} not found");
            }

            // Sprawdź autoryzację
            if (!string.IsNullOrEmpty(_currentUserService.UserId) && 
                Guid.TryParse(_currentUserService.UserId, out Guid userId))
            {
                if (sensor.UserId != userId)
                {
                    _logger.LogWarning("User {UserId} attempted to delete Sensor {SensorId} belonging to another user", 
                        userId, sensor.Id);
                    return Response<bool>.ErrorResponse(403, "You do not have permission to delete this sensor");
                }
            }
            else
            {
                return Response<bool>.ErrorResponse(401, "User authentication required");
            }

            // Znajdź wszystkie odczyty sensora
            var sensorReadings = await _sensorReadingRepository.FindAsync(sr => sr.SensorId == request.SensorId);
            
            _logger.LogInformation("Sensor {SensorId} has {ReadingsCount} readings that will be deleted", 
                request.SensorId, sensorReadings.Count);

            // Hard delete wszystkich odczytów
            foreach (var reading in sensorReadings)
            {
                await _sensorReadingRepository.HardDeleteAsync(reading);
            }

            // Hard delete sensora
            await _sensorRepository.HardDeleteAsync(sensor);

            _logger.LogInformation("Successfully deleted sensor {SensorId} with {ReadingsCount} readings", 
                request.SensorId, sensorReadings.Count);

            return Response<bool>.SuccessWithData(true, 
                $"Sensor '{sensor.SerialNumber}' and {sensorReadings.Count} related readings have been permanently deleted");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting sensor {SensorId}", request.SensorId);
            return Response<bool>.ErrorResponse(500, $"Error deleting sensor: {ex.Message}");
        }
    }
}