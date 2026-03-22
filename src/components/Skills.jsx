import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Server, Cpu, Database, PieChart, Layers, Wrench, Users } from 'lucide-react';
import './Skills.css';

const skillCategories = [
  {
    title: "AI / Machine Learning",
    icon: <Cpu className="skill-cat-icon" />,
    skills: ["NLP", "TF-IDF", "Predictive Modeling", "Feature Engineering", "Model Evaluation", "Cross Validation", "RAG", "LLM-based systems"]
  },
  {
    title: "Data Analytics & Viz",
    icon: <PieChart className="skill-cat-icon" />,
    skills: ["Excel", "Power BI", "Tableau", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn"]
  },
  {
    title: "Languages",
    icon: <span className="skill-cat-icon">{`</>`}</span>,
    skills: ["Python", "SQL", "Java", "C++"]
  },
  {
    title: "Data Engineering",
    icon: <Layers className="skill-cat-icon" />,
    skills: ["Data Cleaning", "Data Pipelines", "ETL Processes", "Data Transformation"]
  },
  {
    title: "Databases",
    icon: <Database className="skill-cat-icon" />,
    skills: ["PostgreSQL", "Relational DB Design", "SQL Optimization"]
  },
  {
    title: "Tools & Soft Skills",
    icon: <Wrench className="skill-cat-icon" />,
    skills: ["Git", "GitHub", "Postman", "Communication", "Leadership", "Problem-Solving", "Adaptability"]
  }
];

import DataPipeline3D from './DataPipeline3D.jsx';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="skills" className="section">
      <div className="container" ref={ref}>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Tech <span className="gradient-text">Stack</span>
        </motion.h2>

        <motion.div 
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {skillCategories.map((category, idx) => (
            <motion.div key={idx} variants={itemVariants} className="skill-card glass-card">
              <div className="skill-header">
                {category.icon}
                <h3>{category.title}</h3>
              </div>
              <div className="skill-tags">
                {category.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="badge">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 3D Pipeline Visual */}
        <motion.div 
          className="pipeline-3d-wrapper mt-5"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="pipeline-header">
              <h3 className="gradient-text">End-to-End Data Workflow</h3>
              <p>Visualizing the journey from raw data to actionable insights.</p>
          </div>
          <DataPipeline3D />
          <div className="pipeline-labels">
            <div className="label-item">Data Source</div>
            <div className="label-item">Pipeline</div>
            <div className="label-item">Model</div>
            <div className="label-item accent-node">Insights</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
