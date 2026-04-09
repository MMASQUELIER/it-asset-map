# Modèle de données et flux métier

[Retour au sommaire](../projet-tutore-wiki.md)

## Tables principales
- `sectors` : secteurs fonctionnels et leur couleur.
- `zones` : zones rectangulaires dessinées sur le plan.
- `equipment_data` : fiches techniques des postes.
- `equipment` : positions des postes sur le plan.

**Référence code :**
- [schema.sql](../../backend/db/schema.sql)

## Schéma relationnel
```mermaid
erDiagram
  SECTORS ||--o{ ZONES : "1 -> 0..n"
  ZONES o{--o| EQUIPMENT : "0..n <- 0..1"
  EQUIPMENT_DATA o|--|| EQUIPMENT : "0..1 -> 1"

  SECTORS {
    INTEGER id PK
    TEXT name UK
    TEXT color
  }

  ZONES {
    INTEGER id PK
    INTEGER sector_id FK
    TEXT code UK
    TEXT name
    INTEGER x_min
    INTEGER y_min
    INTEGER x_max
    INTEGER y_max
  }

  EQUIPMENT_DATA {
    INTEGER id PK
    TEXT hostname
    TEXT ip_address
    TEXT serial_number
    TEXT switch_name
    TEXT floor_location
    TEXT sector
    TEXT prodsheet
  }

  EQUIPMENT {
    TEXT id PK
    INTEGER equipment_data_id FK
    INTEGER x
    INTEGER y
    INTEGER zone_id FK
  }
```

## Contraintes importantes
- `zones.code` est unique et doit respecter un format numérique à trois chiffres.
- Les bornes d'une zone doivent vérifier `x_min < x_max` et `y_min < y_max`.
- `equipment.zone_id` est nullable : une fiche peut exister sans être placée.
- `equipment.equipment_data_id` est unique : une fiche technique ne peut avoir qu'une seule position active.

**Références code :**
- [schema.sql](../../backend/db/schema.sql)
- [zones/validation.ts](../../backend/src/features/infrastructure-map/zones/validation.ts)

## Flux : création ou déplacement d'un marqueur
```mermaid
flowchart TD
  A[Création ou mise à jour d'un marqueur] --> B{zone_id renseigné ?}
  B -- non --> C[Enregistrer x et y]
  B -- oui --> D[Charger la zone et son secteur]
  D --> E[Comparer le secteur de la zone et la localisation résolue de la fiche]
  E -- cohérent --> F[Enregistrer le marqueur]
  F --> G[Resynchroniser prodsheet et localisation dans equipment_data]
  E -- incohérent --> H[Refuser l'opération]
```

**Références code :**
- création et déplacement côté frontend : [useInfrastructureMapState.ts](../../frontend/src/features/infrastructure-map/state/useInfrastructureMapState.ts), [markerMovement.ts](../../frontend/src/features/infrastructure-map/markers/logic/interactive-markers/markerMovement.ts)
- contrôle de compatibilité et resynchronisation côté backend : [equipment/helpers.ts](../../backend/src/features/infrastructure-map/equipment/helpers.ts), [equipment/service.ts](../../backend/src/features/infrastructure-map/equipment/service.ts)

## Flux : mises à jour avec effet de bord
```mermaid
flowchart TD
  A[Modification d'une zone] --> B{Code ou secteur modifié ?}
  B -- oui --> C[Mettre à jour prodsheet et localisation des équipements de la zone]
  B -- non --> D[Aucune resynchronisation métier]
  E[Renommage d'un secteur] --> F[Mettre à jour la localisation des équipements rattachés au secteur]
```

**Références code :**
- mise à jour de zone : [zones/service.ts](../../backend/src/features/infrastructure-map/zones/service.ts)
- mise à jour de secteur : [sectors/service.ts](../../backend/src/features/infrastructure-map/sectors/service.ts)
- resynchronisation locale des marqueurs lors d'une modification de zone : [infrastructureMapState.helpers.ts](../../frontend/src/features/infrastructure-map/state/infrastructureMapState.helpers.ts)


[Page précédente : Architecture technique](./03-architecture-technique.md)  
[Page suivante : Choix techniques et problèmes rencontrés](./05-choix-techniques-et-problemes-rencontres.md)
