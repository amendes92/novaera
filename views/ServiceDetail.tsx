import React, { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle, Dog, Search, AlertCircle, Share2 } from 'lucide-react';
import { DogSize, ServiceDetailData } from '../types';
import { BREEDS_DB } from '../breedsData';
import { useAppConfig } from '../contexts/AppConfigContext';

interface ServiceDetailProps {
  service: ServiceDetailData;
  onBack: () => void;
}

export const ServiceDetailView: React.FC<ServiceDetailProps> = ({ service, onBack }) => {
  const { config, themeHex } = useAppConfig();
  const [dogName, setDogName] = useState('');
  const [dogSize, setDogSize] = useState<DogSize>('');
  const [breed, setBreed] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState({ name: false, size: false, breed: false });
  const nameInputRef = useRef<HTMLInputElement>(null);

  const filteredBreeds = BREEDS_DB.filter(b => 
    b.identificacao.nome.toLowerCase().includes(breed.toLowerCase())
  );

  const handleBreedSelect = (selectedBreedName: string) => {
    setBreed(selectedBreedName);
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, breed: false }));
  };

  const handleWhatsAppClick = () => {
    setErrors({ name: false, size: false, breed: false });
    let hasError = false;
    const newErrors = { name: false, size: false, breed: false };

    if (!dogName.trim()) {
        newErrors.name = true;
        hasError = true;
        nameInputRef.current?.focus();
    }
    if (!dogSize) { newErrors.size = true; hasError = true; }
    if (!breed.trim()) { newErrors.breed = true; hasError = true; }

    setErrors(newErrors);
    if (hasError) return;

    const sizeMap = { small: 'Pequeno', medium: 'Médio', large: 'Grande' };
    const text = `Olá ${config.professionalName.split(' ')[0]}! Gostaria de saber mais sobre o serviço *${service.title}*.\n\n🐶 *Meu Cão*\nNome: ${dogName}\nRaça: ${breed}\nPorte: ${sizeMap[dogSize] || 'Não informado'}`;
    window.open(`https://wa.me/${config.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="animate-slide-in bg-slate-50 min-h-full pb-20 relative z-50 md:flex md:items-center md:justify-center md:p-8 md:bg-transparent">
      
      {/* Desktop Container */}
      <div className="w-full md:max-w-6xl md:bg-white md:rounded-[2.5rem] md:shadow-2xl md:overflow-hidden md:flex md:h-[80vh] md:border border-white/50">
        
        {/* Left Side: Image & Info */}
        <div className="relative h-64 w-full md:h-full md:w-1/2 shrink-0 group">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent md:bg-gradient-to-t md:from-slate-900/90 md:via-slate-900/20"></div>
            
            <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition active:scale-95 z-20">
            <ArrowLeft size={24} />
            </button>

            <div className="absolute bottom-6 left-6 right-6 md:p-8">
            <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-3 text-white shadow-lg" style={{ backgroundColor: themeHex[500] }}>
                {service.tag}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white font-brand leading-tight mb-2 md:mb-4">{service.title}</h1>
            <p className="hidden md:block text-slate-200 text-lg font-medium max-w-md">{service.description}</p>
            </div>
        </div>

        {/* Right Side: Content & Form */}
        <div className="md:w-1/2 md:flex md:flex-col md:h-full bg-slate-50 md:bg-white">
            <div className="p-6 md:p-10 md:overflow-y-auto custom-scroll flex-1 -mt-6 md:mt-0 rounded-t-[2rem] md:rounded-none bg-slate-50 md:bg-white relative z-10">
                
                <div className="mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-3 md:mb-4">Sobre o Serviço</h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">{service.fullDescription}</p>
                    
                    <div className="bg-white md:bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-100 md:border-slate-200">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4">O que está incluso:</h3>
                        <ul className="space-y-3">
                        {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                            {benefit}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>

                <div className="mb-20 md:mb-0">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 font-brand">Perfil do Aluno</h2>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 md:border-slate-200 space-y-5">
                        <div>
                        <label className="block text-xs font-bold uppercase mb-1.5 text-slate-400">Nome do Cão {errors.name && '*'}</label>
                        <div className="relative">
                            <Dog size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                            <input 
                            ref={nameInputRef}
                            type="text"
                            value={dogName}
                            onChange={(e) => { setDogName(e.target.value); if(e.target.value) setErrors(prev => ({...prev, name: false})); }}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-700 focus:outline-none transition-colors focus:bg-white focus:border-blue-400"
                            placeholder="Ex: Thor"
                            style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                            />
                        </div>
                        </div>

                        <div>
                        <label className="block text-xs font-bold uppercase mb-2 text-slate-400">Porte {errors.size && '*'}</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[{ id: 'small', label: 'Pequeno' }, { id: 'medium', label: 'Médio' }, { id: 'large', label: 'Grande' }].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => { setDogSize(s.id as DogSize); setErrors(prev => ({...prev, size: false})); }}
                                className="py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 hover:border-slate-300"
                                style={{ 
                                    borderColor: dogSize === s.id ? themeHex[500] : (errors.size ? '#fecaca' : '#f1f5f9'),
                                    backgroundColor: dogSize === s.id ? themeHex[50] : 'transparent',
                                    color: dogSize === s.id ? themeHex[600] : '#94a3b8'
                                }}
                            >
                                <Dog size={20} />
                                <span className="text-[10px] font-bold uppercase">{s.label}</span>
                            </button>
                            ))}
                        </div>
                        </div>

                        <div className="relative">
                        <label className="block text-xs font-bold uppercase mb-1.5 text-slate-400">Raça {errors.breed && '*'}</label>
                        <div className="relative">
                            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                            <input 
                            type="text"
                            value={breed}
                            onChange={(e) => { setBreed(e.target.value); setShowSuggestions(true); if(e.target.value) setErrors(prev => ({...prev, breed: false})); }}
                            onFocus={() => setShowSuggestions(true)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-700 focus:outline-none transition-colors focus:bg-white focus:border-blue-400"
                            placeholder="Digite para buscar..."
                            style={{ borderColor: errors.breed ? '#ef4444' : undefined }}
                            />
                        </div>
                        {showSuggestions && breed.length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-40 overflow-y-auto custom-scroll">
                            {filteredBreeds.length > 0 ? filteredBreeds.map((b) => (
                                <button key={b.identificacao.id} onClick={() => handleBreedSelect(b.identificacao.nome)} className="w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3">
                                    <img src={b.imagens.img1} alt={b.identificacao.nome} className="w-8 h-8 rounded-full object-cover bg-slate-100 border border-slate-200" />
                                    <span className="font-bold">{b.identificacao.nome}</span>
                                </button>
                                )) : <div className="px-4 py-3 text-xs text-slate-400 italic text-center">Nenhuma raça encontrada.</div>}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer (Mobile) / Inline Action (Desktop) */}
            <div className="fixed md:static bottom-0 left-0 w-full bg-white md:bg-slate-50 border-t border-slate-100 md:border-0 p-4 md:p-8 z-50 sm:rounded-b-[2.5rem]">
                {service.price && (
                    <div className="text-center md:text-left mb-3 md:mb-4">
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-100 inline-block shadow-sm">Investimento: {service.price}</span>
                    </div>
                )}
                <button onClick={handleWhatsAppClick} className="w-full bg-green-500 text-white font-bold py-4 md:py-5 rounded-2xl shadow-xl shadow-green-500/30 active:scale-95 transition hover:bg-green-600 flex items-center justify-center gap-3 md:text-lg animate-pulse-slow">
                    <MessageCircle size={24} /> Consultar Disponibilidade
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};