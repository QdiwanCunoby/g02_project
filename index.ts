// Entry point Giorno 2 — test asincroni con Service e Repository
import { InMemoryAccountRepository } from "./repositories/accountRepository";
import { AccountService } from "./services/accountService";
import { AccountType } from "./types/account";
import { config } from "./config/env";

async function main() {
  console.log("🏦 LipariBank Digital Channels — Giorno 2");
  console.log("Environment:", config.nodeEnv, "— Port:", config.port);
  console.log();

  // ─── Wiring delle dipendenze (manual DI) ───
  const repository = new InMemoryAccountRepository();
  const service = new AccountService(repository);

  // ─── Creazione conti ───
  const conto1 = await service.createAccount({
    iban: "IT60X0542811101000000123456",
    holderName: "Mario Rossi",
    balance: 10000,
    accountType: AccountType.CHECKING,
    customerId: "cust-001",
  });

  const conto2 = await service.createAccount({
    iban: "IT60X0542811101000000789012",
    holderName: "Laura Bianchi",
    balance: 5000,
    accountType: AccountType.SAVINGS,
    customerId: "cust-002",
  });

  console.log("Conti creati:");
  console.log("  " + conto1.holderName + ": " + conto1.balance + " EUR");
  console.log("  " + conto2.holderName + ": " + conto2.balance + " EUR");

  // ─── Bonifico: Promise.all per verificare i saldi in parallelo ───
  console.log("\nEseguo bonifico di 2.500 EUR...");
  await service.transfer(conto1.id, conto2.id, 2500);

  const [updated1, updated2] = await Promise.all([
    service.getAccountById(conto1.id),
    service.getAccountById(conto2.id),
  ]);

  console.log("Dopo il bonifico:");
  console.log("  " + updated1.holderName + ": " + updated1.balance + " EUR");
  console.log("  " + updated2.holderName + ": " + updated2.balance + " EUR");

  // ─── Test gestione errori ───
  console.log("\nTest errore: saldo insufficiente...");
  try {
    await service.transfer(conto1.id, conto2.id, 999999);
  } catch (error) {
    console.log("  ✅ Errore gestito: " + (error as Error).message);
  }

  console.log("\nTest errore: stesso conto...");
  try {
    await service.transfer(conto1.id, conto1.id, 100);
  } catch (error) {
    console.log("  ✅ Errore gestito: " + (error as Error).message);
  }

  console.log("\nTutti i conti:");
  const all = await service.getAllAccounts();
  all.forEach(a => console.log("  " + a.iban + " — " + a.holderName + " — " + a.balance + " EUR"));
}

main().catch(console.error);
