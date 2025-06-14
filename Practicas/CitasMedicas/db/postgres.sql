-- Este archivo asume que la BD 'bd_citas_medicas' ya fue creada por Docker (POSTGRES_DB)

-- Crear secuencia si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'reservas_id_seq') THEN
        CREATE SEQUENCE reservas_id_seq START 1;
    END IF;
END
$$;

-- Crear tabla reservas
CREATE TABLE IF NOT EXISTS public.reservas (
    id integer NOT NULL DEFAULT nextval('reservas_id_seq'),
    paciente_id integer NOT NULL,
    medico_id integer NOT NULL,
    especialidad_id varchar(50) NOT NULL,
    fecha date NOT NULL,
    hora_inicio time NOT NULL,
    hora_fin time NOT NULL,
    CONSTRAINT reservas_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.reservas OWNER TO postgres;
