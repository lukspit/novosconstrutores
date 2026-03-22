import { MemoryRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Box, User, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { supabase } from './lib/supabase';

// Componente Layout
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const tabs = [
    { name: 'O Cofre', path: '/', icon: Box },
    { name: 'Showcase', path: '/showcase', icon: Zap },
    { name: 'Arsenal', path: '/arsenal', icon: Search },
    { name: 'Perfil', path: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background text-foreground font-sans">
      <main className="flex-1 overflow-x-hidden p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] pt-2 pb-6 px-4 z-50">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={clsx(
                  "flex flex-col items-center justify-center w-16 gap-1 transition-all duration-200",
                  isActive ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className="relative">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// Helper resiliente para ler os dados do Telegram ignorando falhas do SDK ou chaves cacheadas
function getTelegramUser() {
  if (typeof WebApp !== 'undefined' && WebApp.initDataUnsafe?.user) {
    return WebApp.initDataUnsafe.user;
  }
  try {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const tgWebAppData = params.get('tgWebAppData');
    if (tgWebAppData) {
      const dataParams = new URLSearchParams(tgWebAppData);
      const userStr = dataParams.get('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
  } catch (e) {
    console.error("Erro no parse manual do Telegram:", e);
  }
  return null;
}

// Telas Base MVP
function Cofre() {
  return (
    <div className="space-y-6">
      <header className="py-4">
        <h1 className="text-2xl font-bold tracking-tight">O Cofre</h1>
        <p className="text-sm text-gray-500 mt-1">Sua biblioteca de prompts e stacks Vibe Coding.</p>
      </header>

      <div className="grid gap-4">
        {/* Placeholder Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg leading-tight">SaaS Básico de Agendamento</h3>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-primary">Iniciante</span>
          </div>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">Template completo: Landing page, auth, dashboard e banco de dados pronto para rodar.</p>
          <div className="flex gap-2">
             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">Lovable</span>
             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">Supabase</span>
             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">Cursor</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Showcase() {
  return (
    <div className="space-y-6">
      <header className="py-4">
        <h1 className="text-2xl font-bold tracking-tight">Hall da Fama</h1>
        <p className="text-sm text-gray-500 mt-1">O que a comunidade está construindo hoje.</p>
      </header>
      <div className="flex justify-center items-center h-48 text-gray-400">Em Breve: Feed de projetos</div>
    </div>
  );
}

function Arsenal() {
  return (
    <div className="space-y-6">
      <header className="py-4">
        <h1 className="text-2xl font-bold tracking-tight">Arsenal AI</h1>
        <p className="text-sm text-gray-500 mt-1">Curadoria das melhores ferramentas testadas.</p>
      </header>
      <div className="flex justify-center items-center h-48 text-gray-400">Em Breve: Diretório Interativo</div>
    </div>
  );
}

function Perfil() {
  const user = getTelegramUser();
  const [profileData, setProfileData] = useState<{area_atuacao: string, experiencia_ia: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const telegramId = user?.id || 123456789; // Substitua por seu ID real para testes locais
      
      try {
        const { data, error } = await supabase
          .from('nc_users')
          .select('area_atuacao, experiencia_ia')
          .eq('telegram_id', telegramId)
          .single();

        if (error) throw error;
        if (data) setProfileData(data);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user?.id]);
  
  return (
    <div className="space-y-6">
      {!user?.id && (
        <div className="bg-orange-50 text-orange-800 p-3 rounded-xl shadow-sm text-xs font-mono break-all mb-4 border border-orange-200">
          <p className="font-bold mb-1">Vibe Coding Debug Mode:</p>
          <p><strong>Platform:</strong> {WebApp.platform || 'Unknown'}</p>
          <p><strong>URL atual:</strong> {window.location.href}</p>
          <p><strong>Tem InitData?</strong> {WebApp.initData ? 'Sim' : 'Não'}</p>
          <p className="mt-1"><i>O Telegram WebApp não repassou o User ID. Tente recarregar a página caso seja um problema de cache do aplicativo no celular.</i></p>
          <button onClick={() => window.location.reload()} className="mt-2 w-full bg-orange-200 hover:bg-orange-300 text-orange-900 px-3 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer">
            🔄 Recarregar Aplicativo (Limpar Cache)
          </button>
        </div>
      )}
      <header className="py-4 text-center">
        {user?.photo_url ? (
          <img src={user.photo_url} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-3 shadow-md" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-orange-300 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {user?.first_name?.charAt(0) || "U"}
          </div>
        )}
        <h1 className="text-xl font-bold">{user?.first_name || "Construtor"} {user?.last_name || ""}</h1>
        {user?.username ? (
          <p className="text-sm text-gray-500">@{user.username}</p>
        ) : (
          <p className="text-sm text-gray-500">Membro Oficial</p>
        )}
      </header>
      
      {/* Builder Card */}
      <div className="relative overflow-hidden bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <h3 className="uppercase text-[10px] font-bold text-gray-400 tracking-wider mb-4">Builder Card</h3>
        <div className="space-y-4">
          <div>
            <span className="block text-xs text-gray-500 mb-1">Especialidade</span>
            <span className="font-semibold text-lg">{loading ? 'Carregando...' : (profileData?.area_atuacao || 'Não definida')}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 mb-1">Nível IA</span>
            <span className="font-semibold text-lg text-primary">{loading ? 'Carregando...' : (profileData?.experiencia_ia || 'Não definido')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Garantir que o SDK está disponível antes de chamar métodos específicos do Telegram
    if (typeof WebApp !== 'undefined' && WebApp.ready) {
      try {
        WebApp.ready();
        WebApp.expand();
        WebApp.setHeaderColor('#FAF9F6');
      } catch (err) {
        console.warn("Erro ao iniciar WebApp:", err);
      }
    }
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Cofre />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/arsenal" element={<Arsenal />} />
          <Route path="/profile" element={<Perfil />} />
        </Routes>
      </Layout>
    </Router>
  );
}
