import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, BrainCircuit, Terminal, Activity } from 'lucide-react';

const GithubIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const PROJECTS = [
  {
    id: 'project-a',
    title: 'NLP Answer Evaluation System',
    type: 'Natural Language Processing',
    summary: 'A full-stack semantic evaluator that matches student scripts against reference answers using BERT embeddings and cosine similarities.',
    highlights: 'Full-stack architecture with Flask backend, MySQL for high-efficiency script indexing, and HuggingFace transformers.',
    tags: ['Python', 'Transformers', 'Flask', 'MySQL', 'NLP', 'Cosine Similarity'],
    github: 'https://github.com/imcharan3/nlp-answer-evaluation',
    accent: 'var(--accent-cyan)',
    glowClass: 'text-glow-cyan',
    borderColor: 'rgba(0, 240, 255, 0.3)',
    logs: [
      '>> LOADING WEIGHTS: sentence-transformers/all-MiniLM-L6-v2',
      '>> ENCODING: Computing candidate embeddings...',
      '>> NLP_COMPASS: Matrix dot product mapping...',
      '>> ANALYZING EMBEDDINGS: Attention layers activated...',
      '>> [PREDICTION SUCCESS]: Semantic similarity score: 94.6%',
      '>> [MYSQL]: Storing response telemetry... 200 OK'
    ]
  },
  {
    id: 'project-b',
    title: 'AI-Powered Pest Detection',
    type: 'Computer Vision / CNN',
    summary: 'Deep learning vision system designed for agronomy, identifying crop diseases and agricultural pests in real-time.',
    highlights: 'TensorFlow CNN architecture achieving 91.0% detection accuracy. Deployed as a web app using Streamlit.',
    tags: ['Python', 'TensorFlow', 'CNN', 'Streamlit', 'Computer Vision', 'Image Processing'],
    github: 'https://github.com/imcharan3/ai-pest-detection',
    accent: 'var(--accent-purple)',
    glowClass: 'text-glow-purple',
    borderColor: 'rgba(157, 78, 221, 0.3)',
    logs: [
      '>> STREAMLIT API: Receiving frame buffer...',
      '>> TENSORFLOW: Loading CNN weight maps (v3.4.1)...',
      '>> INFERENCE PASSED: Resolving bounding boxes...',
      '>> LAYER CONV2D_4: Output channels processed...',
      '>> [DETECTION SUCCESS]: Pest: Tetranychus urticae (91.0%)',
      '>> [LATENCY]: Total frame inference processing time: 42ms'
    ]
  }
];

export default function ProjectCards() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.grid}>
      {PROJECTS.map((project, idx) => {
        const isHovered = hoveredCard === project.id;
        
        return (
          <motion.div
            key={project.id}
            className="glass-panel"
            style={{
              ...styles.card,
              borderColor: isHovered ? project.accent : 'var(--border-color)',
              boxShadow: isHovered 
                ? `0 15px 40px rgba(${project.accent === 'var(--accent-cyan)' ? '0, 240, 255' : '157, 78, 221'}, 0.15)`
                : '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
            onMouseEnter={() => setHoveredCard(project.id)}
            onMouseLeave={() => setHoveredCard(null)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
          >
            {/* Visual Indicator Top Banner */}
            <div 
              style={{
                ...styles.topBar,
                background: `linear-gradient(90deg, ${project.accent}15, transparent)`
              }}
            >
              <div style={styles.topBarLeft}>
                <BrainCircuit size={14} color={project.accent} />
                <span style={{ ...styles.typeText, color: project.accent }}>{project.type}</span>
              </div>
              <div style={styles.statusBadge}>
                <span 
                  style={{
                    ...styles.statusDot,
                    backgroundColor: isHovered ? '#10b981' : project.accent,
                    boxShadow: `0 0 8px ${isHovered ? '#10b981' : project.accent}`
                  }}
                />
                <span style={styles.statusText}>{isHovered ? 'INFERENCE ACTIVE' : 'MODEL IDLE'}</span>
              </div>
            </div>

            <div style={styles.cardContent}>
              <h3 style={styles.projectTitle}>{project.title}</h3>
              <p style={styles.summary}>{project.summary}</p>
              
              <div style={styles.highlightSection}>
                <strong style={{ color: project.accent }}>Highlight:</strong> {project.highlights}
              </div>

              {/* Tech Tags */}
              <div style={styles.tagsContainer}>
                {project.tags.map(tag => (
                  <span key={tag} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Live Simulated Model Telemetry Terminal */}
              <div 
                style={{
                  ...styles.terminal,
                  maxHeight: isHovered ? '190px' : '0px',
                  opacity: isHovered ? 1 : 0,
                  borderColor: project.accent + '35'
                }}
              >
                <div style={styles.terminalHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Terminal size={12} color={project.accent} />
                    <span style={{ color: project.accent, fontWeight: 'bold' }}>MODEL_PREDICTION_LOG</span>
                  </div>
                  <Activity size={12} color="#10b981" className="pulse-dot" />
                </div>
                <div style={styles.terminalLogs}>
                  {project.logs.map((log, lIdx) => (
                    <div key={lIdx} style={styles.logLine}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Links Footer */}
              <div style={styles.linksRow}>
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noreferrer"
                  style={styles.linkButton}
                  className="border-glow-cyan"
                >
                  <GithubIcon size={16} />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '2.5rem',
    marginTop: '3rem',
  },
  card: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topBar: {
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  typeText: {
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-mono)',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    transition: 'background-color 0.3s',
  },
  statusText: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
  },
  cardContent: {
    padding: '1.75rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  projectTitle: {
    fontSize: '1.45rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    marginBottom: '0.75rem',
    color: '#fff',
  },
  summary: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '1rem',
  },
  highlightSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.015)',
    borderLeft: '2px solid var(--text-muted)',
    padding: '0.6rem 0.8rem',
    borderRadius: '0 4px 4px 0',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    color: '#cbd5e1',
    marginBottom: '1.25rem',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  tag: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--text-secondary)',
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  terminal: {
    overflow: 'hidden',
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    backgroundColor: '#020205',
    borderRadius: '6px',
    borderWidth: '1px',
    borderStyle: 'solid',
    marginBottom: '1.5rem',
  },
  terminalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  terminalLogs: {
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    color: '#a7f3d0',
    maxHeight: '150px',
    overflowY: 'auto',
  },
  logLine: {
    lineHeight: '1.3',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  linksRow: {
    marginTop: 'auto',
    display: 'flex',
    gap: '1rem',
  },
  linkButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff',
    border: '1px solid var(--border-color)',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    transition: 'var(--transition-smooth)',
  }
};
