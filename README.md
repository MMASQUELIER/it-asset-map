# it-asset-map
Projet tuteuré : 


# Sujet : Veille et prototypage d’un outil de cartographie interactive pour le repérage des postes informatiques en zone de production
 
# Contexte :  
Le site de l’Isle d’Espagnac à un fichier Excel contenant la liste de tous les postes informatiques utilisé sur le site de production, ce fichier contient différentes informations, comme l’identifiant, le nom du pc ou la zone sur lequel il est situé. Il existe également une carte avec les différentes zones du site mais ces informations ne sont pas reliées entre elle rendant le repérage des postes peu intuitif notamment pour les nouveaux arrivants
 
# Problématique : 
Comment améliorer le repérage et la consultation de ces informations relatives aux postes informatiques en reliant les données à une cartographie interactive des zones du site, tout en facilitant l’ajout, la suppression ou la modification des postes informatiques de la carte.


# Itérations : 
Phase de veille technologique : Comparatif des architectures, des méthodes d'ingestion de données Excel, et des bibliothèques graphiques de cartographie.

Itération 1 : Mise en place d'une carte statique (fond de plan de l'usine) avec affichage de points de test positionnés "en dur" dans le code

Itération 2 : Développement des fonctionnalités d'interaction sur la carte : possibilité de placer manuellement des points (clic sur la carte), d'ajouter de nouveaux marqueurs et de les supprimer.

Itération 3: Enrichissement de la consultation : affichage des détails techniques d'un PC au clic et mise en place d'une barre de recherche pour localiser un équipement spécifique.

Itération 4 : Connexion au fichier Excel source : développement pour lire le fichier, transformer les données et les stocker dans une base de données locale utilisée par l'application.
