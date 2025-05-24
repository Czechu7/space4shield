using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;
    private readonly ICurrentUserService _currentUserService;

    public NotificationHub(ILogger<NotificationHub> logger, ICurrentUserService currentUserService)
    {
        _logger = logger;
        _currentUserService = currentUserService;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = _currentUserService.UserId;
        var connectionId = Context.ConnectionId;
        
        if (!string.IsNullOrEmpty(userId))
        {
            // Dodaj użytkownika do grupy na podstawie jego ID
            await Groups.AddToGroupAsync(connectionId, $"User_{userId}");
            
            // Opcjonalnie - dodaj do grupy wszystkich użytkowników
            await Groups.AddToGroupAsync(connectionId, "AllUsers");
            
            _logger.LogInformation("User {UserId} connected with ConnectionId {ConnectionId}", userId, connectionId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = _currentUserService.UserId;
        var connectionId = Context.ConnectionId;
        
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(connectionId, $"User_{userId}");
            await Groups.RemoveFromGroupAsync(connectionId, "AllUsers");
            
            _logger.LogInformation("User {UserId} disconnected with ConnectionId {ConnectionId}", userId, connectionId);
        }

        if (exception != null)
        {
            _logger.LogError(exception, "User disconnected with error");
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Metoda do dołączania do specyficznej grupy
    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        _logger.LogInformation("User {UserId} joined group {GroupName}", _currentUserService.UserId, groupName);
    }

    // Metoda do opuszczania grupy
    public async Task LeaveGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        _logger.LogInformation("User {UserId} left group {GroupName}", _currentUserService.UserId, groupName);
    }

    // Metoda do wysyłania wiadomości do grupy
    public async Task SendMessageToGroup(string groupName, string message)
    {
        var userId = _currentUserService.UserId;
        await Clients.Group(groupName).SendAsync("ReceiveMessage", userId, message);
        _logger.LogInformation("User {UserId} sent message to group {GroupName}", userId, groupName);
    }
}