using Application.Common.Models;
using Application.Common.Queries;
using Application.CQRS.Sensors.DTOs;

namespace Application.CQRS.Sensors.Queries;

public class GetUserSensorsQuery(
    int pageNumber = 1,
    int pageSize = 10,
    string? searchTerm = null,
    string? sortBy = null,
    bool sortDescending = false) : IQuery<PagedResult<SensorDto>>
{
    public int PageNumber { get; set; } = pageNumber;
    public int PageSize { get; set; } = pageSize;
    public string? SearchTerm { get; set; } = searchTerm;
    public string? SortBy { get; set; } = sortBy;
    public bool SortDescending { get; set; } = sortDescending;
}