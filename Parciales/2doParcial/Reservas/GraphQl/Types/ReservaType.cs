using HotChocolate.Types;
using Reservas.Models;

namespace Reservas.GraphQL.Types
{
  public class ReservaType : ObjectType<Reserva>
  {
    protected override void Configure(IObjectTypeDescriptor<Reserva> descriptor)
    {
      descriptor.Field(f => f.id).Type<IntType>();
      descriptor.Field(f => f.habitacion_id).Type<IntType>();
      descriptor.Field(f => f.usuario_id).Type<IntType>();
      descriptor.Field(f => f.fecha_reserva).Type<DateTimeType>();
      descriptor.Field(f => f.fecha_entrada).Type<DateTimeType>();
      descriptor.Field(f => f.fecha_salida).Type<DateTimeType>();
      descriptor.Field(f => f.estado_reserva).Type<StringType>();
      descriptor.Field(f => f.total_a_pagar).Type<FloatType>();
    }
  }
}