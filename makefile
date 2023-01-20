.DEFAULT_GOAL := help

help:
	@ echo "  Container build tools"
	@ echo "	build: build only the container"
	@ echo "	build-dev: build container and install dependencies on local machine"
	@ echo "  Runtime control tools"
	@ echo "	up: Start runtime environment"
	@ echo "	down: kill all containers"
	@ echo "	clean: kill all containers and then delete all container images (ALL images on your computer)"
	@ echo "  Runtime container introspection tools:"
	@ echo "	frontend-shell: interactive shell for the frontend container"
	@ echo "	auth_gateway_shell: interactive shell for the auth_gateway container"
	@ echo "	auction_daemon_shell: interaction shell for the auction_daemon container"
	@ echo "	catalog_shell: interaction shell for the catalog container"
	@ echo "	marketplace_shell: interaction shell for the marketplace container"
	@ echo "	wallet_shell: interaction shell for the wallet container"


build:
	docker build -t 'frontend' ./frontend
	docker build -t 'auth_gateway' ./auth_gateway
	docker build -t 'auction_daemon' ./auction_daemon
	docker build -t 'catalog' ./catalog
	docker build -t 'marketplace' ./marketplace
	docker build -t 'wallet' ./wallet

build-frontend-dev:
	npm install  --prefix ./frontend
	docker build -t 'frontend' ./frontend

build-auth_gateway-dev:
	npm install --prefix ./auth_gateway
	docker build -t 'frontend' ./auth_gateway

build-auction_daemon-dev:
	docker build -t 'auction_daemon' ./auction_daemon

build-catalog-dev:
	docker build -t 'catalog' ./catalog

build-marketplace-dev:
	docker build -t 'marketplace' ./marketplace

build-wallet-dev:
	docker build -t 'wallet' ./wallet

build-dev: build-auth_gateway-dev build-frontend-dev build-auction_daemon-dev build-catalog-dev build-marketplace-dev build-wallet-dev

up: build
	docker-compose up -d #> /dev/null
	sleep 10

setup:	up
	bundle exec dotenv rake db:migrate

down:
	docker-compose stop
	docker-compose down

clean: down
	docker kill $(docker ps -q) || echo "return 0"
	docker rm $(docker ps -a -q) || echo "return 0"
	docker system prune

frontend-shell:
	docker exec -it frontend bash

auth-gateway-shell:
	docker exec -it auth_gateway bash

backend-shell:
	docker exec -it backend bash

auction_daemon-shell:
	docker exec -it auction_daemon bash

catalog-shell:
	docker exec -it catalog bash

marketplace-shell:
	docker exec -it marketplace bash

wallet-shell:
	docker exec -it wallet bash

