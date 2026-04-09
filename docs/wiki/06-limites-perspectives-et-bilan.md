# Limites, perspectives et bilan

[Retour au sommaire](../projet-tutore-wiki.md)

## Pistes d'amélioration
- ajouter une gestion des rôles et permissions ;
- historiser les modifications ;
- proposer des filtres avancés ;
- détecter les incohérences de données

## Limites actuelles observables dans l'implémentation
- le redimensionnement d'une zone met bien à jour l'interface, mais la réaffectation éventuelle des marqueurs impactés n'est pas encore persistée côté backend ;
- l'import Excel n'est pas industrialisé dans le dépôt actuel ;
- certaines informations de contexte projet relèvent du déroulement réel du projet et non de l'état du code seul.

**Références code :**
- redimensionnement local et commit de zone : [useInfrastructureMapState.ts](../../frontend/src/features/infrastructure-map/state/useInfrastructureMapState.ts)
- recalcul local des marqueurs : [markerAssignments.ts](../../frontend/src/features/infrastructure-map/markers/logic/interactive-markers/markerAssignments.ts)

## Bilan technique
Le prototype valide plusieurs points importants :
- la faisabilité d'une cartographie interactive basée sur un plan ;
- la pertinence d'une architecture web légère ;
- la possibilité de relier les données de parc à une représentation visuelle exploitable ;
- l'intérêt d'un stockage simple et structuré pour les positions et les zones.

## Bilan personnel
Ce projet m'a permis de travailler sur :
- l'analyse d'un besoin métier concret ;
- la conception d'une solution utile pour les utilisateurs ;
- la cartographie web ;
- une architecture full stack ;
- les arbitrages techniques ;
- la recherche d'un compromis entre simplicité et efficacité.


## Montée en compétences

Ce projet m'a permis de monter en compétences à plusieurs niveaux, aussi bien sur la méthode de travail que sur la partie technique.

D'abord, il m'a appris l'importance de bien analyser une idée avant de se lancer dans le développement. Au début, certaines pistes pouvaient sembler simples en théorie, comme le fait d'écrire directement dans un fichier Excel. En pratique, ce projet m'a montré qu'une solution apparemment évidente peut rapidement devenir difficile à maintenir, lente ou peu adaptée à un usage réel. Cette réflexion m'a permis de mieux comprendre qu'avant de développer, il faut toujours évaluer la viabilité d'une solution, ses limites, sa maintenabilité et son adéquation avec le besoin réel.

Ce travail m'a également permis de progresser dans ma manière de concevoir un projet. J'ai dû comparer plusieurs options, faire des choix techniques, revenir sur certaines idées initiales et accepter qu'une bonne solution n'est pas forcément la plus complexe ou la plus "impressionnante", mais celle qui répond le mieux au problème posé. Cela m'a fait gagner en recul sur la façon de structurer une démarche de conception, de prototypage et de prise de décision.

Sur la partie développement, ce projet m'a permis de découvrir et de mieux comprendre la cartographie web. J'ai appris à utiliser Leaflet pour afficher un plan interactif, à manipuler des coordonnées sur une image, à gérer le placement de zones et de marqueurs, et à relier une représentation visuelle à des données techniques. Cette partie m'a particulièrement fait progresser car elle m'a obligé à passer d'un besoin concret à une mise en oeuvre réellement exploitable dans l'interface.

Le projet m'a aussi permis de renforcer mes compétences en développement full stack. Côté backend, j'ai découvert l'utilisation de Deno et de Hono pour construire une API REST légère, organiser des routes, structurer une logique métier et gérer les échanges avec la base de données. Côté frontend, j'ai pu consolider ma pratique d'une application React structurée autour d'un état, d'interactions utilisateur et de composants spécialisés.

En résumé, cette expérience m'a fait progresser :
- dans l'analyse préalable d'un besoin et des contraintes d'un projet ;
- dans la comparaison et la justification de choix techniques ;
- dans la conception d'une application web full stack ;
- dans l'utilisation d'une API construite avec Deno et Hono ;
- dans la mise en place d'une cartographie web interactive avec Leaflet ;
- dans la prise de recul sur la pertinence, la simplicité et la maintenabilité d'une solution.

## Conclusion
Le prototype répond au besoin principal : mieux localiser et consulter les postes informatiques en zone de production.

Il constitue une base pour une évolution future vers un outil plus complet

[Page précédente : Choix techniques et problèmes rencontrés](./05-choix-techniques-et-problemes-rencontres.md)
