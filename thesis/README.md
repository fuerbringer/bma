<img src="ktzh" alt="image" style="width:5.0%" />

<span class="smallcaps">Berufsmaturitätsschule Zürich</span>

Oberthema: <span class="smallcaps">Mobilität</span>  
<img src="cover2" alt="image" style="width:65.0%" />

|                                                   |                                             |
|:-------------------------------------------------:|:-------------------------------------------:|
| <span class="smallcaps">Severin Fürbringer</span> | <span class="smallcaps">Adrian Stoop</span> |
|                  severin@fsfe.org                 |             adrian-stoop@gmx.ch             |
|                       EVT18a                      |                    EVT18a                   |

<span class="smallcaps">Dr. Jürg Pöttinger</span>  

Einleitung
==========

Realisierung
============

Dieser Abschnitt soll dazu verhelfen, die technischen Entscheidungen und
Schritte zu erläutern und es möglich zu machen, die Kernfunktionen des
Projekts zu reproduzieren. Leser, die diese Applikation, oder Teile
davon, anderweitig einsetzen möchten, beziehen sich zusätzlich auf den
frei verfügbaren Quellcode des gesamten Projekts.

Konzept
-------

Die Konzipierung dieser Webapplikation verlangte einige technische und
gestalterische Entscheidungen. Einerseits musste die Programmiersprache
und Struktur der Applikation geplant werden und andererseits auch das
eigentliche Aussehen der Benutzeroberfläche der Webapplikation. Auf
diese zwei wesentlichen Aspekte wird in diesem Abschnitt eingegangen.

### Pathfinding.js

Eine korrekte Implementation der ausgewählten Pathfinder sind
Voraussetzung für das Projekt. Daher wurde, um diese Voraussetzung zu
erfüllen, die frei verfügbare Implementation PathFinding.js
verschiedener Pathfinder ausgewählt.

### Programmierwerkzeuge

Die vorhandenen Fachkenntnisse und Erfahrungen schlugen für die
Implementierung entweder PHP oder JavaScript als mögliche
Programmiersprachen vor. Zum Entscheid massgebend war, dass die
Programmbibliothek PathFinding.js , welche in unserer Arbeit eine
wichtige Rolle spielt, in JavaScript implementiert wurde. Durch den
Einsatz von JavaScript im Front-End und im Back-End, wäre es möglich die
Pathfinder Berechnungen beliebig auf dem Rechner des Nutzers und auch
auf dem Rechner des Servers auszuführen. Aus diesen Gründen wurde für
das Front- und Back-End JavaScript ausgewählt. Folgend werden die
wichtigsten Technologien unserer Webapplikation aufgelistet[1].

Programmiersprache  
JavaScript mit Einbindung von PathFinding.js

Webserver-Software  
Express[2] übernimmt die Ausführung von JavaScript im Back-End.

Quellcode-Hosting  
GitHub[3]. Der Quellcode unser Webapplikation ist frei unter  
<https://github.com/fuerbringer/bma> zugänglich.

Webhosting  
Die Vultr[4]-Cloud dient als Hosting-Provider. Prinzipiell kann die
Webapplikation jedoch auf beliebigen Unix und GNU/Linux Servern gehostet
werden.

### Konzipierung der Benutzeroberfläche

Als Webapplikation muss unsere Arbeit deren Nutzen dem Benutzer
ausreichend klar machen. Umsomehr ist dies von Bedeutung, da die
Webapplikation frei zugänglich ist und daher auch Besucher die Idee der
Webapplikation verstehen sollten. Aus diesem Grund wurde unsere
Webapplikation für den Nutzer einführend gestaltet. Das heisst, dass der
Benutzer beim Aufruf der Webapplikation zunächst auf einer
Willkommensseite landet, die ihn wiederum zu einer Einführung in das
Thema und Ziel der Arbeit führt. Nach der Einführung kann der Benutzer
in der Visualisierung mit einzelnen Pathfindern erste Erfahrungen
machen. Im Abschluss kommt der Benutzer zum Hauptteil der Arbeit, dem
Pathfinding-Vergleicher. Ziel dieser Struktur ist, dass jede Person
wenigstens einen Einblick in die Welt der Pathfinding-Algorithmen erhält
und über das nötige Wissen verfügt, das Ziel des
Pathfinding-Vergleichers zu verstehen.

