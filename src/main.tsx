import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navigation from './Navigation.tsx';
import Randomizer from './pages/Randomizer/Randomizer.tsx';
import Footer from './Footer.tsx';
import Statistics from './pages/Statistics/Statistics.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Games from './pages/Games/Games.tsx';
import Users from './pages/Users/Users.tsx';
import GameDetails from './pages/Games/GameDetails.tsx';

const rootElement = document.getElementById('root');
if (rootElement !== null) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <Navigation />
      <main className="section">
        <div className="container">
          <Router>
            <Routes>
              <Route path="/" element={<Randomizer />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:gameId" element={<GameDetails />} />
              <Route path="/users" element={<Users />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </div>
      </main>
      <Footer />
    </StrictMode>,
  );
}
