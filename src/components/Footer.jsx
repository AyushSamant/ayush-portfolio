import React from 'react';
import { Link } from 'react-scroll';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-alt">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="hero" smooth={true} duration={500} className="logo-text cursor-pointer">
              <span>A</span>yush<span className="accent">.</span>
            </Link>
            <p className="footer-desc">
              Data Scientist | Machine Learning Engineer | Data Analyst<br/>
              Building intelligent systems from raw data.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                <li><Link to="about" smooth={true} duration={500} offset={-50}>About</Link></li>
                <li><Link to="skills" smooth={true} duration={500} offset={-50}>Skills</Link></li>
                <li><Link to="projects" smooth={true} duration={500} offset={-50}>Projects</Link></li>
                <li><Link to="contact" smooth={true} duration={500} offset={-50}>Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Connect</h4>
              <div className="footer-socials">
                <a href="https://linkedin.com/in/ayushsamant/" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
                <a href="https://github.com/AyushSamant" target="_blank" rel="noreferrer"><Github size={20} /></a>
                <a href="mailto:ayushsamant007@gmail.com"><Mail size={20} /></a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} Ayush Samant. All rights reserved.
          </div>
          
          <Link to="hero" smooth={true} duration={500} className="back-to-top">
             <ArrowUp size={18} /> Back to Top
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
