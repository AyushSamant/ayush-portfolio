import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase } from 'lucide-react';
import './Experience.css';

const experiences = [
  {
    role: "Summer Training in UI/UX",
    company: "Feedify App Project",
    period: "Past",
    description: [
      "Conducted user research and developed high-fidelity prototypes.",
      "Improved navigation efficiency by 40% through better information architecture.",
      "Built 'Feedify App' with a robust food donation system.",
      "Drove significant user engagement improvement.",
      "Applied design thinking and user-centric methodologies to solve real problems."
    ]
  },
  {
    role: "Chief Operating Officer (COO)",
    company: "Optimus (DSO)",
    period: "Past",
    description: [
      "Led operational execution and team coordination for smooth organizational delivery.",
      "Streamlined inter-team workflows to maximise efficiency across all departments.",
      "Drove strategic operational decisions aligning teams with organizational objectives.",
      "Oversaw day-to-day functions ensuring accountability and high-performance standards.",
      "Acted as the central bridge between leadership and ground-level operations."
    ]
  },
  {
    role: "President",
    company: "ConverseE+ Club",
    period: "Past",
    description: [
      "Led club operations enhancing communication & leadership skills across members.",
      "Organised events, workshops, and competitions to promote public speaking excellence.",
      "Mentored junior members and fostered an inclusive culture of continuous learning.",
      "Collaborated with institutional bodies to represent the club at inter-college forums.",
      "Elevated club performance and visibility through structured goal-setting and follow-through."
    ]
  }
];

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="experience" className="section">
      <div className="container" ref={ref}>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Professional <span className="gradient-text">Experience</span>
        </motion.h2>

        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx} 
              className="timeline-item"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + (idx * 0.2) }}
            >
              <div className="timeline-dot">
                <Briefcase size={16} />
              </div>
              <div className="timeline-content glass-card">
                <div className="timeline-header">
                  <h3>{exp.role}</h3>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <h4 className="timeline-company">{exp.company}</h4>
                <ul className="timeline-desc">
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
          
          <motion.div 
            className="timeline-item future-item"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="timeline-dot pulsing-dot"></div>
            <div className="timeline-content border-dashed">
              <h3>Currently seeking Data Analytics / ML Engineer roles</h3>
              <p>Looking to bring impactful data solutions to your team.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
