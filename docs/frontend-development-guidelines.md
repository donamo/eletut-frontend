# Frontend Fejlesztési Irányelvek

Ez a dokumentum rövid, újrafelhasználható referencia hasonló frontend projektek indításához és továbbfejlesztéséhez.

## Alap Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui jellegű komponensszervezés
- Apollo Client
- GraphQL Codegen
- React Hook Form
- Zod
- Zustand
- Vitest
- Testing Library
- Playwright
- Docker + nginx production kiszolgálás

## Alapelv

A frontend legyen vékony, típusos és szerződésvezérelt.

- A backend szerződés legyen az igazság forrása.
- GraphQL típusok codegenből jöjjenek.
- REST/OpenAPI típusok generálhatók, de csak ott használjuk, ahol tényleges REST hívás van.
- Form validáció kliensen Zoddal történjen.
- Üzleti szabályt csak akkor tegyünk frontendbe, ha UX-validációhoz szükséges.
- A backend jogosultsági, tulajdonosi és adatvédelmi szabályait ne próbáljuk frontendből kiváltani.

## Projekt Szerkezet

Javasolt mappák:

```text
*.html
src/
  components/
    ui/
  graphql/
  gql/
  lib/
  pages/
  stores/
  test/
e2e/
external/
docs/
```

Szerepek:

- root `*.html`: Vite több belépési pont, például `index.html`, `login.html`, `admin.html`, `system-admin.html`.
- `src/components/ui/`: újrafelhasználható primitív UI elemek.
- `src/components/`: domain- vagy feature-komponensek.
- `src/pages/`: oldalszintű komponensek.
- `src/graphql/`: kézzel írt GraphQL query/mutation dokumentumok.
- `src/gql/`: GraphQL Codegen kimenete.
- `src/lib/`: konfiguráció, formázás, adatátalakítás, util függvények.
- `src/stores/`: Zustand store-ok.
- `external/`: backend interface fájlok.
- `e2e/`: Playwright tesztek.
- `docs/`: projekt dokumentáció.

## Oldalak és Belépési Pontok

Egyszerű, backend mellé telepített appnál elfogadható több HTML belépési pontot használni SPA router nélkül.

Példa:

```text
index.html          fő alkalmazás
login.html          belépés
admin.html          user-szintű beállítások
system-admin.html   rendszeradmin funkciók
no-access.html      jogosultság nélküli állapot
```

Szabályok:

- A Vite `build.rollupOptions.input` tartalmazza az összes HTML entrypointot.
- Az nginx configban a külön HTML oldalak `no-store` cache fejléccel legyenek kiszolgálva.
- A közös React entry (`src/main.tsx`) pathname alapján választhat oldalszintű komponenst.
- Ha a project később összetettebb navigációt kap, React Router bevezethető, de egyszerű többoldalas admin/login flow-hoz nem kötelező.
- Közvetlen URL megnyitásra minden védett oldal kezelje saját auth/jogosultság ellenőrzését.

## Backend Interface

Backend interface fájlok:

```text
external/schema.graphql
external/openapi.yaml
```

Frissítés:

```bash
npm run interfaces:update
```

Elvárás:

- Interface változás után mindig futtatni kell a codegent.
- A kézzel írt GraphQL dokumentumokat igazítani kell az új sémához.
- Build fusson le interface változás után.
- Ha a `/me` REST válasz bővül jogosultsági mezőkkel, a frontend auth Zod sémáját is frissíteni kell.

## Auth és Jogosultság

Auth minta:

- Google login indítása REST endpointtal, például `/auth/login/google`.
- Session állapot ellenőrzése `/me` hívással.
- A `/me` eredménye Zustand auth store-ba kerülhet.
- Ha nincs session, védett oldal redirecteljen `/login.html`-re.
- Logout után törölni kell a helyi auth store-t, majd visszavinni a usert a login oldalra.

Jogosultsági szabályok:

