import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, Github, FileText } from 'lucide-react';
import './Miscellaneous.css';

const data = [
  {
    icon: <Github size={30} />,
    title: "Open Source Contributions",
    text: "Open to contributing to data, AI, and developer-focused open source projects.",
    accent: "var(--accent-primary)"
  },
  {
    icon: <BookOpen size={30} />,
    title: "Blog & Technical Writing",
    subtitle: "Coming Soon",
    text: "I plan to share write-ups on Data Science, Machine Learning, AI systems, and project learnings.",
    accent: "var(--accent-secondary)"
  },
  {
    icon: <FileText size={30} />,
    title: "Research & Patents",
    text: "Research publications and patents will be updated here as I continue building and exploring.",
    accent: "var(--text-secondary)"
  }
];

const Miscellaneous = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="miscellaneous" className="section bg-alt pattern-bg">
      <div className="container" ref={ref}>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Continuous <span className="gradient-text">Learning</span>
        </motion.h2>

        <div className="misc-grid">
          {data.map((item, idx) => (
            <motion.div 
              key={idx}
              className="misc-card glass-card"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + (idx * 0.2) }}
            >
              <div className="misc-icon" style={{ color: item.accent }}>
                {item.icon}
              </div>
              <div className="misc-content">
                <h3>{item.title}</h3>
                {item.subtitle && <span className="misc-subtitle">{item.subtitle}</span>}
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Miscellaneous;
