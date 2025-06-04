using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Habitaciones.Models;

namespace Habitaciones.Data
{
    public class MongoContext
    {
        private readonly IMongoDatabase _database;

        public MongoContext(IOptions<MongoSettings> settings, IMongoClient mongoClient)
        {
            try
            {
                _database = mongoClient.GetDatabase(settings.Value.DatabaseName);

                // Probar la conexión intentando listar colecciones (esto lanza si no conecta)
                _database.ListCollections();

                Console.WriteLine("✅ Conectado correctamente a MongoDB: " + settings.Value.DatabaseName);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error al conectar a MongoDB: " + ex.Message);
                throw; // Opcional: relanza el error para que la app no continúe sin DB
            }
        }

        public IMongoCollection<HabitacionMongo> HabitacionMongo =>
            _database.GetCollection<HabitacionMongo>("Habitaciones");
    }
}
