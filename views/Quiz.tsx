import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ArrowRight, Clock, Dog, Search, RotateCcw, Bone, Target, Star, AlertCircle, Check, PawPrint, Brain, Globe, MessageCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { QuizState, ProblemType, DogSize } from '../types';
import { BREEDS_DB } from '../breedsData';
import { useAppConfig } from '../contexts/AppConfigContext';

interface QuizProps {
  quizState: QuizState;
  setQuizState: React.Dispatch<React.SetStateAction<QuizState>>;
}

export const QuizView: React.FC<QuizProps> = ({ quizState, setQuizState }) => {
  const { config, themeHex } = useAppConfig();
  const { step, name, age, problem, breed, size } = quizState;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Iniciando análise...');
  const [errors, setErrors] = useState({ name: false, breed: false, age: false, size: false });
  const topRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    "Analisando perfil comportamental...",
    "Verificando predisposição da raça...",
    "Calculando curva de aprendizado...",
    "Montando plano personalizado...",
    "Finalizando diagnóstico..."
  ];

  const filteredBreeds = useMemo(() => {
    if (!breed) return [];
    return BREEDS_DB.filter(b => 
      b.identificacao.nome.toLowerCase().includes(breed.toLowerCase())
    ).slice(0, 5);
  }, [breed]);

  const selectedBreedData = useMemo(() => {
    return BREEDS_DB.find(b => b.identificacao.nome.toLowerCase() === breed.trim().toLowerCase());
  }, [breed]);

  const updateState = (updates: Partial<QuizState>) => setQuizState(prev => ({ ...prev, ...updates }));
  const nextStep = () => updateState({ step: step + 1 });
  const resetQuiz = () => {
    setQuizState({ step: 1, name: '', age: '', problem: '', breed: '', size: '' });
    setErrors({ name: false, breed: false, age: false, size: false });
  };

  useEffect(() => {
    if (step === 3) {
      let msgIndex = 0;
      const msgInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        setLoadingMsg(loadingMessages[msgIndex]);
      }, 800);
      const timer = setTimeout(() => {
        clearInterval(msgInterval);
        updateState({ step: 4 });
      }, 4000);
      return () => { clearTimeout(timer); clearInterval(msgInterval); };
    }
  }, [step]);

  const handleStep1Submit = () => {
    const newErrors = { name: !name.trim(), breed: !breed.trim(), size: !size, age: !age };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    nextStep();
  };

  const handleProblemSelect = (p: ProblemType) => updateState({ problem: p, step: 3 });
  const handleBreedSelect = (selectedBreedName: string) => {
    updateState({ breed: selectedBreedName });
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, breed: false }));
  };

  const getResult = () => {
    if (age === 'puppy') return { 
        title: "Protocolo Filhote Exemplar", 
        subtitle: "Educação Sanitária & Socialização", 
        desc: `Nesta fase crítica, o cérebro do ${name} é uma esponja. Nosso foco será prevenir maus hábitos antes que se instalem e criar uma base sólida.`, 
        img: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img11.png", 
        benefits: ['Xixi e cocô no lugar certo', 'Controle de mordidas', 'Socialização segura', 'Prevenção de ansiedade'],
        difficulty: 'Média' 
    };
    
    if (problem === 'aggression') return { 
        title: "Reabilitação Comportamental", 
        subtitle: "Controle de Reatividade & Confiança", 
        desc: `Um programa técnico e cuidadoso para devolver a paz ao ${name}, focando em dessensibilização e construção de confiança.`, 
        img: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img13.png", 
        benefits: ['Redução da reatividade', 'Passeios seguros', 'Controle emocional', 'Segurança para a família'],
        difficulty: 'Alta' 
    };
    
    if (problem === 'leash') return { 
        title: "Passeio Educativo", 
        subtitle: "Andar Junto & Foco no Condutor", 
        desc: `Transformaremos o passeio do ${name} em um momento de conexão e prazer, acabando com os puxões através de técnicas de indução e foco.`, 
        img: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img12.png", 
        benefits: ['Andar junto sem puxar', 'Comandos de parada', 'Foco no tutor na rua', 'Socialização em passeios'],
        difficulty: 'Média' 
    };
    
    // Default / Obedience
    return { 
        title: "Obediência Funcional", 
        subtitle: "Controle de Impulsos & Comandos", 
        desc: `Ideal para o ${name} aprender a ter calma dentro de casa, respeitar limites e obedecer comandos essenciais para a convivência.`, 
        img: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img12.png", 
        benefits: ['Comandos: Senta, Fica, Vem', 'Fim de pulos nas visitas', 'Controle de impulsos', 'Melhora do vínculo'],
        difficulty: 'Baixa' 
    };
  };

  const result = getResult();
  const sizeMap = { small: 'Pequeno', medium: 'Médio', large: 'Grande' };
  const ageMap = { puppy: 'Filhote', adult: 'Adulto' };
  const problemMap = { leash: 'Puxa guia', potty: 'Xixi errado', destruction: 'Destruição', aggression: 'Agressividade' };
  
  const whatsappText = `Olá ${config.professionalName.split(' ')[0]}! 🐾\n\nFiz o diagnóstico no app e adorei o plano recomendado:\n*${result.title}*\n\n🐶 *Perfil do Aluno:*\nNome: ${name}\nRaça: ${breed}\nPorte: ${sizeMap[size as DogSize] || ''}\nIdade: ${ageMap[age] || ''}\n\n⚠️ *Principal Desafio:* ${problemMap[problem] || ''}\n\nGostaria de saber mais sobre como funciona!`;

  return (
    <div className="bg-slate-50 min-h-full flex flex-col relative animate-fade-in pb-20 items-center">
      
      {/* Desktop Card Container */}
      <div className="w-full max-w-3xl bg-white md:rounded-3xl md:shadow-2xl md:my-8 md:overflow-hidden md:border border-slate-100 flex flex-col h-full md:h-auto min-h-[600px]">
        
        {/* Header com Progresso */}
        <div ref={topRef} className="bg-white px-6 pt-6 pb-4 rounded-b-3xl md:rounded-none shadow-sm border-b border-slate-100 sticky top-0 z-40">
            <div className="flex justify-between items-end mb-3">
            <div>
                <h2 className="text-xl font-bold text-slate-900 font-brand leading-none">Diagnóstico</h2>
                <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                    {step === 1 ? 'Perfil do Cão' : step === 2 ? 'Comportamento' : step === 3 ? 'Analisando' : 'Resultado'}
                </p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: themeHex[500], backgroundColor: themeHex[50] }}>{step}/4</span>
            </div>
            <div className="flex gap-1.5 h-1.5">
            {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex-1 rounded-full transition-all duration-500" style={{ backgroundColor: step >= s ? themeHex[500] : '#f1f5f9' }}></div>
            ))}
            </div>
        </div>

        {step === 1 && (
            <div className="p-6 md:p-10 flex-1 flex flex-col animate-slide-in">
            <div className="space-y-6">
                <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${errors.name ? 'text-red-500' : 'text-slate-500'}`}>
                    <Dog size={12} /> Nome do Cão {errors.name && '*'}
                </label>
                <input 
                    value={name}
                    onChange={(e) => { updateState({ name: e.target.value }); if(e.target.value) setErrors(prev => ({...prev, name: false})); }}
                    className={`w-full bg-white px-4 py-3.5 rounded-xl border focus:outline-none text-base font-bold text-slate-900 transition-all shadow-sm ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                    placeholder="Ex: Thor"
                    type="text"
                    style={{ borderColor: errors.name ? undefined : themeHex[200] }}
                />
                </div>

                <div className="relative space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${errors.breed ? 'text-red-500' : 'text-slate-500'}`}>
                    <Search size={12} /> Raça {errors.breed && '*'}
                </label>
                <div className="relative">
                    <input 
                    type="text"
                    value={breed}
                    onChange={(e) => { updateState({ breed: e.target.value }); setShowSuggestions(true); if(e.target.value) setErrors(prev => ({...prev, breed: false})); }}
                    onFocus={() => setShowSuggestions(true)}
                    className={`w-full bg-white px-4 py-3.5 rounded-xl border focus:outline-none text-base font-bold text-slate-900 transition-all shadow-sm ${errors.breed ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                    placeholder="Busque a raça..."
                    style={{ borderColor: errors.breed ? undefined : themeHex[200] }}
                    />
                    {breed && (
                    <button onClick={() => updateState({ breed: '' })} className="absolute right-3 top-3.5 text-slate-300 hover:text-slate-500">
                        <RotateCcw size={16} />
                    </button>
                    )}
                </div>
                {showSuggestions && breed.length > 0 && !selectedBreedData && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scroll">
                    {filteredBreeds.length > 0 ? (
                        filteredBreeds.map((b) => (
                        <button
                            key={b.identificacao.id}
                            onClick={() => handleBreedSelect(b.identificacao.nome)}
                            className="w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3"
                        >
                            <img src={b.imagens.img1} alt={b.identificacao.nome} className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                            <span className="font-bold">{b.identificacao.nome}</span>
                        </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-xs text-slate-400 italic text-center">Raça não encontrada.</div>
                    )}
                    </div>
                )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${errors.age ? 'text-red-500' : 'text-slate-500'}`}>
                        <Clock size={12} /> Idade {errors.age && '*'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {['puppy', 'adult'].map((option) => (
                            <button 
                                key={option}
                                onClick={() => { updateState({ age: option as any }); setErrors(prev => ({...prev, age: false})); }}
                                className="py-3 px-4 rounded-xl border-2 transition-all flex flex-col md:flex-row items-center justify-center gap-2 hover:bg-slate-50"
                                style={{ 
                                    borderColor: age === option ? themeHex[500] : (errors.age ? '#fca5a5' : '#e2e8f0'),
                                    backgroundColor: age === option ? themeHex[50] : (errors.age ? '#fef2f2' : 'white'),
                                    color: age === option ? themeHex[700] : (errors.age ? '#f87171' : '#94a3b8')
                                }}
                            >
                            <Bone size={18} className={age === option ? 'fill-current' : ''}/>
                            <span className="font-bold text-sm">{option === 'puppy' ? 'Filhote' : 'Adulto'}</span>
                            </button>
                        ))}
                    </div>
                    </div>

                    <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${errors.size ? 'text-red-500' : 'text-slate-500'}`}>
                        <Target size={12} /> Porte {errors.size && '*'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                        { id: 'small', label: 'Pequeno' },
                        { id: 'medium', label: 'Médio' },
                        { id: 'large', label: 'Grande' }
                        ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => { updateState({ size: s.id as DogSize }); setErrors(prev => ({...prev, size: false})); }}
                            className={`py-2.5 rounded-xl border-2 transition-all active:scale-95 hover:bg-slate-50 ${size === s.id ? 'border-slate-800 bg-slate-800 text-white hover:bg-slate-900' : 'border-slate-100 bg-white text-slate-400'}`}
                            style={{ borderColor: errors.size && size !== s.id ? '#fca5a5' : undefined }}
                        >
                            <span className="text-xs font-bold uppercase">{s.label}</span>
                        </button>
                        ))}
                    </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button 
                onClick={handleStep1Submit}
                className="w-full text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition flex justify-center items-center gap-2 hover:brightness-110"
                style={{ backgroundColor: themeHex[500] }}
                >
                Continuar <ArrowRight size={20} />
                </button>
            </div>
            </div>
        )}

        {step === 2 && (
            <div className="p-6 md:p-10 flex-1 flex flex-col animate-slide-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-brand">Principal Desafio</h2>
                <p className="text-slate-500 text-sm mt-1">O que precisamos resolver com o <span className="font-bold" style={{ color: themeHex[500] }}>{name || 'Cão'}</span>?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                {[
                { id: 'leash', label: 'Puxa a guia', sub: 'Passeio caótico', icon: '🦮' },
                { id: 'potty', label: 'Xixi Errado', sub: 'Sujeira na casa', icon: '💦' },
                { id: 'destruction', label: 'Destruição', sub: 'Rói tudo', icon: '🛋️' },
                { id: 'aggression', label: 'Reatividade', sub: 'Late/Avança', icon: '🐕' },
                ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleProblemSelect(item.id as ProblemType)}
                    className="bg-white border-2 border-slate-100 rounded-2xl p-4 text-center hover:shadow-lg transition-all active:scale-95 group flex flex-col items-center justify-center gap-3 aspect-square hover:border-blue-200"
                    style={{ borderColor: problem === item.id ? themeHex[500] : undefined }}
                >
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{item.label}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">{item.sub}</p>
                    </div>
                </button>
                ))}
            </div>
            <button onClick={() => updateState({ step: 1 })} className="mt-auto text-slate-400 text-xs font-bold flex items-center justify-center gap-1 py-4 hover:text-slate-600"><RotateCcw size={12} /> Voltar</button>
            </div>
        )}

        {step === 3 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in px-8">
            <div className="mb-8 relative">
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: themeHex[500] }}></div>
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative z-10 shadow-xl border-4" style={{ borderColor: themeHex[100] }}>
                    <Brain size={40} className="animate-bounce" style={{ color: themeHex[500] }} />
                </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{loadingMsg}</h3>
            <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto">
                <div className="h-full animate-progress w-full origin-left" style={{ backgroundColor: themeHex[500] }}></div>
            </div>
            </div>
        )}

        {step === 4 && (
            <div className="p-6 md:p-8 flex-1 flex flex-col animate-slide-in">
                {/* Header do Resultado */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white">
                        <img src={result.img} alt="Plano" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white mb-1.5 inline-flex items-center gap-1" style={{ backgroundColor: themeHex[500] }}>
                            <Star size={10} fill="currentColor" /> RECOMENDADO
                        </span>
                        <h3 className="text-xl font-bold leading-tight text-slate-900 mb-1">{result.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">{result.subtitle}</p>
                    </div>
                </div>

                {/* Descrição e Problema */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                        {result.desc}
                    </p>
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Benefícios Principais:</h4>
                        {result.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                {benefit}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detalhes Técnicos */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Duração Estimada</span>
                        <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                            <Clock size={14} className="text-blue-500" /> 8-12 Semanas
                        </span>
                    </div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nível</span>
                        <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                            <Target size={14} className="text-red-500" /> {result.difficulty}
                        </span>
                    </div>
                </div>

                {/* CTA Actions */}
                <div className="mt-auto space-y-3">
                    <a 
                        href={`https://wa.me/${config.phone}?text=${encodeURIComponent(whatsappText)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/30 active:scale-95 transition flex justify-center items-center gap-2 hover:bg-green-600 group"
                    >
                        <MessageCircle size={22} className="group-hover:animate-bounce" /> 
                        <span>Solicitar este Plano</span>
                        <ChevronRight size={18} className="opacity-60" />
                    </a>
                    
                    <button 
                        onClick={resetQuiz} 
                        className="w-full text-slate-400 text-xs font-bold py-3 flex items-center justify-center gap-1.5 hover:text-slate-600 transition-colors"
                    >
                        <RotateCcw size={12} /> Refazer Diagnóstico
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};