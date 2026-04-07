const DEFAULT_ERROR_MESSAGE = "Une erreur est survenue.";

const DIRECT_MESSAGE_TRANSLATIONS = new Map<string, string>([
  ["an unexpected error occurred while saving the change.", "Impossible d'enregistrer la modification."],
  ["equipment data not found.", "Fiche equipement introuvable."],
  ["equipment not found.", "Poste introuvable."],
  ["failed to fetch", "Impossible de joindre le serveur."],
  ["networkerror when attempting to fetch resource.", "Impossible de joindre le serveur."],
  ["sector name is required.", "Le nom du secteur est requis."],
  ["sector not found.", "Secteur introuvable."],
  ["the provided sector does not exist.", "Le secteur selectionne n'existe pas."],
  ["the provided zone does not exist.", "La zone selectionnee n'existe pas."],
  ["unable to create the equipment data record.", "Impossible d'enregistrer la fiche equipement."],
  ["unable to create the equipment.", "Impossible d'ajouter le poste."],
  ["unable to create the sector.", "Impossible d'ajouter le secteur."],
  ["unable to create the zone.", "Impossible d'ajouter la zone."],
  ["unable to delete the equipment data record.", "Impossible de supprimer la fiche equipement."],
  ["unable to delete the equipment.", "Impossible de supprimer le poste."],
  ["unable to delete the sector.", "Impossible de supprimer le secteur."],
  ["unable to delete the zone.", "Impossible de supprimer la zone."],
  ["unable to load equipment data.", "Impossible de charger les fiches equipement."],
  ["unable to load equipment.", "Impossible de charger les postes."],
  ["unable to load sectors.", "Impossible de charger les secteurs."],
  ["unable to load the infrastructure map.", "Impossible de charger la carte."],
  ["unable to load the map image.", "Impossible de charger le plan."],
  ["unable to load zones.", "Impossible de charger les zones."],
  ["unable to update the equipment data record.", "Impossible de mettre a jour la fiche equipement."],
  ["unable to update the equipment.", "Impossible de mettre a jour le poste."],
  ["unable to update the sector.", "Impossible de mettre a jour le secteur."],
  ["unable to update the zone.", "Impossible de mettre a jour la zone."],
  ["zone not found.", "Zone introuvable."],
]);

export function normalizeAppErrorMessage(
  error: unknown,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
): string {
  if (typeof error === "string") {
    return normalizeErrorText(error, fallbackMessage);
  }

  if (error instanceof Error) {
    return normalizeErrorText(error.message, fallbackMessage);
  }

  return fallbackMessage;
}

export function normalizeErrorText(
  message: string | null | undefined,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
): string {
  const trimmedMessage = message?.trim();

  if (trimmedMessage === undefined || trimmedMessage.length === 0) {
    return fallbackMessage;
  }

  const directTranslation = DIRECT_MESSAGE_TRANSLATIONS.get(
    trimmedMessage.toLowerCase(),
  );

  if (directTranslation !== undefined) {
    return directTranslation;
  }

  const requestStatusMatch = trimmedMessage.match(/^Request failed with status (\d+)\.?$/i);

  if (requestStatusMatch !== null) {
    return getRequestStatusMessage(Number(requestStatusMatch[1]));
  }

  const fieldRequiredMatch = trimmedMessage.match(/^Field "(.+)" is required\.$/i);

  if (fieldRequiredMatch !== null) {
    return `Le champ "${fieldRequiredMatch[1]}" est requis.`;
  }

  const fieldStringMatch = trimmedMessage.match(/^Field "(.+)" must be a string\.$/i);

  if (fieldStringMatch !== null) {
    return `Le champ "${fieldStringMatch[1]}" doit etre un texte.`;
  }

  const fieldIntegerMatch = trimmedMessage.match(/^Field "(.+)" must be an integer\.$/i);

  if (fieldIntegerMatch !== null) {
    return `Le champ "${fieldIntegerMatch[1]}" doit etre un entier.`;
  }

  const fieldStringOrNullMatch = trimmedMessage.match(
    /^Field "(.+)" must be a string or null\.$/i,
  );

  if (fieldStringOrNullMatch !== null) {
    return `Le champ "${fieldStringOrNullMatch[1]}" doit etre un texte ou vide.`;
  }

  const routeParamRequiredMatch = trimmedMessage.match(
    /^Route parameter "(.+)" is required\.$/i,
  );

  if (routeParamRequiredMatch !== null) {
    return `Le parametre "${routeParamRequiredMatch[1]}" est requis.`;
  }

  const routeParamIntegerMatch = trimmedMessage.match(
    /^Route parameter "(.+)" must be a positive integer\.$/i,
  );

  if (routeParamIntegerMatch !== null) {
    return `Le parametre "${routeParamIntegerMatch[1]}" doit etre un entier positif.`;
  }

  return trimmedMessage;
}

function getRequestStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return "La requete est invalide.";
    case 404:
      return "Ressource introuvable.";
    case 409:
      return "Une donnee existe deja avec cette valeur.";
    case 500:
      return "Le serveur a rencontre une erreur.";
    default:
      return `La requete a echoue (${status}).`;
  }
}