<img src="uiflow" alt="Webapplikationsstruktur. Quelle: Eigenleistung" style="width:16cm" />

#### Einführungs- und Willkommensseite

Die Einführungsseite erklärt dem Benutzer was Algorithmen sind und führt
ihn anschliessend mit einfachen Beispielen in das Thema der Pathfinder
ein. Zuletzt werden die Ziele der Arbeit aufgelistet.

<img src="einfuehrung1" alt="Einführungsseite. Quelle: Eigenleistung" style="width:16cm" />

#### Visualisierung der Pathfinder

Nach der Einführung erhält der Benutzer die Möglichkeit mit einzelnen
Pathfindern zu experimentieren. Dazu kann er auch verschiedene Parameter
anpassen. Dies ist die Vorstufe zum Pathfinder-Vergleicher, da hier
nochmals die einzelnen Pathfinder auf ihre Eigenschaften beschrieben
werden.

<img src="visualisierung1" alt="Benutzeroberflächenkonzept Visualisierer. Quelle: Eigenleistung" style="width:16cm" />

<span id="fig:gui_konzept_visualizer"
label="fig:gui_konzept_visualizer">\[fig:gui\_konzept\_visualizer\]</span>

#### Vergleich der Pathfinder

Als Herzstück der Arbeit ermöglicht der Pathfinder-Vergleicher dem
Nutzer die in unserer Arbeit ausgewählten Pathfinder zu vergleichen.
Hier werden, gleich wie beim Visualisierer, zuerst vom Benutzer die
Parameter gewählt. Die parallel ausgeführten Resultate mit Informationen
über die Rechenzeit, zurückgelegten Weg und Operationen, sind dann
interaktiv anwählbar. Gleichzeitig wird auch unter “Resultate” unten
links das Total aller Vergleiche akkumuliert, damit ein Gesamteindruck
verschaffen werden kann. Die Resultate dieser Seite dienen im
Statistikteil als Datenquelle.

<img src="konzept1" alt="Benutzeroberflächenkonzept Vergleicher. Quelle: Eigenleistung" style="width:16cm" />

<span id="fig:gui_konzept_comparator"
label="fig:gui_konzept_comparator">\[fig:gui\_konzept\_comparator\]</span>

Implementierung des Vergleichers
--------------------------------

Vor allem für die statistischen Auswertungen ist es von Bedeutung zu
wissen, wie der Vergleicher zu den Resultaten kommt und die Berechnungen
durchführt. Um an die statistischen Merkmale zu gelangen, musste je nach
Merkmal die Webapplikation oder PathFinding.js erweitert werden.

### Raster

Pathfinder benötigen einen Raum, um ihre Arbeit zu verrichten. Folglich
wird erläutert, wie diese Räume im Quellcode der Arbeit implementiert
wurden. Die Implementation der Pathfinding-Algorithmen von
PathFinding.js erwartet als Raum eine Liste mit beispielsweise 8 × 8
Zellen:  

\[(0, 0), (1, 0), (2, 0), (3, 0), (4, 0), (5, 0), (6, 0), (7, 0)\]  
\[(0, 1), (1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1)\]  
\[(0, 2), (1, 2), (2, 2), (3, 2), (4, 2), (5, 2), (6, 2), (7, 2)\]  
\[(0, 3), (1, 3), (2, 3), (3, 3), (4, 3), (5, 3), (6, 3), (7, 3)\]  
\[(0, 4), (1, 4), (2, 4), (3, 4), (4, 4), (5, 4), (6, 4), (7, 4)\]  
\[(0, 5), (1, 5), (2, 5), (3, 5), (4, 5), (5, 5), (6, 5), (7, 5)\]  
\[(0, 6), (1, 6), (2, 6), (3, 6), (4, 6), (5, 6), (6, 6), (7, 6)\]  
\[(0, 7), (1, 7), (2, 7), (3, 7), (4, 7), (5, 7), (6, 7), (7, 7)\]

