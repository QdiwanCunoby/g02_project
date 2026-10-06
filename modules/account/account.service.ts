// Pattern Service: solo logica di dominio, nessuna logica HTTP.
// Il repository arriva via constructor injection (DI manuale).

import { randomUUID } from "node:crypto";
import { AccountRepository } from "./account.repository";
import { Account, CreateAccountDto, UpdateAccountDto } from "./account.types";

export class AccountService {
  // Parameter property: dichiara il campo, lo assegna e lo rende readonly in una riga
  constructor(private readonly repo: AccountRepository) {}

  async getAll(): Promise<Account[]> {
    return this.repo.findAll();
  }

  async getById(id: string): Promise<Account> {
    const account = await this.repo.findById(id);
    // Al G4 diventerà NotFoundError
    if (!account) throw new Error("Account non trovato: " + id);
    return account;
  }

  async create(dto: CreateAccountDto): Promise<Account> {
    if (dto.balance < 0) throw new Error("Il saldo iniziale non può essere negativo");

    const account: Account = {
      ...dto,
      id: randomUUID(),
      status: "ACTIVE",
      createdAt: new Date(),
    };
    return this.repo.save(account);
  }

  async update(id: string, dto: UpdateAccountDto): Promise<Account> {
    const existing = await this.getById(id); // lancia se non esiste
    return this.repo.save({ ...existing, ...dto, id }); // l'id non è sovrascrivibile
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new Error("Account non trovato: " + id);
  }
}
