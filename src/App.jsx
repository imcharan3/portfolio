import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, ShieldAlert, Cpu, Download, ArrowDown, Activity } from 'lucide-react';
import NeuralNetwork from './components/NeuralNetwork';
import FloatingStack from './components/FloatingStack';
import ExperienceTimeline from './components/ExperienceTimeline';
import ProjectCards from './components/ProjectCard';
import CertTicker from './components/CertTicker';
import TerminalContact from './components/TerminalContact';
import NeuralSphere3D from './components/NeuralSphere3D';
import NLPTokenizerVisualizer from './components/NLPTokenizerVisualizer';


const TYPING_PHRASES = [
  "> Initializing Adishti Charan Teja...",
  "> B.Tech CSE | NLP & ML Specialist...",
  "> Building intelligent systems."
];

export default function App() {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localTime, setLocalTime] = useState('');

  // Clock telemetry
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Custom typing animation loop
  useEffect(() => {
    let timer;
    const currentPhrase = TYPING_PHRASES[phraseIdx];
    const typingSpeed = isDeleting ? 25 : 55;

    if (!isDeleting && text === currentPhrase) {
      // Pause at full word
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setPhraseIdx(prev => (prev + 1) % TYPING_PHRASES.length);
    } else {
      timer = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length + (isDeleting ? -1 : 1)));
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIdx]);

  return (
    <div style={styles.appWrapper}>
      {/* 1. Living canvas particle mesh backdrop */}
      <NeuralNetwork />

      {/* Modern High-tech Navigation Bar */}
      <header className="glass-panel" style={styles.header}>
        <div style={styles.logoBlock}>
          <span style={styles.logoActiveIcon}>⚡</span>
          <span style={styles.logoText}>ADISHTI</span>
          <span style={styles.logoCommand}>:~$</span>
        </div>
        <nav style={styles.nav}>
          <a href="#about" style={styles.navLink}>_about</a>
          <a href="#experience" style={styles.navLink}>_experience</a>
          <a href="#projects" style={styles.navLink}>_projects</a>
          <a href="#labs" style={styles.navLink}>_laboratories</a>
          <a href="#contact" style={styles.navLink}>_contact</a>
        </nav>
      </header>

      <div className="container" style={styles.mainContainer}>
        
        {/* HERO SECTION */}
        <section id="hero" style={styles.heroSection}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={styles.heroContent}
          >
            {/* Minimal High-tech Tag */}
            <div style={styles.heroPreLabel}>
              <span style={styles.pingDot}></span>
              <span style={styles.preLabelText}>SYSTEM_NODE: ACTIVE / NLP_PIPELINE_STABLE</span>
            </div>

            <h1 style={styles.heroMainTitle}>
              Adishti <span className="text-glow-cyan" style={{ color: 'var(--accent-cyan)' }}>Charan Teja</span>
            </h1>

            {/* Loop typing console */}
            <div style={styles.typingBox}>
              <TerminalIcon size={18} color="var(--accent-cyan)" />
              <span style={styles.typingText}>{text}</span>
              <span className="terminal-cursor" />
            </div>

            <p style={styles.heroLead}>
              Developing highly scalable neural network pipelines and real-time machine learning-powered web architectures. Specializing in advanced NLP semantic structures.
            </p>

            {/* CTAs */}
            <div style={styles.heroActions}>
              <a href="#projects" className="btn-glow" style={{ textDecoration: 'none' }}>
                <Cpu size={16} />
                <span>Explore Models</span>
              </a>
              <a 
                href="/Adishti_Charan_Teja_Resume.pdf" 
                download="Adishti_Charan_Teja_Resume.pdf"
                className="btn-glow btn-glow-purple"
                style={{ textDecoration: 'none' }}
              >
                <Download size={16} />
                <span>Initialize Resume</span>
              </a>
            </div>

            {/* Scroll Indicator */}
            <div style={styles.scrollDownIndicator}>
              <span style={styles.scrollText}>SCROLL FOR TELEMETRY</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown size={14} color="var(--accent-cyan)" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* PROFILE & ABOUT SECTION */}
        <section id="about" style={styles.sectionSpacing}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>01 //</span>
            <h2 style={styles.sectionTitle}>Neural Profile</h2>
          </div>
          
          <div style={styles.profileGrid}>
            <motion.div
              className="glass-panel"
              style={styles.aboutCard}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div style={styles.terminalWindowHeader}>
                <div style={styles.windowDots}>
                  <span style={{ ...styles.windowDot, backgroundColor: '#4b5563' }} />
                  <span style={{ ...styles.windowDot, backgroundColor: '#4b5563' }} />
                </div>
                <span style={styles.windowTitle}>system_core.info</span>
              </div>
              <div style={styles.aboutCardBody}>
                <div style={styles.consoleLine}><span style={styles.lbl}>OPERATOR:</span> Adishti Charan Teja</div>
                <div style={styles.consoleLine}><span style={styles.lbl}>B.TECH:</span> Computer Science & Engineering</div>
                <div style={styles.consoleLine}><span style={styles.lbl}>FOCUS:</span> Real-time Deep Learning & NLP APIs</div>
                <div style={styles.consoleLine}><span style={styles.lbl}>LOCATION:</span> Hyderabad Node</div>
                <div style={styles.consoleLine}>-------------------------------------</div>
                <p style={styles.aboutBodyParagraph}>
                  I specialize in designing and deploying intelligent, real-time architectures that bridge high-accuracy machine learning models with sleek, interactive front-ends. 
                </p>
                <p style={styles.aboutBodyParagraph}>
                  From orchestrating transformer attention layers for complex semantic evaluations to assembling convolutional networks to solve real-world problems in agriculture, I love building applications that turn data weights into interactive insights.
                </p>
              </div>
            </motion.div>

            {/* Float visualizer tech stack */}
            <div style={styles.stackColumn}>
              <FloatingStack />
            </div>
          </div>
        </section>

        {/* EXPERIENCE TIMELINE SECTION */}
        <section id="experience" style={styles.sectionSpacing}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>02 //</span>
            <h2 style={styles.sectionTitle}>Data-Stream Timeline</h2>
          </div>
          <ExperienceTimeline />
        </section>

        {/* FEATURED PROJECTS SECTION */}
        <section id="projects" style={styles.sectionSpacing}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>03 //</span>
            <h2 style={styles.sectionTitle}>Model Inferences</h2>
          </div>
          <ProjectCards />
        </section>

        {/* CERTIFICATIONS TICKER */}
        <section style={{ marginTop: '4rem' }}>
          <CertTicker />
        </section>

        {/* INTERACTIVE LABORATORIES */}
        <section id="labs" style={styles.sectionSpacing}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>04 //</span>
            <h2 style={styles.sectionTitle}>Interactive Laboratories</h2>
          </div>
          <div className="labs-grid">
            <NeuralSphere3D />
            <NLPTokenizerVisualizer />
          </div>
        </section>

        {/* CONTACT TERMINAL SECTION */}
        <section id="contact" style={styles.sectionSpacing}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>05 //</span>
            <h2 style={styles.sectionTitle}>Handshake Protocol</h2>
          </div>
          <TerminalContact />
        </section>

        
      </div>

      {/* Futuristic technical footer */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerContainer}>
          <div style={styles.footerLeft}>
            <span style={styles.footerBrand}>ADISHTI:~$ </span>
            <span style={styles.footerCopyright}>© 2026. All pathways secure.</span>
          </div>
          
          <div style={styles.footerTimeBlock}>
            <Activity size={14} color="#10b981" />
            <span style={styles.timeLabel}>SYS_TELEMETRY: </span>
            <span style={styles.timeValue}>{localTime || 'LOADING_STREAMS'}</span>
            <span style={styles.handshakeIndicator}>[PING_OK]</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  appWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
    overflowX: 'hidden',
  },
  header: {
    position: 'fixed',
    top: '1.25rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 2.5rem)',
    maxWidth: '1200px',
    height: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    borderRadius: '12px',
    zIndex: 100,
    backgroundColor: 'rgba(5, 5, 10, 0.65)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  logoBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  logoActiveIcon: {
    color: 'var(--accent-cyan)',
    animation: 'pulse 2s infinite',
  },
  logoText: {
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  logoCommand: {
    color: 'var(--accent-purple)',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    '@media (max-width: 600px)': {
      display: 'none', // Simple responsive clean UI
    }
  },
  navLink: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    transition: 'var(--transition-smooth)',
    ':hover': {
      color: '#fff',
      textShadow: '0 0 8px var(--accent-cyan)',
    }
  },
  mainContainer: {
    flex: 1,
    paddingTop: '100px',
    display: 'flex',
    flexDirection: 'column',
  },
  heroSection: {
    minHeight: 'calc(100vh - 100px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 0',
  },
  heroContent: {
    maxWidth: '850px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroPreLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.35rem 0.8rem',
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 240, 255, 0.04)',
    border: '1px solid rgba(0, 240, 255, 0.1)',
    marginBottom: '1.5rem',
  },
  pingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 6px #10b981',
    animation: 'blink 1.5s infinite',
  },
  preLabelText: {
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-cyan)',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  heroMainTitle: {
    fontSize: '4.25rem',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-0.03em',
    marginBottom: '1.5rem',
    color: '#fff',
    '@media (max-width: 768px)': {
      fontSize: '2.75rem',
    }
  },
  typingBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: '#020204',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0.6rem 1.25rem',
    borderRadius: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '1rem',
    color: '#fff',
    marginBottom: '2rem',
    minHeight: '44px',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  typingText: {
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    textAlign: 'left',
  },
  heroLead: {
    fontSize: '1.15rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    maxWidth: '650px',
    marginBottom: '2.5rem',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
    }
  },
  heroActions: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '4rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scrollDownIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  scrollText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.15em',
    fontWeight: '700',
  },
  sectionSpacing: {
    padding: '6rem 0 3rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '3rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.75rem',
  },
  sectionNumber: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-purple)',
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: '2.25rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: '#fff',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: '5fr 7fr',
    gap: '3rem',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    }
  },
  aboutCard: {
    overflow: 'hidden',
  },
  terminalWindowHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '0.6rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  windowDots: {
    display: 'flex',
    gap: '0.35rem',
  },
  windowDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  windowTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  aboutCardBody: {
    padding: '2rem',
    textAlign: 'left',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.88rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    color: 'var(--text-secondary)',
  },
  consoleLine: {
    lineHeight: '1.4',
  },
  lbl: {
    color: 'var(--accent-cyan)',
    fontWeight: 'bold',
  },
  aboutBodyParagraph: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#cbd5e1',
    marginTop: '0.5rem',
  },
  stackColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    backgroundColor: '#010103',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '1.5rem 0',
    marginTop: '6rem',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  footerBrand: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-cyan)',
    fontSize: '0.9rem',
    fontWeight: '700',
  },
  footerCopyright: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  footerTimeBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
  },
  timeLabel: {
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  timeValue: {
    color: '#fff',
  },
  handshakeIndicator: {
    color: '#10b981',
    fontWeight: '700',
  }
};
