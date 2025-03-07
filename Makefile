.PHONY: init up down destroy migrate seed app.login web.login db.login db.console

DC = docker compose

init:
	@$(DC) up -d --build
	@$(DC) exec app composer install
	@$(DC) exec app cp .env.example .env
	@$(DC) exec app php artisan config:clear
	@$(DC) exec app php artisan cache:clear
	@$(DC) exec app php artisan key:generate
	@$(DC) exec app php artisan migrate
	@$(DC) exec app php artisan db:seed
	@$(DC) exec node npm install react react-dom @vitejs/plugin-react
	@$(DC) exec node npm install react react-dom --save

up:
	@$(DC) up -d

down:
	@$(DC) down

destroy:
	@$(DC) down --rmi all --volumes

migrate:
	@$(DC) exec app php artisan migrate

seed:
	@$(DC) exec app php artisan db:seed

app:
	@$(DC) exec app bash

web:
	@$(DC) exec web bash

node:
	@$(DC) exec node sh

db.login:
	@$(DC) exec db bash

db.console:
	@$(DC) exec db mysql -uphper -psecret laravel

cache clear:
	@$(DC) exec app php artisan config:clear
	@$(DC) exec app php artisan route:clear
	@$(DC) exec app php artisan view:clear
	@$(DC) exec app php artisan cache:clear

dev:
	@$(DC) exec node npm run dev
