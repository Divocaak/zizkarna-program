<script>
    import SvelteMarkdown from 'svelte-markdown';
    const source = `
## přidáno
- tag edit skrz admin
- band edit skrz admin
- event edit skrz admin
- event visibility switch
- band json lze vypsat už při vytváření bandu
- kapely a tagy lze přidávat a odebírat během editu/vytváření eventu
- stagetime u kapel
  - lze měnit/přidávat v editu/vytváření eventu
  - TODO zobrazují se u každé kapely v detailu eventu
  - TODO zobrazují se u každé kapely v copy
- kapelní tagy
  - lze přidávat a odebírat v band formuláři během editu/vytváření
  - zobrazují se spolu s event tagy na kartě eventu a v hlavičce eventu v detailu
  - TODO zobrazují se u každé kapely v detailu eventu
  - TODO zobrazují se u každé kapely v copy

## upraveno
- tagy lze přidat ke kapelám (automatické přidání tagu kapely k eventu :o)
- admin tables redesign (větší přehlednost)
- tagy rozděleny na event a band kategorie
- zlepšení fb buttonu (existuje/chybí) v admin event table
- algoritmus pro získávání eventů z databáze

## opraveno
- text "zatím žádné akce" se zobrazuje v případě prázdného pole


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
</svelte:head>
  
  <SvelteMarkdown {source} />