Zu beachten ist, dass die obige Liste pro Element (Zelle) lediglich die
Koordinate (*x*, *y*) als Eigenschaft aufweist. Weitere Eigenschaften
pro Zelle, wie die Wandeigenschaft, werden in späteren Abschnitten
erwähnt. Diese Art von Raster ist bei der Darstellung von Pixelmatrizen
und sonstigen computergrafikorientierten Anwendungen üblich. Man kann
sich diese Anordnung auch als den vierten Quadranten eines kartesischen
Koordinatensystems vorstellen, dessen *y*-Koordinate ihren Absolutwert
annimmt. Des Weiteren gilt *x* ∈ ℕ und *y* ∈ ℕ. Daraus folgt, dass
Zwischenschritte nicht möglich sind, beispielsweise das Ziel nicht die
Koordinate $(\\frac{1}{2},\\frac{42}{11})$ annehmen kann. Ein weiteres
Beispiel dafür wären die Pixel eines gewöhnlichen Monitors, denn einen
Bruchteil eines Pixels anzusteuern ist ebenfalls nicht möglich. Benötigt
man eine derartige Präzision, erhöht man dazu am besten die Auflösung
des Raums. Es folgt eine Abbildung eines zweidimensionalen leeren Raumes
der oben gegebenen Liste.

<img src="grid1" alt="Ein von unserer Webapplikation generiertes 8\times8 Raster. Quelle: Eigenleistung" style="width:8cm" />

#### Generierung der Wände und Gänge

Damit die Eigenschaften der Pathfinder besser zum Vorschein kommen, sie
also nicht nur im leeren Raum ausgeführt werden, wurde im nächsten
Schritt für den Rastergenerator die Logik zum Verstreuen von Wänden
implementiert. Die Rastermatrix erhält dann pro Zelle die Eigenschaft,
ob sie vom Pathfinder passierbar ist oder nicht. Die Programmbibliothek
PathFinding.js versteht diese Logik genauso, indem man zu einer
gegebenen Koordinate definiert, ob sie eine Wand ist. Der folgende
prozedurale Pseudocode definiert die in unserer Webapplikation benutzte
Routine[5], um Raster mit Wänden zu füllen.

Zeilen (*y*-Achse) Zellen (*x*-Achse)
*r**a**n**d* ← *r**a**n**d**o**m*(0, 100) Zufallszahl \[0, 100\]
*x* ← ⌊*r**a**n**d*mod*f**r**e**q*⌋ Rest von $\\frac{rand}{freq}$
*r**a**s**t**e**r*\[*y*\]\[*x*\] ← *w**a**n**d*() Zelle bei
*y*<sub>*i*</sub> und *x*<sub>*i*</sub> wird zu einer Wand **return**
*r**a**s**t**e**r*

Vom Frequenzparameter *f**r**e**q* hängt schlussendlich ab, wie oft
Wände im Raster vorkommen. Er kann frei gewählt werden. Nähert sich der
Wert *f**r**e**q* jedoch 1 mit *f**r**e**q* &gt; 1, erhöht sich auch die
Anzahl unlösbarer Raster, da immer weniger mögliche Wege zwischen den
verbliebenen Zellen besteht. Wendet man den Wandgenerator in unserem
Raster der Abbildung
<a href="#fig:grid1" data-reference-type="ref" data-reference="fig:grid1">[fig:grid1]</a>
an, so erhält man ein Raster mit Wänden.

