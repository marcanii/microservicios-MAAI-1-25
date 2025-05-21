using System;
using System.ComponentModel.DataAnnotations;

namespace Eventos.Models
{
    public class Evento
    {
        public int id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha es obligatoria")]
        [DataType(DataType.DateTime, ErrorMessage = "Formato de fecha inválido")]
        [FutureDate(ErrorMessage = "La fecha debe ser futura")]
        public DateTime fecha { get; set; }

        [Required(ErrorMessage = "El lugar es obligatorio")]
        public string lugar { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "La capacidad debe ser mayor que 0")]
        public int capacidad { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "El precio no puede ser negativo")]
        public int precio { get; set; }
    }

    // Atributo personalizado para validar fechas futuras
    public class FutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value is DateTime date)
            {
                return date > DateTime.Now;
            }
            return false;
        }
    }
}