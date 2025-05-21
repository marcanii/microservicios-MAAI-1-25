# 📘 API GraphQL en C# con .NET 8, HotChocolate y MySQL

Este proyecto es una API GraphQL construida con .NET 8, HotChocolate y Entity Framework Core conectada a una base de datos MySQL. Proporciona operaciones CRUD para libros.

---

## 🔧 Requisitos previos

- .NET SDK 8.0 instalado
- MySQL instalado y corriendo
- Visual Studio Code (opcional pero recomendado)

---

## 🛠️ Pasos de instalación y configuración

### 1. Crear el proyecto

```bash
dotnet new webapi -n LibrosGraphQL
cd LibrosGraphQL
```

### 2. Instalar paquetes NuGet

Instalar paquetes compatibles con .NET 8:

```bash
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.13
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.13
dotnet add package Pomelo.EntityFrameworkCore.MySql --version 8.0.3
dotnet add package HotChocolate.AspNetCore --version 13.7.0
dotnet add package HotChocolate.Data.EntityFramework --version 13.7.0
```

### 3. Configurar cadena de conexión

En appsettings.json:

```bash
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=bd_libros;User=root;Password=tu_contraseña;"
  }
}
```

### 4. Crear el modelo Libro.cs

```bash
public class Libro
{
    public int Id { get; set; }
    public string Titulo { get; set; }
    public string Autor { get; set; }
    public string Editorial { get; set; }
    public int Anio { get; set; }
    public string Descripcion { get; set; }
    public int NumPaginas { get; set; }
}
```

### 5. Crear el AppDbContext.cs

```bash
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Libro> Libros { get; set; }
}
```

### 6. Configurar servicios en Program.cs

```bash
builder.Services.AddDbContextFactory<LibrosDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")),
        mysqlOptions => mysqlOptions.EnableRetryOnFailure()));

builder.Services.AddPooledDbContextFactory<LibrosDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")),
        mysqlOptions => mysqlOptions.EnableRetryOnFailure()));
```

### 7. Crear Query.cs

```bash
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
```

### 8. Crear Mutation.cs

```bash
public class LibroMutations
    {
        [UseDbContext(typeof(LibrosDbContext))]
        public async Task<Libro> AddLibroAsync(
            [Service(ServiceKind.Resolver)] LibrosDbContext context,
            LibroInput input)
        { /* Here Code */ }
        public async Task<Libro> UpdateLibroAsync(
            [Service(ServiceKind.Resolver)] LibrosDbContext context,
            int id,
            LibroInput input)
         { /* Here Code */ }
         public async Task<bool> DeleteLibroAsync(
            [Service(ServiceKind.Resolver)] LibrosDbContext context,
            int id)
        { /* Here Code */ }
    }
```

### 9. Mapear el endpoint GraphQL

En Program.cs, asegúrate de tener:

```bash
app.MapControllers(); // opcional
app.MapGraphQL();
```

### 🚀 Ejecutar la aplicación

```bash
dotnet build
dotnet run
```

Visita la URL:
http://localhost:5198/graphql

(Puede cambiar dependiendo del puerto asignado)

### 🧪 Ejemplos de uso

Obtener todos los libros

```bash
query GetAllLibros {
  libros {
    nodes {
      id
      titulo
      autor
      editorial
      anio
      descripcion
      numPaginas
    }
  }
}
```

Obtener un libro por ID

```bash
query GetLibroById {
  libroById(id: 1) {
    id
    titulo
    autor
    editorial
    anio
    descripcion
    numPaginas
  }
}
```

### Mutaciones (Mutations):

Agregar un nuevo libro

```bash
mutation AddLibro {
  addLibro(
    input: {
      titulo: "El código Da Vinci"
      autor: "Dan Brown"
      editorial: "Planeta"
      anio: 2003
      descripcion: "Novela de misterio y conspiración"
      numPaginas: 589
    }
  ) {
    id
    titulo
    autor
    editorial
  }
}
```

Actualizar un libro existente

```bash
mutation UpdateLibro {
  updateLibro(
    id: 1
    input: {
      titulo: "El código Da Vinci - Edición revisada"
      autor: "Dan Brown"
      editorial: "Planeta"
      anio: 2003
      descripcion: "Novela de misterio y conspiración religiosa"
      numPaginas: 590
    }
  ) {
    id
    titulo
    descripcion
    numPaginas
  }
}
```

Eliminar un libro

```bash
mutation DeleteLibro {
  deleteLibroAsync(id: 3)
}
```