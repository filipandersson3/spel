## Spel

Filip 2022-01-11

## Inledning
Spel i Phaser som planerades i grupp med estetare och som går ut på att spamma höger snabbt nog att ta sig till målet innan tiden går ut. Man kan köpa uppgraderingar med flaskor som man samlar för att åka snabbare och målet är att ta sig till en fabrik, som endast går när man har alla uppgraderingar.

## Bakgrund
Satte upp en to-do lista med Github där jag prioriterade vad som var viktigast och i vilken ordning saker skulle kodas. Det här är en sammanfattning på vad jag har lagt till och i ungefär vilken ordning:
* Tilemap, samma som från template fast ändrade saker i Tiled
* Movement, man kan spamma höger för att glida framåt
* Kamera som följer spelaren, hade redan gjort den när vi jobbade med Phaser innan så CTRL+V
* Obstacle som man kan krocka in i.
* Automatisk spawning av obstacles, flaskor, etc. Den utgår ifrån tiden som gått och spelarens hastighet och är random. Spawnar just utanför skärmen.
* Zeunerts flaskor som man kan plocka upp och som sparas.
* Ramp, har ingen kollision (går inte) men vinklar ens hastighet istället
* HUD, cold metern är bara en rektangel som ändrar bredd efter hur lång tid som gått.
* Custom font laddar jag in från en .ttf fil i CSS.
* Platformar med zeunerts spawnar på samma sätt som allt annat.
* Milestone som sparar det längsta avståndet från start, så man kan se om man passerat sitt bästa.
* Texturer, animationer. Ville att en animation bara skulle kunna spelas efter en annan så fick använda en eventlistener som lyssnade efter att någon animation slutat spela.
* Shop med cursor som man kan styra med piltangenter för att välja en uppgradering, öppnar en ny scene och håller koll på vilken uppgradering man är på med en int.
* Hade tid över så la till ljud och musik som beror på vad man gör i spelet och ett slut på spelet.

När något fungerade ganska bra gick jag till nästa del, så jag blev färdig och kunda finslipa sedan. Därför fick jag ett spelbart spel ganska fort och finslipade närmare slutet.

## Positiva erfarenheter

* Gick bra att hinna det vi hade planerat för att vi planerade inte för mycket och avancerade saker.
* Gick bra att koda i js för att det är roligare att jobba med något som man får direkt feedback av och som man kan spela, så jag har fått lära mig att koda i js. Hade också gjort js exempeluppgifter förut så det var inte för svårt att förstå.
* Det var bra när vi fick grafik från estetarna så tidigt så att det gick att lägga in det i spelet och testa animationer mycket innan inlämning.

## Negativa erfarenheter

* Svårt att förstå Phaser dokumentation så därför uppstod flera problem som t.ex. med timer. Lösning: kolla på exempel istället eller fråga andra.
* Det var svårt att förstå hur man kan få animationer att följa efter varandra och så att t.ex. en animation bara kan spelas när en annan är färdig. Men jag hittade en slags 
lösning ändå, även fast Phaser dokumentationen inte var till någon hjälp.
* Kontrollerna var svåra att förstå, så jag la till fler kontroller som gör samma sak, t.ex. WASD och piltangenter. Fick också lära mig vilka kontroller som förväntas.
* Fysikmotorn var begränsande med kollisioner mellan objekt som inte var rektanglar eller cirklar, men då fick jag lära mig hur man kan lösa ramper på ett annat sätt.

## Sammanfattning

* Bra planering som gick att utföra på den tid vi fick.
* Fick lära mig koda i JS på roligare sätt än att t.ex. följa tutorials.
* Det blev mycket lättare när vi fick grafik ganska tidigt, men planeringen innehöll också mycket annat som jag kunde jobba med medans jag väntade på grafikerna.
* Phaser dokumentation dålig, kolla på exempel eller fråga andra som gjort liknande.
* Animationlogik och rampkollisioner var båda svåra att implementera, men jag fick lära mig hur man kunde lösa det på andra sätt.
* Kontroller var svåra att förstå för andra, fick lära mig deras förväntade kontroller och gjorde flera kontroller som gör samma.
