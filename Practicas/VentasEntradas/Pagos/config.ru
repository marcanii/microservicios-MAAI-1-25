# config.ru (si usas Puma directamente)
require './app'
run Sinatra::Application

# Y en el Dockerfile:
CMD ["bundle", "exec", "puma", "-p", "4002", "config.ru"]