FROM ruby:3.0

WORKDIR /app

# Primero copia solo los archivos necesarios para instalar dependencias
COPY Gemfile* ./

RUN bundle install

# Luego copia el resto de los archivos
COPY . .

EXPOSE 4003

CMD ["ruby", "app.rb", "-p", "4002", "-o", "0.0.0.0"]