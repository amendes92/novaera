import React, { useState } from 'react';
import { MapPin, Navigation, Star, Search, Filter, Trees, Stethoscope, Store, Map as MapIcon, Share2, CheckCircle2, Info, ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';
import { LocationData } from '../types';

export const LocationsView: React.FC = () => {
  const { config, themeHex } = useAppConfig();
  const [activeFilter, setActiveFilter] = useState<'all' | 'park' | 'vet' | 'shop'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  
  const locations = config.locations || [];

  const filteredLocations = locations.filter(loc => {
    const matchesFilter = activeFilter === 'all' || loc.type === activeFilter;
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          loc.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'park': return <Trees size={16} />;
      case 'vet': return <Stethoscope size={16} />;
      case 'shop': return <Store size={16} />;
      default: return <MapIcon size={16} />;
    }
  };

  const openMapExternal = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const handleShare = (loc: LocationData) => {
    // Construct a valid HTTPS Google Maps URL. 
    // This avoids "Invalid URL" errors that can occur with window.location.href in some environments.
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + " " + loc.address)}`;

    if (navigator.share) {
        navigator.share({
            title: loc.name,
            text: `Recomendação: ${loc.name} - ${loc.address}`,
            url: mapLink
        }).catch((err) => {
            console.error("Share failed:", err);
            // Fallback to clipboard if native share fails
            navigator.clipboard.writeText(`${loc.name} - ${loc.address}\n${mapLink}`);
            alert("Link copiado para a área de transferência!");
        });
    } else {
        // Fallback for browsers without Web Share API
        navigator.clipboard.writeText(`${loc.name} - ${loc.address}\n${mapLink}`);
        alert("Link copiado!");
    }
  };

  // Maps URL generation
  const mapUrl = selectedLocation 
    ? `https://maps.google.com/maps?q=${encodeURIComponent(selectedLocation.name + " " + selectedLocation.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(config.locationText)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-slate-50 h-[calc(100vh-80px)] md:h-screen flex flex-col lg:flex-row overflow-hidden animate-fade-in">
      
      {/* SIDEBAR LIST */}
      <div className="flex-1 lg:w-[450px] lg:max-w-[450px] lg:flex-none flex flex-col border-r border-slate-200 bg-white h-full z-10 shadow-xl relative">
        <div className="p-6 pb-2 border-b border-slate-100 bg-white z-20">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900 font-brand">Guia Local</h2>
                <p className="text-xs text-slate-500 font-medium">Lugares aprovados pelo seu adestrador.</p>
            </div>
            <div className="relative mb-4">
                <div className="bg-slate-50 rounded-xl flex items-center p-1 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <div className="p-3 text-slate-400"><Search size={18} /></div>
                    <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-transparent text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none" />
                </div>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[
                    { id: 'all', label: 'Todos', icon: Filter },
                    { id: 'park', label: 'Parques', icon: Trees },
                    { id: 'vet', label: 'Saúde', icon: Stethoscope },
                    { id: 'shop', label: 'Lojas', icon: Store },
                ].map(cat => (
                    <button key={cat.id} onClick={() => setActiveFilter(cat.id as any)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${activeFilter === cat.id ? 'text-white border-transparent shadow-md transform scale-105' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`} style={{ backgroundColor: activeFilter === cat.id ? themeHex[500] : undefined }}>
                        <cat.icon size={12} /> {cat.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {filteredLocations.length > 0 ? filteredLocations.map(loc => (
                <div key={loc.id} onClick={() => setSelectedLocation(loc)} className={`bg-white rounded-xl p-3 border transition-all cursor-pointer group hover:shadow-md flex gap-3 ${selectedLocation?.id === loc.id ? 'border-blue-500 ring-1 ring-blue-500 shadow-md scale-[1.02]' : 'border-slate-100 hover:border-blue-200'}`}>
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-slate-200">
                        <img src={loc.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-0.5">
                            <h3 className="font-bold text-slate-800 text-sm truncate pr-2 group-hover:text-blue-600 transition-colors">{loc.name}</h3>
                            {loc.rating && <span className="flex items-center gap-0.5 text-[10px] font-bold bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded"><Star size={8} fill="currentColor" /> {loc.rating}</span>}
                        </div>
                        <p className="text-[10px] text-slate-500 mb-1.5 line-clamp-1 flex items-center gap-1"><MapPin size={10} /> {loc.address}</p>
                        <div className="flex items-center gap-2 mt-auto">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 ${loc.type === 'park' ? 'bg-green-50 text-green-700 border-green-100' : loc.type === 'vet' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                {getIcon(loc.type)} {loc.typeName}
                            </span>
                            <div className="ml-auto flex items-center gap-1">
                                <button onClick={(e) => { e.stopPropagation(); handleShare(loc); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Share2 size={14} /></button>
                                <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">Ver <ChevronRight size={10} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-10 opacity-50"><MapIcon size={40} className="mx-auto mb-2 text-slate-300" /><p className="text-sm font-bold text-slate-400">Nenhum local encontrado.</p></div>
            )}
        </div>
      </div>

      {/* MAP AREA */}
      <div className="hidden lg:block lg:flex-1 relative bg-slate-200 h-full overflow-hidden">
        <iframe key={selectedLocation ? `map-${selectedLocation.id}` : 'map-default'} src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" title="Mapa" className="w-full h-full grayscale-[10%] hover:grayscale-0 transition-all duration-700" />
        
        {selectedLocation && (
            <div className="absolute top-6 right-6 w-80 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20 animate-slide-in z-20">
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedLocation.name}</h2>
                    <button onClick={() => setSelectedLocation(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{selectedLocation.fullDescription || selectedLocation.description}</p>
                <div className="flex gap-2">
                    <button onClick={() => openMapExternal(selectedLocation.address)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"><Navigation size={16} /> Ir agora</button>
                </div>
            </div>
        )}
      </div>

      {/* MOBILE MODAL */}
      {selectedLocation && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end animate-fade-in p-0 sm:items-center sm:justify-center sm:p-4">
            <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-auto sm:rounded-3xl rounded-t-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slide-in-up">
                <div className="h-48 w-full relative shrink-0">
                    <img src={selectedLocation.image} alt={selectedLocation.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <button onClick={() => setSelectedLocation(null)} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white border border-white/20"><ArrowLeft size={20} /></button>
                    <div className="absolute bottom-4 left-6 text-white">
                        <span className="text-[10px] font-bold bg-blue-600 px-2 py-0.5 rounded mb-2 inline-block uppercase tracking-wider">{selectedLocation.typeName}</span>
                        <h2 className="text-2xl font-bold leading-none">{selectedLocation.name}</h2>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                    <div className="flex gap-2 mb-6">
                        <button onClick={() => openMapExternal(selectedLocation.address)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition"><Navigation size={18} /> Navegar</button>
                        <button onClick={() => handleShare(selectedLocation)} className="w-12 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition"><Share2 size={20} /></button>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-4">
                        <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><Info size={16} className="text-blue-500" /> Sobre</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{selectedLocation.fullDescription || selectedLocation.description}</p>
                    </div>
                    {selectedLocation.features && (
                        <div>
                            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-2">Comodidades</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedLocation.features.map((f, i) => (
                                    <span key={i} className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1"><CheckCircle2 size={10} className="text-green-500" /> {f}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};