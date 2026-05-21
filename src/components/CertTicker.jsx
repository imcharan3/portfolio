import React from 'react';
import { Award, Shield, BarChart3, Eye } from 'lucide-react';

const CERTS = [
  {
    name: 'IBM AI Fundamentals',
    issuer: 'IBM',
    icon: Award,
    id: 'IBM-AI-883',
    glowColor: 'var(--accent-cyan)'
  },
  {
    name: 'NPTEL Privacy & Security',
    issuer: 'NPTEL (IIT)',
    icon: Shield,
    id: 'NPTEL-SEC-412',
    glowColor: 'var(--accent-purple)'
  },
  {
    name: 'TATA Data Visualization',
    issuer: 'TATA',
    icon: Eye,
    id: 'TATA-VIS-590',
    glowColor: 'var(--accent-cyan)'
  },
  {
    name: 'SkillUp Power BI',
    issuer: 'SkillUp',
    icon: BarChart3,
    id: 'SKILL-BI-204',
    glowColor: 'var(--accent-purple)'
  }
];

export default function CertTicker() {
  // Duplicate list to ensure a seamless continuous marquee scroll
  const scrollList = [...CERTS, ...CERTS, ...CERTS];

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionSub}>VALIDATED EXPERTISE</h3>
      <div className="marquee-container" style={styles.tickerWrapper}>
        <div className="marquee-content">
          {scrollList.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <div 
                key={index} 
                className="glass-panel" 
                style={{
                  ...styles.badgeCard,
                  borderColor: 'rgba(255, 255, 255, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = cert.glowColor;
                  e.currentTarget.style.boxShadow = `0 0 15px ${cert.glowColor}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div 
                  style={{
                    ...styles.iconContainer,
                    backgroundColor: cert.glowColor + '10',
                    borderColor: cert.glowColor + '40'
                  }}
                >
                  <Icon size={20} color={cert.glowColor === 'var(--accent-cyan)' ? '#00f0ff' : '#bd59ff'} />
                </div>
                <div style={styles.textContainer}>
                  <div style={styles.certName}>{cert.name}</div>
                  <div style={styles.issuerRow}>
                    <span style={styles.issuerLabel}>ISSUER:</span>
                    <span style={styles.issuerValue}>{cert.issuer}</span>
                    <span style={styles.idDivider}>|</span>
                    <span style={styles.idLabel}>HASH:</span>
                    <span style={styles.idValue}>{cert.id}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  section: {
    padding: '4rem 0',
    textAlign: 'center',
    width: '100vw',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    overflow: 'hidden',
  },
  sectionSub: {
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '0.2em',
    color: 'var(--text-muted)',
    marginBottom: '2rem',
    textTransform: 'uppercase',
  },
  tickerWrapper: {
    padding: '1rem 0',
  },
  badgeCard: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '1rem 2rem',
    margin: '0 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    whiteSpace: 'nowrap',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  certName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    letterSpacing: '-0.01em',
  },
  issuerRow: {
    display: 'flex',
    gap: '0.4rem',
    alignItems: 'center',
    marginTop: '0.2rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
  },
  issuerLabel: {
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  issuerValue: {
    color: 'var(--text-secondary)',
  },
  idDivider: {
    color: 'rgba(255, 255, 255, 0.1)',
  },
  idLabel: {
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  idValue: {
    color: 'var(--text-muted)',
  }
};
