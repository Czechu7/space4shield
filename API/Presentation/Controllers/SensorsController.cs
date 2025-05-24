using Application.Common.Models;
using Application.CQRS.Sensors.Commands;
using Application.CQRS.Sensors.DTOs;
using Application.CQRS.Sensors.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

[Authorize]
public class SensorsController : ApiControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(Response<SensorDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Response<SensorDto>>> CreateSensor([FromBody] CreateSensorDto createSensorDto)
    {
        var command = new CreateSensorCommand(createSensorDto);
        var response = await Mediator.Send(command);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return CreatedAtAction(nameof(GetSensorById), new { id = response.Data?.Id }, response);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Response<SensorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Response<SensorDto>>> GetSensorById(Guid id)
    {
        var query = new GetSensorByIdQuery(id);
        var response = await Mediator.Send(query);

        if (!response.Success)
        {
            if (response.StatusCode == 404)
                return NotFound(response);

            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet("serial/{serialNumber}")]
    [ProducesResponseType(typeof(Response<SensorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Response<SensorDto>>> GetSensorBySerial(string serialNumber)
    {
        var query = new GetSensorBySerialQuery(serialNumber);
        var response = await Mediator.Send(query);

        if (!response.Success)
        {
            if (response.StatusCode == 404)
                return NotFound(response);

            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet("my-sensors")]
    [ProducesResponseType(typeof(Response<PagedResult<SensorDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Response<PagedResult<SensorDto>>>> GetUserSensors(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDescending = false)
    {
        var query = new GetUserSensorsQuery(pageNumber, pageSize, searchTerm, sortBy, sortDescending);
        var response = await Mediator.Send(query);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet("my-sensors-all")]
    [ProducesResponseType(typeof(Response<List<SensorDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Response<List<SensorDto>>>> GetMySensorsAll(
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDescending = false,
        [FromQuery] bool includeInactive = false)
    {
        var query = new GetMySensorsAllQuery(searchTerm, sortBy, sortDescending, includeInactive);
        var response = await Mediator.Send(query);

        if (!response.Success)
        {
            if (response.StatusCode == 401)
                return Unauthorized(response);

            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Response<SensorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Response<SensorDto>>> UpdateSensor(Guid id, [FromBody] UpdateSensorDataDto updateSensorDto)
    {
        var command = new UpdateSensorCommand(id, updateSensorDto);
        var response = await Mediator.Send(command);

        if (!response.Success)
        {
            if (response.StatusCode == 404)
                return NotFound(response);
            if (response.StatusCode == 403)
                return Forbid();

            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPost("data/{serialNumber}")]
    [AllowAnonymous] 
    [ProducesResponseType(typeof(Response<SensorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Response<SensorDto>>> UpdateSensorDataBySerial(
        string serialNumber, 
        [FromBody] UpdateSensorDataDto updateSensorDataDto)
    {
        var command = new UpdateSensorDataBySerialCommand(serialNumber, updateSensorDataDto);
        var response = await Mediator.Send(command);

        if (!response.Success)
        {
            if (response.StatusCode == 404)
                return NotFound(response);

            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Response<bool>>> DeleteSensor(Guid id)
    {
        var command = new DeleteSensorCommand(id);
        var response = await Mediator.Send(command);

        if (!response.Success)
        {
            return response.StatusCode switch
            {
                404 => NotFound(response),
                401 => Unauthorized(response),
                403 => Forbid(),
                _ => BadRequest(response)
            };
        }

        return Ok(response);
    }

    [HttpGet("{id}/history")]
    [ProducesResponseType(typeof(Response<PagedResult<SensorReadingDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Response<PagedResult<SensorReadingDto>>>> GetSensorHistory(
        Guid id,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDescending = false,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] bool includeInvalid = false)
    {
        var query = new GetSensorHistoryQuery(id, pageNumber, pageSize, searchTerm, sortBy, sortDescending, fromDate, toDate, includeInvalid);
        var response = await Mediator.Send(query);

        if (!response.Success)
        {
            if (response.StatusCode == 404)
                return NotFound(response);
            if (response.StatusCode == 401)
                return Unauthorized(response);
            if (response.StatusCode == 403)
                return Forbid();

            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet("all-info")]
    [AllowAnonymous] 
    [ProducesResponseType(typeof(Response<List<SensorInfoDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Response<List<SensorInfoDto>>>> GetAllSensorsInfo(
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDescending = false,
        [FromQuery] bool includeInactive = false,
        [FromQuery] bool onlyPublic = true)
    {
        var query = new GetAllSensorsInfoQuery(searchTerm, sortBy, sortDescending, includeInactive, onlyPublic);
        var response = await Mediator.Send(query);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}