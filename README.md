# eletut-frontend

React + TypeScript frontend az Élettörténet MVP-hez.

Az alkalmazás két belépési pontot tartalmaz:

- `login.html`: Google alapú belépés indítása a backend auth endpointján keresztül.
- `index.html`: privát életút/idővonal oldal eseménykezeléssel.
- `admin.html`: label törzsadat kezelése.

## Technológia

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui jellegű komponensek
- Apollo Client + GraphQL Codegen
- React Hook Form + Zod
- Zustand
- Vitest + Testing Library
- Playwright
- nginx + Docker production kiszolgálás

## Backend kapcsolat

Alapértelmezett backend URL fejlesztésben:

```bash
http://localhost:3000
```

Felülírható dev szervernél:

```bash
VITE_API_BASE_URL=https://api.example.com npm run dev
```

Production Docker image-nél az URL **runtime** állítható be — nem kell újra buildelni a bundle-t:

```bash
docker run -e API_BASE_URL=https://api.example.com myimage
```

A konténer induláskor egy `docker-entrypoint.sh` script generálja az `env-config.js` fájlt az `API_BASE_URL` env var értékéből, amit a HTML oldalak futás közben töltenek be.

## Fejlesztés

Telepítés:

```bash
npm install
```

Dev szerver:

```bash
npm run dev
```

Oldalak:

```text
http://localhost:5173/login.html
http://localhost:5173/index.html
http://localhost:5173/admin.html
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

## Interface frissítés

A külső backend interface fájlok az `external/` mappában vannak:

- `external/schema.graphql`
- `external/openapi.yaml`

Generált frontend típusok:

- GraphQL: `src/gql/`
- OpenAPI: `src/api/openapi.ts`

Frissítés:

```bash
npm run interfaces:update
```

Részparancsok:

```bash
npm run codegen:graphql
npm run codegen:openapi
npm run codegen:watch
```

## Tesztek

Unit/integration tesztek:

```bash
npm test
```

Playwright e2e:

```bash
npm run test:e2e
```

Ha a Playwright böngészők hiányoznak:

```bash
npx playwright install chromium
```

## Production Docker

A production image multi-stage Dockerfile-lal készül:

- Node builder stage: `npm ci` + `npm run build`
- nginx runtime stage: a `dist/` kiszolgálása

Build és indítás:

```bash
docker compose build
docker compose up -d
```

Más backend URL-lel (nem kell újrabuildelni):

```bash
API_BASE_URL=https://eletut-api.donamo.science docker compose up -d
```

Compose ellenőrzés:

```bash
docker compose config
docker compose ps
docker logs eletut_frontend_nginx
```

Health endpoint:

```bash
curl http://localhost/health
```

## nginx-proxy

A `docker-compose.yml` az external `nginx-proxy` hálózatra csatlakozik:

```yaml
networks:
  default:
    name: nginx-proxy
    external: true
```

Beállított hostok:

```text
VIRTUAL_HOST=eletut.donamo.science
LETSENCRYPT_HOST=eletut.donamo.science
VIRTUAL_PORT=80
```

## Fontos fájlok

- `Dockerfile`: production image build
- `docker-entrypoint.sh`: runtime `env-config.js` generálás induláskor
- `docker-compose.yml`: deploy service
- `default.conf`: nginx config
- `.dockerignore`: Docker build context szűrése
- `codegen.ts`: GraphQL Codegen konfiguráció
- `external/`: backend interface-ek
- `src/graphql/`: kézzel írt GraphQL műveletek
- `src/gql/`: generált GraphQL típusok
- `src/pages/`: oldalak
- `src/components/`: UI és feature komponensek

## Megjegyzések

- A backend URL runtime konfigurálható az `API_BASE_URL` env var-ral — nem kell újrabuildelni a Docker image-et környezetenként. Fejlesztésben a `VITE_API_BASE_URL` változó továbbra is működik.
- A build jelenleg chunk size warningot adhat az Apollo/GraphQL csomagok miatt. Ez nem hibás működés, később route alapú lazy loadinggal lehet csökkenteni.
- Az `external/generated/` mappa csak akkor használandó, ha a backend workflow ténylegesen oda generálja az aktuális interface-eket. A jelenlegi codegen az `external/schema.graphql` és `external/openapi.yaml` fájlokat használja.
