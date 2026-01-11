import React, { useState } from 'react';
import { Map, Plus, Search, Loader2, ExternalLink, Trash2 } from 'lucide-react';
import { AppConfig, LocationData } from '../../types';
import { GoogleGenAI } from "@google/genai";

interface LocationsSectionProps {
  tempConfig: AppConfig;
  setTempConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  setSaved: (saved: boolean) => void;
  expanded: boolean;
  onToggle: () => void;
  locationText: string;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  tempConfig, setTempConfig, setSaved, expanded, onToggle, locationText
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [guideTab, setGuideTab] = useState<'list' | 'search'>('list');

  const handleMapSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Encontre 10 empresas ou locais reais no Google Maps relacionados a: "${searchQuery}" na cidade de "${locationText}". Retorne apenas locais que realmente existem no mapa.`,
            config: {
                tools: [{ googleMaps: {} }],
            }
        });

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        if (chunks && chunks.length > 0) {
            const newLocations: LocationData[] = [];
            const q = searchQuery.toLowerCase();
            
            const determineType = (title: string): { type: any, typeName: string, image: string } => {
                const t = title.toLowerCase();
                if (t.includes('parque') || t.includes('praça') || q.includes('parque')) 
                    return { type: 'park', typeName: 'Lazer', image: 'https://images.unsplash.com/photo-1596464716127-f9a0859b0437?auto=format&fit=crop&q=80&w=300&h=200' };
                if (t.includes('vet') || t.includes('clínica') || t.includes('hospital') || q.includes('vet')) 
                    return { type: 'vet', typeName: 'Saúde', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300&h=200' };
                if (t.includes('pet') || t.includes('shop') || t.includes('banho') || q.includes('pet')) 
                    return { type: 'shop', typeName: 'Pet Shop', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=300&h=200' };
                return { type: 'other', typeName: 'Local', image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=300&h=200' };
            };

            chunks.forEach((chunk: any, index: number) => {
                const title = chunk.web?.title || chunk.retrievedContext?.title;
                const uri = chunk.web?.uri || chunk.retrievedContext?.uri;
                
                if (title && !newLocations.find(l => l.name === title)) {
                    const info = determineType(title);
                    newLocations.push({
                        id: Date.now() + index,
                        name: title,
                        type: info.type,
                        typeName: info.typeName,
                        address: uri ? 'Endereço disponível no mapa' : 'Endereço sob consulta',
                        description: `Resultado encontrado via Google Maps.`,
                        fullDescription: `Este local foi encontrado através da busca inteligente do Google Maps. Importado para o guia local do adestrador.`,
                        image: info.image,
                        openHours: 'Consultar',
                        website: uri
                    });
                }
            });
            
            if (newLocations.length === 0) {
                 alert("O Google Maps encontrou informações, mas não conseguiu estruturar os locais. Tente buscar algo mais específico.");
            } else {
                setSearchResults(newLocations);
            }
        } else {
            alert("Nenhum local específico encontrado no mapa. Tente adicionar o nome do bairro ou cidade na busca.");
        }
    } catch (error) {
        console.error("Erro na busca de locais:", error);
        alert("Erro de conexão. Verifique sua chave de API ou internet.");
    } finally {
        setIsSearching(false);
    }
  };

  const importLocation = (loc: LocationData) => {
    if (tempConfig.locations.some(existing => existing.name === loc.name)) {
        alert("Este local já está no seu guia!");
        return;
    }
    const newLocs = [...tempConfig.locations, loc];
    setTempConfig(prev => ({ ...prev, locations: newLocs }));
    setSaved(false);
    
    setSearchResults(prev => prev.filter(p => p.id !== loc.id));
    if (window.confirm(`"${loc.name}" importado! Deseja ver sua lista agora?`)) {
        setGuideTab('list');
    }
  };

  const removeLocation = (id: number | string) => {
    if(window.confirm("Remover este local do guia?")) {
        const newLocs = tempConfig.locations.filter(l => l.id !== id);
        setTempConfig(prev => ({ ...prev, locations: newLocs }));
        setSaved(false);
    }
  };

  return (
    <div className="space-y-3">
        <button 
            onClick={onToggle}
            className={`w-full flex items-center justify-between p-4 bg-white ${expanded ? 'rounded-t-2xl border-b border-slate-50' : 'rounded-2xl hover:bg-slate-50'} transition-all shadow-sm border border-slate-100 mb-2 group relative overflow-hidden`}
        >
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 bg-opacity-10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Map size={20} className="text-indigo-500" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-slate-800 text-sm block">Guia Local</span>
                    <span className="text-[10px] text-slate-400 font-medium">Importar empresas do Google Maps</span>
                </div>
            </div>
        </button>

        {expanded && (
            <div className="bg-white p-6 rounded-b-2xl border-x border-b border-slate-100 shadow-sm animate-slide-in -mt-3 pt-4 mb-4">
                
                <div className="flex gap-2 mb-4 bg-slate-50 p-1 rounded-xl">
                    <button onClick={() => setGuideTab('list')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${guideTab === 'list' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Meus Locais ({tempConfig.locations.length})</button>
                    <button onClick={() => setGuideTab('search')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${guideTab === 'search' ? 'bg-indigo-600 shadow text-white' : 'text-slate-400 hover:text-slate-600'}`}><Plus size={14} /> Maps (Importar)</button>
                </div>

                {guideTab === 'search' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="relative flex gap-2">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()} placeholder="Ex: Veterinários perto de mim..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" />
                            </div>
                            <button onClick={handleMapSearch} disabled={isSearching} className="px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors font-bold text-xs flex items-center gap-2">{isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Buscar</button>
                        </div>
                        
                        <div className="space-y-3 mt-4">
                            {searchResults.map(loc => (
                                <div key={loc.id} className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all group animate-slide-in">
                                    <div className="w-full md:w-16 h-32 md:h-16 rounded-lg bg-slate-100 shrink-0 overflow-hidden relative">
                                        <img src={loc.image} alt="loc" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 truncate">{loc.name}</h4>
                                        <p className="text-xs text-slate-500 mb-2">{loc.address}</p>
                                        {loc.website && <a href={loc.website} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-500 hover:underline flex items-center gap-1 font-bold"><ExternalLink size={10}/> Maps</a>}
                                    </div>
                                    <button onClick={() => importLocation(loc)} className="w-full md:w-auto py-2.5 px-4 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-lg active:scale-95 text-xs font-bold flex items-center justify-center gap-2"><Plus size={14} /> Importar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {guideTab === 'list' && (
                    <div className="space-y-3 animate-fade-in">
                        {tempConfig.locations.length > 0 ? tempConfig.locations.map(loc => (
                            <div key={loc.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0"><img src={loc.image} alt={loc.name} className="w-full h-full object-cover" /></div>
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-slate-800 truncate pr-2">{loc.name}</h4>
                                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{loc.typeName}</span>
                                    </div>
                                </div>
                                <button onClick={() => removeLocation(loc.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                            </div>
                        )) : <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200"><p className="text-xs font-bold text-slate-400">Guia vazio.</p></div>}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};