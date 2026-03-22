import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Experience from './components/Experience.jsx';
import Certifications from './components/Certifications.jsx';
import Achievements from './components/Achievements.jsx';
import Miscellaneous from './components/Miscellaneous.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ParticlesBackground from './components/ParticlesBackground.jsx';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [dataStream, setDataStream] = useState([]);

  useEffect(() => {
    // Generate random data stream for the loading screen
    const interval = setInterval(() => {
      setDataStream(prev => {
        const stream = [...prev, Math.random().toString(36).substring(2, 8).toUpperCase()];
        return stream.slice(-5);
      });
    }, 150);

    // Simulate loading a bit longer to show the animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="data-pipeline-loader">
          <div className="isometric-plane">
            <div className="grid-lines"></div>

            <div className="server-node source">
              <div className="cube-layer"></div>
              <div className="cube-layer"></div>
              <div className="cube-layer"></div>
              <span className="node-label">RAW_DATA</span>
            </div>

            <div className="pipeline-track track-1">
              <div className="data-packet p1"></div>
              <div className="data-packet p2"></div>
            </div>

            <div className="server-node etl">
              <div className="processing-core">
                <div className="ring r1"></div>
                <div className="ring r2"></div>
              </div>
              <span className="node-label">ETL_PIPELINE</span>
            </div>

            <div className="pipeline-track track-2">
              <div className="data-packet p3"></div>
              <div className="data-packet p4"></div>
            </div>

            <div className="server-node analytics">
              <div className="chart-bars">
                <div className="bar b1"></div>
                <div className="bar b2"></div>
                <div className="bar b3"></div>
              </div>
              <span className="node-label">METRICS</span>
            </div>
          </div>
        </div>

        <div className="loader-telemetry">
          <div className="loader-text gradient-text">INITIALIZING DATA PIPELINES...</div>
          <div className="data-stream">
            {dataStream.map((packet, i) => (
              <span key={i} className="stream-packet">0x{packet}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <ParticlesBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Achievements />
        <Miscellaneous />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
