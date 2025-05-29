CREATE DATABASE IF NOT EXISTS bd_parcial_2do;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `habitacion_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_reserva` datetime NOT NULL,
  `fecha_entrada` datetime NOT NULL,
  `fecha_salida` datetime NOT NULL,
  `estado_reserva` varchar(100) NOT NULL,
  `total_a_pagar` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `habitacion_id`, `usuario_id`, `fecha_reserva`, `fecha_entrada`, `fecha_salida`, `estado_reserva`, `total_a_pagar`) VALUES
(1, 1, 1, '2025-05-29 22:16:25', '2025-05-29 22:16:25', '2025-05-29 22:16:25', 'Pendiente', 45.5),
(2, 1, 1, '2025-05-30 02:16:25', '2025-05-30 02:16:25', '2025-05-30 02:16:25', 'Pendiente', 80);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `password`, `correo`) VALUES
(1, '$2b$08$UDsvJTHwOUtSt6C6lbSuguSJFpAypr.ptDeNM8v2Qh3ZrnpQPtTZW', 'marcani@gmail.com');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;
