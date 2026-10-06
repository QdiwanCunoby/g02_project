// Tipi di dominio del modulo Account.

export type AccountType = "CHECKING" | "SAVINGS" | "BUSINESS";
export type AccountStatus = "ACTIVE" | "BLOCKED" | "CLOSED";

export interface Account {
  id: string;
  iban: string;
  balance: number; // al G5 diventerà Decimal
  type: AccountType;
  status: AccountStatus;
  ownerId: string;
  createdAt: Date;
}

/** Dati richiesti per aprire un conto: id, status e createdAt li genera il service */
export type CreateAccountDto = Omit<Account, "id" | "status" | "createdAt">;

/** Campi modificabili di un conto: iban, ownerId, id e createdAt sono immutabili */
export type UpdateAccountDto = Partial<Pick<Account, "balance" | "type" | "status">>;
