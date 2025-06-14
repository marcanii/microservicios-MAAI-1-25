CREATE DATABASE IF NOT EXISTS `bd_citas_medicas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bd_citas_medicas`;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(255) NOT NULL DEFAULT 'usuario',
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `celular` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `usuarios` (`id`, `correo`, `password`, `rol`, `nombres`, `apellidos`, `celular`) VALUES
(1, 'marcani@gmail.com', '$2b$08$e7N0LLsM9ZvwfAWqnWQkpu4zv3qRiwbutOHWXGmqfiJMmJG06g5z.', 'admin', 'Israel', 'Marcani', '+591 69677638');


ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;