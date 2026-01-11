import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppConfig, ServiceDetailData, LocationData } from '../types';

// Palette Definitions for Inline Styles (Safe for Production Builds)
const THEME_PALETTE = {
  orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 900: '#7c2d12' },
  blue:   { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 900: '#1e3a8a' },
  green:  { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 900: '#14532d' },
  purple: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 900: '#581c87' }
};

const DEFAULT_SERVICES: ServiceDetailData[] = [
  {
    id: 'puppy',
    title: "Educação de Filhotes",
    description: "Socialização segura, controle de mordidas e o fim do xixi errado.",
    fullDescription: "A fase de filhote é a mais crítica para o desenvolvimento do cão. Nosso programa foca em prevenir problemas futuros, criando uma base sólida de confiança e comunicação. Ensinamos seu filhote a gostar de ser manuseado, a fazer as necessidades no lugar certo e a interagir bem com o mundo.",
    image: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img11.png",
    tag: "FILHOTES",
    tagColor: "blue",
    benefits: [
      "Educação Sanitária (Xixi e Cocô)",
      "Inibição de mordidas",
      "Socialização com pessoas e barulhos",
      "Prevenção de ansiedade de separação"
    ],
    duration: "8 aulas",
    location: "Domiciliar",
    price: ""
  },
  {
    id: 'obedience',
    title: "Obediência Básica",
    description: "Comandos essenciais e foco.",
    fullDescription: "Ter um cão obediente significa ter mais liberdade. Ensinamos comandos funcionais que servem para a vida real, não apenas truques de circo. Seu cão aprenderá a manter o foco em você mesmo com distrações, tornando os passeios e a convivência em casa muito mais tranquilos.",
    image: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img12.png",
    tag: "POPULAR",
    tagColor: "orange",
    popular: true,
    benefits: [
      "Andar junto sem puxar a guia",
      "Comandos: Senta, Fica, Vem",
      "Controle de impulsos (não pular)",
      "Melhora na comunicação dono-cão"
    ],
    duration: "10 aulas",
    location: "Domiciliar e Parque",
    price: ""
  },
  {
    id: 'behavior',
    title: "Comportamental",
    description: "Reabilitação de agressividade e medos.",
    fullDescription: "Problemas comportamentais sérios exigem conhecimento técnico aprofundado. Trabalhamos a modificação comportamental baseada em desensibilização e contracondicionamento. Ideal para cães reativos, medrosos ou com histórico de agressividade.",
    image: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img13.png",
    tag: "REABILITAÇÃO",
    tagColor: "purple",
    benefits: [
      "Análise funcional do comportamento",
      "Redução de reatividade",
      "Tratamento de fobias e medos",
      "Reconstrução do vínculo de confiança"
    ],
    duration: "Sob avaliação",
    location: "Domiciliar",
    price: ""
  },
  {
    id: 'online',
    title: "Consultoria Online",
    description: "Orientações via videochamada.",
    fullDescription: "Mora longe ou precisa de orientações pontuais? A consultoria online é perfeita para resolver questões específicas, tirar dúvidas sobre rotina, adaptação de novos cães ou correções simples que dependem mais da mudança de atitude do tutor.",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    tag: "ONLINE",
    tagColor: "green",
    benefits: [
      "Atendimento para qualquer lugar do mundo",
      "Gravação da aula para revisão",
      "Material de apoio em PDF",
      "Flexibilidade de horário"
    ],
    duration: "1 hora/sessão",
    location: "Google Meet / Zoom",
    price: ""
  }
];

