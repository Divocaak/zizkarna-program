<script>
    import SvelteMarkdown from 'svelte-markdown';
    const source = `
## přidáno
- tag edit skrz admin
- band edit skrz admin
- band json lze vypsat už při vytváření bandu

## upraveno
- tagy lze přidat ke kapelám (automatické přidání tagu kapely k eventu :o)
- admin tables redesign (větší přehlednost)
- tagy rozděleny na event a band kategorie

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
  
  <SvelteMarkdown {source} />