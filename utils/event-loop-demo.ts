// Quiz event loop — eseguire con: npx tsx src/utils/event-loop-demo.ts
// Output atteso: 1, 5, 4, 3, 2

console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
process.nextTick(() => console.log("4"));
console.log("5");

/*
 * Perché questo ordine:
 *
 * 1 e 5 → codice sincrono. Viene eseguito subito, dall'alto in basso, sullo stack.
 *         setTimeout, .then e nextTick si limitano a REGISTRARE una callback in una coda,
 *         che verrà eseguita solo quando lo stack sincrono si è svuotato.
 *
 * 4     → process.nextTick. Finito il codice sincrono, Node svuota PRIMA la coda di nextTick
 *         (priorità più alta di tutte, è specifica di Node, non fa parte delle Promise).
 *
 * 3     → microtask (callback di Promise .then / await). Viene eseguita subito dopo la coda
 *         di nextTick, sempre prima che l'event loop passi alla fase successiva.
 *
 * 2     → macrotask (setTimeout, anche con 0 ms). Gira nella fase "timers" del giro
 *         successivo dell'event loop, quindi dopo che nextTick e microtask sono stati svuotati.
 *
 * Riassunto delle priorità:
 *   codice sincrono  >  process.nextTick  >  microtask (Promise)  >  macrotask (setTimeout, I/O)
 *
 * Nota: dopo OGNI macrotask Node svuota di nuovo nextTick e microtask, ecco perché un ciclo
 * infinito di nextTick o di Promise può "affamare" timer e I/O.
 *
 * ⚠️ Attenzione a come lo esegui (verificato con Node 22 + tsx 4):
 *   - node su CommonJS  (npx tsc && node dist/utils/event-loop-demo.js)  → 1, 5, 4, 3, 2
 *   - npx tsx / ES Modules                                              → 1, 5, 3, 4, 2
 * tsx (come gli ES Modules) valuta il modulo DENTRO una Promise: il codice sincrono gira già
 * mentre Node sta svuotando la coda dei microtask, quindi il .then (3) appena accodato viene
 * eseguito in quello stesso giro, prima che Node torni a processare la coda di nextTick (4).
 * La regola "nextTick prima delle Promise" vale quando si parte da uno stack vuoto
 * (script CommonJS, callback di timer o di I/O); il setTimeout (2) resta comunque ultimo.
 */
