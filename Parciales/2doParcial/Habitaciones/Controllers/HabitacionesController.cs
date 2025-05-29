using Habitaciones.Models;
using Habitaciones.Services;
using Microsoft.AspNetCore.Mvc;

namespace Habitaciones.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class HabitacionesMongoController : ControllerBase
  {
    private readonly IHabitacionService _habitacionService;

    public HabitacionesMongoController(IHabitacionService habitacionService)
    {
      _habitacionService = habitacionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<HabitacionMongo>>> Get()
    {
      var habitaciones = await _habitacionService.GetAllHabitaciones();
      return Ok(habitaciones);
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<HabitacionMongo>> GetById(string id)
    {
      var habitacion = await _habitacionService.GetHabitacion(id);

      if (habitacion is null)
        return NotFound();

      return Ok(habitacion);
    }

    [HttpPost]
    public async Task<ActionResult> Post(HabitacionMongo habitacion)
    {
      var nuevaHabitacion = await _habitacionService.AddHabitacion(habitacion);
      return CreatedAtAction(nameof(GetById), new { id = nuevaHabitacion.Id }, nuevaHabitacion);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Put(string id, HabitacionMongo habitacion)
    {
      var updatedHabitacion = await _habitacionService.UpdateHabitacion(id, habitacion);
      if (updatedHabitacion is null)
        return NotFound();

      return NoContent();
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
      var deletedHabitacion = await _habitacionService.DeleteHabitacion(id);
      if (deletedHabitacion is null)
        return NotFound();

      return NoContent();
    }
  }
}
