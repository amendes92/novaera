import React from 'react';
import { PawPrint, CalendarCheck } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAppConfig } from '../contexts/AppConfigContext';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showBottomNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  showBottomNav = true 
}) => {
  const { config, themeClasses } = useAppConfig();

  return (
    <div className="min-h-screen w-full bg-slate-50 flex text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 relative flex flex-col min-h-screen w-full">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden bg-white/95 backdrop-blur-sm px-4 py-3 shadow-sm z-40 flex justify-between items-center sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <PawPrint size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 font-brand leading-none">{config.professionalName.split(' ')[0]}</span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">{config.appName}</span>
            </div>
          </div>
          <button 
            onClick={() => onTabChange('schedule')}
            className="bg-slate-50 p-2 rounded-full text-slate-600 hover:bg-slate-100 transition active:scale-95 border border-slate-200"
          >
            <CalendarCheck size={20} />
          </button>
        </header>

        {/* Content Container */}
        <div className="flex-1 w-full">
           <div className="max-w-7xl mx-auto md:p-8 p-0 pb-24 md:pb-8">
              {children}
           </div>
        </div>

        {/* Mobile Bottom Nav */}
        {showBottomNav && (
           <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        )}

      </main>
    </div>
  );
};