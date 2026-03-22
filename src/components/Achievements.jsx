import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Code2, Users, Trophy } from 'lucide-react';
import './Achievements.css';

const achievements = [
  {
    icon: <Code2 size={24} />,
    title: "250+ DSA Problems Solved",
    desc: "Strong foundation in problem-solving, algorithm design, and edge-case analysis.",
    color: "var(--accent-primary)"
  },
  {
    icon: <Trophy size={24} />,
    title: "Top 50 Finalist (800+ teams)",
    desc: "Smart India Hackathon (SIH) Internals 2025",
    color: "#ffbd2e"
  },
  {
    icon: <Award size={24} />,
    title: "1st Position",
    desc: "Catalyzing Concepts 2025, IIT Ropar",
    color: "var(--accent-secondary)"
  },
  {
    icon: <Award size={24} />,
    title: "Runner-Up",
    desc: "Infineon Hackathon",
    color: "#ff5f56"
  },
  {
    icon: <Users size={24} />,
    title: "COO, Optimus (DSO)",
    desc: "Led operational execution and team coordination.",
    color: "#27c93f"
  }
];

const galleryImages = [
  "/Advitiya%20Winner%20Pic.jpeg",
  "/WhatsApp%20Image%202026-03-22%20at%2010.32.25%20PM.jpeg",
  "/WhatsApp%20Image%202026-03-22%20at%2010.26.35%20PM.jpeg",
  "/WhatsApp%20Image%202025-10-31%20at%2020.30.33_2493e7d9.jpg",
  "/WhatsApp%20Image%202026-03-22%20at%2010.26.36%20PM.jpeg",
  "/WhatsApp%20Image%202026-03-22%20at%2010.26.36%20PM%20(1).jpeg",
  "/WhatsApp%20Image%202026-03-22%20at%2010.26.35%20PM%20(1).jpeg",
  "/WhatsApp%20Image%202026-03-22%20at%2010.26.35%20PM%20(2).jpeg"
];

const Achievements = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section id="achievements" className="section achievements-section">
      <div className="container" ref={ref}>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Hackathons & <span className="gradient-text">Leadership</span>
        </motion.h2>

        <motion.div 
          className="achievements-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {achievements.map((item, idx) => (
            <motion.div 
              key={idx} 
              className="achievement-card glass-card"
              variants={itemVariants}
            >
              <div className="card-content">
                <div 
                  className="ach-icon" 
                  style={{ 
                    color: item.color, 
                    boxShadow: `0 0 15px ${item.color}30`,
                    border: `1px solid ${item.color}30`
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="ach-title">{item.title}</h3>
                <p className="ach-desc">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gallery Slider */}
        <motion.div 
          className="achievements-gallery"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="gallery-track">
            {/* Double the images for infinite scroll effect */}
            {[...galleryImages, ...galleryImages].map((img, i) => (
              <div key={i} className="gallery-item">
                <img src={img} alt={`Achievement ${i}`} loading="lazy" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
