using HotChocolate;
using LibrosGraphQL.Data;
using LibrosGraphQL.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
// Añadir esta referencia para ServiceKind
using HotChocolate.Execution;

namespace LibrosGraphQL.GraphQL.Mutations
{
    public class LibroMutations
    {
        [UseDbContext(typeof(LibrosDbContext))]
        public async Task<Libro> AddLibroAsync(
            [Service(ServiceKind.Resolver)] LibrosDbContext context,
            LibroInput input)
        {
            var libro = new Libro
            {
                Titulo = input.Titulo,
                Autor = input.Autor,
                Editorial = input.Editorial,
                Anio = input.Anio,
                Descripcion = input.Descripcion,
                NumPaginas = input.NumPaginas
            };
            context.Libros.Add(libro);
            await context.SaveChangesAsync();
            return libro;
        }

        [UseDbContext(typeof(LibrosDbContext))]
        public async Task<Libro> UpdateLibroAsync(
            [Service(ServiceKind.Resolver)] LibrosDbContext context,
            int id,
            LibroInput input)
        {
            var libro = await context.Libros.FindAsync(id);
            if (libro == null)
            {
                throw new GraphQLException(new Error("Libro no encontrado.", "LIBRO_NOT_FOUND"));
            }
            libro.Titulo = input.Titulo;
            libro.Autor = input.Autor;
            libro.Editorial = input.Editorial;
            libro.Anio = input.Anio;
            libro.Descripcion = input.Descripcion;
            libro.NumPaginas = input.NumPaginas;
            context.Libros.Update(libro);
            await context.SaveChangesAsync();
            return libro;
        }

        [UseDbContext(typeof(LibrosDbContext))]
        public async Task<bool> DeleteLibroAsync(
            [Service(ServiceKind.Resolver)] LibrosDbContext context,
            int id)
        {
            var libro = await context.Libros.FindAsync(id);
            if (libro == null)
            {
                throw new GraphQLException(new Error("Libro no encontrado.", "LIBRO_NOT_FOUND"));
            }
            context.Libros.Remove(libro);
            await context.SaveChangesAsync();
            return true;
        }
    }

    public class LibroInput
    {
        public string Titulo { get; set; } = string.Empty;
        public string Autor { get; set; } = string.Empty;
        public string Editorial { get; set; } = string.Empty;
        public int Anio { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int NumPaginas { get; set; }
    }
}