<img src="freq_for_2" title="fig:" alt="Raster mit Frequenzparametern freq = 2, freq = 4 und freq = 16 im Wandgenerator. Quelle: Eigenleistung" />
<img src="freq_for_4" title="fig:" alt="Raster mit Frequenzparametern freq = 2, freq = 4 und freq = 16 im Wandgenerator. Quelle: Eigenleistung" />
<img src="freq_for_16" title="fig:" alt="Raster mit Frequenzparametern freq = 2, freq = 4 und freq = 16 im Wandgenerator. Quelle: Eigenleistung" />  

<span id="fig:freq_param"
label="fig:freq_param">\[fig:freq\_param\]</span>

Wir sehen also, dass mit dem Frequenzparameter *f**r**e**q* die
Häufigkeit der unpassierbaren Wände geändert werden kann. In unserer
Webapplikation haben wir für den Frequenzparameter *f**r**e**q* = 4
ausgewählt, da dieser Wert ein gutes Gleichgewicht zwischen nicht zu
viel unlösbaren Rastern und genügend Wänden ergibt.

#### Generierung des Start-und Endpunkts

Wählt man zwei zufällige passierbare Zellen als Start- und Endpunkt aus,
erhält man ein Raster, mit dem man Pathfinding-Algorithmen anwenden
kann. In unserer Webapplikation werden diese zwei Zellen farbig
differenziert. Programmatikalisch handelt es sich um Zellen, die Wände
sind und in Ziel- resp. Endpünkte umgewandelt werden. Die folgenden zwei
Routinen[6] wählen in einem gegebenen Raster einen Start- und einen
Endpunkt aus.

Start- und Endpunkte markieren
*s**t**a**r**t**I**n**d**e**x* ← ⌊*r**a**n**d**o**m*(0,*c**o**u**n**t*(*f**r**e**i*))⌋
$raster\[frei\[startIndex\]\\textsubscript{y}\]\[frei\[startIndex\]\\textsubscript{x}\] \\gets start()$
Startpunkt markieren *f**r**e**i*\[*s**t**a**r**t**I**n**d**e**x*\] ← ∅
Benutzten Punkt von den noch freien entfernen
*e**n**d**I**n**d**e**x* ← ⌊*r**a**n**d**o**m*(0,*c**o**u**n**t*(*f**r**e**i*))⌋
$raster\[frei\[endIndex\]\\textsubscript{y}\]\[frei\[endIndex\]\\textsubscript{x}\] \\gets ende()$
Endpunkt markieren *f**r**e**i*\[*e**n**d**I**n**d**e**x*\] ← ∅
Benutzten Punkt von den noch freien entfernen **return**
*r**a**s**t**e**r* *f**r**e**i* ← *l**e**e**r**e* *L**i**s**t**e*
mögliche Zellen für den Start- und Endpunkt Zeilen (*y*-Achse) Zellen
(*x*-Achse)
*f**r**e**i* ← *f**r**e**i* + *r**a**s**t**e**r*\[*y*\]\[*x*\] Freie
Zelle aus *r**a**s**t**e**r* wird *f**r**e**i* hinzugefügt
$raster \\gets \\textsc{Punktemarkieren}(raster, frei)$ **return**
*r**a**s**t**e**r*

Wendet man nun den Start- und Endpunktgenerator[7] an Rastern mit Wänden
(siehe Abbildung
<a href="#fig:freq_param" data-reference-type="ref" data-reference="fig:freq_param">[fig:freq_param]</a>)
an, so erhält man folgendes, ein für den PathFinder brauchbares, Raster
mit Wänden und Start- und Endpunkt:

<img src="grid2" alt="Ein von unserer Webapplikation generiertes 8\times8 Raster mit Wänden und markierten Start- und Endpunkten. Quelle: Eigenleistung" style="width:8cm" />

Im letzten Schritt lässt man die PathFinder den Weg zwischen den
markierten Start- und Enpunkten finden. Die Parameter, die man
PathFinding.js dafür übergeben muss, sind grundsätzlich das Raster und
die darin markierten Punkte, die als Start- und Ende dienen. Die
markierten Punkte speichert man entweder im Start- und Endpunktgenerator
zwischen oder man benutzt eine weitere Routine[8], die die Start- und
Endpunkte aus einem Raster extrahiert:

