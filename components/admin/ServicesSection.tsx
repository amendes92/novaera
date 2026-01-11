import React from 'react';
import { Briefcase, Plus, Edit2, Zap, ChevronDown } from 'lucide-react';
import { AppConfig } from '../../types';

interface ServicesSectionProps {
  tempConfig: AppConfig;
  expanded: boolean;
  onToggle: () => void;
  openEditor: (id?: string) => void;
  themeHex: any;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  tempConfig, expanded, onToggle, openEditor, themeHex 
}) => {
  return (
    <div className="space-y-3">
        <button 
            onClick={onToggle}
            className={`w-full flex items-center justify-between p-4 bg-white ${expanded ? 'rounded-t-2xl border-b border-slate-50' : 'rounded-2xl hover:bg-slate-50'} transition-all shadow-sm border border-slate-100 mb-2 group relative overflow-hidden`}
        >
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-500 bg-opacity-10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Briefcase size={20} className="text-orange-500" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-slate-800 text-sm block">Seus Planos</span>
                    <span className="text-[10px] text-slate-400 font-medium">Gerenciar serviços oferecidos</span>
                </div>
            </div>
            <div className={`text-slate-300 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                <ChevronDown size={20} />
            </div>
        </button>

        {expanded && (
            <div className="bg-white p-6 rounded-b-2xl border-x border-b border-slate-100 shadow-sm animate-slide-in -mt-3 pt-4 mb-4">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-xs text-slate-400">Serviços ativos no app.</p>
                    <button 
                        onClick={() => openEditor()}
                        className="text-[10px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm hover:shadow-md"
                        style={{ backgroundColor: themeHex[50], color: themeHex[600] }}
                    >
                        <Plus size={14} /> Novo Plano
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tempConfig.services.map((service) => (
                    <div 
                        key={service.id} 
                        onClick={() => openEditor(service.id)}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white transition-all cursor-pointer group hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                            <img src={service.image} alt="ico" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{service.title}</h4>
                            <div className="flex gap-2 mt-1">
                                <span className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-100 text-slate-500">{service.tag}</span>
                                {service.popular && <span className="text-[9px] font-bold text-orange-500 flex items-center gap-0.5"><Zap size={8} fill="currentColor"/> Popular</span>}
                            </div>
                        </div>
                        </div>
                        <div className="bg-white p-2.5 rounded-full border border-slate-100 text-slate-300 group-hover:text-blue-500 transition-colors">
                            <Edit2 size={16} />
                        </div>
                    </div>
                ))}
                </div>
            </div>
        )}
    </div>
  );
};