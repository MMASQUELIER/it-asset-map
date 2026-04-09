# Wiki du Projet Tutoré

## Présentation
Ce wiki documente le prototype **IT Asset Map** réalisé pour le repérage des postes informatiques en zone de production sur le site de l'Isle d'Espagnac.

Le contenu a été réorganisé en plusieurs pages pour séparer clairement :
- le contexte du projet ;
- la solution fonctionnelle ;
- l'architecture technique ;
- le modèle de données ;
- les choix techniques et les difficultés rencontrées ;
- les limites et les perspectives.

## Sommaire
1. [Contexte et objectifs](wiki/01-contexte-et-objectifs.md)
2. [Solution fonctionnelle](wiki/02-solution-fonctionnelle.md)
3. [Architecture technique](wiki/03-architecture-technique.md)
4. [Modèle de données et flux métier](wiki/04-modele-de-donnees-et-flux.md)
5. [Choix techniques et problèmes rencontrés](wiki/05-choix-techniques-et-problemes-rencontres.md)
6. [Limites, perspectives et bilan](wiki/06-limites-perspectives-et-bilan.md)

## Vue d'ensemble rapide

| Élément | Choix retenu |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Cartographie | Leaflet / React Leaflet |
| Backend | Deno + Hono |
| Données | SQLite |
| Support cartographique | Image PNG servie par l'API |

## Ce que couvre ce wiki
- le besoin métier et le périmètre retenu ;
- les fonctionnalités réellement présentes dans le prototype ;
- l'architecture frontend / backend ;
- le modèle de données et les cardinalités ;
- les flux métier importants ;
- les choix techniques et les difficultés rencontrées ;
- les limites actuelles et les pistes d'évolution.

## Conventions utilisées
- Les schémas sont cohérents avec l'implémentation réelle du dépôt.
- Les relations de données sont notées avec `1`, `0..1` et `0..n`.
- Le terme *plan* désigne l'image du site chargée dans Leaflet.

## Navigation rapide
- [Contexte et objectifs](wiki/01-contexte-et-objectifs.md)
- [Solution fonctionnelle](wiki/02-solution-fonctionnelle.md)
- [Architecture technique](wiki/03-architecture-technique.md)
- [Modèle de données et flux métier](wiki/04-modele-de-donnees-et-flux.md)
- [Choix techniques et problèmes rencontrés](wiki/05-choix-techniques-et-problemes-rencontres.md)
- [Limites, perspectives et bilan](wiki/06-limites-perspectives-et-bilan.md)
