// Pattern Service: contiene la business logic.
// Riceve il Repository via constructor injection (DI).
// Stessa architettura di @Service in Spring Boot.

import { Account, CreateAccountDto } from "../types/account";
import { IAccountRepository } from "../repositories/accountRepository";

export class AccountService {
  // private readonly: la dipendenza è immutabile e accessibile solo internamente
  constructor(private readonly repository: IAccountRepository) {}

  async getAllAccounts(): Promise<Account[]> {
    return this.repository.findAll();
  }

  async getAccountById(id: string): Promise<Account> {
    const account = await this.repository.findById(id);
    if (!account) throw new Error("Account con id " + id + " non trovato");
    return account;
  }

  async createAccount(dto: CreateAccountDto): Promise<Account> {
    // Business rule: saldo iniziale non negativo
    if (dto.balance < 0) throw new Error("Il saldo iniziale non può essere negativo");
    // Business rule: IBAN univoco
    const existing = await this.repository.findByIban(dto.iban);
    if (existing) throw new Error("IBAN " + dto.iban + " già registrato");
    return this.repository.create(dto);
  }

  /**
   * Trasferimento tra due conti (bonifico).
   * ⚠️ Questa implementazione NON è atomica — al Giorno 5 useremo Prisma $transaction.
   */
  async transfer(fromId: string, toId: string, amount: number): Promise<void> {
    if (amount <= 0) throw new Error("L'importo deve essere positivo");
    if (fromId === toId) throw new Error("Il conto di origine e destinazione devono essere diversi");

    const fromAccount = await this.getAccountById(fromId);
    const toAccount = await this.getAccountById(toId);

    if (fromAccount.balance < amount) {
      throw new Error("Saldo insufficiente: disponibile " + fromAccount.balance + " EUR, richiesto " + amount + " EUR");
    }

    await this.repository.updateBalance(fromId, fromAccount.balance - amount);
    await this.repository.updateBalance(toId, toAccount.balance + amount);
  }
}
