using Application.Common.Interfaces;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(IHubContext<NotificationHub> hubContext, ILogger<NotificationService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task SendNotificationToUserAsync(string userId, string message, object? data = null)
    {
        try
        {
            await _hubContext.Clients.Group($"User_{userId}")
                .SendAsync("ReceiveNotification", new
                {
                    Message = message,
                    Data = data,
                    Timestamp = DateTime.UtcNow,
                    Type = "UserNotification"
                });

            _logger.LogInformation("Notification sent to user {UserId}: {Message}", userId, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send notification to user {UserId}", userId);
        }
    }

    public async Task SendNotificationToGroupAsync(string groupName, string message, object? data = null)
    {
        try
        {
            await _hubContext.Clients.Group(groupName)
                .SendAsync("ReceiveNotification", new
                {
                    Message = message,
                    Data = data,
                    Timestamp = DateTime.UtcNow,
                    Type = "GroupNotification"
                });

            _logger.LogInformation("Notification sent to group {GroupName}: {Message}", groupName, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send notification to group {GroupName}", groupName);
        }
    }

    public async Task SendNotificationToAllAsync(string message, object? data = null)
    {
        try
        {
            await _hubContext.Clients.Group("AllUsers")
                .SendAsync("ReceiveNotification", new
                {
                    Message = message,
                    Data = data,
                    Timestamp = DateTime.UtcNow,
                    Type = "BroadcastNotification"
                });

            _logger.LogInformation("Broadcast notification sent: {Message}", message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send broadcast notification");
        }
    }

    public async Task SendDataUpdateNotificationAsync(string entityType, string action, object data)
    {
        try
        {
            await _hubContext.Clients.Group("AllUsers")
                .SendAsync("DataUpdated", new
                {
                    EntityType = entityType,
                    Action = action, // "Created", "Updated", "Deleted"
                    Data = data,
                    Timestamp = DateTime.UtcNow
                });

            _logger.LogInformation("Data update notification sent: {EntityType} {Action}", entityType, action);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send data update notification for {EntityType}", entityType);
        }
    }
}