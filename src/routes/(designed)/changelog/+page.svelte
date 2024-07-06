<script>
    import SvelteMarkdown from 'svelte-markdown';
    const source = `
# 7. 7. 24

## MAJOR video generator refactor

### upraveno
- video generátory sjednoceny, použito OOP
- video generátory běží na html kódu, ne na Canvas
- video generátor kapel v rámci eventu:
  - obrázek kapely kliknutelný
  - console log časů (kdy co)
- video se skládá z obrázků uložených v paměti (jednotlivé snímky už se nukládají jako fotky na disk)
- video generátory bez skrz puppeteer (1 frame za .65 sekundy)

### přidáno
- gradienty ve video generátorech u kapel v rámci eventu
- html stránka jako preview generovaného videa, frame skrz GET parametr
- console log času renderování jednotlivých framů
- GitHub repo odkaz na changelog stránce
- genertátor thumbnailu pro generátor měsíčních přehledů
- generátor instagram textací pro měsíční přehledy

### opraveno
- fonty u videogenerátorů
- padding-y u generovaných videí formátu ig story
- paddingy měsíčních přehledů se určijí podle výstupního formátu (b0, a4, videa)


# 13. 5. 24

## upraveno
- title info stránky
- anglická prezentace a texty k ní vedoucí
- line breaks povoleny v anotaci k eventu
- line breaks povoleny v biu kapel
- line breaks povoleny v copy

## přidáno
- cs verze prezentace


# 28. 3. 24

## přidáno
- generátor akcí na měsíc (story, reel, a4, b0 (plachta))
- generátor akcí na týden (story, reel, a4, b0 (plachta))
- TikTok je nově podporován jako kapelní odkaz (nastylováno)
- žž presskit (odkazy, loga, prezentace) v info sekci
- schéma db přidáno na admin homepage pro snažší pochopení a vysvětlování :)
- YT playlist pole v databázi u eventu, přidána položka do formulářů (edit a create event)
- YT btn ke kartě i detailu akce (pokud existuje odkaz na záznam v db)
- mapa a adresa na info podstránce

## upraveno
- navbar odkaz na dramaturgii přepsán na Info
- hlavička tabulky v seznamu eventů
- textace vstup zdarma
- zzTV stránka se dynamicky naplňuje z odkazů na playlisty u jednotlivých eventů v databázi
- pokud je intepret označen jako pořadatel, nezobrazuje se u něj stage time a není vypsaný ani v čas. harmonogramu (detail události, admin copy)
- snížena verze canvas za účelem načítání fontů v produkci (vid gen)

## odebráno
- tel. číslo na dramaturgii
- tlačítko na předprodej u uplynulých akcí


# 4. 3. 24

## přidáno
- nadpis k ig story generátoru

## upraveno
- framerate boost

## opraveno
- video generovalo jenom testframe


# 3. 3. 24

## přidáno
- stáhnout video btn
- video test frames (event a band sekce)
- možnost upravovat textace před generováním videa a vybrat obrázek kapely
- info o existenci předprodeje do žž sekce

## upraveno
- u videa některé texty vycentrované
- max width u textů ve videu
- mezery za tečkama u datumů v changelogu (myslim to vážně)


# 27. 2. 24

## přidáno
- insta story video generator


# 22. 2. 24

## opraveno
- namístě typo v cashtext


# 20. 2. 24

## upraveno
- víc emoji do copy textu

## přidáno
- víc věcí do admin event tabulky
  - cena lístků dveře/předprodej
  - čas dveří
  - link na předprodej


# 19. 2. 24

## opraveno
- časy po půlnoci (opět)


# 16. 2. 24

## přidáno
- fb pixel (snad?)
- trackování uživatelů z ShareButton a admin copy text

## upraveno
- dark mode pro admin rozhraní, protože to stejně všechno dělám po nocích


# 5. 2. 24

## přidáno
- trackování uživatelů z qr


# 27. 1. 24

## opraveno
- tag form preview defaultní barvy
- reaktivní tlačítka v detailu stejně jako na kartě (reakce na před/po konání akce)

## přidáno
- google analytics rozšíření
  - karty
    - všechna tlačítka odesílají info o kliknutí s požadovanými daty
    - detail rozličen na obrázek a tlačítko
  - talčítka v detailu
    - stejná data jako tlačítka na kartě
    - s rozlišením, že je stiksnuto v detailu, ne na kartě
    - trackování kliků na odkazy kapel
  - zzTV
    - přehrání playlistu
    - klik na youtube btn
- tagy kapel a eventu přidáno do meta keywords

## upraveno
- barevné rozlišení eventů v admin listu podle dne konání (snažší orientace při administraci)
- zobrazování fotek kapel
- noindex band.json soubory
- generování SEO rozděleno do funkcí
  - zmenšení redundance
- přidány doplněny SEO parametry podle GoogleSearchConsoleTestResults


# 18. 1. 24

## upraveno
- tag // POŘADATEL // se nezobrazuje na kartě na homepage

## přidáno
- tag preview v tag form (edit a add)


# 17. 1. 24

## opraveno
- lomena na konci band tagů v copy
- sjednocen margin u tlačítek (konečně)

## upraveno
- tlačítko přidat do kalendáře se nezobrazuje u uběhlých akcí
- u uběhlých akcí pozměněn text tlačítka pro sdílení
- přidán druhý font (konečně!) na info texty, talčítka, popisy eventů a bia kapel, čas. harmonogram a textové stránky
- sjednocen design tlačítek

## odebráno
- podpora "sptfy.com/..." odkazů, protože služba trpí na výpadky

## přidáno
- podpora pro odkazy typu "open.spotify.com/..." (není nutno konvertovat na formát "sptfy.com/...")


# 10. 1. 24

## upraveno
- pozice panelu v detailu výš - nutí scrollovat
- připsaný den k datumům

## opraveno
- formálář pro přidávání/úpravy eventu (bez předprodejní ceny házelo error)
- v den akce byla zapsanáa akce už jako uplynulá


# 14. 12. 23

## přidáno
- změna-časů-možná-text přidáno do copy

## upraveno
- image loading
- blurred placeholder při načítání

## opraveno
- předprodej cena se nezobrazovala u karty a v detailu
- předprodej cena nešla upravovat a přidávat přes admin rozhraní
- výpis kapel v detailu/copy a čas harmonogram s akcema, kde lineup přesahuje půlnoc


# 9. 12. 23

## přidáno
- tag edit skrz admin
- band edit skrz admin
- event edit skrz admin
- event visibility switch
- band json lze vypsat už při vytváření bandu
- kapely a tagy lze přidávat a odebírat během editu/vytváření eventu
- stagetime u kapel
  - lze měnit/přidávat v editu/vytváření eventu
  - zobrazují se u každé kapely v detailu eventu
  - zobrazují se u každé kapely v copy
- kapelní tagy
  - lze přidávat a odebírat v band formuláři během editu/vytváření
  - zobrazují se spolu s event tagy na kartě eventu a v hlavičce eventu v detailu
  - zobrazují se u každé kapely v detailu eventu
  - zobrazují se u každé kapely v copy
- časový harmonogram v deailu akce a v copy
- žžTV podstránka
- dynamické SEO pro event detaily podle schema.org
- dynamické SEO pro main page schema.org

## upraveno
- tagy lze přidat ke kapelám (automatické přidání tagu kapely k eventu :o)
- admin tables redesign (větší přehlednost)
- tagy rozděleny na event a band kategorie
- zlepšení fb buttonu (existuje/chybí) v admin event table
- algoritmus pro získávání eventů z databáze
- api route system
- tag outline
- "vstup 0,-" upraveno na "bez vstupného"
- meta desc tagy podstránek

## opraveno
- text "zatím žádné akce" se zobrazuje v případě prázdného pole
- nové tlačítko přidate do kalendáře, jen jedno, rychlejší načítání, funkčnější


# 30. 11. 23

## upraveno
- seo
- lazy load obrázků


# 15. 11. 23

## přidáno
- changelog
- do copy eventu přidáno eventDesc
- goout cena na kartě a v detailu

## upraveno
- předpordej ikona
- dlouhé texty zarovnány doleva
- upraven admin ssh command
- seo prvky
- band imgs placeholder
- ikony a názvy tlačítek

## opraveno - clickable karty
- placeholder event imgs


# 6. 9. 23

## opraveno
- detail na rozkliku
- desc kapely limit v adminu nesedí s limitem v db


# 4. 9. 23

## přidáno
- soundcloud social button

## upraveno
- clickable event card => detail page


# 4. 7. 23

## přidáno
- fb event copy
- inbudejovice copy

## upraveno
- formát času (bez sekund)
- websafe default font

## opraveno
- bilej pruh po stranach


# 19. 6. 23

## přidáno
- downloadable presskit a fb cover


# 14. 6. 23

## opraveno
- add to cal btns opravené datumy


# 9. 5. 23

## upraveno
- db pool
`;
  </script>

<svelte:head>
  <title>Changelog</title>
	<meta
		name="description"
		content="Nejnovější aktualizace programu na jednom místě. Aby Tě žádná změna nepřekvapila"
	/>
</svelte:head>

<a href="https://github.com/Divocaak/zizkarna-program" class="text-muted karla" target="_blank"><i class="bi bi-github pe-1"></i>GitHub repo</a>
<SvelteMarkdown {source} />