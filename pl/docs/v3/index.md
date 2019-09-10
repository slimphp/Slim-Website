---
title: Dokumentacja Slim 3
l10n-link: index-v3
l10n-lang: pl
---

<div class="alert alert-info">
    <p>
        To jest dokumentacja dla <strong>Slim 3</strong>. Poszukujesz wersji dla <a href="/docs/v2">Slim 2</a>?.
    </p>
</div>

## Witaj

Slim to microframework PHP, kt&#243;ry syzbko pomaga
pisa&#263; proste, ale pot&#281;&#380;ne aplikacje internetowe oraz interfejsy API. U podstaw Slim
posiada dyspozytor, kt&#243;ry odbiera &#380;&#261;danie HTTP, wywo&#322;uje odpowiednie wywo&#322;anie zwrotne
procedura i zwraca odpowied&#378; HTTP. To wszystko!

## Jaki jest sens?

Slim jest idealnym narz&#281;dziem do tworzenia interfejs&#243;w API, kt&#243;re wykorzystuj&#261;, zmieniaj&#261; przeznaczenie lub publikuj&#261; dane.
Slim te&#380; jest doskona&#322;ym narz&#281;dziem do szybkiego prototypowania. Mo&#380;esz nawet zbudowa&#263; w pe&#322;ni funkcjonaln&#261; sie&#263;
aplikacji z interfejsami u&#380;ytkownika. Co wa&#380;niejsze, Slim jest super szybki
i ma bardzo ma&#322;o kodu. W rzeczywisto&#347;ci mo&#380;esz odczyta&#263; i zrozumie&#263; jego kod &#378;r&#243;d&#322;owy
w jedno popo&#322;udnie!

> U podstaw Slim jest dyspozytor, kt&#243;ry odbiera &#380;&#261;danie HTTP,
>wywo&#322;uje odpowiednie wywo&#322;anie zwrotne i zwraca odpowied&#378; HTTP. To wszystko!

Nie zawsze potrzebujesz kombajnu, takiego jak [Symfony][symfony] lub [Laravel][laravel].
Na pewno s&#261; to &#347;wietne narz&#281;dzia. Ale cz&#281;sto s&#261; przesadzone.
Slim zapewnia tylko minimalny zestaw narz&#281;dzi, kt&#243;re wykona to, 
czego potrzebujesz i nic wi&#281;cej.

## Jak to dzia&#322;a?

Po pierwsze, potrzebujesz serwera WWW takiego jak Nginx lub Apache.
Powiniene&#347;/powinna&#347; [skonfigurowa&#263; sw&#243;j serwer WWW](/docs/v3/start/web-servers.html), aby wysy&#322;a&#322; wszystkie
odpowiednie &#380;&#261;dania do jednego pliku PHP „front-controller”.
Tworzysz instancj&#281; i uruchamiasz aplikacj&#281; Slim w tym pliku PHP.

Aplikacja Slim zawiera trasy (routes), kt&#243;re odpowiadaj&#261; na okre&#347;lone &#380;&#261;dania HTTP.
Ka&#380;da trasa wywo&#322;uje funkcj&#281; zwrotn&#261; i zwraca odpowied&#378; HTTP. Aby rozpocz&#261;&#263;,
najpierw utw&#243;rz i skonfiguruj aplikacj&#281; Slim. Nast&#281;pnie zdefiniuj trasy aplikacji.
Na koniec uruchom aplikacj&#281; Slim. To takie proste. Oto przyk&#322;adowa aplikacja:

<figure markdown="1">
```php
<?php
// Create and configure Slim app
$config = ['settings' => [
    'addContentLengthHeader' => false,
]];
$app = new \Slim\App($config);

// Define app routes
$app->get('/hello/{name}', function ($request, $response, $args) {
    return $response->write("Hello " . $args['name']);
});

// Run app
$app->run();
```
<figcaption>Rysunek 1: Przyk&#322;ad aplikachi Slim</figcaption>
</figure>

## &#380;&#261;danie i odpowied&#378;

Podczas tworzenia aplikacji Slim cz&#281;sto pracujesz bezpo&#347;rednio z Request (&#380;&#261;danie)
i Response (odpowied&#378;). Te obiekty reprezentuj&#261; rzeczywiste otrzymane &#380;&#261;danie HTTP
przez serwer WWW i ewentualn&#261; odpowied&#378; HTTP zwr&#243;con&#261; do klienta.

Ka&#380;da trasa aplikacji (route) Slim otrzymuje jako argument bie&#380;&#261;ce obiekty Request i Response
do jego procedury zwrotnej. Obiekty te implementuj&#261; popularne interfejsy [PSR-7](/docs/v3/concept/value-objects.html).
Trasa aplikacji Slim mo&#380;e sprawdzi&#263; lub w razie potrzeby manipulowa¢ tymi obiektami.
Ostatecznie ka&#380;da trasa aplikacji Slim **MUSI** zwr&#243;ci&#263; obiekt odpowiedzi PSR-7.

## U&#380;yj w&#322;asne komponenty

Slim zosta&#322; zaprojektowany do wsp&#243;&#322;pracy z innymi komponentami PHP. mo&#380;esz si&#281; zarejestrować
dodatkowe komponenty w&#322;asne, takie jak [Slim-Csrf][csrf], [Slim-HttpCache][httpcache],
lub [Slim-Flash][flash], kt&#243;re bazuj&#261; na domy&#347;lnej funkcjonalno&#347;ci Slim. Tak&#380;e
&#322;atwo do zintegrowa&#263; komponenty innych firm znalezione na [Packagist](https://packagist.org/).

## Jak czyta&#263; dokumentacj&#281;

Je&#347;li dopiero zaczynasz korzysta&#263; ze Slim'a, zalecamy przeczytanie tej dokumentacji od samego pocz&#261;tku
do ko&#324;ca. Je&#347;li znasz ju&#380; Slim, mo&#380;esz zamiast tego przej&#347;&#263; prosto
do odpowiedniej sekcji.

Ta dokumentacja zaczyna si&#281; od wyja&#347;nienia koncepcji i architektury Slima
przed podj&#281;ciem konkretnych temat&#243;w, takich jak obs&#322;uga zapyta&#324; i odpowiedzi,
routing i obs&#322;uga b&#322;&#281;d&#243;w.

## Licencja dokumentacji
<p style="text-align: left;">
    Ta strona internetowa i dokumentacja s&#261; licencjonowane na podstawie <a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
    <br />
    <a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
        <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" />
    </a>
</p>

[symfony]: https://symfony.com/
[laravel]: https://laravel.com/
[csrf]: https://github.com/slimphp/Slim-Csrf/
[httpcache]: https://github.com/slimphp/Slim-HttpCache
[flash]: https://github.com/slimphp/Slim-Flash
[eloquent]: https://laravel.com/docs/5.1/eloquent
[doctrine]: http://www.doctrine-project.org/projects/orm.html
