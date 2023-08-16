import Navigation from './Navigation';
import Randomizer from './pages/Randomizer/Randomizer';

const App = () => {
  return (
    <>
      <Navigation />
      <main className="section">
        <div className="container">
          <Randomizer />
        </div>
      </main>
    </>
  );
};

export default App;
