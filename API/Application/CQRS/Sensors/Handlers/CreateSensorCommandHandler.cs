using Application.Common.Models;
using Application.Common.Interfaces;
using Application.CQRS.Base.Commands;
using Application.CQRS.Sensors.Commands;
using Application.CQRS.Sensors.DTOs;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.CQRS.Sensors.Handlers;

public class CreateSensorCommandHandler : CreateCommandHandler<CreateSensorCommand, SensorDto, CreateSensorDto, Sensor>
{
    private readonly IGeocodingService _geocodingService;

    public CreateSensorCommandHandler(IGeocodingService geocodingService)
    {
        _geocodingService = geocodingService;
    }

    protected override async Task ValidateCreateAsync(Sensor entity, CreateSensorDto dto, CancellationToken cancellationToken)
    {
        // Sprawdź czy numer seryjny już istnieje
        var existingSensor = await DbContext.Sensors
            .FirstOrDefaultAsync(s => s.SerialNumber == dto.SerialNumber, cancellationToken);

        if (existingSensor != null)
        {
            throw new Common.Exceptions.ApplicationException($"Sensor with serial number '{dto.SerialNumber}' already exists");
        }

        await base.ValidateCreateAsync(entity, dto, cancellationToken);
    }

    protected override async Task HandleCreate(Sensor entity, CreateSensorDto dto, CancellationToken cancellationToken)
    {
        // Przypisz sensor do aktualnego użytkownika
        if (!string.IsNullOrEmpty(CurrentUserService.UserId))
        {
            entity.UserId = Guid.Parse(CurrentUserService.UserId);
        }
        else
        {
            throw new InvalidOperationException("User ID is not available");
        }

        Logger.LogInformation("Getting coordinates for sensor address: {Street}, {City}, {PostalCode}",
            dto.Street, dto.City, dto.PostalCode);

        var geocodingResult = await _geocodingService.GetCoordinatesAsync(
            dto.Street, dto.City, dto.PostalCode, "Poland");

        if (!geocodingResult.Success || !geocodingResult.Latitude.HasValue || !geocodingResult.Longitude.HasValue)
        {
            Logger.LogWarning("Failed to geocode address for sensor: {Street}, {City}, {PostalCode}. Error: {Error}",
                dto.Street, dto.City, dto.PostalCode, geocodingResult.ErrorMessage);

            throw new Common.Exceptions.ApplicationException(
                $"Unable to determine coordinates for the provided address: {geocodingResult.ErrorMessage}");
        }

        // Ustaw współrzędne
        entity.Latitude = geocodingResult.Latitude.Value;
        entity.Longitude = geocodingResult.Longitude.Value;
        entity.Status = "Active";

        Logger.LogInformation("Sensor coordinates set: {Latitude}, {Longitude} for address: {FormattedAddress}",
            entity.Latitude, entity.Longitude, geocodingResult.FormattedAddress);

        await base.HandleCreate(entity, dto, cancellationToken);
    }

    protected override async Task<SensorDto> CreateResponseFromEntityAsync(Sensor entity, CreateSensorDto dto, CancellationToken cancellationToken)
    {
        var response = Mapper.Map<SensorDto>(entity);
        return await Task.FromResult(response);
    }
}