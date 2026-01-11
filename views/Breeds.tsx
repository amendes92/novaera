import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, Ruler, HeartPulse, Shield, Home, Sparkles, Activity, AlertTriangle, Filter, X, Globe, MapPin, Weight, ArrowUpDown, Wind } from 'lucide-react';
import { BreedData } from '../types';
import { BREEDS_DB } from '../breedsData';
import { useAppConfig } from '../contexts/AppConfigContext';

type FilterType = 'all' | 'apartment' | 'beginner' | 'guard' | 'family';

export const BreedsView: React.FC = () => {
  const { themeHex } = useAppConfig();
  const [selectedBreed, setSelectedBreed] = useState<BreedData | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedBreed) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedBreed]);

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'apartment', label: 'Apartamento', icon: <Home size={12} /> },
    { id: 'beginner', label: 'Iniciantes', icon: <Sparkles size={12} /> },
    { id: 'guard', label: 'Guarda', icon: <Shield size={12} /> },
    { id: 'family', label: 'Família', icon: <HeartPulse size={12} /> },
  ];

  const filteredBreeds = useMemo(() => {
    return BREEDS_DB.filter(b => {
      const matchesSearch = b.identificacao.nome.toLowerCase().includes(search.toLowerCase());
      let matchesFilter = true;
      switch (activeFilter) {
        case 'apartment': matchesFilter = b.convivencia.apartamento === 'Sim'; break;
        case 'beginner': matchesFilter = b.convivencia.nivelExperiencia === 'Iniciante'; break;
        case 'guard': matchesFilter = b.estatisticas.guarda >= 4; break;
        case 'family': matchesFilter = b.estatisticas.afeto >= 4 && b.estatisticas.energia < 5; break;
        default: matchesFilter = true;
      }
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <div className="p-6 h-full flex flex-col animate-fade-in bg-slate-50 relative min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 font-brand">Guia de Raças</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-xl">Enciclopédia canina completa.</p>
      </div>

      <div className="space-y-4 mb-8 sticky top-0 bg-slate-50/95 backdrop-blur-sm z-30 pt-2 pb-4 -mx-6 px-6 border-b border-slate-100 transition-all shadow-sm">
        <div className="relative max-w-2xl mx-auto md:mx-0">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar raça (ex: Pug...)"
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"><X size={18} /></button>}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border hover:shadow-md active:scale-95"
              style={{
                backgroundColor: activeFilter === filter.id ? themeHex[500] : 'white',
                color: activeFilter === filter.id ? 'white' : '#64748b',
                borderColor: activeFilter === filter.id ? themeHex[500] : '#e2e8f0'
              }}
            >
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
        {filteredBreeds.map((breed) => (
          <button
            key={breed.identificacao.id}
            onClick={() => setSelectedBreed(breed)}
            className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center active:scale-95 transition-all duration-300 group h-full hover:border-slate-300 hover:shadow-xl hover:-translate-y-2"
          >
            <div className="w-full aspect-square rounded-2xl overflow-hidden mb-3 relative bg-slate-100 shadow-inner">
                <img src={breed.imagens.img1 || 'https://placehold.co/400x400?text=Dog'} alt={breed.identificacao.nome} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-lg shadow-sm border border-white/50">{breed.identificacao.bandeira}</div>
            </div>
            <div className="w-full text-left px-1">
              <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 transition-colors group-hover:text-blue-600">{breed.identificacao.nome}</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase truncate flex items-center gap-1 bg-slate-50 px-2 py-1 rounded w-fit"><MapPin size={10} /> {breed.identificacao.origem}</span>
            </div>
          </button>
        ))}
        
        {filteredBreeds.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 opacity-60">
                <Filter size={64} className="mb-6" />
                <p className="text-lg font-medium">Nenhuma raça encontrada.</p>
                <button onClick={() => {setSearch(''); setActiveFilter('all');}} className="mt-4 text-sm font-bold hover:underline" style={{ color: themeHex[500] }}>Limpar filtros</button>
            </div>
        )}
      </div>

      {/* DETAIL MODAL OVERLAY */}
      {selectedBreed && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-0 md:p-8 animate-fade-in overflow-hidden">
            <div className="bg-slate-50 w-full h-full md:max-w-5xl md:max-h-[90vh] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-y-auto custom-scroll relative animate-slide-in-up">
                
                {/* Close Button */}
                <button onClick={() => setSelectedBreed(null)} className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 rounded-full text-white transition-all shadow-lg border border-white/10 md:bg-white md:text-slate-800 md:hover:bg-slate-100">
                    <X size={24} />
                </button>

                {/* Header Image */}
                <div className="relative h-72 md:h-80 w-full shrink-0">
                    <img src={selectedBreed.imagens.img1} alt={selectedBreed.identificacao.nome} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    <button onClick={() => setSelectedBreed(null)} className="md:hidden absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white border border-white/10"><ChevronLeft size={24} /></button>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-1 w-fit mb-2">
                            <Globe size={12} /> {selectedBreed.identificacao.origem}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold font-brand leading-none mb-2">{selectedBreed.identificacao.nome}</h1>
                        <p className="text-slate-300 italic text-sm md:text-base opacity-90">"{selectedBreed.identificacao.slogan}"</p>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-10 space-y-8 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                <Sparkles className="absolute -top-4 -right-4 text-white/10 w-32 h-32 group-hover:rotate-12 transition-transform" />
                                <h3 className="font-bold text-indigo-100 text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Sparkles size={14}/> Curiosidade</h3>
                                <p className="text-sm md:text-base font-medium leading-relaxed relative z-10">{selectedBreed.identificacao.fatoCurioso}</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Ruler size={16} className="text-blue-500" /> Físico</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Altura', val: selectedBreed.fisico.altura, icon: ArrowUpDown },
                                        { label: 'Peso', val: selectedBreed.fisico.peso, icon: Weight },
                                        { label: 'Vida', val: selectedBreed.fisico.expectativaVida, icon: HeartPulse },
                                        { label: 'Pelo', val: `Queda ${selectedBreed.fisico.quedaPelo}/5`, icon: Wind }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-2 text-slate-400 mb-1"><stat.icon size={14} /><span className="text-[10px] font-bold uppercase">{stat.label}</span></div>
                                            <span className="text-sm font-bold text-slate-800">{stat.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Activity size={16} className="text-green-500" /> Temperamento</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Energia', val: selectedBreed.estatisticas.energia, color: 'bg-yellow-500' },
                                        { label: 'Inteligência', val: selectedBreed.estatisticas.inteligencia, color: 'bg-blue-500' },
                                        { label: 'Afeto', val: selectedBreed.estatisticas.afeto, color: 'bg-red-500' },
                                        { label: 'Guarda', val: selectedBreed.estatisticas.guarda, color: 'bg-slate-600' }
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between mb-1"><span className="text-xs font-bold text-slate-600">{stat.label}</span><span className="text-xs font-bold text-slate-400">{stat.val}/5</span></div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${stat.color} transition-all duration-1000 ease-out`} style={{ width: `${(stat.val / 5) * 100}%` }}></div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                                <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><AlertTriangle size={16} /> Atenção</h3>
                                <p className="text-sm text-orange-900/80 leading-relaxed font-medium">{selectedBreed.convivencia.problemasComportamento}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};