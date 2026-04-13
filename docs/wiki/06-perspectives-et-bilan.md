# Perspectives et bilan

[Retour au sommaire](../projet-tutore-wiki.md)

## Pistes d'amelioration
- ajouter une gestion des roles et permissions ;
- historiser les modifications ;
- proposer des filtres avances ;

## Bilan technique
Le prototype valide plusieurs points importants :
- la faisabilite d'une cartographie interactive basee sur un plan ;
- la pertinence d'une architecture web legere ;
- la possibilite de relier les donnees de parc a une representation visuelle exploitable ;
- l'interet d'un stockage simple et structure pour les positions et les zones.

## Bilan personnel
Ce projet m'a permis de travailler sur :
- l'analyse d'un besoin metier concret ;
- la conception d'une solution utile pour les utilisateurs ;
- la cartographie web ;
- une architecture full stack ;
- les arbitrages techniques ;
- la recherche d'un compromis entre simplicite et efficacite.

## Montee en competences
Ce projet m'a permis de monter en competences a plusieurs niveaux, aussi bien sur la methode de travail que sur la partie technique.

D'abord, il m'a appris l'importance de bien analyser une idee avant de se lancer dans le developpement. Au debut, certaines pistes pouvaient sembler simples en theorie, comme le fait d'ecrire directement dans un fichier Excel. En pratique, ce projet m'a montre qu'une solution apparemment evidente peut rapidement devenir difficile a maintenir, lente ou peu adaptee a un usage reel.

Ce travail m'a egalement permis de progresser dans ma maniere de concevoir un projet. J'ai du comparer plusieurs options, faire des choix techniques et accepter qu'une bonne solution n'est pas forcement la plus complexe ou la plus "impressionnante", mais celle qui repond le mieux au probleme.

Dans ce projet, cela s'est verifiee de facon tres concrete. Il aurait ete possible de choisir une base de donnees plus sophistiquee ou un framework plus ambitieux pour rendre la solution plus impressionnante sur le papier. Pourtant, cela n'aurait pas forcement rendu le prototype meilleur. Le besoin principal etait de localiser des postes sur un plan, de gerer des zones et de relier ces elements a des donnees techniques.

Par exemple, Leaflet etait suffisant pour afficher une image du site, placer des marqueurs et dessiner des zones. Il n'etait pas necessaire de partir sur une solution de cartographie plus complexe puisque le projet ne reposait pas sur de la cartographie geographique avancee. De la meme maniere, SQLite a finalement ete plus pertinent qu'une solution plus lourde avec ORM ou base plus complexe, car les donnees changent peu, le volume reste modeste et le besoin principal etait d'avoir un stockage fiable, lisible et facile a integrer au prototype.

Sur la partie developpement, ce projet m'a permis de decouvrir et de mieux comprendre la cartographie web. J'ai appris a utiliser Leaflet pour afficher un plan interactif, a manipuler des coordonnees sur une image, a gerer le placement de zones et de marqueurs, et a relier une representation visuelle a des donnees techniques.

En resume, cette experience m'a fait progresser :
- dans l'analyse prealable d'un besoin et des contraintes d'un projet ;
- dans la comparaison et la justification de choix techniques ;
- dans la conception d'une application web full stack ;
- dans l'utilisation d'une API construite avec Deno et Hono ;
- dans la mise en place d'une cartographie web interactive avec Leaflet ;
- dans la prise de recul sur la pertinence et la simplicite


[Page precedente : Choix techniques et problemes rencontres](./05-choix-techniques-et-problemes-rencontres.md)
