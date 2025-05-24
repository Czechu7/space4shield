namespace Application.Common.Interfaces;

public interface INotificationService
{
    Task SendNotificationToUserAsync(string userId, string message, object? data = null);
    Task SendNotificationToGroupAsync(string groupName, string message, object? data = null);
    Task SendNotificationToAllAsync(string message, object? data = null);
    Task SendDataUpdateNotificationAsync(string entityType, string action, object data);
}