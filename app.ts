// Composition root: l'unico punto in cui le dipendenze vengono istanziate e collegate.
// Il resto del codice riceve le dipendenze dal costruttore e non usa mai `new` sui collaboratori.

import { InMemoryAccountRepository } from "./modules/account/account.repository";
import { AccountService } from "./modules/account/account.service";

const repo = new InMemoryAccountRepository();
const service = new AccountService(repo);

// Per ora è un oggetto vuoto: dal G3 diventerà l'app HTTP
export const app = {};

export { repo, service };
