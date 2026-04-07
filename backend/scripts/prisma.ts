import { runPrismaCommand } from "@/db/prismaCli.ts";

await runPrismaCommand(Deno.args);
