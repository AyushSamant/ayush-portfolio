import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import './Projects.css';

const projects = [
  {
    title: "NivaranAI",
    subtitle: "AI-Powered Citizen Grievance Redressal System",
    description: "Built a full-stack grievance system with role-based access. Features AI routing and SLA tracking across 11 government departments using an NLP + ML pipeline via TF-IDF for automated classification and urgency-based routing. Integrated an LLM-powered RAG chatbot, secure JWT authentication, and voice input support.",
    stack: ["Python", "Django", "DRF", "Scikit-learn", "FAISS", "DeepSeek LLM", "PostgreSQL", "JWT"],
    featured: true,
    github: "https://github.com/AyushSamant",
    demo: "#"
  },
  {
    title: "PredictWise",
    subtitle: "Student Status Prediction System",
    description: "Built a machine learning system to predict student health and academic performance using historical dataset. Evaluated several models using cross-validation and implemented an end-to-end ML workflow from preprocessing to predictive analysis.",
    stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn"],
    featured: false,
    github: "https://github.com/AyushSamant",
    demo: "#"
  },
  {
    title: "MGNREGA Analytics",
    subtitle: "Data Analytics Dashboard",
    description: "Engineered an Excel dashboard visualizing employment metrics and project performance. Improved reporting efficiency through interactive visualizations and enabled data-driven decision-making through analytics.",
    stack: ["Excel", "Data Visualization", "Analytics"],
    featured: false,
    github: "https://github.com/AyushSamant",
    demo: "#"
  }
];

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" className="section bg-alt">
      <div className="container" ref={ref}>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="gradient-text">Projects</span>
        </motion.h2>

        <div className="projects-grid">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx} 
              className={`project-card glass-card ${project.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + (idx * 0.2) }}
            >
              <div className="project-content">
                {project.featured && (
                  <div className="featured-badge">Flagship Project</div>
                )}
                <h3 className="project-title">{project.title}</h3>
                <h4 className="project-subtitle">{project.subtitle}</h4>
                
                <p className="project-desc">{project.description}</p>
                
                <div className="project-stack">
                  {project.stack.map((tech, tIdx) => (
                    <span key={tIdx} className="tech-badge">{tech}</span>
                  ))}
                </div>
                
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noreferrer" className="p-link">
                    <Github size={18} /> Source Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
