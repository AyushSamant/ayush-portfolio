import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';
import { Github, Linkedin, Mail, ArrowRight, Download } from 'lucide-react';
import './Hero.css';

const roles = [
  "Data Scientist",
  "Data Analyst",
  "Data Engineer",
  "ML Engineer"
];

const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);

    const picInterval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 4000);

    return () => {
      clearInterval(roleInterval);
      clearInterval(picInterval);
    };
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-badge"
          >
            <span className="pulse-dot"></span>
            Available for Opportunities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hero-title"
          >
            Hi, I'm <span className="gradient-text">Ayush Samant</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="role-container"
          >
            <h2>
              I'm a <br className="mobile-break" />
              <div className="role-slider">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentRole}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="accent-role gradient-text"
                  >
                    {roles[currentRole]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hero-description"
          >
            I turn raw data into intelligent systems and decisions. 
            Passionate about building ML pipelines, analytics dashboards, 
            and scalable AI-powered applications that solve real-world problems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="hero-actions"
          >
            <Link to="projects" smooth={true} duration={500} offset={-50}>
              <button className="btn btn-primary">
                View Projects <ArrowRight size={18} />
              </button>
            </Link>
            
            <a href="/General%20CV.pdf" download="Ayush_Samant_Resume.pdf" target="_blank" rel="noreferrer" className="btn btn-outline">
                Download Resume <Download size={18} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="social-links"
          >
            <a href="https://linkedin.com/in/ayushsamant/" target="_blank" rel="noreferrer" className="social-icon">
              <Linkedin size={22} />
            </a>
            <a href="https://github.com/AyushSamant" target="_blank" rel="noreferrer" className="social-icon">
              <Github size={22} />
            </a>
            <a href="mailto:ayushsamant007@gmail.com" className="social-icon">
              <Mail size={22} />
            </a>
          </motion.div>
        </div>

        {/* ── Profile Picture ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-visual"
        >
          <div className="profile-pic-wrapper">
            {/* Decorative animated rings */}
            <div className="profile-ring ring-outer"></div>
            <div className="profile-ring ring-mid"></div>
            {/* Floating data nodes */}
            <div className="floating-nodes">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`node node-${i}`}></div>
              ))}
            </div>
            {/* The actual photo - Coin implementation */}
            <div className="profile-pic-frame">
              <div className="coin-inner" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                <div className="coin-face coin-front">
                  <img src="/profile.jpg" alt="Ayush Samant" className="profile-pic" />
                </div>
                <div className="coin-face coin-back">
                  <img src="/pp.jpg" alt="Ayush Samant" className="profile-pic" />
                </div>
              </div>
            </div>
            {/* Accent corner lines */}
            <div className="corner-accent top-left"></div>
            <div className="corner-accent top-right"></div>
            <div className="corner-accent bottom-left"></div>
            <div className="corner-accent bottom-right"></div>
          </div>
        </motion.div>
      </div>

      <div className="scroll-indicator">
        <Link to="about" smooth={true} duration={500} offset={-50}>
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
