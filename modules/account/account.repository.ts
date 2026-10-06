// Pattern Repository: astrae l'accesso ai dati.
// Oggi: in-memory con Map. Al G5: Prisma + PostgreSQL, senza toccare il service.

import { Account } from "./account.types";

/** Contratto che il service usa — non sa nulla di come i dati sono salvati */
export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
  findAll(): Promise<Account[]>;
  /** Inserisce o aggiorna (upsert) in base all'id */
  save(account: Account): Promise<Account>;
  /** true se il conto esisteva ed è stato rimosso */
  delete(id: string): Promise<boolean>;
}

/**
 * Implementazione in-memory.
 * La Map è sincrona, ma i metodi sono async per simulare l'I/O del DB del G5:
 * così il service è già scritto con await e non cambierà.
 */
export class InMemoryAccountRepository implements AccountRepository {
  private readonly accounts = new Map<string, Account>();

  async findById(id: string): Promise<Account | null> {
    const account = this.accounts.get(id);
    return account ? { ...account } : null; // copia: non esporre il riferimento interno
  }

  async findAll(): Promise<Account[]> {
    return [...this.accounts.values()].map(a => ({ ...a }));
  }

  async save(account: Account): Promise<Account> {
    this.accounts.set(account.id, { ...account });
    return { ...account };
  }

  async delete(id: string): Promise<boolean> {
    return this.accounts.delete(id);
  }
}
