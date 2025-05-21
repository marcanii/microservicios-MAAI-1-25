using Eventos.Models;
using Eventos.Services;
using Microsoft.AspNetCore.Mvc;

namespace Eventos.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EventosController : ControllerBase
  {
    private readonly IEventoService _eventoService;

    public EventosController(IEventoService eventoService)
    {
      _eventoService = eventoService;
    }

    // GET: api/Eventos
    [HttpGet]
    public async Task<ActionResult<List<Evento>>> GetEventos()
    {
      return await _eventoService.GetAllEventos();
    }

    // GET: api/Eventos/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Evento>> GetEvento(int id)
    {
      var evento = await _eventoService.GetEvento(id);

      if (evento == null)
      {
        return NotFound();
      }

      return evento;
    }

    // POST: api/Eventos
    [HttpPost]
    public async Task<ActionResult<Evento>> PostEvento(Evento evento)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var nuevoEvento = await _eventoService.AddEvento(evento);
      return CreatedAtAction(nameof(GetEvento), new { id = nuevoEvento.id }, nuevoEvento);
    }

    // PUT: api/Eventos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutEvento(int id, Evento evento)
    {
      var eventoActualizado = await _eventoService.UpdateEvento(id, evento);

      if (eventoActualizado == null)
      {
        return NotFound();
      }

      return NoContent();
    }

    // DELETE: api/Eventos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvento(int id)
    {
      var evento = await _eventoService.DeleteEvento(id);

      if (evento == null)
      {
        return NotFound();
      }

      return NoContent();
    }
  }
}