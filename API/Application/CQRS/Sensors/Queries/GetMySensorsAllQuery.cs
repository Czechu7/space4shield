using Application.CQRS.Base.Queries;
using Application.CQRS.Sensors.DTOs;

namespace Application.CQRS.Sensors.Queries;

public class GetMySensorsAllQuery : GetAllQuery<SensorDto>
{
    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }

    public GetMySensorsAllQuery(
        string? searchTerm = null,
        string? sortBy = null,
        bool sortDescending = false,
        bool includeInactive = false) : base(includeInactive)
    {
        SearchTerm = searchTerm;
        SortBy = sortBy;
        SortDescending = sortDescending;
    }
}