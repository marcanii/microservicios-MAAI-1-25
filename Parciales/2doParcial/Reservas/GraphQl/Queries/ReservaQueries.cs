using HotChocolate;
using HotChocolate.Data;
using Reservas.Data;
using Reservas.Models;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
// Añadir esta referencia para ServiceKind
using HotChocolate.Execution;

namespace Reservas.GraphQL.Queries
{
  public class ReservaQueries
  {
    [UseDbContext(typeof(ReservasDbContext))]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Reserva> GetReservas([Service(ServiceKind.Resolver)] ReservasDbContext context)
    {
      return context.reservas;
    }

    [UseDbContext(typeof(ReservasDbContext))]
    public async Task<Reserva?> GetReservaById([Service(ServiceKind.Resolver)] ReservasDbContext context, int id)
    {
      var reserva = await context.reservas.FindAsync(id);
      if (reserva == null)
      {
        throw new GraphQLException(new Error("Reserva no encontrada.", "RESERVA_NOT_FOUND"));
      }
      return reserva;
    }
  }
}