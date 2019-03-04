Teil von Severin: Von "Konzept: Einführungspage" bis "Vorführung"
---

# Folien

## Konzept und Realisierung: Struktur der Webapplikation

Wir haben nun von Adrian mitbekommen, was Algorithmen und Pathfinder sind, wo
sie vorkommen, wofür sie gut sind und was sie mit dem Oberthema zu tun
haben. Auch haben wir die Ziele dieser BMA kennengelernt.

Wie erwähnt sollte unser Produkt eine Webapplikation sein. Aber wie soll
diese aussehen?

Hier sieht man den geplanten UI-Flow (Aufbau der Website). Wenn man die
Seite zum ersten mal besucht, kommt man zuerst auf eine Einführungspage und
das ganze wird einem zuerst erklärt.

Dann wird man zu einer weiteren Page geführt, auf welcher man einen Pathfinder
demonstriert und kurz erklärt bekommnt. Dann kommt der User zum Herzstück der
Webapplikation, dem Pathfinding-Algorithmus-Vergleicher.

## Konzept: Einführungspage

So sehen die Konzeptpläne für die Einführungsseite aus. Der tatsächliche
Text- und Bildinhalt gleicht etwa dem, was Adrian euch bereits mitgeteilt
hat.

## Konzept: Pathfinding-Algorithmen-Vergleicher

Das Herzstück der Webapp, der Pathfinding-Algorithmus-Vergleicher, sieht so
aus. Wir werden uns das Produkt sehr bald live ansehen und euch vorführen.

Aber bevor wir das tun, möchte ich das Raster, auf dem sich das Wichtigste abspielt noch genauer erläutern.

## Das Produkt: Raster

Wie erwähnt werden Pathfinder in einem Raum ausgeführt. Hier ein leerer
Raum. 

Natürlich könnten wir hier unsere drei Pathfinder bereits schon ausführen.
Besonders interessant wäre dies jedoch nicht.

Um die Sache spannender zu gestalten, fügen wir dem Raum "Wände" hinzu und
und markieren zwischen welchen zwei Punkten die Pathfinder den Weg finden
sollen.

## Das Produkt: Korridore und Wände

Das sieht dann so aus. (die vier Block-Typen erklären).

Schauen wir nun mal, wie der Raum aussehen würde, wenn wir die drei von uns ausgewählten Pathfinder in diesem Raum parallel laufen lassen würden.

## Das Produkt: Pathfinding-Algorithmen werden angewendet

Wir sehen sofort, dass die drei Pathfinder anscheinend nicht equivalente
Wege gefunden haben. In der Entwicklungsphase haben wir mit viel mehr
Pathfinder herumgespielt und haben uns für diese drei entschieden, weil wir
früh merkten, dass der Vergleich der drei interessante Resultate erbringen
würde.

## Realisierung: Realisierung und Infrastruktur

Bevor wir endgültig uns das Produkt anschauen, erläutere ich noch etwas
oberflächlich die technische Implementation der Webapplikation.

Die Webapplikation ist mehr oder weniger klassich aufgebaut. Es gibt den
Server, der die Seite zum Benutzer, also Browser (oder Frontend), schickt. 

Am speziellsten wir wohl sein, dass sowohl das Frontend als auch das Backend in JavaScript implementiert wurden.

Gründe:
- Erfahrung
- Gleiche Sprache wie PathFinding.js
- Client offloading

## Realisierung: Technische Kernkomponenten

Dann kommen wir noch kurz zu den wichtigen Eckpunkten, welche wir im Rahmen
dieser BMA programmiert haben.

Unsere Eigenleistungen bestehen unter anderem aus dem dynamischen generieren
von den bereits genannten Rastern. Rundum dieser Funktionalität benötigte es
viele andere Funktionen, um das ganze zu Stande zu bringen.

- Statistikwerte Ausgabe
- Grafische Darstellung von Allem
- Steuerbares Experiment
- Einbindung PathFinding.js
