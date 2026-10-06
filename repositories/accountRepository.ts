// Pattern Repository: astrae l'accesso ai dati.
// Oggi: in-memory con array. Al Giorno 5: Prisma + PostgreSQL.
// Il Service NON cambia quando cambi implementazione.

import { Account, CreateAccountDto, AccountStatus } from "../types/account";

/** Interfaccia del Repository — il contratto che il Service usa */
export interface IAccountRepository {
  findAll(): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  findByIban(iban: string): Promise<Account | null>;
  create(dto: CreateAccountDto): Promise<Account>;
  updateBalance(id: string, newBalance: number): Promise<Account>;
}

/** Implementazione in-memory — sarà sostituita da PrismaAccountRepository al Giorno 5 */
export class InMemoryAccountRepository implements IAccountRepository {
  private accounts: Account[] = [];

  async findAll(): Promise<Account[]> {
    return [...this.accounts]; // Copia — non esporre il riferimento interno
  }

  async findById(id: string): Promise<Account | null> {
    return this.accounts.find(a => a.id === id) ?? null;
  }

  async findByIban(iban: string): Promise<Account | null> {
    return this.accounts.find(a => a.iban === iban) ?? null;
  }

  async create(dto: CreateAccountDto): Promise<Account> {
    const account: Account = {
      id: crypto.randomUUID(),
      ...dto,
      status: AccountStatus.ACTIVE,
      createdAt: new Date(),
    };
    this.accounts.push(account);
    return account;
  }

  async updateBalance(id: string, newBalance: number): Promise<Account> {
    const account = this.accounts.find(a => a.id === id);
    if (!account) throw new Error("Account non trovato: " + id);
    account.balance = newBalance;
    return { ...account };
  }
}
