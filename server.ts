// Entry point: per ora verifica solo che il wiring del composition root compili e funzioni.

import { app, repo, service } from "./app";
import { Account } from "./modules/account/account.types";

async function main() {
  console.log("app:", app);
  console.log("service:", service);

  // ─── Esercizio 5 (temporaneo): Promise.all con tipo esplicito ───
  // Se il tipo inferito non fosse una tupla [Account | null, Account | null], tsc darebbe errore.
  const result: [Account | null, Account | null] = await Promise.all([
    repo.findById("a"),
    repo.findById("b"),
  ]);
  console.log("Promise.all findById('a'), findById('b'):", result);

  // ─── Smoke test del service ───
  const created = await service.create({
    iban: "IT60X0542811101000000123456",
    balance: 1000,
    type: "CHECKING",
    ownerId: "owner-001",
  });
  console.log("creato:", created);

  const updated = await service.update(created.id, { balance: 1500, status: "BLOCKED" });
  console.log("aggiornato:", updated);

  console.log("tutti:", await service.getAll());

  await service.delete(created.id);
  try {
    await service.getById(created.id);
  } catch (error) {
    console.log("dopo delete →", (error as Error).message);
  }
}

main().catch(console.error);