const DEFAULT_LOCATIONS: LocationData[] = [
  {
    id: 1,
    name: 'Parque Ibirapuera',
    type: 'park',
    typeName: 'Lazer',
    address: 'Av. Pedro Álvares Cabral, Vila Mariana',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1596464716127-f9a0859b0437?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'O pulmão verde de SP. Área do cachorródromo próxima ao portão 6.',
    fullDescription: 'Melhor local para socialização. Possui bebedouros e áreas sombreadas. Evite horários de pico nos finais de semana.',
    openHours: '05:00 - 00:00',
    features: ['Cachorródromo', 'Bebedouros', 'Gramado'],
    website: 'https://parqueibirapuera.org'
  },
  {
    id: 2,
    name: 'Parque Villa-Lobos',
    type: 'park',
    typeName: 'Lazer',
    address: 'Av. Prof. Fonseca Rodrigues, 2001',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Ótimo espaço para cães, com área cercada dedicada.',
    fullDescription: 'Possui um dos melhores espaços cercados para cães da cidade, permitindo que corram soltos com segurança.',
    openHours: '05:30 - 19:00',
    features: ['Área Cercada', 'Agility', 'Estacionamento']
  },
  {
    id: 3,
    name: 'Parque Buenos Aires',
    type: 'park',
    typeName: 'Lazer',
    address: 'Av. Angélica, 1500 - Higienópolis',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Famoso pelo "Cercadinho" onde os cães socializam.',
    fullDescription: 'Um clássico de Higienópolis. O cercado é ponto de encontro de muitos donos e passeadores.',
    openHours: '06:00 - 19:00',
    features: ['Socialização', 'Sombra', 'Bancos']
  },
  {
    id: 4,
    name: 'Parque da Aclimação',
    type: 'park',
    typeName: 'Lazer',
    address: 'Rua Muniz de Sousa, 1119',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Ambiente tranquilo com lago e muitas árvores.',
    fullDescription: 'Ideal para caminhadas calmas. Atenção aos cisnes e animais silvestres locais.',
    openHours: '06:00 - 20:00',
    features: ['Lago', 'Pista de Cooper']
  },
  {
    id: 5,
    name: 'Praça Pôr do Sol',
    type: 'park',
    typeName: 'Lazer',
    address: 'Praça Cel. Custódio Fernandes Pinheiro',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1533514114760-4384390e9406?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Gramado amplo com vista incrível da cidade.',
    fullDescription: 'Muito frequentada por jovens e donos de cães no final da tarde. Ótimo para deitar na grama.',
    openHours: '24h',
    features: ['Vista Panorâmica', 'Ar Livre']
  },
  {
    id: 6,
    name: 'Matilha Cultural',
    type: 'other',
    typeName: 'Cultura',
    address: 'Rua Rego Freitas, 542 - Centro',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Centro cultural 100% Pet Friendly com cinema.',
    fullDescription: 'Um espaço incrível que aceita cães em todas as áreas, inclusive no cinema (Cine Matilha).',
    openHours: 'Consultar Agenda',
    features: ['Cinema Pet Friendly', 'Exposições', 'Café']
  },
  {
    id: 7,
    name: 'Hospital Veterinário Rebouças',
    type: 'vet',
    typeName: 'Saúde',
    address: 'Av. Rebouças, 123',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Atendimento de emergência 24h de alta complexidade.',
    fullDescription: 'Referência em SP. Possui UTI e centro cirúrgico completo.',
    openHours: '24 Horas',
    features: ['UTI', 'Cirurgia', 'Laboratório']
  },
  {
    id: 8,
    name: 'Pet Care Morumbi',
    type: 'vet',
    typeName: 'Saúde',
    address: 'Av. Giovanni Gronchi, 3001',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Hospital completo com diversas especialidades.',
    fullDescription: 'Rede renomada com oncologia, cardiologia e neurologia veterinária.',
    openHours: '24 Horas',
    features: ['Especialistas', 'Internação', 'Diagnóstico']
  },
  {
    id: 9,
    name: 'Hospital Vet. Santa Inês',
    type: 'vet',
    typeName: 'Saúde',
    address: 'Av. Santa Inês, 1357',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Tradicional na Zona Norte, atendimento 24h.',
    openHours: '24 Horas',
    features: ['Raio-X', 'Ultrassom', 'Emergência']
  },
  {
    id: 10,
    name: 'Provet Especialidades',
    type: 'vet',
    typeName: 'Saúde',
    address: 'Av. Divino Salvador, 775 - Moema',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1628009368231-76033584865c?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Centro de diagnósticos avançados.',
    fullDescription: 'O melhor lugar para exames complexos, tomografia e ressonância.',
    openHours: '08:00 - 20:00',
    features: ['Tomografia', 'Laboratório', 'Cardiologia']
  },
  {
    id: 11,
    name: 'Petz Megastore Itaim',
    type: 'shop',
    typeName: 'Loja',
    address: 'Rua Bandeira Paulista, 982',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Tudo o que você precisa em um só lugar.',
    openHours: '08:00 - 22:00',
    features: ['Farmácia', 'Banho e Tosa', 'Acessórios']
  },
  {
    id: 12,
    name: 'Cobasi Augusta',
    type: 'shop',
    typeName: 'Loja',
    address: 'Rua Augusta, 2380',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Loja ampla com grande variedade de rações.',
    openHours: '08:00 - 23:00',
    features: ['Estacionamento', 'Jardinagem', 'Aquarismo']
  },
  {
    id: 13,
    name: 'Padaria Pet',
    type: 'shop',
    typeName: 'Gourmet',
    address: 'Rua Oscar Freire, 502',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1595279633633-40a232742969?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Petiscos gourmet, bolos e cerveja para cães.',
    fullDescription: 'Um mimo para seu pet. Ótimo para comprar bolos de aniversário caninos.',
    openHours: '10:00 - 20:00',
    features: ['Petiscos Naturais', 'Bolos', 'Presentes']
  },
  {
    id: 14,
    name: 'Dog Lab',
    type: 'other',
    typeName: 'Creche',
    address: 'Rua Texas, 605 - Brooklin',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1602584386319-fa0df310bf8b?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Daycare com foco em enriquecimento ambiental.',
    fullDescription: 'Espaço pensado para o bem-estar e gasto de energia com supervisão profissional.',
    openHours: '07:00 - 19:30',
    features: ['Daycare', 'Hotel', 'Natação']
  },
  {
    id: 15,
    name: 'Quintal Animal',
    type: 'other',
    typeName: 'Creche',
    address: 'Rua Califórnia, 1171',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Espaço amplo e livre de baias.',
    openHours: '07:00 - 20:00',
    features: ['Socialização', 'Monitoria']
  },
  {
    id: 16,
    name: 'Shopping Villa Lobos',
    type: 'other',
    typeName: 'Pet Friendly',
    address: 'Av. das Nações Unidas, 4777',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Um dos shoppings mais pet friendly da cidade.',
    fullDescription: 'Possui carrinhos para pets e permite a circulação em praticamente todas as áreas.',
    openHours: '10:00 - 22:00',
    features: ['Ar Condicionado', 'Carrinho Pet']
  },
  {
    id: 17,
    name: 'Parque da Independência',
    type: 'park',
    typeName: 'Lazer',
    address: 'Av. Nazaré, s/n - Ipiranga',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1562592186-069279e60273?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'História e lazer. Jardins inspirados em Versalhes.',
    openHours: '05:00 - 20:00',
    features: ['Jardins', 'Pista de Skate']
  },
  {
    id: 18,
    name: 'WeVets Moema',
    type: 'vet',
    typeName: 'Saúde',
    address: 'Alameda dos Maracatins, 114',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Hospital 24h moderno e bem equipado.',
    openHours: '24 Horas',
    features: ['Gatos e Cães', 'Emergência']
  },
  {
    id: 19,
    name: 'Petland Higienópolis',
    type: 'shop',
    typeName: 'Loja',
    address: 'Rua Pará, 50',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Rede americana com foco em filhotes e bem-estar.',
    openHours: '09:00 - 20:00',
    features: ['Banho e Tosa', 'Filhotes']
  },
  {
    id: 20,
    name: 'Botanikafé',
    type: 'other',
    typeName: 'Café',
    address: 'Alameda Lorena, 1765',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Brunch delicioso em ambiente super Pet Friendly.',
    fullDescription: 'Área externa muito agradável onde seu pet é sempre bem-vindo e recebe água fresca.',
    openHours: '08:00 - 23:00',
    features: ['Área Externa', 'Água para Pets']
  },
  {
    id: 21,
    name: 'Bullguer Vila Madalena',
    type: 'other',
    typeName: 'Restaurante',
    address: 'Rua Fradique Coutinho, 1136',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Hamburgueria com varanda pet friendly.',
    openHours: '11:30 - 23:00',
    features: ['Varanda', 'Casual']
  },
  {
    id: 22,
    name: 'Centro de Controle de Zoonoses',
    type: 'vet',
    typeName: 'Público',
    address: 'Rua Santa Eulália, 86 - Santana',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Serviços públicos de vacinação e controle.',
    openHours: '09:00 - 17:00',
    features: ['Vacinação', 'Adoção']
  },
  {
    id: 23,
    name: 'Parque do Povo',
    type: 'park',
    typeName: 'Lazer',
    address: 'Av. Henrique Chamma, 420',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1575960662252-9c762494ee60?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Parque moderno e plano, ótimo para idosos.',
    openHours: '06:00 - 22:00',
    features: ['Plano', 'Segurança', 'Jardins']
  },
  {
    id: 24,
    name: 'Pet Love Store',
    type: 'shop',
    typeName: 'Loja',
    address: 'Av. Magalhães de Castro, 12000',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1608096299210-db7e38487075?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Conceito phygital da maior petshop online.',
    openHours: '10:00 - 22:00',
    features: ['Tecnologia', 'Variedade']
  },
  {
    id: 25,
    name: 'Praça Roosevelt',
    type: 'park',
    typeName: 'Urbano',
    address: 'Praça Franklin Roosevelt - Centro',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1571210059434-1c0052882d8c?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Possui um "Cachorródromo" urbano cercado.',
    fullDescription: 'Ótima opção para quem mora no centro. O espaço é cimentado, o que facilita a limpeza, mas pode esquentar no sol.',
    openHours: '24h',
    features: ['Cercado', 'Urbano', 'Iluminado']
  }
];

