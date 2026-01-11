import React from 'react';
import { Home, PawPrint, Grid, User, BookOpen, Settings, CalendarCheck, Map } from 'lucide-react';
import { Tab } from '../types';
import { useAppConfig } from '../contexts/AppConfigContext';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { config, themeHex } = useAppConfig();
  
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Início', icon: <Home size={20} /> },
    { id: 'locations', label: 'Explorar', icon: <Map size={20} /> },
    { id: 'diagnosis', label: 'Avaliação (Quiz)', icon: <PawPrint size={20} /> },
    { id: 'schedule', label: 'Agendamento', icon: <CalendarCheck size={20} /> },
    { id: 'breeds', label: 'Guia de Raças', icon: <BookOpen size={20} /> },
    { id: 'services', label: 'Serviços', icon: <Grid size={20} /> },
    { id: 'contact', label: 'Perfil Profissional', icon: <User size={20} /> },
    { id: 'admin', label: 'Painel Admin', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen bg-white border-r border-slate-100 fixed left-0 top-0 z-50 shadow-xl shadow-slate-200/50">
      {/* Header Sidebar */}
      <div className="p-8 flex items-center gap-4 border-b border-slate-50 bg-gradient-to-b from-white to-slate-50/50">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-300 transform transition-transform hover:scale-105" style={{ backgroundColor: themeHex[500] }}>
           <PawPrint size={26} />
        </div>
        <div>
           <h1 className="font-brand font-bold text-slate-800 text-xl leading-none tracking-tight">{config.appName}</h1>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Painel Web</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scroll">
         {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden ${isActive ? 'shadow-md translate-x-1' : 'hover:bg-slate-50 hover:translate-x-1'}`}
                style={{ 
                    backgroundColor: isActive ? themeHex[50] : 'transparent',
                    color: isActive ? themeHex[700] : '#64748b'
                }}
              >
                {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full" style={{ backgroundColor: themeHex[500] }}></div>
                )}
                <div className={`transition-colors duration-300 ${isActive ? '' : 'text-slate-400 group-hover:text-slate-600'}`} style={{ color: isActive ? themeHex[500] : undefined }}>
                    {item.icon}
                </div>
                {item.label}
              </button>
            );
         })}
      </nav>

      {/* Footer Profile */}
      <div className="p-6 border-t border-slate-50 bg-slate-50/30">
         <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <img src={config.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-slate-50 shadow-sm" />
            <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-slate-800 truncate">{config.professionalName}</p>
               <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
               </p>
            </div>
         </div>
      </div>
    </aside>
  );
};