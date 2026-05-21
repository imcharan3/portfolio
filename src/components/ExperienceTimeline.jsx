import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react';

const EXPERIENCES = [
  {
    role: 'AI Machine Training Intern',
    company: 'Eshasri Tech Solutions',
    period: 'Jan 2026 - Present',
    location: 'Remote / Hybrid',
    description: 'Spearheading the development and refinement of scalable Machine Learning systems and deep training architectures.',
    bulletPoints: [
      'Engineered scalable NLP evaluation models and fine-tuned pre-trained transformer pipelines for high-accuracy analysis.',
      'Developed high-fidelity inference wrappers to host PyTorch/TensorFlow models with minimal latency.',
      'Implemented automated pipeline architectures to process, clean, and enrich model training datasets.'
    ],
    accent: 'var(--accent-cyan)',
    pulseClass: 'pulse-dot'
  },
  {
    role: 'Data Analytics Intern',
    company: 'Aspire Primo Grade',
    period: 'June 2025 - Sept 2025',
    location: 'On-site',
    description: 'Delivered deep analytical insights, turning complex business telemetry datasets into actionable operational intelligence.',
    bulletPoints: [
      'Designed and engineered interactive BI dashboards in Power BI and Streamlit, automating critical weekly intelligence reports.',
      'Aggregated business metrics across disparate relational databases using optimized SQL and custom Pandas pipelines.',
      'Conducted visual exploratory data analyses (EDA) to map growth trends and pinpoint critical structural inefficiencies.'
    ],
    accent: 'var(--accent-purple)',
    pulseClass: 'pulse-dot-purple'
  }
];

export default function ExperienceTimeline() {
  return (
    <div style={styles.timelineContainer}>
      {/* Pulse Line - Vertical data stream */}
      <div style={styles.verticalStreamLine} />

      {/* Experience Entries */}
      <div style={styles.list}>
        {EXPERIENCES.map((exp, index) => {
          return (
            <div key={exp.company + index} style={styles.timelineRow}>
              
              {/* Timeline dot node */}
              <div style={styles.nodeColumn}>
                <motion.div
                  className={exp.pulseClass}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: 'spring', stiffness: 200, delay: index * 0.2 }}
                  style={{
                    backgroundColor: exp.accent,
                    boxShadow: `0 0 15px ${exp.accent}`
                  }}
                />
              </div>

              {/* Glass Card content */}
              <motion.div
                className="glass-panel"
                style={{
                  ...styles.card,
                  borderLeft: `3px solid ${exp.accent}`
                }}
                initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, type: 'spring' }}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.roleTitle}>{exp.role}</h3>
                    <h4 style={{ ...styles.companyTitle, color: exp.accent }}>{exp.company}</h4>
                  </div>
                  <Briefcase size={22} color={exp.accent} style={styles.briefcaseIcon} />
                </div>

                <div style={styles.metaRow}>
                  <div style={styles.metaItem}>
                    <Calendar size={14} color="var(--text-muted)" />
                    <span style={styles.metaText}>{exp.period}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <MapPin size={14} color="var(--text-muted)" />
                    <span style={styles.metaText}>{exp.location}</span>
                  </div>
                </div>

                <p style={styles.description}>{exp.description}</p>

                <ul style={styles.bulletList}>
                  {exp.bulletPoints.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} style={styles.bulletItem}>
                      <CheckCircle 
                        size={14} 
                        color={exp.accent} 
                        style={{ flexShrink: 0, marginTop: '3px' }} 
                      />
                      <span style={styles.bulletText}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  timelineContainer: {
    position: 'relative',
    maxWidth: '900px',
    margin: '3rem auto 0',
    padding: '0 1rem',
  },
  verticalStreamLine: {
    position: 'absolute',
    left: '20px',
    top: '10px',
    bottom: '10px',
    width: '3px',
    background: 'linear-gradient(to bottom, var(--accent-cyan), var(--accent-purple))',
    boxShadow: '0 0 10px rgba(0, 240, 255, 0.25)',
    borderRadius: '4px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
  },
  timelineRow: {
    display: 'flex',
    position: 'relative',
    alignItems: 'flex-start',
  },
  nodeColumn: {
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '0px',
    top: '1.8rem',
    zIndex: 5,
  },
  card: {
    marginLeft: '50px',
    flex: 1,
    padding: '2rem',
    textAlign: 'left',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  roleTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    marginBottom: '0.2rem',
  },
  companyTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    letterSpacing: '0.02em',
  },
  briefcaseIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  metaRow: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '0.75rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  metaText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
  },
  description: {
    color: 'var(--text-primary)',
    fontSize: '0.98rem',
    lineHeight: '1.5rem',
    marginBottom: '1.25rem',
  },
  bulletList: {
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  bulletItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  bulletText: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.4',
  }
};
