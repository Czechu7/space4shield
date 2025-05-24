using Application.Common.Models;
using Application.CQRS.Base.Commands;

namespace Application.CQRS.Sensors.Commands;

public class DeleteSensorCommand(Guid id) : DeleteCommand<ResponseBase>(id)
{
}