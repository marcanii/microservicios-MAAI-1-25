using HotChocolate;
using Reservas.Data;
using Reservas.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
// Añadir esta referencia para ServiceKind
using HotChocolate.Execution;

namespace Reservas.GraphQL.Mutations
{
  public class ReservaMutations
  {
    [UseDbContext(typeof(ReservasDbContext))]
    public async Task<Reserva> AddReservaAsync(
        [Service(ServiceKind.Resolver)] ReservasDbContext context,
        ReservaInput input)
    {
      var reserva = new Reserva
      {
        habitacion_id = input.habitacion_id,
        usuario_id = input.usuario_id,
        fecha_reserva = input.fecha_reserva,
        fecha_entrada = input.fecha_entrada,
        fecha_salida = input.fecha_salida,
        estado_reserva = input.estado_reserva,
        total_a_pagar = input.total_a_pagar
      };
      context.reservas.Add(reserva);
      await context.SaveChangesAsync();
      return reserva;
    }

    [UseDbContext(typeof(ReservasDbContext))]
    public async Task<Reserva> UpdateReservaAsync(
        [Service(ServiceKind.Resolver)] ReservasDbContext context,
        int id,
        ReservaInput input)
    {
      var reserva = await context.reservas.FindAsync(id);
      if (reserva == null)
      {
        throw new GraphQLException(new Error("Reserva no encontrada.", "RESERVA_NOT_FOUND"));
      }
      reserva.habitacion_id = input.habitacion_id;
      reserva.usuario_id = input.usuario_id;
      reserva.fecha_reserva = input.fecha_reserva;
      reserva.fecha_entrada = input.fecha_entrada;
      reserva.fecha_salida = input.fecha_salida;
      reserva.estado_reserva = input.estado_reserva;
      reserva.total_a_pagar = input.total_a_pagar;
      context.reservas.Update(reserva);
      await context.SaveChangesAsync();
      return reserva;
    }

    [UseDbContext(typeof(ReservasDbContext))]
    public async Task<bool> DeleteReservaAsync(
        [Service(ServiceKind.Resolver)] ReservasDbContext context,
        int id)
    {
      var reserva = await context.reservas.FindAsync(id);
      if (reserva == null)
      {
        throw new GraphQLException(new Error("Reserva no encontrada.", "RESERVA_NOT_FOUND"));
      }
      context.reservas.Remove(reserva);
      await context.SaveChangesAsync();
      return true;
    }
  }
  public class ReservaInput
  {
    public int habitacion_id { get; set; }
    public int usuario_id { get; set; }
    public DateTime fecha_reserva { get; set; }
    public DateTime fecha_entrada { get; set; }
    public DateTime fecha_salida { get; set; }
    public string estado_reserva { get; set; } = string.Empty;
    public float total_a_pagar { get; set; }
  }
}