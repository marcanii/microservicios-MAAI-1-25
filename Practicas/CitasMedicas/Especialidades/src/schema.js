const { gql } = require("apollo-server-express");
const Especialidad = require("./models/Especialidad");
const Medico = require("./models/Medico");
const logger = require("./utils/logger");
const { json } = require("body-parser");

const getIpFromContext = (context) => {
  return (
    context.req.headers["x-forwarded-for"] || context.req.socket.remoteAddress
  );
};

const typeDefs = gql`
  type Especialidad {
    id: ID!
    nombre: String!
  }

  type Horario {
    dia: String
    desde: String
    hasta: String
  }

  type Medico {
    id: ID!
    medico_id: Int!
    nombre: String!
    especialidades: [Especialidad]
    horarios: [Horario]
  }

  type Query {
    especialidades: [Especialidad]
    especialidadById(especialidadId: ID!): Especialidad
    medicosPorEspecialidad(especialidadId: ID!): [Medico]
    disponibilidad(medicoId: ID!): [Horario]
  }

  type Mutation {
    crearEspecialidad(nombre: String!): Especialidad
    registrarMedico(
      medico_id: Int!
      nombre: String!
      especialidadIds: [ID!]!
      horarios: [HorarioInput!]!
    ): Medico
  }

  input HorarioInput {
    dia: String
    desde: String
    hasta: String
  }
`;

const resolvers = {
  Query: {
    especialidades: async (_, __, context) => {
      const ip = getIpFromContext(context);
      const usuario = context?.user?.id || "anónimo";
      logger.info(
        `Consulta de especialidades - Usuario: ${usuario}, IP: ${ip}, Acción: Consultar Especialidades`
      );
      return await Especialidad.find();
    },

    especialidadById: async (_, { especialidadId }, context) => {
      const ip = getIpFromContext(context);
      const usuario = context?.user?.id || "anónimo";
      const especialidad = await Especialidad.findById({ _id: especialidadId });
      logger.info(
        `Consulta de especialidad - Usuario: ${usuario}, IP: ${ip}, EspecialidadID: ${especialidadId}, Acción: Consultar Especialidad`
      );
      return especialidad;
    },

    disponibilidad: async (_, { medicoId }, context) => {
      const ip = getIpFromContext(context);
      const usuario = context?.user?.id || "anónimo";

      const medico = await Medico.findOne({ medico_id: medicoId }).populate(
        "especialidades"
      );
      if (!medico) {
        logger.warn(
          `Intento de consulta de disponibilidad fallida - Usuario: ${usuario}, IP: ${ip}, MédicoID: ${medicoId}`
        );
        throw new Error("Médico no encontrado");
      }

      logger.info(
        `Consulta de disponibilidad - Usuario: ${usuario}, IP: ${ip}, MédicoID: ${medicoId}, Acción: Consultar Disponibilidad`
      );
      return medico.horarios;
    },
  },

  Mutation: {
    crearEspecialidad: async (_, { nombre }, context) => {
      const ip = getIpFromContext(context);
      const usuario = context?.user?.id || "anónimo";

      const nueva = new Especialidad({ nombre });
      const result = await nueva.save();

      logger.info(
        `Creación de especialidad - Usuario: ${usuario}, IP: ${ip}, Nombre: ${nombre}, Acción: Crear Especialidad`
      );
      result.message = `Especialidad creada exitosamente: ${nombre}`;
      return result;
    },

    registrarMedico: async (
      _,
      { medico_id, nombre, especialidadIds, horarios },
      context
    ) => {
      const ip = getIpFromContext(context);
      const usuario = context?.user?.id || "anónimo";

      const nuevo = new Medico({
        medico_id,
        nombre,
        especialidades: especialidadIds,
        horarios,
      });
      const result = await nuevo.save();

      logger.info(
        `Registro de médico - Usuario: ${usuario}, IP: ${ip}, Médico: ${nombre}, ID: ${medico_id}, Acción: Registrar Médico`
      );
      return result;
    },
  },
};

module.exports = { typeDefs, resolvers };
