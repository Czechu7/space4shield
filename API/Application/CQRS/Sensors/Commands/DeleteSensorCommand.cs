using Application.Common.Models;
using MediatR;

namespace Application.CQRS.Sensors.Commands;

public class DeleteSensorCommand : IRequest<Response<bool>>
{
    public Guid SensorId { get; set; }

    public DeleteSensorCommand(Guid sensorId)
    {
        SensorId = sensorId;
    }
}