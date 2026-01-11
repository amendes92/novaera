import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './views/Home';
import { QuizView } from './views/Quiz';
import { ServicesView } from './views/Services';
import { ContactView } from './views/Contact';
import { BreedsView } from './views/Breeds';
import { ServiceDetailView } from './views/ServiceDetail';
import { ScheduleView } from './views/Schedule';
import { AdminView } from './views/Admin';
import { SalesPage } from './views/SalesPage';
import { LocationsView } from './views/Locations';
import { Tab, QuizState } from './types';
import { AppConfigProvider, useAppConfig } from './contexts/AppConfigContext';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const { config } = useAppConfig();
  
  const [quizState, setQuizState] = useState<QuizState>({
    step: 1,
    name: '',
    age: '',
    problem: '',
    breed: '',
    size: ''
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedServiceId(null);
    window.scrollTo(0, 0);
  };

  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    const selectedService = config.services.find(s => s.id === selectedServiceId);

    if (selectedServiceId && selectedService) {
      return (
        <ServiceDetailView 
          service={selectedService} 
          onBack={() => setSelectedServiceId(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'home': return <HomeView onNavigate={handleTabChange} onServiceSelect={handleServiceSelect} />;
      case 'diagnosis': return <QuizView quizState={quizState} setQuizState={setQuizState} />;
      case 'breeds': return <BreedsView />;
      case 'services': return <ServicesView onServiceSelect={handleServiceSelect} />;
      case 'contact': return <ContactView />;
      case 'schedule': return <ScheduleView onBack={() => handleTabChange('home')} />;
      case 'admin': return <AdminView onNavigate={handleTabChange} />;
      case 'sales': return <SalesPage onBack={() => handleTabChange('admin')} />;
      case 'locations': return <LocationsView />;
      default: return <HomeView onNavigate={handleTabChange} onServiceSelect={handleServiceSelect} />;
    }
  };

  // Determine if bottom nav should be hidden based on current view/state
  const shouldShowBottomNav = !selectedServiceId && activeTab !== 'schedule' && activeTab !== 'sales';

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={handleTabChange}
      showBottomNav={shouldShowBottomNav}
    >
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <AppConfigProvider>
      <AppContent />
    </AppConfigProvider>
  );
}

export default App;