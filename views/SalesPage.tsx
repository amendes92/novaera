import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Crown, Zap, ShieldCheck, Rocket, MessageCircle, Smartphone, Edit3, Server, Loader2, Check, Gift } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';

interface SalesPageProps {
  onBack: () => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onBack }) => {
  const { config } = useAppConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    const text = `🚀 *NOVA ASSINATURA SOLICITADA*\n\n👤 *Cliente:* ${config.professionalName}\n📱 *WhatsApp:* ${config.phone}\n\n📦 *Plano:* TrainerBuilder Pro\n💰 *Valor:* R$ 250,00 (Pagamento Único de Ativação)\n🎁 *Bônus:* 3 Meses de Manutenção Grátis\n🔄 *Mensalidade:* R$ 45,00 (apenas após 3 meses)\n\n_Enviado via App_`;

    try {
        const response = await fetch('https://api.santanamendes.com.br/message/sendText/Instancia%20Principal', {
            method: 'POST',
            headers: { 'apikey': '574AC148C773-4994-B19A-7CDFD9A9409A', 'Content-Type': 'application/json' },
            body: JSON.stringify({ number: "5511997508970", text: text })
        });
        if (response.ok) setIsSuccess(true);
        else throw new Error('Erro API');
    } catch (error) {
        const fallbackText = `Olá! Tentei assinar pelo app mas houve um erro.\n\nNome: ${config.professionalName}\nQuero a oferta da Ativação + 3 Meses Grátis.`;
        window.open(`https://wa.me/5511997508970?text=${encodeURIComponent(fallbackText)}`, '_blank');
    } finally {
        setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-slate-900 min-h-full flex flex-col items-center justify-center p-8 animate-fade-in relative z-50 overflow-y-auto text-center h-[100dvh]">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse delay-1000"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.5)] mb-8 animate-bounce"><Check size={48} className="text-white" strokeWidth={4} /></div>
              <h2 className="text-3xl font-bold text-white font-brand mb-2">Solicitação Recebida!</h2>
              <p className="text-slate-400 text-sm mb-12 max-w-xs leading-relaxed">Já recebemos seu pedido de assinatura.</p>
              <button onClick={onBack} className="mt-12 text-slate-500 text-xs font-bold hover:text-white transition-colors flex items-center gap-2"><ArrowLeft size={14} /> Voltar ao Painel</button>
          </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-full animate-fade-in relative z-50 text-white pb-40">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-slate-900 sticky top-0 z-40 border-b border-slate-800/50 backdrop-blur-md bg-opacity-90">
        <button onClick={onBack} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition backdrop-blur-md"><ArrowLeft size={20} /></button>
        <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-500 flex items-center justify-end gap-1"><Crown size={12} fill="currentColor" /> Premium</span>
            <h2 className="text-lg font-bold font-brand leading-none">Visão Geral</h2>
        </div>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden shadow-2xl hover:shadow-yellow-500/10 transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Crown size={120} className="text-yellow-500 transform rotate-12" /></div>
            <div className="relative z-10">
                <h1 className="text-3xl font-bold font-brand mb-1 text-white">TrainerBuilder <span className="text-yellow-400">Pro</span></h1>
                <p className="text-slate-400 text-xs mb-8 font-medium">Sua plataforma completa de adestramento.</p>
                <div className="mb-6 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Investimento Inicial</p>
                    <div className="flex items-center gap-4">
                        <span className="text-5xl font-bold text-white tracking-tighter">R$ 250</span>
                        <div className="flex flex-col">
                            <span className="text-sm text-slate-200 font-bold leading-tight">Ativação Única</span>
                            <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-wide bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20 w-fit mt-1">Setup Completo</span>
                        </div>
                    </div>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 flex items-center gap-4">
                    <div className="bg-green-500/20 p-2 rounded-full"><Gift size={20} className="text-green-400" /></div>
                    <div>
                        <span className="text-sm font-bold text-green-400 block">3 Meses Grátis</span>
                        <p className="text-[10px] text-green-300/80 leading-tight">Mensalidade de R$ 45 só após 90 dias.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-6 z-50">
        <div className="max-w-2xl mx-auto">
            <button onClick={handleSubscribe} disabled={isLoading} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-70">
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} fill="currentColor" />}
                {isLoading ? 'Enviando...' : 'Desbloquear Pro Agora'}
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-3 flex items-center justify-center gap-1"><ShieldCheck size={10} /> Pagamento seguro via WhatsApp.</p>
        </div>
      </div>
    </div>
  );
};