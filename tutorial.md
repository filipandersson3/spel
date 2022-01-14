## Hur använder man scenes?
I game.js finns det en lista med scenes där namnet på alla scener i spelet ska finnas. Dessutom så behöver scenerna importeras med 
```
"import SceneNamn from './scene-fil';"
```
För att skapa en ny scene så kan man copy-pastea en scene som redan finns och byta ut namnet och koden i create och update.

Det här kör en ny scene parallellt med en annan. Användbart t.ex. för en pausmeny.
```
this.scene.launch('SceneSomSkaLaunchasHär');
```
Det här stänger av nuvarande scene och startar den här istället. T.ex. gå tillbaka till main menu.
```
this.scene.start('SceneSomSkaStartasHär');
```
Det här startar om nuvarande scene.
```
this.scene.restart();
```
Det här pausar nuvarande scene.
```
this.scene.pause();
```
Det här gör motsatsen till pause.
```
this.scene.resume();
```
Gör en scene synlig eller osynlig.
```
this.scene.setVisible(true eller false, 'SceneNamn');
```
## Hur sparar man data i spelet utanför scener? (tills hela spelet startar om)
Det här kan man använda för att spara data som ska finnas kvar när man startar om scener eller om man vill flytta data mellan scener.

All den här datan försvinner ändå när man startar om spelet, men om man t.ex. vill starta om en scene varje gång man dör så kan man använda det här 
för att spara antal liv.
För data som stannar på användarens dator som high scores så kan du titta på **localstorage**.
```
this.game.variabel = värde
```
Om variabeln blir satt till ett värde i början av en scene så blir ju värdet overwritten, men om man försöker att använda en variabel som inte har fått 
något värde än så funkar inget.
Därför rekommenderar jag att ge variabeln ett värde i preload-scene, för att variabeln får då ett startvärde.

## All min pixelart ser suddig ut!
Stoppa in pixelArt: true någonstans i config i game.js. 
```
const config = {
    type: Phaser.AUTO,
    width: 896,
    height: 448,
    pixelArt: true,
```
## När jag trycker ner en tangent vill jag bara att koden ska köras en gång per nedtryckning
```
Phaser.Input.Keyboard.JustDown(this.keyObj)
```
## Ett sätt att använda custom fonts
Lägg in nya fonts i CSS så kan de användas i Phaser. Här används en nedladdad font fil. 

**Byt ut PressStart2P mot din egna font.**
```
@font-face {
    font-family: PressStart2P;
    src: url('/assets/PressStart2P-Regular.ttf');
}
```
För att font ska visas rätt från början så borde det här finnas i preload-scene:
```
this.add.text(0, 0, '', { fontFamily: '"PressStart2P"' });
```
Det är för att den första gången man använder en font så visas den inte rätt.

Det här är hur man använder text i resten av spelet.
```
this.add.text(x, y, 'skrivtexthär', { 
            fontFamily: '"PressStart2P"', 
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center', });
```
## Få saker att sluta röra sig
Har inte själv testat vilken av de här som gör att de slutar att röra sig, men båda tillsammans funkar.
```
this.fysikobjekt.body.immovable = true;
this.fysikobjekt.body.moves = false;
```
## (o)ljud
Ladda in ljud i preload
```
this.load.audio('vineboom', '/audio/vineboom.mp3');
```
**Det finns två olika sätt att använda ljud:**
### Första sättet
En specifik instans av ett ljud som man kan pausa och ändra på medans den spelar, 
fungerar bra för musik eller ljud som bara ska spelas en åt gången. Det här är i create() i playscene.
```
this.shopmusic = this.sound.add('shopmusic');
```
Man kan spela ljudet så här (ta bort loop:true om det inte ska loopa).
```
this.shopmusic.play({loop:true});
```
```
this.shopmusic.pause();
```
```
this.shopmusic.resume();
```
### Andra sättet
Man kan också starta en ny instans av ett ljud varje gång en bit kod körs, 
och det är bra för ljudeffekter som ska kunna bli stackade.
```
this.sound.play('vineboom',{volume:2});
```
1 är maxvolym men loud=funny.

### Om det blir för mycket oljud:
```
this.game.sound.stopAll();
```
