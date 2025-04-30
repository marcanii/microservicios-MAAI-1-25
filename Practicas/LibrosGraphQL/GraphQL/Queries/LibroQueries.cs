using HotChocolate;
using HotChocolate.Data;
using LibrosGraphQL.Data;
using LibrosGraphQL.Models;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
// Añadir esta referencia para ServiceKind
using HotChocolate.Execution;

namespace LibrosGraphQL.GraphQL.Queries
{
    public class LibroQueries
    {
        [UseDbContext(typeof(LibrosDbContext))]
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Libro> GetLibros([Service(ServiceKind.Resolver)] LibrosDbContext context)
        {
            return context.Libros;
        }

        [UseDbContext(typeof(LibrosDbContext))]
        public async Task<Libro?> GetLibroById([Service(ServiceKind.Resolver)] LibrosDbContext context, int id)
        {
            var libro = await context.Libros.FindAsync(id);
            if (libro == null)
            {
                throw new GraphQLException(new Error("Libro no encontrado.", "LIBRO_NOT_FOUND"));
            }
            return libro;
        }
    }
}