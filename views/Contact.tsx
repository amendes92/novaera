import React from 'react';
import { MapPin, Download, Star, Award, ShieldCheck, Clock, MessageCircle, Instagram, Mail, CheckCircle2, Quote, Calendar, Phone, Share2 } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';

export const ContactView: React.FC = () => {
  const { config, themeHex } = useAppConfig();

  const handleExportHtml = () => {
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adestrador-app-snapshot.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reviews = [
    { name: "Ana Paula", dog: "Thor", text: `O ${config.professionalName.split(' ')[0]} salvou minha relação com o Thor! Ele parou de destruir o sofá.` },
    { name: "Roberto M.", dog: "Luna", text: "Profissional incrível. O método positivo realmente funciona." },
    { name: "Carla Diaz", dog: "Bolinha", text: "Super paciente e didático. Recomendo para todos." }
  ];

  return (
    <div className="animate-fade-in pb-24 bg-slate-50 min-h-full lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        
        {/* Sticky Profile Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
            <div className="relative pb-10 lg:pb-6 rounded-b-[2.5rem] lg:rounded-[2rem] overflow-hidden shadow-2xl lg:sticky lg:top-8 bg-slate-900" style={{ background: `linear-gradient(to bottom right, ${themeHex[600]}, ${themeHex[900]})` }}>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>
                <div className="px-6 pt-8 relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-4 group">
                        <div className="w-32 h-32 rounded-full p-1 bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                            <img alt={config.professionalName} className="w-full h-full rounded-full border-4 border-white/50 object-cover bg-white" src={config.profileImage} />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full border-4 border-white/20 shadow-lg"><ShieldCheck size={18} /></div>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-brand flex items-center gap-2 justify-center">{config.professionalName} <span className="text-blue-200"><Award size={20} fill="currentColor"/></span></h2>
                    <p className="text-white/80 text-sm font-medium mt-1">{config.slogan}</p>
                    <div className="mt-4 bg-black/20 backdrop-blur border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-white uppercase tracking-wide">Agenda Aberta</span>
                    </div>
                    <div className="flex flex-col gap-3 mt-8 w-full px-4">
                        <button onClick={() => window.open(`https://wa.me/${config.phone}`, '_blank')} className="w-full bg-white py-3.5 px-4 rounded-xl text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:bg-slate-50 hover:shadow-xl transform hover:-translate-y-0.5 duration-300" style={{ color: themeHex[700] }}><MessageCircle size={18} /> WhatsApp</button>
                        <button onClick={() => window.open(config.instagramUrl, '_blank')} className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-3.5 px-4 rounded-xl text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2 border border-white/20"><Instagram size={18} /> Instagram</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 px-6 lg:px-0 -mt-6 lg:mt-0 space-y-6 relative z-20">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex justify-between items-center divide-x divide-slate-100 hover:shadow-xl transition-shadow">
                <div className="flex-1 flex flex-col items-center gap-1 group"><span className="text-3xl font-bold text-slate-800 group-hover:scale-110 transition-transform">10+</span><span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Anos Exp.</span></div>
                <div className="flex-1 flex flex-col items-center gap-1 group"><span className="text-3xl font-bold text-slate-800 group-hover:scale-110 transition-transform">500+</span><span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Alunos</span></div>
                <div className="flex-1 flex flex-col items-center gap-1 group"><div className="flex items-center gap-1 font-bold text-3xl group-hover:scale-110 transition-transform" style={{ color: themeHex[500] }}>4.9 <Star size={20} fill="currentColor" /></div><span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Avaliação</span></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-bold text-slate-800 mb-4 px-1 text-sm uppercase tracking-wide">Por que me escolher?</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Award, label: "Certificado", sub: "CBKC & Cia", color: "orange" },
                            { icon: CheckCircle2, label: "Positivo", sub: "Sem punição", color: "green" },
                            { icon: Clock, label: "Pontual", sub: "Respeito total", color: "blue" },
                            { icon: MessageCircle, label: "Suporte", sub: "Pós-aula VIP", color: "purple" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 hover:border-slate-300 transition-colors group">
                                <div className={`bg-${item.color}-100 p-2.5 rounded-lg text-${item.color}-600 group-hover:scale-110 transition-transform`}><item.icon size={20} /></div>
                                <div><span className="block text-xs font-bold text-slate-800">{item.label}</span><span className="text-[10px] text-slate-500">{item.sub}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col h-full">
                    <h3 className="font-bold text-slate-800 mb-4 px-1 text-sm uppercase tracking-wide opacity-0 md:opacity-100">Pronto?</h3>
                    <div className="flex-1 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform" style={{ backgroundColor: themeHex[500] }}>
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Calendar size={100} className="transform rotate-12" /></div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-2xl leading-none mb-2">Vamos começar?</h3>
                            <p className="text-sm text-white/80 font-medium mb-6">A primeira aula muda tudo.</p>
                            <button className="bg-white text-slate-900 w-full py-3 rounded-xl font-bold text-sm shadow-md hover:bg-slate-50 transition-colors">Agendar Visita</button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-bold text-slate-800 mb-4 px-1 text-sm uppercase tracking-wide flex items-center gap-2"><Star size={16} className="text-yellow-400" fill="currentColor"/> Depoimentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {reviews.map((r, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
                            <Quote size={24} className="text-slate-200 absolute top-4 right-4" />
                            <p className="text-xs text-slate-600 font-medium italic mb-4 leading-relaxed">"{r.text}"</p>
                            <div className="flex items-center gap-2 mt-auto">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">{r.name.charAt(0)}</div>
                                <div><p className="text-xs font-bold text-slate-800">{r.name}</p><p className="text-[10px] text-slate-400">Tutor(a) de {r.dog}</p></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="flex justify-end pt-4 pb-8 md:pb-0"><button onClick={handleExportHtml} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"><Download size={14} /> Salvar Cartão (Offline)</button></div>
        </div>
      </div>
    </div>
  );
};