*s**t**a**r**t**P**u**n**k**t* ← ∅ *e**n**d**P**u**n**k**t* ← ∅
*y*-Achse *x*-Achse *s**t**a**r**t**P**u**n**k* ← *z**e**l**l**e*
*e**n**d**P**u**n**k* ← *z**e**l**l**e* **return**
\[*s**t**a**r**t**P**u**n**k**t*, *e**n**d**P**u**n**k**t*\] Objekt mit
dem Start- und Endpunkt

Übergibt man PathFinding.js nun die nötigen Parameter des Rasters und
dessen Start-und Endpunkte, so erhält man den Weg von Start bis Ende.
Wiederholt man dies mehrere Male mit verschiedenen Pathfindern, so
ermöglicht man den direkten Vergleich der Pathfinding-Algorithmen. Dies
ist eine wichtige Kernfunktion dieser Berufsmaturitätsarbeit.

<img src="grid3" alt="Ein von unserer Webapplikation generiertes 8\times8 Raster mit Wänden und gelöstem Weg. Quelle: Eigenleistung" style="width:8cm" />

### Auswertung und Merkmale

Zur Auswertung werden Merkmale definiert, welche bei der Statistik
relevant sind. Es folgen die drei wichtigsten Merkmale beim Vergleich
der Pathfinder in der Webapplikation.

#### Zurückgelegter Weg

Der zurückgelegte Weg ist aus praktischer Sicht gesehen ein bedeutendes
Merkmal, da man natürlich möchte, dass der resultierende Weg möglichst
kurz ausfällt. Die Programmbibliothek PathFinding.js liefert den Weg in
einer Liste mit einer Koordinate pro Element. Daraus folgt, dass der Weg
*s* der Anzahl der Elemente der Liste entsprechen muss, wenn man nach
PathFinding.js Sprünge oder Luftlinien ausschliest[9]. Es gibt demnach
keine Geraden, ausser zwischen zwei Benachbarten Punkten. Diagonalen
würden nach dieser Logik bei einem diagonalen Sprung als eine Wegeinheit
gelten.
$$s = n
\\begin{cases}
  P\_1(0,0),\\\\
  P\_2(1,0),\\\\
  ...\\\\
  P\_n(x,y)
\\end{cases}$$

#### Operationen

Ein Algorithmus, der für das gleiche Resultat weniger Schritte
(Operationen) tätigen muss, ist grundsätzlich besser als ein anderer.
Zur Erfassung der Anzahl Operationen mussten die internen Routinen der
Programmbibliothek PathFinding.js angepasst werden, da sie solche
Messungsmerkmale nicht standardmässig liefert. Dazu wurde der Quellcode
von PathFinding.js kopiert[10] und in die Routinen der drei ausgewählten
Pathfinder im äusseren und inneren Loop eingefügt. Folgende Dateien[11]
wurden dafür angepasst:

-   src/finders/AStarFinder.js

-   src/finders/BreadthFirstFinder.js

Zu beachten ist, dass die Datei des BestFirstFinders nicht angepasst
werden musste, da dieser auf dem A\*-Finder basiert und somit alle
Änderungen vom A\*-Finder vererbt.

#### Rechenzeit

Ein bedeutendes Merkmal ist die Rechenzeit, also die Zeit, in der der
Pathfinder seine Arbeit verrichtet hat. Um diese zu berechnen, wird
unmittelbar vor der Ausführung der Wegfindungsroutine des Pathfinders
der Zeitstempel *t*<sub>0</sub> der jetzigen Zeit zwischengespeichert
und danach vom Pathfinder die Arbeit verrichtet. Direkt nach dem Beenden
der Wegfindung wird ein zweites Mal ein Zeitstempel *t*<sub>1</sub>
zwischengespeichert. Die Differenz ergibt die Zeit *t* in
Millisekunden[12], die für die Berechnung benötigt wurde.
*t* = *t*<sub>1</sub> − *t*<sub>0</sub>
 Die Werte *t* sind pro Pathfinder in der Webapplikation unter “Messung
