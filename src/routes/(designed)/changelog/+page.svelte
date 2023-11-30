<script>
    import SvelteMarkdown from 'svelte-markdown';
    const source = `# 15.11.23
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