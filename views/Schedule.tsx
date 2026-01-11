import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, User, Dog, CheckCircle2, Search, Loader2, ChevronRight, Sparkles, Home, PawPrint, LocateFixed, Map, AlertCircle } from 'lucide-react';
import { BREEDS_DB } from '../breedsData';
import { useAppConfig } from '../contexts/AppConfigContext';

interface ScheduleProps {
  onBack: () => void;
}

export const ScheduleView: React.FC<ScheduleProps> = ({ onBack }) => {
  const { config, themeHex } = useAppConfig();
  const [step, setStep] = useState(1);
  const [loadingCep, setLoadingCep] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showBreedSuggestions, setShowBreedSuggestions] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    dogName: '',
    breed: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    date: '',
    time: ''
  });

  const filteredBreeds = useMemo(() => {
    if (!formData.breed) return [];
    return BREEDS_DB.filter(b => 
      b.identificacao.nome.toLowerCase().includes(formData.breed.toLowerCase())
    ).slice(0, 5);
  }, [formData.breed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'cep') {
      const cleanVal = value.replace(/\D/g, '').slice(0, 8);
      setFormData(prev => ({ ...prev, [name]: cleanVal }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectBreed = (breedName: string) => {
    setFormData(prev => ({ ...prev, breed: breedName }));
    setShowBreedSuggestions(false);
  };

  useEffect(() => {
    if (formData.cep.length === 8) {
      fetchAddress(formData.cep);
    }
  }, [formData.cep]);

  const fetchAddress = async (cep: string) => {
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
        document.getElementById('number-input')?.focus();
      } else {
        alert("CEP não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleUseMyLocation = () => {
    setLocationFeedback(null);
    if (!navigator.geolocation) {
        setLocationFeedback({ type: 'error', message: 'Geolocalização indisponível.' });
        return;
    }
    setLocatingUser(true);
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            
            if (data && data.address) {
                const street = data.address.road || '';
                const neighborhood = data.address.suburb || data.address.neighbourhood || '';
                const city = data.address.city || data.address.town || data.address.municipality || '';
                const state = data.address.state || '';
                const postcode = data.address.postcode ? data.address.postcode.replace(/\D/g, '') : '';

                setFormData(prev => ({
                    ...prev,
                    street,
                    neighborhood,
                    city,
                    state,
                    cep: postcode,
                    number: data.address.house_number || ''
                }));
                setLocationFeedback({ type: 'success', message: 'Endereço encontrado!' });
                setTimeout(() => setLocationFeedback(null), 4000);
            } else {
                setLocationFeedback({ type: 'error', message: 'Endereço não localizado.' });
            }
        } catch (error) {
            console.error("Erro GPS", error);
            setLocationFeedback({ type: 'error', message: 'Erro de conexão.' });
        } finally {
            setLocatingUser(false);
        }
    }, () => {
        setLocatingUser(false);
        setLocationFeedback({ type: 'error', message: 'Permissão negada.' });
    }, { enableHighAccuracy: true, timeout: 8000 });
  };

  const validateStep = () => {
    if (step === 1 && (!formData.name || !formData.phone || !formData.dogName)) {
      alert("Preencha os dados básicos! 🐶");
      return false;
    }
    if (step === 2 && (!formData.street || !formData.city)) {
      alert("Precisamos do endereço! 🏡");
      return false;
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(prev => prev + 1); };
  const prevStep = () => { step === 1 ? onBack() : setStep(prev => prev - 1); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) { alert("Escolha uma data! 📅"); return; }
    const message = `Olá ${config.professionalName.split(' ')[0]}! 📅 Agendamento:\n\n👤 ${formData.name}\n🐕 ${formData.dogName} (${formData.breed})\n📍 ${formData.street}, ${formData.number}\n🗓 ${formData.date} às ${formData.time}`;
    window.open(`https://wa.me/${config.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-full animate-slide-in pb-20 relative z-50 flex flex-col h-full">
      {/* Header Compacto */}
      <div 
        className="pt-6 pb-8 px-6 rounded-b-[2rem] shadow-xl relative shrink-0 transition-all duration-500"
        style={{ background: `linear-gradient(to bottom right, ${themeHex[600]}, ${themeHex[900]})` }}
      >
        <div className="flex items-center justify-between relative z-10 max-w-5xl mx-auto w-full">
          <button onClick={prevStep} className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/20 transition active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
             <h2 className="text-xl font-bold text-white font-brand">Agendar Visita</h2>
             <p className="text-white/60 text-[10px] uppercase tracking-widest">Etapa {step} de 3</p>
          </div>
          <div className="w-9"></div> 
        </div>
        {/* Stepper */}
        <div className="flex gap-2 mt-6 justify-center max-w-xs mx-auto">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}></div>
           ))}
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-20 flex-1 flex flex-col max-w-6xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 lg:p-10 flex-1 flex flex-col lg:flex-row lg:gap-16">
          
          {/* Left Column: Form Fields */}
          <div className="flex-1 space-y-6">
            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><User size={24} /></div>
                        <div><h3 className="font-bold text-slate-800 text-lg">Seus Dados</h3><p className="text-xs text-slate-400">Para identificarmos você.</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Seu Nome</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Maria Silva" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
                            <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="(00) 00000-0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome do Cão</label>
                            <input name="dogName" value={formData.dogName} onChange={handleInputChange} placeholder="Ex: Rex" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                        </div>
                        <div className="relative space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Raça</label>
                            <input name="breed" value={formData.breed} onChange={(e) => { handleInputChange(e); setShowBreedSuggestions(true); }} onFocus={() => setShowBreedSuggestions(true)} placeholder="Busque..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                            {showBreedSuggestions && formData.breed.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 shadow-xl rounded-xl mt-1 max-h-40 overflow-y-auto z-30 custom-scroll">
                                    {filteredBreeds.map(b => (
                                        <div key={b.identificacao.id} onClick={() => selectBreed(b.identificacao.nome)} className="px-4 py-3 hover:bg-slate-50 text-sm text-slate-800 cursor-pointer border-b border-slate-50 flex items-center gap-2">
                                            <PawPrint size={12} className="text-slate-300" /> {b.identificacao.nome}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-sm"><Home size={24} /></div>
                        <div><h3 className="font-bold text-slate-800 text-lg">Local da Aula</h3><p className="text-xs text-slate-400">Onde iremos atender.</p></div>
                    </div>

                    <div className="space-y-3">
                        <button type="button" onClick={handleUseMyLocation} disabled={locatingUser} className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 border ${locatingUser ? 'bg-blue-50 border-blue-200 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'}`}>
                            {locatingUser ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
                            {locatingUser ? 'Localizando...' : 'Usar Localização Atual'}
                        </button>
                        {locationFeedback && (
                            <div className={`p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold animate-fade-in ${locationFeedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {locationFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {locationFeedback.message}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">CEP</label>
                            <div className="relative">
                                <input name="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000" maxLength={8} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold tracking-widest outline-none focus:border-green-500 transition-colors" />
                                <div className="absolute right-3 top-3.5 text-slate-400">{loadingCep ? <Loader2 size={18} className="animate-spin text-green-500"/> : <Search size={18}/>}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="col-span-3 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Endereço</label>
                                <input name="street" value={formData.street} onChange={handleInputChange} placeholder="Rua" className="w-full bg-slate-100 border-transparent rounded-xl px-4 py-3.5 text-sm font-bold outline-none" />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nº</label>
                                <input id="number-input" name="number" value={formData.number} onChange={handleInputChange} placeholder="123" className="w-full bg-white border border-slate-200 rounded-xl px-2 py-3.5 text-sm font-bold text-center outline-none focus:border-green-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="Bairro" className="bg-slate-100 border-transparent rounded-xl px-4 py-3.5 text-sm font-medium w-full outline-none" />
                            <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Cidade" className="bg-slate-100 border-transparent rounded-xl px-4 py-3.5 text-sm font-medium w-full outline-none" />
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: themeHex[500] }}><Calendar size={24} /></div>
                        <div><h3 className="font-bold text-slate-800 text-lg">Quando?</h3><p className="text-xs text-slate-400">Sugira um horário.</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Data</label>
                            <input name="date" type="date" value={formData.date} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Hora</label>
                            <input name="time" type="time" value={formData.time} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:border-purple-500 transition-colors" />
                        </div>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Sparkles size={14} className="text-yellow-500"/> Resumo</h4>
                        <div className="space-y-3 text-sm text-slate-700">
                            <p className="flex items-center gap-3"><User size={16} className="text-slate-400"/> <span className="font-bold">{formData.name}</span></p>
                            <p className="flex items-center gap-3"><Dog size={16} className="text-slate-400"/> <span className="font-bold">{formData.dogName}</span> {formData.breed && <span className="text-xs text-slate-500">({formData.breed})</span>}</p>
                            <p className="flex items-center gap-3"><MapPin size={16} className="text-slate-400"/> <span className="truncate">{formData.street}, {formData.number}</span></p>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Right Column: Desktop Summary/Action */}
          <div className="lg:w-80 lg:shrink-0 lg:border-l lg:border-slate-100 lg:pl-10 flex flex-col justify-end">
             <div className="hidden lg:flex mb-auto flex-col items-center text-center pt-10 opacity-40">
                <Map size={100} className="text-slate-300 mb-6" />
                <p className="text-sm font-bold text-slate-400 max-w-[200px]">Vamos transformar a vida do seu cão com adestramento positivo.</p>
             </div>

             <div className="pt-6 border-t border-slate-100 lg:border-0 lg:pt-0">
                {step < 3 ? (
                    <button type="button" onClick={nextStep} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2">
                        Próximo Passo <ChevronRight size={18} />
                    </button>
                ) : (
                    <button type="submit" className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-green-500/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse-slow">
                        <CheckCircle2 size={20} /> Enviar no WhatsApp
                    </button>
                )}
             </div>
          </div>

        </form>
      </div>
    </div>
  );
};