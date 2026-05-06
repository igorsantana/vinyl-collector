.DEFAULT_GOAL := run

.PHONY: run stop logs clean rebuild

## Start everything (builds images if needed, then runs in background)
run:
	docker compose up --build -d
	@echo ""
	@echo "Vinyl Catalog is running → http://localhost:3000"
	@echo "To follow logs: make logs"

## Stop all containers (data is preserved in volumes)
stop:
	docker compose down

## Stream app logs
logs:
	docker compose logs -f app

## Stop containers AND delete all volumes (wipes the database and uploads)
clean:
	docker compose down -v --remove-orphans

## Rebuild images from scratch without Docker cache
rebuild:
	docker compose down
	docker compose build --no-cache
	docker compose up -d
