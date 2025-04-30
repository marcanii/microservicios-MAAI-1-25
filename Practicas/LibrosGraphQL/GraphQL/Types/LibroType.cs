using HotChocolate.Types;
using LibrosGraphQL.Models;

namespace LibrosGraphQL.GraphQL.Types
{
    public class LibroType : ObjectType<Libro>
    {
        protected override void Configure(IObjectTypeDescriptor<Libro> descriptor)
        {
            descriptor.Field(f => f.Id).Type<IntType>();
            descriptor.Field(f => f.Titulo).Type<StringType>();
            descriptor.Field(f => f.Autor).Type<StringType>();
            descriptor.Field(f => f.Editorial).Type<StringType>();
            descriptor.Field(f => f.Anio).Type<IntType>();
            descriptor.Field(f => f.Descripcion).Type<StringType>();
            descriptor.Field(f => f.NumPaginas).Type<IntType>();
        }
    }
}