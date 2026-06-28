import Header from './assets/Header.jsx';
import Home from './assets/Home.jsx';
import About from './assets/About.jsx';
import Contact from './assets/Contact.jsx'
import Skills from './assets/Skills.jsx'
import './App.css'
import Projects from './assets/Projects.jsx';
import Preloader from './assets/Preloader.jsx';
import React, { useState, useEffect } from 'react';
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [startHomeAnimation, setStartHomeAnimation] = useState(false);

  useEffect(() => {
    if (startHomeAnimation) {
      // 🚀 Force global recalculation of scroll spaces right when elements mount
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [startHomeAnimation]);

  return (
    <>
      {isLoading && (
        <Preloader
          onComplete={() => {
            setIsLoading(false);
            // Give the browser 50ms to paint the visible layout before starting animations
            setTimeout(() => {
              setStartHomeAnimation(true);
            }, 50);
          }}
        />
      )}

      {/* Ensure content is strictly unhidden or mounted */}
      <main className={`main-site-content ${isLoading ? 'hidden' : 'visible'}`}>
        <Header readyToAnimate={startHomeAnimation} />
        <Home readyToAnimate={startHomeAnimation} />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>);
}
export default App;

