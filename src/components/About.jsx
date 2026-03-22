import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Database, Brain, Code, Terminal } from 'lucide-react';
import './About.css';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const cards = [
    {
      icon: <Database className="card-icon" />,
      title: "Data Engineering",
      desc: "Architecting scalable data pipelines and ETL processes."
    },
    {
      icon: <Brain className="card-icon" />,
      title: "Machine Learning",
      desc: "Building predictive models and intelligent AI systems."
    },
    {
      icon: <Terminal className="card-icon" />,
      title: "Data Analytics",
      desc: "Transforming complex datasets into actionable insights."
    },
    {
      icon: <Code className="card-icon" />,
      title: "Software Dev",
      desc: "Developing full-stack applications with robust backends."
    }
  ];

  return (
    <section id="about" className="section bg-alt pattern-bg">
      <div className="container" ref={ref}>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          About <span className="gradient-text">Me</span>
        </motion.h2>

        <div className="about-content grid-2">
          <motion.div 
            className="about-text-wrapper glass-card"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="terminal-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
              <span className="terminal-title">ayush_profile.json</span>
            </div>
            
            <div className="about-text">
              <p>
                I am an aspiring <strong className="gradient-text">Data Analyst / Machine Learning Engineer / Data Engineer</strong> with a strong interest in building intelligent systems.
              </p>
              <br/>
              <p>
                I thrive on working through end-to-end solutions—from data preprocessing and ML pipelines to analytics dashboards and AI-powered applications. I enjoy transforming complex, unstructured datasets into useful insights and scalable platforms that solve real-world problems.
              </p>
              <br/>
              <p>
                Beyond technical execution, I blend data science with strong communication, leadership, and design thinking to ensure the products I build are both powerful and user-centric.
              </p>
              
              <div className="stats-row mt-4">
                <div className="stat-item">
                  <span className="stat-num">250+</span>
                  <span className="stat-label">DSA Solved</span>
                </div>
                <div className="divider"></div>
                <div className="stat-item">
                  <span className="stat-num">3+</span>
                  <span className="stat-label">Data Projects</span>
                </div>
                <div className="divider"></div>
                <div className="stat-item">
                  <span className="stat-num">1st</span>
                  <span className="stat-label">Place Hackathons</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="about-cards">
            {cards.map((card, idx) => (
              <motion.div 
                key={idx}
                className="feature-card glass-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
              >
                <div className="icon-wrapper">
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