für diesen Einzelversuch:” unter dem Raster ersichtlich. Diese
Berechnung demnach pro Durchlauf dreimal getätigt.  
  
Aus diesen drei Merkmalen folgen zusammengefasst die in unserer
Webapplikation vermessenen Werte der Pathfinding-Algorithmen.

<img src="measurements_single" alt="Vergleicherausschnitt. Quelle: Eigenleistung" style="width:10cm" />

<span id="fig:gui_konzept_comparator"
label="fig:gui_konzept_comparator">\[fig:gui\_konzept\_comparator\]</span>

Schluss
=======

Anhang
======

Screenshots der Webapplikation
------------------------------

### Pathfinder-Vergleicher

<img src="3_full" alt="Pathfinder-Vergleicher-Page. Quelle: Eigenleistung" style="width:14cm" />

<span id="fig:comparator_screenshot"
label="fig:comparator_screenshot">\[fig:comparator\_screenshot\]</span>

Danksagung
----------

### Schriftsetzung

Die Schriftsetzung wurde durch die freie Software LaTeX und deren
Autoren Leslie Lamport et. al. ermöglicht.

Glossar
=======

Fachwörter- und Begriffsverzeichnis
-----------------------------------

In diesem Kapitel werden wichtige Wörter aus der Fachsprache erklärt,
die in unserer Arbeit oftmals vorkommen.

##### A\*

Sprich “A Star”. Ein Pathfinding Algorithmus (siehe Fachbegriff
Algorithmus). Dieser nutzt zusätzlich heuristische Mittel, um den Weg zu
berechnen (siehe Heuristik).

##### Algorithmus

Ein Ablauf, Prozess oder Programm, der eine Liste mit Anweisungen
schrittweise befolgt, um Daten umzuwandeln.

##### Back-End

Der Server—mit guten Systemtechnikern rund um die Uhr stellt das
Back-End die Website unter einer URL, wie `bma.fuerbringer.info`, zur
Verfügung.

##### BestFirstFinder

Ein Pathfinding-Algorithmus. Nicht zu verwechseln mit dem
BreadthFirstFinder.

##### BreadthFirstFinder

Ein Pathfinding-Algorithmus. Nicht zu verwechseln mit dem
BreadthFirstFinder.

##### Dijkstra

Ein Pathfinding Algorithmus (siehe Fachbegriff Algorithmus). Dieser
nutzt keine heuristische Mittel und kommt in unserer Arbeit nicht direkt
vor.

##### Front-End

Der Browser—der Teil einer Website oder Webapplikation, den der Benutzer
sieht und mit dem er interagiert. In unserem Fall werden die wichtigsten
Berechnungen im Front-End verrichtet.

##### Heuristik

Hilfsalgorithmus, unter anderem für Pathfinder, der zusätzlich hilft
zwischen einzelnen Schritten die Kosten für eine mögliche Operation
einzuschätzen.

##### Matrix

Anordnung von Elementen. In unserem Fall ein zweidimensionales Raster,
in dem Wände, Korridore und Wege platziert sind.

##### Operationen

Eine “Operation” beschreibt in unserem Fall einen Zyklus eines
Pathfinders. Je mehr Zyklen ein Pathfinder in Relation zu einem anderen
benötigt, desto weniger effizient ist er.

##### Parameter

Die Randbedingungen für einen Durchlauf bzw. ein Experiment.

##### PathFinding.js

Die Zentrale Programmbibliothek, deren Pathfinder Implementationen wir
in unserer Webapplikation nutzen.

##### Pathfinder

Eine Art Algorithmus, der in einem gegebenen Raum mit eingezeichnetem
Start- und Endpunkt den schnellsten weg Findet.

