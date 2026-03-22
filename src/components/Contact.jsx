import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, Send, MessageSquare, Linkedin, Github } from 'lucide-react';
import './Contact.css';

// ─── Web3Forms Configuration ─────────────────────────────────────────────────
// This key sends the owner notification to ayushsamant007@gmail.com.
// Web3Forms natively sends an auto-reply to the visitor when you set:
//   "autoresponse": true  and  "replyto": <visitor email>
// No extra service / API key needed — it's included with Web3Forms free plan.
const WEB3FORMS_KEY = 'd891f00d-fbe4-4eb3-a568-edec7fbd3a31';

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });

  const [status, setStatus] = useState({
    submitting: false, success: false, error: false, message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: false, message: '' });

    try {
      // ── Single Web3Forms call ─────────────────────────────────────────────
      // Web3Forms will:
      //  1. Deliver the notification email to the owner (ayushsamant007@gmail.com)
      //  2. Send an auto-reply copy to the visitor (formData.email) automatically
      //     because we set autoresponse:true and replyto = visitor's email.
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key:   WEB3FORMS_KEY,
          subject:      `[Portfolio] New message from ${formData.name}: ${formData.subject}`,
          name:         formData.name,
          email:        formData.email,          // visitor's email
          message:      formData.message,
          from_name:    'Ayush Samant | Portfolio',
          reply_to:     formData.email,          // ensure reply-to is set correctly
          // Auto-reply fields (Web3Forms feature)
          autoresponse: "true",                   // trigger the visitor copy (string true)
          botcheck:     false,
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Submission failed');

      setStatus({
        submitting: false, success: true, error: false,
        message: '✅ Message sent! A confirmation copy has been sent to your email.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(p => ({ ...p, success: false, message: '' })), 7000);

    } catch (err) {
      console.error('Contact form error:', err);
      setStatus({
        submitting: false, success: false, error: true,
        message: 'Oops! Something went wrong. Please email me directly at ayushsamant007@gmail.com',
      });
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container" ref={ref}>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Let's <span className="gradient-text">Connect</span>
        </motion.h2>

        <div className="contact-grid">
          {/* ── Info Panel ─────────────────────────────────────────────────── */}
          <motion.div
            className="contact-info glass-card"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Let's build something meaningful with data.</h3>
            <p className="contact-desc">
              Whether you have a question about my work, an opportunity to discuss,
              or just want to say hi — I'll get back to you!
            </p>

            <div className="info-items">
              <a href="mailto:ayushsamant007@gmail.com" className="info-item">
                <div className="info-icon"><Mail size={20} /></div>
                <div className="info-text">
                  <span>Email</span>
                  <p>ayushsamant007@gmail.com</p>
                </div>
              </a>

              <div className="info-item">
                <div className="info-icon"><Phone size={20} /></div>
                <div className="info-text">
                  <span>Phone</span>
                  <p>+91 7520035281</p>
                </div>
              </div>

              <a href="https://linkedin.com/in/ayushsamant/" target="_blank" rel="noreferrer" className="info-item">
                <div className="info-icon"><Linkedin size={20} /></div>
                <div className="info-text">
                  <span>LinkedIn</span>
                  <p>linkedin.com/in/ayushsamant/</p>
                </div>
              </a>

              <a href="https://github.com/AyushSamant" target="_blank" rel="noreferrer" className="info-item">
                <div className="info-icon"><Github size={20} /></div>
                <div className="info-text">
                  <span>GitHub</span>
                  <p>github.com/AyushSamant</p>
                </div>
              </a>
            </div>

            <div className="connection-visual">
              <div className="nodes-connection">
                <span className="node pulse"></span>
                <span className="line"></span>
                <span className="node pulse delay"></span>
                <span className="line"></span>
                <span className="node pulse"></span>
              </div>
            </div>
          </motion.div>

          {/* ── Form Panel ─────────────────────────────────────────────────── */}
          <motion.div
            className="contact-form glass-card"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="form-header">
              <MessageSquare size={24} className="form-header-icon" />
              <h3>Send a Message</h3>
            </div>

            {status.success && <div className="alert alert-success">{status.message}</div>}
            {status.error   && <div className="alert alert-error">{status.message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" id="name" name="name" className="form-control"
                    placeholder="John Doe" value={formData.name}
                    onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" id="email" name="email" className="form-control"
                    placeholder="john@example.com" value={formData.email}
                    onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input type="text" id="subject" name="subject" className="form-control"
                  placeholder="Opportunity / Collaboration" value={formData.subject}
                  onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea id="message" name="message" className="form-control"
                  rows="5" placeholder="Your message here..."
                  value={formData.message} onChange={handleChange} required />
              </div>

              <button
                type="submit"
                className={`btn btn-primary submit-btn ${status.submitting ? 'submitting' : ''}`}
                disabled={status.submitting}
              >
                {status.submitting ? (
                  <><span className="loader-spinner"></span> Sending...</>
                ) : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
