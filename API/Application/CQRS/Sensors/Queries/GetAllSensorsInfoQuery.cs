using Application.CQRS.Base.Queries;
using Application.CQRS.Sensors.DTOs;

namespace Application.CQRS.Sensors.Queries;

public class GetAllSensorsInfoQuery : GetAllQuery<SensorInfoDto>
{
    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
    public bool OnlyPublic { get; set; }

    public GetAllSensorsInfoQuery(
        string? searchTerm = null,
        string? sortBy = null,
        bool sortDescending = false,
        bool includeInactive = false,
        bool onlyPublic = true) : base(includeInactive)
    {
        SearchTerm = searchTerm;
        SortBy = sortBy;
        SortDescending = sortDescending;
        OnlyPublic = onlyPublic;
    }
}