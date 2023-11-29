import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import Navigation from './Navigation.tsx';
import Randomizer from './pages/Randomizer/Randomizer.tsx';
import Footer from './Footer.tsx';
import Statistics from './pages/Statistics/Statistics.tsx';

  const router = createBrowserRouter([
  {
    path: '/',
    element: <Randomizer />
  },
  {
    path: '/stats',
    element: <Statistics />
  }
]);

const rootElement = document.getElementById('root');
if (rootElement !== null) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <Navigation />
      <main className="section">
        <div className="container">
          <RouterProvider router={router} />
        </div>
      </main>
      <Footer />
    </StrictMode>,
  );
}
