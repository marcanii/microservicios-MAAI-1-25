using MongoDB.Driver;
using Microsoft.Extensions.Options;
using Habitaciones.Models;

namespace Habitaciones.Data
{
    public class MongoContext
    {
        private readonly IMongoDatabase _database;

        public MongoContext(IOptions<MongoSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<HabitacionMongo> HabitacionMongo => _database.GetCollection<HabitacionMongo>("Habitaciones");
    }
}
