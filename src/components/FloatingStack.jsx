import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Layers, RefreshCw, BarChart2, Globe } from 'lucide-react';

const SKILLS = [
  {
    name: 'Python',
    icon: Terminal,
    desc: 'Primary language for ML development, NLP pipelines & web APIs.',
    metrics: { confidence: '99.4%', latency: '2ms', loss: '0.001', extra: 'GPU Accelerated' },
    color: 'rgba(0, 240, 255, 0.15)',
    borderColor: 'var(--accent-cyan)'
  },
  {
    name: 'TensorFlow',
    icon: Cpu,
    desc: 'Deep learning models, CNN architectures, and real-time pest detection.',
    metrics: { confidence: '91.0%', latency: '14ms', loss: '0.045', extra: 'CNN v3 Layers' },
    color: 'rgba(157, 78, 221, 0.15)',
    borderColor: 'var(--accent-purple)'
  },
  {
    name: 'Transformers',
    icon: Layers,
    desc: 'NLP architectures, BERT/RoBERTa implementations for evaluation systems.',
    metrics: { confidence: '96.8%', latency: '22ms', loss: '0.021', extra: 'Attention Layers Active' },
    color: 'rgba(0, 240, 255, 0.15)',
    borderColor: 'var(--accent-cyan)'
  },
  {
    name: 'NLP',
    icon: RefreshCw,
    desc: 'Natural Language Processing, text mining, semantic evaluations & embeddings.',
    metrics: { confidence: '98.2%', latency: '8ms', loss: '0.012', extra: 'Word2Vec / BERT' },
    color: 'rgba(157, 78, 221, 0.15)',
    borderColor: 'var(--accent-purple)'
  },
  {
    name: 'Flask',
    icon: Globe,
    desc: 'Micro-services framework for serving trained ML/NLP model inferences.',
    metrics: { confidence: '95.0%', latency: '5ms', status: '200 OK', extra: 'REST API Gateway' },
    color: 'rgba(0, 240, 255, 0.15)',
    borderColor: 'var(--accent-cyan)'
  },
  {
    name: 'Django',
    icon: BarChart2,
    desc: 'Robust full-stack systems, secure data models & operational databases.',
    metrics: { confidence: '92.5%', latency: '18ms', status: 'Active', extra: 'ORM / Postgres' },
    color: 'rgba(157, 78, 221, 0.15)',
    borderColor: 'var(--accent-purple)'
  }
];

export default function FloatingStack() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div style={styles.grid}>
      {SKILLS.map((skill, index) => {
        const Icon = skill.icon;
        const isHovered = hoveredIndex === index;
        
        // Stagger the vertical floating offset so they feel organic
        const floatDuration = 3.5 + (index % 3) * 0.5;
        const floatDelay = index * 0.2;

        return (
          <motion.div
            key={skill.name}
            style={{
              ...styles.card,
              backgroundColor: isHovered ? skill.color : 'var(--bg-card)',
              borderColor: isHovered ? skill.borderColor : 'var(--border-color)',
              boxShadow: isHovered 
                ? `0 10px 30px rgba(${skill.borderColor === 'var(--accent-cyan)' ? '0, 240, 255' : '157, 78, 221'}, 0.2)`
                : '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            animate={{
              y: [0, -10, 0],
            }}
            // Framer motion float loop
            animateOptions={{
              y: {
                duration: floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay
              }
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div style={styles.cardHeader}>
              <div 
                style={{
                  ...styles.iconWrapper,
                  backgroundColor: skill.borderColor + '15',
                  borderColor: skill.borderColor
                }}
              >
                <Icon size={20} color={skill.borderColor === 'var(--accent-cyan)' ? '#00f0ff' : '#bd59ff'} />
              </div>
              <h3 
                className={isHovered ? "glitch-text text-glow-cyan" : ""}
                data-text={skill.name}
                style={{
                  ...styles.title,
                  color: isHovered ? '#fff' : 'var(--text-primary)'
                }}
              >
                {skill.name}
              </h3>
            </div>
            
            <p style={styles.desc}>{skill.desc}</p>

            {/* Inference telemetry reveal on hover */}
            <div 
              style={{
                ...styles.telemetry,
                maxHeight: isHovered ? '120px' : '0px',
                opacity: isHovered ? 1 : 0,
                borderColor: skill.borderColor + '40'
              }}
            >
              <div style={styles.telemetryHeader}>
                <span style={{ color: skill.borderColor }}>⚡ MODEL_INFERENCE</span>
                <span style={styles.blinkDot}></span>
              </div>
              <div style={styles.telemetryContent}>
                <div><span style={styles.lbl}>ACCURACY:</span> {skill.metrics.confidence}</div>
                <div><span style={styles.lbl}>LATENCY:</span> {skill.metrics.latency}</div>
                {skill.metrics.loss && <div><span style={styles.lbl}>LOSS:</span> {skill.metrics.loss}</div>}
                {skill.metrics.status && <div><span style={styles.lbl}>HTTP_STATUS:</span> {skill.metrics.status}</div>}
                <div><span style={styles.lbl}>TELEMETRY:</span> {skill.metrics.extra}</div>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '2.5rem',
  },
  card: {
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '12px',
    padding: '1.75rem',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: '600',
    letterSpacing: '-0.02em',
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '1rem',
  },
  telemetry: {
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    backgroundColor: '#030307',
    borderRadius: '6px',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  telemetryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.4rem 0.6rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    fontWeight: 'bold',
  },
  blinkDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px #10b981',
    animation: 'blink 1.5s infinite',
  },
  telemetryContent: {
    padding: '0.6rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.3rem',
    color: '#e2e8f0',
  },
  lbl: {
    color: 'var(--text-muted)',
    fontWeight: '600',
  }
};
