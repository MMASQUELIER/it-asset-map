export async function readMapFile(
  mapFilePath: string,
): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await Deno.readFile(mapFilePath));
}
