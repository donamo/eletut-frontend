# Frontend Deploy

Production telepítés Dockerrel:

```bash
docker compose build
docker compose up -d
```

Ha más backend URL kell a buildelt frontendbe:

```bash
VITE_API_BASE_URL=https://eletut-api.donamo.science docker compose build
docker compose up -d
```

A `VITE_API_BASE_URL` build-time változó, mert Vite statikus bundle készül. Ha ez változik, újra kell buildelni az image-et.

## Fájlok

- `Dockerfile`: multi-stage build, Node építi a Vite appot, nginx szolgálja ki.
- `default.conf`: nginx config `/login.html`, `/index.html`, asset cache és SPA fallback kezeléssel.
- `docker-compose.yml`: nginx-proxy/letsencrypt környezethez illesztett service.

## Ellenőrzés

```bash
docker compose config
docker compose ps
docker logs eletut_frontend_nginx
```

Health endpoint:

```bash
curl http://localhost/health
```
