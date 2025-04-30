using System;

namespace LibrosGraphQL.Models
{
    public class Libro
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Autor { get; set; } = string.Empty;
        public string Editorial { get; set; } = string.Empty;
        public int Anio { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int NumPaginas { get; set; }
    }
}