##### recbacktracker

“Recursive Backtracker, ein Labyrinthalgorithmus, den wir in unserer
Webapplikation zur Generierung von perfekten (immer lösbaren)
Labyrinthen verwenden. Dieser Algorithmus kommt im Vergleicher nicht zum
Zug.

##### Pseudocode

Definiert einen Algorithmus schriftlich in einer allgemein
verständlichen Sprache, damit dieser in beliebigen Programmiersprachen
umgesetzt werden kann.

##### PHP

Eine freie serverseitige Programmiersprache, die seit über zwei
Jahrzehnten einen hohen Marktanteil hat.

##### JavaScript

Nicht zu verwechseln mit Java. Eine clientseitige Programmiersprache,
die in jedem Browser integriert ist. Sie wird hauptsächlich zwecks der
Interaktivität benutzt.

##### Implementieren/Implementation

Im Kontext der Software wird damit die Planung und Entwicklung des
Quellcodes bezeichnet.

##### Pixelmatrizen

Eine Liste mit Pixeldaten, die zum Beispiel bei
Computergrafikapplikationen gebraucht wird. Der “Inhalt” des Bildschirm
kann ganzheitlich in einer Pixelmatrix abgelegt werden.

##### Prozedural

Beschreibt programme, die schrittartig ablaufen.

##### Routine

Unter diesem Begriff kann man im Rahmen dieser Arbeit einen Teil eines
Algorithmus, einer Funktion oder einer Prozedur verstehen.

##### Unix und GNU/Linux

Betriebssysteme abstammend vom AT&T UNIX.

9 Xueqiao Xu et al., *PathFinding.js*,
<https://github.com/qiao/PathFinding.js>, Quellcode auf GitHub, Letzter
Aufruf: Xiao, Cui; Hao Shi, *A\*-based Pathfinding in Modern Computer
Games*, IJCSNS International Journal of Computer Science and Network
Security, VOL.11 No.1, Januar 2011. Fürbringer, Severin; Stoop, Adrian,
*BMA Quellcode*, <https://github.com/fuerbringer/bma>, Fürbringer,
Severin; Stoop, Adrian, *BMA-Webapplikation*,
<https://bma.fuerbringer.info>,

[1] Eine komplette Auflistung inklusive der abhängenden
Programmbibliotheken macht wenig Sinn, vor allem da unser Quellcode frei
ersichtlich ist.

[2] Express Webserver für Node Webapplikationen,
<https://expressjs.com/>, Stand:

[3] GitHub, <https://github.com/>, Stand:

[4] Vultr - The Infrastructure Cloud™, <https://vultr.com/>, Stand:

[5] Die genaue Codestelle in der Webapplikation ist hier ersichtlich:
<https://github.com/fuerbringer/bma/blob/master/src/maze.js#L8>

[6] Die genaue Codestelle in der Webapplikation ist hier ersichtlich:
<https://github.com/fuerbringer/bma/blob/master/src/maze.js#L27>

[7] Die genaue Codestelle in der Webapplikation ist hier ersichtlich:
<https://github.com/fuerbringer/bma/blob/master/src/maze.js#L27>

[8] Die genaue Codestelle in der Webapplikation ist hier ersichtlich:
<https://github.com/fuerbringer/bma/blob/master/src/helper.js#L15>

[9] Ein von PathFinding.js berechneter Weg:
<https://pathfindingjs.readthedocs.io/en/latest/user-guide/getting-started/>

[10] Diesen Prozess nennt man bei freier Software “Forking”.

[11] Die genauen Anpassungen sind unter dem folgenden Link verfügbar:
<https://github.com/fuerbringer/PathFinding.js/commit/51034158638ad7aaa9c5142a827bd4d3de2b8786#diff-22360b18a43ac33ae398e44b998101c7>

[12] Die Einheit Millisekunden ergibt sich aus der Schnittstelle
`Performance.now()` von JavaScript
