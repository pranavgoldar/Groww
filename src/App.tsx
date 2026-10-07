import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AskLensPage } from './pages/AskLens'
import { ExplorePage } from './pages/Explore'
import { HomePage } from './pages/Home'
import { IndexDetailPage } from './pages/IndexDetail'
import { LensPage } from './pages/Lens'
import { LensTimelinePage } from './pages/LensTimeline'
import { NotFound } from './pages/NotFound'
import { OnboardingPage } from './pages/Onboarding'
import { PortfolioPage } from './pages/Portfolio'
import { ProfilePage } from './pages/Profile'
import { StockDetailPage } from './pages/StockDetail'
import { AppStateProvider } from './state/AppState'
import { GlossaryProvider } from './state/Glossary'


export default function App() {
  return (
    <AppStateProvider>
      <GlossaryProvider>
        {/* Hash routing keeps the static build portable (any host, any sub-path). */}
        <HashRouter>
          <Routes>
            <Route path="/welcome" element={<OnboardingPage />} />
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="stock/:id" element={<StockDetailPage />} />
              <Route path="stock/:id/lens" element={<LensPage />} />
              <Route path="stock/:id/lens/timeline" element={<LensTimelinePage />} />
              <Route path="stock/:id/ask" element={<AskLensPage />} />
              <Route path="index/:id" element={<IndexDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </GlossaryProvider>
    </AppStateProvider>
  )
}
