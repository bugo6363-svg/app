import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserPlusIcon, EditIcon, TrashIcon, LoaderIcon } from '../components/Icons';

export default function App() {
  const [heroes, setHeroes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHero, setCurrentHero] = useState(null);
  const [formData, setFormData] = useState({ name: '', power: '' });
  const [heroToDelete, setHeroToDelete] = useState(null);

  useEffect(() => {
    const loadHeroes = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const data = await api.getHeroes();
        setHeroes(data);
      } catch (err) {
        setError('Falha ao carregar os heróis. A dimensão pode estar instável.');
      } finally {
        setIsLoading(false);
      }
    };
    loadHeroes();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentHero(null);
    setFormData({ name: '', power: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.power) {
      alert('O nome e o poder do herói não podem ser vazios.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        const updatedHero = await api.updateHero({ ...currentHero, ...formData });
        setHeroes(heroes.map(h => (h.id === updatedHero.id ? updatedHero : h)));
      } else {
        const newHero = await api.addHero(formData);
        setHeroes([...heroes, newHero]);
      }
      resetForm();
    } catch (err) {
      setError('Falha ao salvar o herói. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEdit = (hero) => {
    setIsEditing(true);
    setCurrentHero(hero);
    setFormData({ name: hero.name, power: hero.power });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (hero) => {
      setHeroToDelete(hero);
  };
  
  const handleDelete = async () => {
    if (!heroToDelete) return;
    await api.deleteHero(heroToDelete.id);
    setHeroes(heroes.filter(h => h.id !== heroToDelete.id));
    setHeroToDelete(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-2">Panteão de Heróis</h1>
          <p className="text-lg text-gray-400">Registe, atualize e administre os seus campeões.</p>
        </header>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 text-center">{error}</div>}

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-12 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-cyan-300">
            <UserPlusIcon />
            {isEditing ? 'Atualizar Herói' : 'Registar Novo Herói'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 mb-2">Nome de Código</label>
              <input 
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                placeholder="Ex: Trovão Sónico"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="power" className="block text-gray-300 mb-2">Poder Principal</label>
              <input
                type="text"
                id="power"
                name="power"
                value={formData.power}
                onChange={handleFormChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                placeholder="Ex: Manipulação do som"
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <button type="submit" disabled={isSubmitting} className="flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting && <LoaderIcon />}
                {isEditing ? 'Salvar Alterações' : 'Adicionar Herói'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition">
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8">
            <h2 className="text-3xl font-bold mb-6 text-cyan-300 border-b-2 border-gray-700 pb-2">Heróis Registados</h2>
            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <LoaderIcon />
                    <p className="text-lg text-gray-400">A consultar os arquivos cósmicos...</p>
                </div>
            ) : heroes.length === 0 ? (
                <div className="text-center bg-gray-800 border border-gray-700 p-8 rounded-lg">
                    <p className="text-lg text-gray-400">Nenhum herói foi registado ainda. O universo aguarda os seus campeões.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {heroes.map(hero => (
                        <div key={hero.id} className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500">
                            <div>
                                <h3 className="text-xl font-bold text-cyan-400">{hero.name}</h3>
                                <p className="text-gray-300 mt-2">{hero.power}</p>
                            </div>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                                <button onClick={() => handleEdit(hero)} className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition" aria-label={`Editar ${hero.name}`}>
                                    <EditIcon />
                                </button>
                                <button onClick={() => confirmDelete(hero)} className="p-2 rounded-full text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition" aria-label={`Apagar ${hero.name}`}>
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {heroToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-sm w-full shadow-2xl">
                    <h3 className="text-2xl font-bold text-red-400 mb-4">Confirmar Ação</h3>
                    <p className="text-gray-300 mb-6">Tem a certeza que deseja remover <strong className="font-bold text-white">{heroToDelete.name}</strong> dos registos? Esta ação é irreversível.</p>
                    <div className="flex justify-end gap-4">
                        <button onClick={() => setHeroToDelete(null)} className="py-2 px-5 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition">
                            Cancelar
                        </button>
                        <button onClick={handleDelete} className="py-2 px-5 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition">
                            Sim, Apagar
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}