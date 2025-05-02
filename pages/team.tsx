import { Navigation } from './components/Navigation';
import { Team } from './components/Team';
import { Footer } from './components/Footer';

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf0e7] via-[#e8d8f3] to-[#d5f3f3]">
      <Navigation />
      <Team />
      <Footer />
    </div>
  );
};

export default TeamPage;