- A frontend csak UX szinten rejtsen el gombokat; valódi jogosultságot mindig a backend ellenőrizzen.
- Rendszeradmin gomb csak admin usernek jelenjen meg, például `user.isAdmin === true` alapján.
- Rendszeradmin oldal közvetlen URL-en se kérdezzen le érzékeny listát, ha a `/me` alapján a user nem admin.
- User-szintű beállítások és rendszer-szintű admin funkciók külön oldalon legyenek.

Whitelist/no-access flow:

- Ha Google auth sikerült, de a user nincs engedélyezve, a backend redirecteljen a frontend `no-access.html` oldalára.
- A `no-access.html` szövege mondja ki, hogy az azonosítás sikeres volt, de hozzáférést kell kérni.
- OAuth konfigurációs hibát ne keverjük whitelist tiltással. Hibás Google client config esetén login hiba vagy backend error oldal indokolt, nem no-access.
- Backend callback JSON 401 válaszát a frontend nem tudja React oldalként kezelni, mert a böngésző közvetlenül a backend URL-t tölti be. Ilyenkor backend redirect szükséges.

## GraphQL Szabályok

- Apollo Client legyen a GraphQL kliens.
- Query/mutation dokumentumok `src/graphql/` alatt legyenek.
- A generált típusok `src/gql/` alatt legyenek.
- Fragmentet használjunk ismétlődő entity mezőkhöz.
- Mutáció után csak a szükséges query-ket refetcheljük.
- Listanézeti gyors módosításhoz külön célzott mutation előnyösebb, mint teljes entity update.

Példa:

```ts
export const LIFE_EVENTS_QUERY = graphql(`
  query LifeEvents {
    lifeEvents {
      ...LifeEventFields
    }
  }
`);
```

## Formok

Form stack:

- React Hook Form
- Zod
- shadcn/ui jellegű input/select/textarea/button komponensek

Szabályok:

- Minden nem triviális formnak legyen Zod sémája.
- A form alapértékeit külön helper állítsa elő, ne JSX-ben legyen szétszórva.
- Opcionális stringeket mentés előtt trimelni kell.
- Üres opcionális string `null` legyen, ha a backend ezt várja.
- Többválasztós mezőknél id-listát küldjünk, ne megjelenített nevet, kivéve ha a backend kifejezetten nevet vár.
- Dátum pontosságot külön mezőben kell kezelni.

## Dátumkezelés

Ha a domain támogat eltérő dátumpontosságot:

- `YEAR`: technikai dátum `YYYY-01-01T00:00:00.000Z`
- `MONTH`: technikai dátum `YYYY-MM-01T00:00:00.000Z`
- `DAY`: tényleges nap `YYYY-MM-DDT00:00:00.000Z`

Fontos:

- A technikai `dateValue` csak rendezésre való.
- A valódi pontosságot külön `datePrecision` jelzi.
- UI-ban ne mutassunk pontos napot, ha a pontosság csak év vagy hónap.

## State Management

Zustand használható kevés globális kliensállapothoz:

- auth user
- UI preferenciák
- egyszerű session state

Apollo cache kezelje a szerveradatot.

Ne duplikáljuk Apollo query eredményét Zustand store-ba, ha nincs rá erős ok.

Auth store irányelv:

- `loadUser()` adjon vissza `CurrentUser | null` értéket, hogy az oldalak egyszerűen tudjanak redirectelni.
- A user objektum tartalmazhat opcionális jogosultsági mezőket, például `isEnabled`, `isAdmin`.
- Jogosultság alapú UI állapotnál kezeld a betöltési és denied állapotot külön.

## UI Irányelvek

Általános:

- Első képernyő legyen használható app, ne marketing landing.
- Operatív felületeken legyen sűrű, tiszta, gyorsan olvasható layout.
- Ne legyenek felesleges dekorációk.
- Kártyákat csak valódi elemekhez, dialogokhoz és ismétlődő listákhoz használjunk.
- Ne tegyünk kártyát kártyába.
- A gombokban ikon legyen, ha a művelet ismert ikonhoz köthető.
- Színválasztáshoz swatchot használjunk.
- Többválasztáshoz checkbox vagy chip alapú UI legyen.
- Numerikus értékhez slider, stepper vagy szám input.
- Hosszabb listákat többoszlopos gridben rendezzünk, ha van hely.

