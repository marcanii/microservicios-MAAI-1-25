using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Habitaciones.Models
{
    public class HabitacionMongo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string numero_habitacion { get; set; } = string.Empty;
        public string tipo_habitacion { get; set; } = string.Empty;
        public float precio_por_noche { get; set; }
        public string estado { get; set; } = string.Empty;
        public string descripcion { get; set; } = string.Empty;
    }
}
