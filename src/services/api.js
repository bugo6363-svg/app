// --- DADOS MOCK (Simulação do "Banco de Diverti") ---
const initialHeroes = [
    { id: 1, name: 'Capitão Cometa', power: 'Voar à velocidade da luz' },
    { id: 2, name: 'Doutora Dimensão', power: 'Manipulação de portais interdimensionais' },
    { id: 3, name: 'Gigante Gentil', power: 'Super-força e invulnerabilidade' },
];

// --- SIMULAÇÃO DA API (Backend) ---
// Funções que simulam chamadas de rede com um atraso artificial.
export const api = {
  getHeroes: () => new Promise(resolve => setTimeout(() => resolve([...initialHeroes]), 800)),
  addHero: (hero) => new Promise(resolve => {
    const newHero = { ...hero, id: Date.now() };
    initialHeroes.push(newHero);
    setTimeout(() => resolve(newHero), 500);
  }),
  updateHero: (updatedHero) => new Promise(resolve => {
    const index = initialHeroes.findIndex(h => h.id === updatedHero.id);
    if (index !== -1) {
      initialHeroes[index] = updatedHero;
    }
    setTimeout(() => resolve(updatedHero), 500);
  }),
  deleteHero: (id) => new Promise(resolve => {
    const index = initialHeroes.findIndex(h => h.id === id);
    if (index !== -1) {
      initialHeroes.splice(index, 1);
    }
    setTimeout(() => resolve({ id }), 500);
  }),
};