Reszponzív szabályok:

- Mobilon minden legyen egy oszlopban.
- Desktopon a listaelemek sűrűsíthetők.
- Fontosabb elemek lehetnek nagyobbak, kevésbé fontos elemek kompaktabbak.
- Szöveg ne lógjon ki a konténeréből.
- Ne skálázzunk fontot viewport szélesség alapján.

## Lista és Kártya Viselkedés

Listaelemnél:

- A fő tartalom kattintása nyithat dialogot.
- Inline gyors műveletek külön gombok legyenek.
- Ne tegyünk interaktív gombot egy teljes kártya-button belsejébe.
- Törlés mindig kérjen megerősítést.
- Kis fontosságú elemeknél a leírás elhagyható.
- Nagy fontosságú elemeknél több részlet mutatható.

## Admin Oldalak

User-szintű beállítás vagy törzsadat oldal akkor indokolt, ha:

- listaértékeket kell karbantartani
- címkéket, kategóriákat, színeket kell kezelni
- nem csak egyetlen formban használt lokális opcióról van szó

User-szintű beállítási oldalak:

- legyenek külön belépési ponton vagy route-on
- ugyanazt az auth ellenőrzést használják
- egyszerű list + form szerkezetet kapjanak
- mutation után refetcheljék a releváns törzsadat query-t
- a bejelentkezett user saját adatkörében működjenek

Rendszeradmin oldalak:

- külön belépési pontot kapjanak, például `system-admin.html`
- csak admin usernek jelenjen meg hozzájuk navigáció
- közvetlen megnyitáskor `/me` alapján ellenőrizzék az admin jogosultságot
- nem admin user esetén mutassanak tiltott állapotot, és ne indítsanak rendszer-szintű query-t
- a user admin, whitelist, globális konfiguráció és rendszer-szintű törzsadat ide tartozik

Példa szétválasztás:

- `admin.html`: label kezelés, user-szintű beállítás.
- `system-admin.html`: felhasználók engedélyezése/tiltása, rendszeradmin funkció.

## Tesztelés

Minimum:

```bash
npm test
npm run build
npm run test:e2e
```

Vitest:

- komponens smoke tesztek
- form alap render ellenőrzés
- fontos helper függvények

Playwright:

- login oldal render
- fő oldal üres állapot
- dialog megnyitás
- user-szintű admin/beállítás oldal smoke teszt
- rendszeradmin oldal smoke teszt admin userrel
- jogosultság nélküli oldal vagy denied állapot ellenőrzése
- backend hívások route mockkal

## Docker és Deploy

Production irány:

- multi-stage Dockerfile
- Node builder stage
- nginx runtime stage
- `dist/` ne legyen kézzel mountolt productionben

Vite miatt:

- `VITE_*` változók build-time változók.
- Backend URL változásakor új image build kell.
- Új HTML entrypoint esetén frissíteni kell a Vite inputot és az nginx `try_files` szabályokat.

Alap parancs:

```bash
docker compose build
docker compose up -d
```

## Minőség

Minden feature után:

- codegen, ha interface változott
- TypeScript build
- unit teszt
- e2e smoke teszt, ha UI flow változott
- compose config ellenőrzés, ha deploy fájl változott

Parancsok:

```bash
npm run interfaces:update
npm run build
npm test
npm run test:e2e
docker compose config
```

## Git és Artefaktumok

Commitolható:

- forráskód
- `package-lock.json`
- `external/` interface fájlok
- codegen output, ha a projekt így dönt
- Dockerfile, compose, nginx config

Nem commitolható:

- `node_modules/`
- `dist/`
- `test-results/`
- coverage output
- lokális `.env`
- lokális tool metadata

## Mikor Kérj Pontosítást

Kérdés kell, ha:

- nem egyértelmű a backend szerződés
- nincs mutation egy kért módosításhoz
- törlés vagy adatvesztés kockázata van
- production host vagy backend URL bizonytalan
- a fizikai DB séma kellene, de csak GraphQL séma van

Egyébként érdemes konzervatív, működő megoldást választani és végigvinni buildig/tesztig.
