Berufsmaturitätsarbeit
======================

Arbeit eingereicht: 01. Februar 2019

Präsentation vorgetragen: 05. März 2019

Note: 5.5

## Beschreibung

Demo: [Link](https://bma.fuerbringer.info).

Auszug aus der Projektbeschreibung:

Algorithmen sind Abläufe welche in Einzelschritten Daten in einer nützlichen Weise umwandeln. Darunter gibt es die Pathfinder. Diese Algorithmen erarbeiten mittels einer gegebenen zweidimensionalen Matrix oder einem Labyrinth mit einem Start- und Endpunkt den kürzesten bzw. schnellsten Weg zwischen den zwei Punkten. Praktisch kommen diese in verschiedensten Anwendungen vor, wie zum Beispiel in Computernetzwerken, Video Spielen und selbstfahrenden Fahrzeugen.

Um zu demonstrieren welche Pathfinder es gibt und wie sie funktionieren entwickeln wir eine interaktive Webanwendung (Website). Als Basis dient eine bestehende frei verfügbare Webapplikation. Deren Pathfinder binden wir in unserer Webanwendung ein. (Xueqiao Xu: PathFinding.JS Visual Demos https://qiao.github.io/PathFinding.js/visual/). In unserer Webanwendung lassen sich gleich wie im Basisprodukt visuell dargestellt Labyrinthe mit verschiedenen Pathfinder Algorithmen lösen, wobei die Labyrinthe automatisch generiert werden und man sie nicht selber einzeichnen muss. ~~Unsere Webanwendung verbessert die Basis indem sie erklärt, wie die Algorithmen funktionieren.~~ Verschiedene Pathfinder lassen sich zudem vegleichen, indem sie gleichzeitig ein Labyrinth lösen. Die dabei entstandenen Abweichungen lassen sich durch die verschieden gelösten Wege ablesen. In der Webanwendung stehen dazu auch vorgefertigte Fallbeispiele zur Verfügung, welche diese Abweichungen direkt veranschaulichen.

Unser Endprodukt wird in Javascript programmiert und die fertigen Pathfinding Algorithmen von PathFinding.js eingebunden. Sowohl das Produkt als Website als auch der Quellcode wird frei verfügbar sein.

Installation
------------

### Umgebung

Folgendes muss installiert sein:

-   NodeJS runtime ([Link](https://nodejs.org/))

### Ausführung

1.  Schritt 1 ─ Herunterladen

    Repo klonen:
    `git clone --recursive https://github.com/fuerbringer/bma.git`

    Oder ausserhalb von Entwicklungszwecken als ZIP:
    [Link](https://github.com/fuerbringer/bma/archive/master.zip)

2.  Schritt 2 ─ Vorbereitung

    Im Terminal in das geklonte directory navigieren und Dependencies
    installieren: `npm install`

3.  Schritt 3 ─ Ausführung

    Nun kann die Webapplikation ausgeführt werden: `npm start`

    Die Seite ist lokal unter <http://localhost:3000> aufrufbar.

Entwicklung
-----------

### Dokumentation

Zum bestehenden Code steht unter [/docs](https://bma.fuerbringer/docs) eine automatisch aus Kommentaren generierte Dokumentation zur Verfügung.

### Git

1.  Alle Schritte aus `Ausführung` oben erledigen.
2.  Für das zu entwickelnde Feature / den Bugfix / etc. einen neuen
    Branch erstellen (`git checkout -b feature123`).
3.  Änderungen durchführen und hinzufügen mittels `git add ...` und
    `git commit -m ...`.
4.  Änderungen zu GitHub pushen (`git push -u origin feature123`)
5.  Auf github.com ein Pull Request erstellen.
