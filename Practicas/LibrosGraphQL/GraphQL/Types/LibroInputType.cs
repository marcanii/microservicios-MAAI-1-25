using HotChocolate.Types;
using LibrosGraphQL.GraphQL.Mutations;

namespace LibrosGraphQL.GraphQL.Types
{
    public class LibroInputType : InputObjectType<LibroInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<LibroInput> descriptor)
        {
            descriptor.Name("LibroInput");
            descriptor.Field(f => f.Titulo).Type<StringType>();
            descriptor.Field(f => f.Autor).Type<StringType>();
            descriptor.Field(f => f.Editorial).Type<StringType>();
            descriptor.Field(f => f.Anio).Type<IntType>();
            descriptor.Field(f => f.Descripcion).Type<StringType>();
            descriptor.Field(f => f.NumPaginas).Type<IntType>();
        }
    }
}