FROM ruby:3.2.2-slim

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev git curl

# Set working directory
WORKDIR /app

# Install Rails
RUN gem install rails -v 7.1.3

# Entrypoint to handle server pid
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
