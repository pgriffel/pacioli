# Usage:
#
# Initially:
#   docker build -t jekyll-site .
#
# Then:
#   docker compose up
#
# or:
#   docker run -p 4000:4000 -v .:/usr/src/app jekyll-site
#
# Copied from https://jogendra.dev/dockerize-your-jekyll-site-for-local-development

# Use a slim Ruby image as the base
FROM ruby:3.3-slim

# Set environment variables for UTF-8 encoding and non-interactive package installation
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    DEBIAN_FRONTEND=noninteractive

# Install essential build tools and dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the Gemfile and Gemfile.lock
COPY Gemfile* ./

# Install Bundler and project dependencies
RUN gem install bundler && bundle install

# Copy the rest of the source code
COPY . .

# Expose port 4000
EXPOSE 4000

RUN git config --global --add safe.directory /usr/src/app

# Start the Jekyll development server with live reloading
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--watch"]
