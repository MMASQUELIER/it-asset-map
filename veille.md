# Rapport de veille technologique – Choix de la solution de cartographie

**Projet :** Projet tuteure 
**Sujet :** Cartographie interactive pour la gestion d’un parc informatique (Indoor Mapping)

---

## 1. Analyse du besoin

Dans le cadre du projet, le besoin principal concerne la mise en place d’une solution de **cartographie d’intérieur (Indoor Mapping)** afin de faciliter le repérage des postes informatiques dans l'usine.  
Afin de réaliser ce projet , il va falloir respecter ces différentes contraintes.

- **Support** : plan d’usine statique (image JPG/PNG).
- **Repérage** : utilisation de coordonnées cartésiennes (X, Y en pixels).
- **Interaction** : gestion simple des interactions (clic, survol, déplacement de points,zoom,ajout/suppression de poste).
- **Rapidité** : l’application doit se lancer rapidement et être simple à utiliser.

L’objectif est d’avoir un outil visuel clair pour localiser, consulter et modifier les informations liées aux postes informatiques.

---

## 2. Comparatif des solutions étudiées

Plusieurs solutions techniques ont été analysées pour répondre à ce besoin.

| Critère | **Leaflet.js** | **MapLibre GL** | **Canvas HTML5** |
|-------|---------------|-----------------|------------------|
| **Prise en main** | Rapide, documentation claire | Plus complexe, courbe d’apprentissage élevée | Moyenne, tout est à développer |
| **Adapté à l’indoor** | Oui, via `L.CRS.Simple` | Peu adapté, orienté GPS | Possible mais sans outils intégrés |
| **Performances** | Très bonnes pour des volumes modérés | Très élevées pour de gros volumes | Dépend fortement de l’implémentation |
| **Fonctionnalités** | Plugins (drag & drop, édition) | Puissance graphique | Aucune fonctionnalité prête à l’emploi |

Le Canvas HTML5 a été étudié comme solution bas niveau, mais il nécessite de développer entièrement la navigation (zoom, déplacement, gestion des événements), ce qui augmente fortement la charge de développement.

---

## 3. Pourquoi Leaflet.js

Suite à cette étude comparative, le choix s’est porté sur **Leaflet.js** pour plusieurs raisons techniques.

### A. Gestion native des coordonnées non géographiques (`L.CRS.Simple`)

Leaflet propose le système `L.CRS.Simple`, qui permet d’utiliser une image comme fond de carte sans projection géographique.  
Cela correspond exactement au besoin du projet : positionner des postes informatiques directement sur le plan de l’usine, sans conversion artificielle en coordonnées GPS.

MapLibre GL est principalement conçu pour des usages géographiques (WebGL, styles vectoriels) et nécessite des adaptations supplémentaires pour un usage indoor basé sur des coordonnées cartésiennes.

---

### B. Architecture basée sur le DOM

Contrairement aux solutions basées sur WebGL, Leaflet utilise des éléments HTML standards (`<div>`) pour les marqueurs.

- **Avantage** : intégration simple des interactions UI (infobulles, états visuels via CSS, accessibilité).


---

### C. Un écosystème mature pour l’édition

Le projet prévoit une phase d’édition des données (déplacement, ajout et suppression de postes).  
Leaflet gère nativement le déplacement des marqueurs via l’option `draggable`, et dispose de plugins matures comme `Leaflet.Draw`.

Cela permet d’envisager facilement des évolutions futures (zones, annotations) et s’intègre bien dans les itérations prévues du projet.

---

## 4. Conclusion

Au regard des contraintes du projet *it-asset-map* — cartographie indoor, plan statique, interactions riches et simplicité de maintenance — **Leaflet.js** apparaît comme la solution la plus adaptée.  
Son approche non géographique, sa facilité d’intégration et la maturité de son écosystème permettent de répondre efficacement aux besoins tout en limitant la complexité technique et la dette future.


Dans ce projet, la solution sera implémentée à l’aide de Node.js pour la partie serveur et Leaflet.js pour la cartographie interactive côté client.