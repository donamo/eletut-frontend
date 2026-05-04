# ChatGPT History -> Élettörténet Import Prompt

Ezt a promptot közvetlenül ChatGPT-nek lehet odaadni. A cél nem az, hogy vakon SQL-t generáljon, hanem hogy először a beszélgetési előzményekből megtalálja azokat a részeket, amelyek rólad szólnak és életeseményként importálhatók.

```text
A feladatod: nézd át a rendelkezésedre álló ChatGPT beszélgetési előzményeket, és keresd meg azokat a rólam szóló részeket, amelyek relevánsak lehetnek egy privát élettörténet/idővonal alkalmazás számára.

Ne azonnal SQL-t írj. Először eseményjelölteket keress és rendszerezz.

Adatvédelmi és pontossági szabályok:
- Csak olyan eseményt vegyél fel, amely rólam szól.
- Ne vegyél fel más személyek privát eseményeit saját életeseményként.
- Ne találj ki konkrét dátumot, helyszínt, okot vagy következményt.
- Ha valami csak következtetés, jelöld: "következtetés".
- Ha valami bizonytalan, jelöld: "ellenőrizendő".
- Ha egy esemény nagyon érzékeny, jelöld külön, és ne készíts hozzá automatikus SQL-t emberi jóváhagyás nélkül.
- Ha ugyanaz az esemény több beszélgetésben is előjön, vond össze egy jelöltté, de írd oda, hogy több forrásból következik.

Mit keress:
- életeseményeket
- fordulópontokat
- költözést, munkahelyet, tanulást, kapcsolatot, családi eseményt
- fontos felismeréseket
- tartós időszakokat
- egészséggel, krízissel, veszteséggel, újrakezdéssel kapcsolatos eseményeket
- olyan visszatérő témákat, amelyek élettörténeti szempontból fontosak lehetnek

Ne importáld:
- egyszerű technikai kérdéseket
- napi apró feladatokat, ha nincs személyes élettörténeti jelentőségük
- puszta véleményt vagy hangulatot konkrét esemény nélkül
- más emberek történeteit
- olyan dolgot, amelyből nem derül ki, hogy hozzám tartozik

Kimenet 1: eseményjelöltek táblázata

Adj egy táblázatot ezekkel az oszlopokkal:
- sorszám
- javasolt cím
- rövid leírás
- becsült dátum
- dátum pontossága: YEAR / MONTH / DAY / UNKNOWN
- helyszín, ha ismert
- fontosság 1-5
- javasolt szín
- bizonyosság: magas / közepes / alacsony
- érzékenység: normál / érzékeny
- miért releváns
- milyen beszélgetésrész vagy forrás alapján következik

Dátumkezelés:
- Ha pontos nap ismert: DAY.
- Ha csak év és hónap ismert: MONTH.
- Ha csak év ismert: YEAR.
- Ha nincs elég információ: UNKNOWN, és ne készíts hozzá SQL-t, csak review jelölést.

Fontosság skála:
- 1: kisebb, kontextust adó emlék vagy élethelyzet.
- 2: hasznos, de nem meghatározó esemény.
- 3: fontos életesemény vagy tartós időszak.
- 4: jelentős fordulópont, erős személyes hatás.
- 5: életutat alapvetően meghatározó esemény.

Színjavaslat:
- TEAL: általános vagy kiegyensúlyozott esemény.
- BLUE: tanulás, munka, tervezés, felismerés.
- GREEN: fejlődés, gyógyulás, újrakezdés.
- YELLOW: öröm, siker, pozitív emlék.
- ORANGE: változás, költözés, aktivitás.
- RED: krízis, veszteség, konfliktus.
- PURPLE vagy INDIGO: identitás, belső munka, mély felismerés.
- GRAY: bizonytalan vagy semleges kontextus.

Kimenet 2: ellenőrzési lista

Adj külön listát:
- mely eseményekhez kell dátumot pontosítani
- mely eseményekhez kell helyszínt pontosítani
- mely események érzékenyek
- mely eseményeknél alacsony a bizonyosság
- milyen kérdéseket kellene feltenned nekem az import előtt

Kimenet 3: importálható JSON

Csak a magas vagy közepes bizonyosságú, nem érzékeny vagy jóváhagyható eseményekhez adj JSON-t ebben a formában:

[
  {
    "title": "Rövid cím",
    "description": "Tömör, tényszerű leírás. Ne tartalmazzon kitalált részletet.",
    "dateValue": "YYYY-MM-DDT00:00:00.000Z",
    "datePrecision": "YEAR | MONTH | DAY",
    "location": "helyszín vagy null",
    "importance": 1,
    "color": "TEAL vagy null",
    "gyermekiStateIds": [],
    "szuloiStateIds": [],
    "felnottStateIds": [],
    "reviewNote": "ha kell emberi ellenőrzés, ide írd"
  }
]

DateValue képzés:
- DAY esetén a tényleges nap: YYYY-MM-DDT00:00:00.000Z.
- MONTH esetén a hónap első napja: YYYY-MM-01T00:00:00.000Z.
- YEAR esetén január 1.: YYYY-01-01T00:00:00.000Z.
- UNKNOWN dátumú esemény ne kerüljön az importálható JSON-ba.

EgoState mezők:
- A gyermekiStateIds, szuloiStateIds, felnottStateIds mezőkbe csak akkor írj id-t, ha külön megkapod az EgoState törzsadatot.
- Ha nem kaptál törzsadatot, hagyd üres tömbön.
- Szövegesen javasolhatod, hogy milyen én-állapot illene hozzá, de id-t ne találj ki.

Kimenet 4: SQL csak külön kérésre

SQL-t csak akkor készíts, ha külön kérem.
Ha SQL-t kérek, előtte kérdezd meg vagy kérd be:
- a tényleges adatbázis táblaneveket
- a LifeEvent tábla oszlopneveit
- az EgoState kapcsolótáblák nevét
- az owner user id-t

Minőségi elvárások:
- Legyél konzervatív.
- Inkább kevesebb, de biztosabb eseményt javasolj.
- Ne dramatizálj.
- Ne pszichologizálj túl.
- A leírás legyen privát idővonalba illő, nem publikációs szöveg.
- Ha nincs elég információ, mondd azt, hogy nincs elég információ.
```

## Használat

1. Add oda ChatGPT-nek ezt a promptot.
2. Kérd meg, hogy a saját beszélgetési előzményei alapján dolgozzon.
3. Először csak az eseményjelölt táblát és az ellenőrzési listát kérd.
4. A JSON-t csak azután használd, hogy átnézted.
5. SQL-t csak a backend tényleges adatbázis-sémájával együtt kérj.

## Megjegyzés

Ez a prompt szándékosan import-előkészítésre való. A beszélgetési előzményekből kinyert személyes eseményeket embernek kell ellenőriznie, mielőtt adatbázisba kerülnek.
