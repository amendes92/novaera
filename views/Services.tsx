import React from 'react';
import { ArrowRight, Check, Star, Video, Home, Shield, Zap, Sparkles, CalendarCheck, PawPrint } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';

interface ServicesProps {
  onServiceSelect: (id: string) => void;
}

export const ServicesView: React.FC<ServicesProps> = ({ onServiceSelect }) => {
  const { config, themeHex } = useAppConfig();
  const services = config.services;

  const getIcon = (tag: string) => {
    if (tag.includes('FILHOTES')) return <Sparkles size={18} />;
    if (tag.includes('POPULAR')) return <Zap size={18} />;
    if (tag.includes('REABILITAÇÃO')) return <Shield size={18} />;
    if (tag.includes('ONLINE')) return <Video size={18} />;
    return <PawPrint size={18} />;
  };

  return (
    <div className="bg-slate-50 min-h-full pb-24 animate-fade-in">
      
      {/* Header Moderno (Themed) */}
      <div 
        className="pt-8 pb-16 px-8 rounded-b-[2.5rem] md:rounded-[3rem] relative overflow-hidden shadow-xl mb-12"
        style={{ 
            background: `linear-gradient(to bottom right, ${themeHex[600]}, ${themeHex[900]})`
        }}
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Home size={180} className="text-white transform rotate-12 translate-x-8 -translate-y-4" />
        </div>
        
        <div className="relative z-10 md:text-center md:max-w-3xl md:mx-auto">
          <div className="flex items-center gap-2 mb-3 md:justify-center">
             <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5 border border-white/10 shadow-sm">
               <CalendarCheck size={12} /> Agenda Aberta
             </span>
             <div className="flex text-yellow-400 drop-shadow-sm">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
             </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-brand mb-4 md:mb-6 tracking-tight drop-shadow-md">Transforme a vida do seu cão</h2>
          <p className="text-white/90 text-sm md:text-lg font-medium leading-relaxed">
            Escolha o pacote ideal e garanta seu horário. Todos os planos incluem suporte via WhatsApp e metodologia positiva.
          </p>
        </div>
      </div>

      {/* Lista de Serviços - Grid Responsivo */}
      <div className="px-5 md:px-0 space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 md:gap-8 -mt-10 relative z-20 md:max-w-7xl md:mx-auto">
        {services.map((service, idx) => (
          <div 
            key={service.id}
            onClick={() => onServiceSelect(service.id)}
            className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 group relative border h-full flex flex-col"
            style={{ 
                borderColor: service.popular ? themeHex[500] : '#f1f5f9',
                boxShadow: service.popular ? `0 15px 30px -10px ${themeHex[500]}30` : '0 10px 20px -5px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Tag Badge */}
            <div 
                className="absolute top-4 right-4 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-wide transform group-hover:scale-105 transition-transform"
                style={{ 
                    backgroundColor: service.popular ? themeHex[500] : (service.tagColor === 'purple' ? '#9333ea' : service.tagColor === 'green' ? '#16a34a' : '#1e293b')
                }}
            >
              {service.tag}
            </div>

            {/* Image Area */}
            <div className="h-48 md:h-56 relative overflow-hidden bg-slate-100">
               <img 
                 src={service.image} 
                 alt={service.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
               <div className="absolute bottom-5 left-6 right-6 text-white flex items-end justify-between">
                  <div>
                    <h3 className="font-bold text-xl md:text-2xl leading-none mb-2 drop-shadow-md">{service.title}</h3>
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
                            {getIcon(service.tag)}
                        </div>
                        <p className="text-xs text-slate-200 font-bold bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">{service.duration}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col bg-white">
              <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium line-clamp-3">
                {service.description}
              </p>
              
              {/* Features Checklist */}
              {service.benefits && service.benefits.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100 flex-1">
                   <ul className="space-y-3">
                      {service.benefits.slice(0, 3).map((benefit, i) => (
                         <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                            <div className="bg-green-100 text-green-600 rounded-full p-0.5 shrink-0 shadow-sm">
                               <Check size={12} strokeWidth={4} />
                            </div>
                            <span className="truncate">{benefit}</span>
                         </li>
                      ))}
                   </ul>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-slate-50">
                  {service.price && (
                      <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Investimento</span>
                          <span className="text-sm font-bold text-green-600">{service.price}</span>
                      </div>
                  )}
                  <button 
                    className="flex-1 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 ml-auto"
                    style={{ 
                        backgroundColor: service.popular ? themeHex[500] : '#0f172a',
                        color: 'white',
                        boxShadow: service.popular ? `0 4px 10px -2px ${themeHex[500]}50` : '0 4px 6px -1px rgba(15, 23, 42, 0.1)'
                    }}
                  >
                    Ver Detalhes
                    <ArrowRight size={14} />
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-6 mt-16 mb-4 text-center">
         <div className="rounded-3xl p-8 border max-w-2xl mx-auto shadow-sm" style={{ backgroundColor: themeHex[50], borderColor: themeHex[100] }}>
            <p className="text-lg font-bold mb-3" style={{ color: themeHex[800] }}>Ainda com dúvidas?</p>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">Faça nosso diagnóstico gratuito e descubra qual plano se encaixa melhor na rotina do seu cão.</p>
            <button 
               onClick={() => {
                 const nav = document.querySelector('nav button:nth-child(3)') as HTMLButtonElement; 
                 if(nav) nav.click();
               }}
               className="bg-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
               style={{ color: themeHex[600] }}
            >
               Fazer Diagnóstico Agora
            </button>
         </div>
      </div>

    </div>
  );
};