import React from 'react';
import { TranscriptProvider, useTranscript } from './context/TranscriptContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { MyTranscriptView } from './views/MyTranscriptView';
import { UploadTranscriptView } from './views/UploadTranscriptView';
import { AIAssistantView } from './views/AIAssistantView';
import { PerformanceAnalyticsView } from './views/PerformanceAnalyticsView';
import { GradeCalculatorView } from './views/GradeCalculatorView';
import { StudyRecommendationsView } from './views/StudyRecommendationsView';
import { BacklogStatusView } from './views/BacklogStatusView';
import { ProjectDemoView } from './views/ProjectDemoView';
import { SettingsView } from './views/SettingsView';

const MainAppContent: React.FC = () => {
  const { activeView } = useTranscript();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'my-transcript':
        return <MyTranscriptView />;
      case 'upload-transcript':
        return <UploadTranscriptView />;
      case 'ai-assistant':
        return <AIAssistantView />;
      case 'performance-analytics':
        return <PerformanceAnalyticsView />;
      case 'grade-calculator':
        return <GradeCalculatorView />;
      case 'study-recommendations':
        return <StudyRecommendationsView />;
      case 'backlog-status':
        return <BacklogStatusView />;
      case 'project-demo':
        return <ProjectDemoView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-purple-500 selection:text-white">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <TranscriptProvider>
      <MainAppContent />
    </TranscriptProvider>
  );
}
