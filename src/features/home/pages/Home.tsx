import About from '../components/About';
import Projects from '../components/Projects';
import Features from '../components/Features';
import Team from '../components/Team';
import Contact from '../components/Contact';
import Hero from '@/shared/components/Hero';

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Features />
      <Team />
      <Contact />
    </>
  );
};

export default Home;
