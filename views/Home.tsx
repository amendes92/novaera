import React, { useState } from 'react';
import { Star, Clock, ChevronRight, Calendar, HelpCircle, Loader2, Link as LinkIcon, Search, MapPin, CheckCircle2 } from 'lucide-react';
import { Tab } from '../types';
import { useAppConfig } from '../contexts/AppConfigContext';
import { GoogleGenAI } from "@google/genai";

interface HomeProps {
  onNavigate: (tab: Tab) => void;
  onServiceSelect: (id: string) => void;
}

export const HomeView: React.FC<HomeProps> = ({ onNavigate, onServiceSelect }) => {
  const { config, themeHex } = useAppConfig();
  const featuredServices = config.services || [];

  // Search Grounding State
  const [askQuery, setAskQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [askSources, setAskSources] = useState<any[]>([]);
  
  // Location Check State
  const [checkingLoc, setCheckingLoc] = useState(false);
  const [locStatus, setLocStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;
    
    setIsAsking(true);
    setAskAnswer(null);
    setAskSources([]);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Responda de forma concisa e útil para um dono de cachorro: ${askQuery}`,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        setAskAnswer(response.text || "Desculpe, não consegui encontrar uma resposta no momento.");
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
            setAskSources(chunks);
        }

    } catch (error) {
        console.error("Erro no Search Grounding:", error);
        setAskAnswer("Ocorreu um erro ao buscar a resposta. Verifique sua conexão.");
    } finally {
        setIsAsking(false);
    }
  };

  const handleCheckLocation = () => {
      setCheckingLoc(true);
      if (!navigator.geolocation) {
          alert("Navegador não suporta geolocalização");
          setCheckingLoc(false);
          return;
      }
      
      navigator.geolocation.getCurrentPosition(() => {
          // Simulate a check logic
          setTimeout(() => {
              setLocStatus('success');
              setCheckingLoc(false);
          }, 1500);
      }, (err) => {
          console.error(err);
          setLocStatus('fail');
          setCheckingLoc(false);
      });
  };

  return (
    <div className="animate-fade-in pb-6">
      
      {/* Hero Section Responsive */}
      <div className="relative w-full h-auto min-h-[400px] md:min-h-[550px] rounded-b-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl mb-12 group flex flex-col-reverse md:flex-row bg-slate-900">
        
        {/* Desktop Image Side (Right) */}
        <div className="md:absolute md:right-0 md:top-0 md:w-3/5 md:h-full h-72 relative">
            <img
            alt="Capa Principal"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            src={config.heroImage}
            />
            {/* Gradient Overlay for Desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-slate-900/60 md:to-slate-900"></div>
        </div>

        {/* Content Side (Left) */}
        <div className="relative z-10 flex flex-col justify-center p-8 md:p-20 md:w-1/2 md:min-h-[550px]">
          <div className="max-w-xl">
            {/* Badge de Urgência */}
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 backdrop-blur-md text-green-400 text-[10px] md:text-xs font-bold px-4 py-2 rounded-full w-fit mb-6 animate-fade-in shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                AGENDA ABERTA
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 font-brand">
                {config.slogan} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">hoje</span>.
            </h1>
            <p className="text-slate-400 text-sm md:text-lg mb-10 font-medium leading-relaxed max-w-md">
                Agende sua visita com {config.professionalName} e transforme a convivência com seu melhor amigo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:max-w-md">
                <button
                onClick={() => onNavigate('schedule')}
                className="flex-1 text-white font-bold py-4 px-8 rounded-2xl active:scale-95 transition flex items-center justify-center gap-3 hover:brightness-110 shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:-translate-y-1 duration-300"
                style={{ backgroundColor: themeHex[600] }}
                >
                <Calendar size={20} />
                Agendar Visita
                </button>
                <button
                onClick={handleCheckLocation}
                disabled={locStatus === 'success'}
                className={`bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold py-4 px-6 rounded-2xl active:scale-95 transition flex items-center justify-center gap-2 hover:bg-white/10 ${locStatus === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : ''}`}
                >
                    {checkingLoc ? <Loader2 size={20} className="animate-spin" /> : 
                     locStatus === 'success' ? <CheckCircle2 size={20} /> : <MapPin size={20} />}
                    {checkingLoc ? 'Verificando...' : locStatus === 'success' ? 'Região Atendida!' : 'Verificar Cobertura'}
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 md:px-0">
        
        {/* Coluna Esquerda: Status e AI Assistant */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Faixa de Escassez/Status */}
            <div className="bg-white p-6 rounded-3xl flex items-center justify-between shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3.5 rounded-2xl">
                    <Clock size={24} className="text-green-600"/>
                </div>
                <div>
                    <span className="block text-sm font-bold text-slate-800">Próxima Vaga</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Terça-feira, 14:00</span>
                </div>
                </div>
                <button onClick={() => onNavigate('schedule')} className="text-xs font-bold px-4 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors" style={{ color: themeHex[600] }}>
                Reservar
                </button>
            </div>

            {/* Smart Assistant Widget (Search Grounding) */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-xl shadow-indigo-200 text-white border border-indigo-500/30 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <HelpCircle size={100} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <HelpCircle size={20} className="text-yellow-300" />
                        </div>
                        <h3 className="font-bold text-lg">Dúvidas Rápidas?</h3>
                    </div>
                    <form onSubmit={handleAskAI} className="relative mb-4">
                        <input 
                            type="text"
                            value={askQuery}
                            onChange={(e) => setAskQuery(e.target.value)}
                            placeholder="Ex: Cães podem comer uva?"
                            className="w-full bg-white/10 border border-white/20 rounded-2xl pl-5 pr-12 py-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all shadow-inner"
                        />
                        <button 
                            type="submit"
                            disabled={isAsking}
                            className="absolute right-2 top-2 p-2 bg-white text-purple-700 rounded-xl hover:bg-slate-100 disabled:opacity-70 transition-colors shadow-sm"
                        >
                            {isAsking ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                        </button>
                    </form>
                    {askAnswer && (
                        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 animate-fade-in">
                            <p className="text-xs leading-relaxed text-slate-100 mb-3 font-medium">{askAnswer}</p>
                            {askSources.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                                    {askSources.slice(0, 2).map((src, i) => (
                                        <a key={i} href={src.web?.uri} target="_blank" rel="noreferrer" className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-bold text-white/80">
                                            <LinkIcon size={10} /> Fonte
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Social Proof Compacto */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="flex -space-x-4">
                    {[1, 2, 3].map((i) => (
                    <img
                        key={i}
                        alt="Cliente"
                        className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm bg-slate-200"
                        src={`https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img${i}.png`}
                    />
                    ))}
                </div>
                <div className="text-left">
                    <div className="flex text-yellow-400 text-xs gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-sm text-slate-600 font-bold">+500 Famílias Felizes</p>
                </div>
            </div>
        </div>

        {/* Coluna Direita: Lista de Serviços */}
        <div className="lg:col-span-8 xl:col-span-9">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 font-brand">Escolha seu Plano</h2>
            <button
                onClick={() => onNavigate('services')}
                className="text-sm font-bold hover:text-slate-600 uppercase tracking-wide transition-opacity hover:opacity-80 flex items-center gap-1"
                style={{ color: themeHex[600] }}
            >
                Ver tudo <ChevronRight size={16} />
            </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredServices.map((service) => {
                const isPopular = service.popular; 
                
                return (
                <div
                    key={service.id}
                    onClick={() => onServiceSelect(service.id)}
                    className="p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row items-center md:items-start gap-5 active:scale-95 transition-all cursor-pointer group relative overflow-hidden hover:shadow-xl hover:-translate-y-2 duration-300"
                    style={{ 
                        backgroundColor: isPopular ? themeHex[50] : '#ffffff',
                        borderColor: isPopular ? themeHex[200] : '#f1f5f9'
                    }}
                >
                    <div className={`w-full md:w-24 h-40 md:h-24 rounded-2xl overflow-hidden shrink-0 z-10 shadow-sm ${isPopular ? 'bg-white' : 'bg-slate-100'}`}>
                    <img
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={service.image}
                    />
                    </div>
                    <div className="flex-1 min-w-0 z-10 w-full">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900 text-lg md:text-base leading-tight truncate pr-2">{service.title}</h3>
                        {isPopular && (
                            <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-full shadow-sm" style={{ backgroundColor: themeHex[500] }}>
                                POPULAR
                            </span>
                        )}
                    </div>
                    <p className="text-sm md:text-xs text-slate-500 mb-4 line-clamp-2 font-medium">{service.description}</p>
                    <div className="flex items-center gap-2 mt-auto">
                        <span 
                                className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors flex-1 text-center"
                                style={{ 
                                    color: isPopular ? themeHex[700] : '#2563eb',
                                    backgroundColor: isPopular ? '#ffffff80' : '#eff6ff',
                                    border: isPopular ? `1px solid ${themeHex[200]}` : 'none'
                                }}
                        >
                            {isPopular ? 'Consultar Agenda' : 'Saiba Mais'}
                        </span>
                        {service.price && (
                            <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg">
                                {service.price}
                            </span>
                        )}
                    </div>
                    </div>
                    {!isPopular && (
                    <div className="hidden md:block absolute top-4 right-4 text-slate-300 group-hover:translate-x-1 transition-transform">
                        <ChevronRight size={20} />
                    </div>
                    )}
                </div>
                );
            })}
            </div>
        </div>
      </div>

    </div>
  );
};