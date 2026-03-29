/**
 * @file map.service.ts
 * @brief Lecture du fichier image de la carte.
 */

/**
 * @brief Lit le fichier image de la carte.
 * @param mapFilePath Chemin absolu du fichier image.
 * @returns Contenu binaire du fichier image.
 */
export async function readMapFile(mapFilePath: string) {
  return await Deno.readFile(mapFilePath);
}
