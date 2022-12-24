.DEFAULT_GOAL := help

help:
	@ echo "  Container build tools"
	@ echo "	build-dev: build container and install dependencies on local machine"
	@ echo "	build: build only the container"
	@ echo "  Runtime control tools"
	@ echo "	up: Start runtime environment"
	@ echo "	down: kill all containers"
	@ echo "	clean: kill all containers and then delete all container images"
	@ echo "  Runtime container introspection tools:"
	@ echo "	frontend-shell: interactive shell for the frontend container"
	@ echo "	backend-shell: interactive shell for the backend container"


build-frontend-dev:
	npm install  --prefix ./frontend
	docker build -t 'frontend' ./frontend

build-backend-dev:
	bundle install --gemfile ./backend/Gemfile --path ./backend
	docker build -t 'backend' ./backend

build-dev: build-frontend build-backend

# Skip installing deps locally.
build:
	docker build -t 'frontend' ./frontend
	docker build -t 'backend' ./backend

up: build
	docker-compose up -d #> /dev/null
	sleep 10
	docker exec -it backend bin/rails db:migrate RAILS_ENV=development

setup:	up
	bundle exec dotenv rake db:migrate

down:
	docker-compose stop
	docker-compose down

# dangerous will delete all of your images
clean: down
	docker kill $(docker ps -q) || echo "return 0"
	docker rm $(docker ps -a -q) || echo "return 0"
	docker system prune

frontend-shell:
	docker exec -it frontend bash

backend-shell:
	docker exec -it backend bash
