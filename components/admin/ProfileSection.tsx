import React, { useState } from 'react';
import { User, Phone, Instagram, MapPin, Palette, Camera, Image as ImageIcon, Grid, ChevronDown } from 'lucide-react';
import { useAppConfig } from '../../contexts/AppConfigContext';
import { AppConfig } from '../../types';
import { HERO_IMAGES_GALLERY } from '../../data/heroImages';

interface ProfileSectionProps {
  tempConfig: AppConfig;
  setTempConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  setSaved: (saved: boolean) => void;
  expanded: boolean;
  onToggle: () => void;
  themeHex: any;
}

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxWidth = 800;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  tempConfig, setTempConfig, setSaved, expanded, onToggle, themeHex 
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempConfig(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'heroImage') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await resizeImage(file);
        setTempConfig(prev => ({ ...prev, [field]: compressedImage }));
        setSaved(false);
      } catch (err) {
        console.error(`Erro ao processar ${field}`, err);
        alert("Erro ao carregar imagem.");
      }
    }
  };

  const SectionHeader = ({ title, subtitle, icon: Icon, colorClass, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 bg-white ${expanded ? 'rounded-t-2xl border-b border-slate-50' : 'rounded-2xl hover:bg-slate-50'} transition-all shadow-sm border border-slate-100 mb-2 group relative overflow-hidden`}
    >
        <div className="flex items-center gap-4 relative z-10">
            <div className={`w-10 h-10 rounded-xl ${colorClass} bg-opacity-10 flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
            </div>
            <div className="text-left">
                <span className="font-bold text-slate-800 text-sm block">{title}</span>
                {subtitle && <span className="text-[10px] text-slate-400 font-medium">{subtitle}</span>}
            </div>
        </div>
        <div className={`text-slate-300 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} />
        </div>
    </button>
  );

  return (
    <div className="space-y-3">
        <SectionHeader 
            title="Dados e Aparência" 
            subtitle="Perfil, Contato, Cores e Imagens" 
            icon={User} 
            colorClass="bg-blue-500"
            onClick={onToggle}
        />
        
        {expanded && (
            <div className="bg-white p-6 rounded-b-2xl border-x border-b border-slate-100 shadow-sm animate-slide-in -mt-3 pt-4 mb-4 space-y-8">
                
                {/* Imagens */}
                <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
                    <div className="relative group cursor-pointer">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-50 shadow-sm">
                            <img src={tempConfig.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={20} className="text-white" />
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profileImage')} />
                        </label>
                    </div>
                    
                    <div className="relative group cursor-pointer flex-1 h-20 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
                         <img src={tempConfig.heroImage} alt="Hero" className="w-full h-full object-cover" />
                         <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-xs font-bold flex items-center gap-2"><ImageIcon size={14}/> Capa</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'heroImage')} />
                        </label>
                    </div>
                </div>

                {/* Campos de Texto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome Profissional</label>
                        <input name="professionalName" value={tempConfig.professionalName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Slogan / Cargo</label>
                        <input name="slogan" value={tempConfig.slogan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Phone size={10}/> WhatsApp</label>
                        <input name="phone" value={tempConfig.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Instagram size={10}/> Instagram URL</label>
                        <input name="instagramUrl" value={tempConfig.instagramUrl} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><MapPin size={10}/> Local de Atendimento</label>
                        <input name="locationText" value={tempConfig.locationText} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500" />
                    </div>
                </div>

                {/* Cores */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1 mb-2"><Palette size={10}/> Tema do App</label>
                    <div className="grid grid-cols-4 gap-3">
                        {['orange', 'blue', 'green', 'purple'].map((color) => (
                            <button
                                key={color}
                                onClick={() => { setTempConfig(prev => ({ ...prev, themeColor: color as any })); setSaved(false); }}
                                className="h-10 rounded-lg border-2 transition-all flex items-center justify-center gap-2"
                                style={{ 
                                    borderColor: tempConfig.themeColor === color ? color : '#e2e8f0',
                                    backgroundColor: tempConfig.themeColor === color ? '#f8fafc' : '#ffffff'
                                }}
                            >
                                <div className={`w-4 h-4 rounded-full bg-${color}-500 shadow-sm`}></div>
                                <span className="text-[10px] font-bold uppercase text-slate-400 hidden md:inline">{color}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Galeria Hero */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1"><Grid size={12}/> Galeria Rápida de Capas:</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {HERO_IMAGES_GALLERY.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => { setTempConfig(prev => ({ ...prev, heroImage: img.img_full })); setSaved(false); }}
                                className="aspect-video rounded-lg overflow-hidden border-2 transition-all hover:opacity-80"
                                style={{ borderColor: tempConfig.heroImage === img.img_full ? themeHex[500] : '#e2e8f0' }}
                            >
                                <img src={img.img_thumb} className="w-full h-full object-cover" alt={`Capa ${idx}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};