const DEFAULT_CONFIG: AppConfig = {
  appName: 'Adestramento Pro',
  professionalName: 'Carlos Eduardo',
  slogan: 'Adestrador Comportamentalista',
  phone: '5511999999999',
  profileImage: 'https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img14.png',
  heroImage: 'https://santanamendes.com.br/imagens/imagemhero/img_06.webp',
  themeColor: 'orange',
  instagramUrl: 'https://instagram.com',
  locationText: 'São Paulo - SP',
  services: DEFAULT_SERVICES,
  locations: DEFAULT_LOCATIONS,
  isOnboarded: false 
};

interface AppConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  resetConfig: () => void;
  themeClasses: {
    // Legacy support using style objects mostly
    primary: string; 
    primaryBg: string;
    primaryText: string;
  };
  themeHex: {
    50: string;
    100: string;
    200: string;
    400: string;
    500: string;
    600: string;
    700: string;
    900: string;
  }
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const savedConfig = localStorage.getItem('app_config_saas');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Ensure properties exist by merging carefully
        setConfig(prev => ({
          ...prev,
          ...parsed,
          services: parsed.services && Array.isArray(parsed.services) && parsed.services.length > 0 
            ? parsed.services 
            : prev.services,
          locations: parsed.locations && Array.isArray(parsed.locations) 
            ? parsed.locations 
            : prev.locations
        }));
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_config_saas', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const themeHex = THEME_PALETTE[config.themeColor] || THEME_PALETTE.orange;

  const getThemeClasses = () => ({
    primary: 'transition-colors', 
    primaryBg: 'transition-colors',
    primaryText: 'transition-colors',
  });

  return (
    <AppConfigContext.Provider value={{ config, updateConfig, resetConfig, themeClasses: getThemeClasses(), themeHex }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
};