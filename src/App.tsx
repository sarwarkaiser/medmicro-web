import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { MedicationsPage } from './pages/MedicationsPage';
import { MedicationDetailPage } from './pages/MedicationDetailPage';
import { GuidelinesPage } from './pages/GuidelinesPage';
import { CriteriaPage } from './pages/CriteriaPage';
import { InteractionsPage } from './pages/InteractionsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { RecentPage } from './pages/RecentPage';
import { useMedications } from './hooks/useMedications';
import { useGuidelines } from './hooks/useMedications';
import { useCriteria } from './hooks/useMedications';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        const url = new URL(anchor.href);
        if (url.pathname !== currentPath) {
          e.preventDefault();
          window.history.pushState({}, '', anchor.href);
          setCurrentPath(url.pathname);
          window.scrollTo(0, 0);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [currentPath]);

  return (
    <Layout>
      <Router currentPath={currentPath} />
    </Layout>
  );
}

function Router({ currentPath }: { currentPath: string }) {
  const { medications, loading: medsLoading } = useMedications();
  const { guidelines, loading: guidesLoading } = useGuidelines();
  const { criteria, loading: criteriaLoading } = useCriteria();

  // Extract ID from path
  const medMatch = currentPath.match(/^\/medications\/(.+)$/);
  const medId = medMatch ? medMatch[1] : null;

  if (currentPath === '/' || currentPath === '/medications') {
    return <MedicationsPage medications={medications} loading={medsLoading} />;
  }

  if (medId) {
    return <MedicationDetailPage id={medId} medications={medications} />;
  }

  if (currentPath === '/guidelines') {
    return <GuidelinesPage guidelines={guidelines} loading={guidesLoading} />;
  }

  if (currentPath === '/criteria') {
    return <CriteriaPage criteria={criteria} loading={criteriaLoading} />;
  }

  if (currentPath === '/interactions') {
    return <InteractionsPage medications={medications} />;
  }

  if (currentPath === '/favorites') {
    return <FavoritesPage medications={medications} guidelines={guidelines} criteria={criteria} />;
  }

  if (currentPath === '/recent') {
    return <RecentPage medications={medications} guidelines={guidelines} criteria={criteria} />;
  }

  // Default to medications page
  return <MedicationsPage medications={medications} loading={medsLoading} />;
}

export default App;
