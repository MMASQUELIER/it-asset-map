export async function readMapFile(mapFilePath: string): Promise<Uint8Array> {
  return await Deno.readFile(mapFilePath);
}
