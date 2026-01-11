import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Layout, ChevronRight, Crown, TrendingUp, Activity, Lock, Grid, PawPrint, Loader2, Zap, Smartphone, User } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';
import { AppConfig, ServiceDetailData, Tab } from '../types';
import { ServiceEditorView } from './ServiceEditor';
import { ProfileSection } from '../components/admin/ProfileSection';
import { ServicesSection } from '../components/admin/ServicesSection';
import { LocationsSection } from '../components/admin/LocationsSection';

interface AdminProps {
  onNavigate: (tab: Tab) => void;
}

export const AdminView: React.FC<AdminProps> = ({ onNavigate }) => {
  const { config, updateConfig, resetConfig, themeHex } = useAppConfig();
  
  const [setupName, setSetupName] = useState('');
  const [setupPhone, setSetupPhone] = useState('');
  const [setupStep, setSetupStep] = useState<'form' | 'processing'>('form');
  const [loadingMsg, setLoadingMsg] = useState('Iniciando sistema...');

  const [tempConfig, setTempConfig] = useState<AppConfig>(config);
  const [saved, setSaved] = useState(false);
  
  const [viewMode, setViewMode] = useState<'dashboard' | 'editor'>('dashboard');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const openEditor = (serviceId?: string) => {
    setEditingServiceId(serviceId || null);
    setViewMode('editor');
  };

  const closeEditor = () => {
    setViewMode('dashboard');
    setEditingServiceId(null);
  };

  const handleSaveService = (updatedService: ServiceDetailData) => {
    const newServices = tempConfig.services.map(s => s.id === updatedService.id ? updatedService : s);
    if (!tempConfig.services.find(s => s.id === updatedService.id)) {
        newServices.push(updatedService);
    }
    const newConfig = { ...tempConfig, services: newServices };
    setTempConfig(newConfig);
    updateConfig(newConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    closeEditor();
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este plano permanentemente?")) {
      const newConfig = {
        ...tempConfig,
        services: tempConfig.services.filter(s => s.id !== id)
      };
      setTempConfig(newConfig);
      updateConfig(newConfig);
      setSaved(false);
      closeEditor();
    }
  };

  const handleGlobalSave = () => {
    updateConfig(tempConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Setup Logic
  const handleStartSetup = () => {
    if(!setupName || !setupPhone) { alert("Por favor, preencha seu nome e WhatsApp."); return; }
    setSetupStep('processing');
  };

  useEffect(() => {
    if (setupStep === 'processing') {
        let i = 0;
        const messages = ["Conectando...", "Criando perfil...", `Configurando ${setupName}...`, "Finalizando..."];
        const interval = setInterval(() => {
            if (i < messages.length) { setLoadingMsg(messages[i]); i++; } 
            else {
                clearInterval(interval);
                const updates = { professionalName: setupName, phone: setupPhone.replace(/\D/g, ''), isOnboarded: true };
                updateConfig(updates);
                setTempConfig(prev => ({ ...prev, ...updates }));
            }
        }, 800);
        return () => clearInterval(interval);
    }
  }, [setupStep]);

  if (!config.isOnboarded) {
    if (setupStep === 'form') {
        return (
            <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
                <div className="w-full max-w-sm relative z-10 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="relative mx-auto w-24 h-24 mb-6">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-[2rem] rotate-6 opacity-50 blur-md"></div>
                            <div className="relative bg-gradient-to-tr from-blue-600 to-purple-700 rounded-[2rem] w-full h-full flex items-center justify-center shadow-2xl border border-white/10"><PawPrint size={40} className="text-white fill-white/20" /></div>
                        </div>
                        <h1 className="text-3xl font-bold text-white font-brand mb-2 tracking-tight">TrainerBuilder</h1>
                        <p className="text-slate-300 text-sm font-medium leading-relaxed">Sua plataforma completa de gestão.</p>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-4">
                            <div><label className="text-[10px] font-bold text-blue-300 uppercase ml-3 mb-1.5 block tracking-wider">Como você quer ser chamado?</label><div className="relative group"><div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-400 transition-colors"><User size={20} /></div><input value={setupName} onChange={(e) => setSetupName(e.target.value)} placeholder="Ex: Carlos Adestrador" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 transition-all shadow-inner" /></div></div>
                            <div><label className="text-[10px] font-bold text-green-300 uppercase ml-3 mb-1.5 block tracking-wider">Seu WhatsApp</label><div className="relative group"><div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors"><Smartphone size={20} /></div><input value={setupPhone} onChange={(e) => setSetupPhone(e.target.value)} type="tel" placeholder="5511999999999" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-green-500 focus:bg-slate-900/80 transition-all shadow-inner" /></div></div>
                        </div>
                        <button onClick={handleStartSetup} className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 hover:shadow-blue-600/40 border border-white/10 group"><span className="text-sm">Criar Meu Aplicativo</span><div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform"><Zap size={14} fill="currentColor" /></div></button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
            <div className="relative z-10 w-full max-w-sm flex flex-col items-center"><Loader2 size={52} className="text-blue-500 animate-spin mb-4" /><h2 className="text-xl font-bold text-white mb-2 font-brand animate-pulse text-center">{loadingMsg}</h2></div>
        </div>
    );
  }

  if (viewMode === 'editor') {
    const serviceToEdit = tempConfig.services.find(s => s.id === editingServiceId);
    return <ServiceEditorView initialService={serviceToEdit} onSave={handleSaveService} onCancel={closeEditor} onDelete={handleDeleteService} />;
  }

  return (
    <div className="bg-slate-50 min-h-full pb-24 animate-fade-in relative">
      
      {/* Header Admin */}
      <div className="pt-8 pb-12 px-8 rounded-b-[2.5rem] md:rounded-3xl relative overflow-hidden shadow-xl mb-8" style={{ background: `linear-gradient(to bottom right, ${themeHex[600]}, ${themeHex[900]})` }}>
        <div className="absolute top-0 right-0 p-8 opacity-10"><Layout size={180} className="text-white transform rotate-12" /></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-white/30 overflow-hidden bg-white/10 backdrop-blur-sm shadow-md"><img src={config.profileImage} className="w-full h-full object-cover" alt="Profile" /></div>
                <div><p className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-0.5">Painel de Controle</p><h2 className="text-2xl font-bold text-white font-brand leading-none">{config.professionalName.split(' ')[0]}</h2></div>
             </div>
             <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div><span className="text-[10px] text-white font-bold">Online</span></div>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
             <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-colors"><span className="block text-2xl font-bold text-white mb-1">284</span><span className="text-[10px] text-white/60 uppercase tracking-wide flex items-center justify-center gap-1"><Activity size={10}/> Visitas</span></div>
             <div className="bg-gradient-to-br from-white/20 to-white/5 border border-white/20 rounded-2xl p-4 text-center shadow-lg"><span className="block text-2xl font-bold text-white mb-1">12</span><span className="text-[10px] text-white/80 uppercase tracking-wide flex items-center justify-center gap-1 font-bold"><TrendingUp size={10}/> Leads</span></div>
             <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-colors"><span className="block text-2xl font-bold text-white mb-1">{config.services.length}</span><span className="text-[10px] text-white/60 uppercase tracking-wide flex items-center justify-center gap-1"><Grid size={10}/> Planos</span></div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-0 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="space-y-6 lg:col-span-1">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-1 shadow-xl relative overflow-hidden group cursor-pointer z-20" onClick={() => onNavigate('sales')}>
                <div className="bg-slate-900 rounded-[1.3rem] p-6 relative z-10 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <div className="flex items-center gap-2 mb-2"><span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm"><Crown size={10} fill="currentColor" /> PRO</span><span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Plano Gratuito</span></div>
                        <h3 className="text-white font-bold text-lg leading-tight">Desbloqueie o potencial máximo</h3>
                        </div>
                        <div className="bg-slate-800 p-2 rounded-full text-slate-500 group-hover:text-white transition-colors"><ChevronRight size={20} /></div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Configuração do Perfil</span><span>75%</span></div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-3/4"></div></div>
                        <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5"><Lock size={10} /> Recursos bloqueados: Domínio Próprio & WhatsApp API</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-2 mb-1"><h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Configurações Gerais</h3></div>
            
            {/* New Refactored Section */}
            <ProfileSection 
                tempConfig={tempConfig} 
                setTempConfig={setTempConfig} 
                setSaved={setSaved} 
                expanded={expandedSection === 'profile'} 
                onToggle={() => toggleSection('profile')}
                themeHex={themeHex}
            />
        </div>

        <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between px-2 mb-1"><h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Conteúdo do App</h3></div>
            
            {/* New Refactored Sections */}
            <LocationsSection 
                tempConfig={tempConfig}
                setTempConfig={setTempConfig}
                setSaved={setSaved}
                expanded={expandedSection === 'locations'}
                onToggle={() => toggleSection('locations')}
                locationText={config.locationText}
            />

            <ServicesSection 
                tempConfig={tempConfig}
                expanded={expandedSection === 'services'}
                onToggle={() => toggleSection('services')}
                openEditor={openEditor}
                themeHex={themeHex}
            />

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-3 pt-4">
                <button onClick={handleGlobalSave} className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2 hover:bg-slate-800 hover:shadow-xl"><Save size={20} />{saved ? 'Alterações Salvas!' : 'Salvar Todas Alterações'}</button>
                <button onClick={() => { resetConfig(); setTempConfig(useAppConfig().config); alert("Configurações restauradas para o padrão."); }} className="flex-1 md:flex-none md:w-48 bg-white border border-slate-200 text-slate-400 text-xs font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition shadow-sm"><RotateCcw size={14} /> Restaurar Padrão</button>
            </div>
        </div>
      </div>
    </div>
  );
};