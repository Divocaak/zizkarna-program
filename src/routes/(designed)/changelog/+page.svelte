<script>
    import SvelteMarkdown from 'svelte-markdown';
    const source = `

# TODO datum

# přidáno
- změna-časů-možná-text přidáno do copy

## upraveno
- image loading
- blurred placeholder při načítání

## opraveno
- předprodej cena se nezobrazovala u karty a v detailu
- předprodej cena nešla upravovat a přidávat přes admin rozhraní
- výpis kapel v detailu/copy a čas harmonogram s akcema, kde lineup přesahuje půlnoc

# 9.12.23

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


# 30.11.23

## upraveno
- seo
- lazy load obrázků


# 15.11.23

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


# 6.9.23

## opraveno
- detail na rozkliku
- desc kapely limit v adminu nesedí s limitem v db


# 4.9.23

## přidáno
- soundcloud social button

## upraveno
- clickable event card => detail page


# 4.7.23

## přidáno
- fb event copy
- inbudejovice copy

## upraveno
- formát času (bez sekund)
- websafe default font

## opraveno
- bilej pruh po stranach


# 19.6.23

## přidáno
- downloadable presskit a fb cover


# 14.6.23

## opraveno
- add to cal btns opravené datumy


# 9.5.23

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
  
  <SvelteMarkdown {source} />