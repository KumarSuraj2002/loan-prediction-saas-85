
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import LoanPrediction from './LoanPrediction';
import BankRecommendation from './BankRecommendation';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="home" className="flex-1">
        <Hero />
        <LoanPrediction />
        <BankRecommendation />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
