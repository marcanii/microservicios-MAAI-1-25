using System;

namespace Reservas.Models
{
  public class Reserva
  {
    public int id { get; set; }
    public int habitacion_id { get; set; }
    public int usuario_id { get; set; }
    public DateTime fecha_reserva { get; set; }
    public DateTime fecha_entrada { get; set; }
    public DateTime fecha_salida { get; set; }
    public string estado_reserva { get; set; } = string.Empty;
    public float total_a_pagar { get; set; }
  }
}