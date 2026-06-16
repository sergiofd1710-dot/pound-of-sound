import { useCallback, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/common/AuthModal';
import { ListingForm } from './components/listings/ListingForm';
import { HomePage } from './routes/HomePage';
import { AppraisalPage } from './routes/AppraisalPage';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './components/common/Toast';

export default function App() {
  const { user } = useAuth();
  const toast = useToast();

  const [authOpen, setAuthOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const requireAuth = useCallback(() => setAuthOpen(true), []);

  // «+ Объявление» / «Продать»: требуем вход, иначе открываем форму.
  const handleAddClick = useCallback(() => {
    if (!user) {
      setAuthOpen(true);
      toast('Войдите, чтобы подать объявление');
      return;
    }
    setAddOpen(true);
  }, [user, toast]);

  return (
    <>
      <Nav onAddClick={handleAddClick} onAuthClick={() => setAuthOpen(true)} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onSellClick={handleAddClick}
                onRequireAuth={requireAuth}
              />
            }
          />
          <Route path="/appraise" element={<AppraisalPage />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <ListingForm open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
