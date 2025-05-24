using Application.Common.Models;
using Application.Common.Queries;
using Application.CQRS.Base.Queries;
using Application.CQRS.Sensors.DTOs;
using Domain.Entities;

namespace Application.CQRS.Sensors.Queries;

public class GetSensorHistoryQuery : GetPagedQuery<SensorReadingDto, SensorReading>
{
    public Guid SensorId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public bool IncludeInvalid { get; set; }

    public GetSensorHistoryQuery(
        Guid sensorId,
        int pageNumber,
        int pageSize,
        string? searchTerm = null,
        string? sortBy = null,
        bool sortDescending = false,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        bool includeInvalid = false)
        : base(pageNumber, pageSize, searchTerm)
    {
        SensorId = sensorId;
        SortBy = sortBy ?? "ReadingDateTime";
        SortDescending = sortDescending;
        FromDate = fromDate;
        ToDate = toDate;
        IncludeInvalid = includeInvalid;
    }
}