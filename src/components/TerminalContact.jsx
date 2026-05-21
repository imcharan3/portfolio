import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, MessageSquare, Send, ArrowRight, CornerDownLeft } from 'lucide-react';

const GithubIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const WELCOME_BANNER = [
  '⚡ ADISHTI OS [Version 1.2.4]',
  '🛡️ (c) 2026 Adishti Charan Teja. NLP & ML Specialist.',
  '🌐 System Status: ONLINE | Active Nodes: 24',
  '-------------------------------------------------------',
  "Type 'help' to view available system routines, or click the quick pills below.",
];

export default function TerminalContact() {
  const [history, setHistory] = useState([
    ...WELCOME_BANNER.map(line => ({ type: 'output', text: line }))
  ]);
  const [inputVal, setInputVal] = useState('');
  
  // Guided state machine: 'NORMAL', 'NAME', 'EMAIL', 'MSG', 'SENDING'
  const [cliState, setCliState] = useState('NORMAL');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll terminal to bottom when history changes
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const addLine = (type, text) => {
    setHistory(prev => [...prev, { type, text }]);
  };

  const handleCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    addLine('input', `guest@adishti-shell:~$ ${trimmed}`);

    if (!trimmed) return;

    const lower = trimmed.toLowerCase();

    // Command parser based on state
    if (cliState === 'NORMAL') {
      switch (lower) {
        case 'help':
          addLine('output', 'Available commands:');
          addLine('output', '  about     - Brief summary of Adishti\'s engineering focus');
          addLine('output', '  skills    - Print current core technology weights');
          addLine('output', '  socials   - Display LinkedIn and GitHub pathways');
          addLine('output', '  contact   - Initialize the guided contact submission pipeline');
          addLine('output', '  clear     - Wipe terminal screen buffer');
          break;
        case 'about':
          addLine('output', '> Adishti Charan Teja is a B.Tech CSE scholar & AI/ML Developer.');
          addLine('output', '> Specialized in Natural Language Processing (NLP) & Deep Learning.');
          addLine('output', '> Focused on deploying low-latency web models using Flask, Django, and Streamlit.');
          break;
        case 'skills':
          addLine('output', '> Core Weights Matrix:');
          addLine('output', '  Python:      [████████████████████] 99%');
          addLine('output', '  TensorFlow:  [██████████████████░░] 91%');
          addLine('output', '  Transformers:[███████████████████░] 96%');
          addLine('output', '  NLP:         [████████████████████] 98%');
          addLine('output', '  Flask/Django:[███████████████████░] 94%');
          break;
        case 'socials':
          addLine('output', 'Accessing external networks...');
          addLine('output', '  GitHub:   https://github.com/imcharan3');
          addLine('output', '  LinkedIn: https://linkedin.com/in/adishti-charan-teja');
          addLine('output', '  Email:    charanadishti123@gmail.com');
          addLine('output', 'Note: You can also hover & click the glowing icons on the right!');
          break;
        case 'clear':
          setHistory([]);
          break;
        case 'contact':
          setCliState('NAME');
          addLine('output', '🤖 INITIALIZING GUIDED TELEMETRY PIPELINE...');
          addLine('output', 'Enter your Name:');
          break;
        default:
          addLine('output', `bash: command not found: ${trimmed}. Type 'help' for options.`);
      }
    } else if (cliState === 'NAME') {
      setFormData(prev => ({ ...prev, name: trimmed }));
      setCliState('EMAIL');
      addLine('output', `> Registered Name: ${trimmed}`);
      addLine('output', 'Enter your Email Address:');
    } else if (cliState === 'EMAIL') {
      // Basic validation
      if (!trimmed.includes('@') || !trimmed.includes('.')) {
        addLine('output', '⚠️ Invalid email format. Please re-enter:');
        return;
      }
      setFormData(prev => ({ ...prev, email: trimmed }));
      setCliState('MSG');
      addLine('output', `> Registered Email: ${trimmed}`);
      addLine('output', 'Enter your Message:');
    } else if (cliState === 'MSG') {
      const finalMsg = trimmed;
      addLine('output', `> Registered Message: ${finalMsg}`);
      addLine('output', '📡 Transmitting payload...');
      
      setCliState('SENDING');
      
      // Simulate network payload dispatch
      setTimeout(() => {
        addLine('output', 'POST /api/v1/contact HTTP/1.1');
        addLine('output', 'Host: adishti.dev');
        addLine('output', 'Content-Type: application/json');
        addLine('output', 'Payload: { name, email, message } uploaded successfully.');
        addLine('output', '---------------------------------------------------');
        addLine('output', '✅ [SUCCESS]: Message dispatched to Adishti\'s inbox!');
        addLine('output', '🤖 PIPELINE TERMINATED. Returned to normal shell.');
        
        // Reset state
        setFormData({ name: '', email: '', message: '' });
        setCliState('NORMAL');
      }, 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    }
  };

  const executePill = (cmd) => {
    if (cliState !== 'NORMAL') return; // block pills during guided contact flow
    handleCommand(cmd);
  };

  return (
    <div style={styles.contactWrapper}>
      {/* Visual Header */}
      <div style={styles.headerBlock}>
        <h2 style={styles.title}>Secure Node Connection</h2>
        <p style={styles.subtitle}>Execute shell queries or broadcast a telemetry message directly into the network.</p>
      </div>

      <div style={styles.grid}>
        {/* Terminal Section */}
        <div 
          className="glass-panel scanline" 
          style={styles.terminalContainer}
          onClick={focusInput}
        >
          {/* Top window headers */}
          <div style={styles.terminalTopBar}>
            <div style={styles.dots}>
              <span style={{ ...styles.dot, backgroundColor: '#ff5f56' }} />
              <span style={{ ...styles.dot, backgroundColor: '#ffbd2e' }} />
              <span style={{ ...styles.dot, backgroundColor: '#27c93f' }} />
            </div>
            <div style={styles.terminalTitle}>
              <Terminal size={14} color="var(--accent-cyan)" />
              <span style={styles.titleText}>guest@adishti-shell:~</span>
            </div>
            <div style={styles.spacer} />
          </div>

          {/* Terminal content container */}
          <div ref={terminalBodyRef} style={styles.terminalBody}>
            {history.map((line, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.terminalLine,
                  color: line.type === 'input' 
                    ? '#ffffff' 
                    : line.text.includes('✅') 
                    ? '#10b981' 
                    : line.text.includes('⚠️') 
                    ? '#f59e0b'
                    : 'var(--text-secondary)'
                }}
              >
                {line.text}
              </div>
            ))}
            
            {/* Sending model loader loader */}
            {cliState === 'SENDING' && (
              <div style={{ ...styles.terminalLine, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                🚀 Transmitting: [██████████████████░░] 90% ...
              </div>
            )}

            {/* Direct prompt row */}
            {cliState !== 'SENDING' && (
              <div style={styles.inputRow}>
                <span style={styles.promptText}>
                  {cliState === 'NORMAL' && 'guest@adishti-shell:~$'}
                  {cliState === 'NAME' && 'enter_name:~$'}
                  {cliState === 'EMAIL' && 'enter_email:~$'}
                  {cliState === 'MSG' && 'enter_message:~$'}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={styles.terminalInput}
                  autoComplete="off"
                  disabled={cliState === 'SENDING'}
                />
                <span className="terminal-cursor" />
              </div>
            )}
          </div>

          {/* Prompt quick suggestions */}
          <div style={styles.pillBar}>
            <span style={styles.pillLabel}>QUICK SCRIPTS:</span>
            <button 
              style={{ ...styles.pill, opacity: cliState === 'NORMAL' ? 1 : 0.4 }} 
              onClick={() => executePill('help')}
              disabled={cliState !== 'NORMAL'}
            >
              help
            </button>
            <button 
              style={{ ...styles.pill, opacity: cliState === 'NORMAL' ? 1 : 0.4 }} 
              onClick={() => executePill('about')}
              disabled={cliState !== 'NORMAL'}
            >
              about
            </button>
            <button 
              style={{ ...styles.pill, opacity: cliState === 'NORMAL' ? 1 : 0.4 }} 
              onClick={() => executePill('skills')}
              disabled={cliState !== 'NORMAL'}
            >
              skills
            </button>
            <button 
              style={{ ...styles.pill, opacity: cliState === 'NORMAL' ? 1 : 0.4 }} 
              onClick={() => executePill('contact')}
              disabled={cliState !== 'NORMAL'}
            >
              run contact
            </button>
            <button 
              style={{ ...styles.pill, opacity: cliState === 'NORMAL' ? 1 : 0.4 }} 
              onClick={() => executePill('clear')}
              disabled={cliState !== 'NORMAL'}
            >
              clear
            </button>
          </div>
        </div>

        {/* Social Connection Panels */}
        <div style={styles.socialColumn}>
          <div className="glass-panel" style={styles.socialCard}>
            <div style={styles.cardIndicator} />
            <h3 style={styles.socialHeader}>External Nodes</h3>
            <p style={styles.socialDesc}>Establish secure secure handshakes through standard networking protocols.</p>
            
            <div style={styles.linksBlock}>
              <a 
                href="https://linkedin.com/in/adishti-charan-teja" 
                target="_blank" 
                rel="noreferrer"
                style={styles.socialLink}
                className="border-glow-cyan"
              >
                <div style={{ ...styles.socialIconBg, backgroundColor: 'rgba(0, 240, 255, 0.1)' }}>
                  <LinkedinIcon size={20} color="#00f0ff" />
                </div>
                <div>
                  <div style={styles.socialName}>LinkedIn Profile</div>
                  <div style={styles.socialHandle}>adishti-charan-teja</div>
                </div>
                <ArrowRight size={16} style={styles.arrowIcon} />
              </a>

              <a 
                href="https://github.com/imcharan3" 
                target="_blank" 
                rel="noreferrer"
                style={styles.socialLink}
                className="border-glow-purple"
              >
                <div style={{ ...styles.socialIconBg, backgroundColor: 'rgba(157, 78, 221, 0.1)' }}>
                  <GithubIcon size={20} color="#bd59ff" />
                </div>
                <div>
                  <div style={styles.socialName}>GitHub Network</div>
                  <div style={styles.socialHandle}>@imcharan3</div>
                </div>
                <ArrowRight size={16} style={styles.arrowIcon} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  contactWrapper: {
    padding: '2rem 0',
  },
  headerBlock: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    maxWidth: '600px',
    margin: '0 auto',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '7fr 5fr',
    gap: '2.5rem',
    alignItems: 'stretch',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    }
  },
  terminalContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-terminal)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    minHeight: '400px',
  },
  terminalTopBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  dots: {
    display: 'flex',
    gap: '0.4rem',
    width: '80px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  terminalTitle: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
  },
  titleText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  spacer: {
    width: '80px',
  },
  terminalBody: {
    flex: 1,
    padding: '1.25rem',
    overflowY: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.88rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left',
    lineHeight: '1.4rem',
    maxHeight: '320px',
  },
  terminalLine: {
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
  },
  promptText: {
    color: 'var(--accent-cyan)',
    marginRight: '0.5rem',
    flexShrink: 0,
  },
  terminalInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.88rem',
    flex: 1,
    caretColor: 'transparent', // We make our own custom terminal blinking cursor
  },
  pillBar: {
    padding: '0.75rem 1.25rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center',
  },
  pillLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
    marginRight: '0.5rem',
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    color: 'var(--text-secondary)',
    borderRadius: '4px',
    padding: '0.2rem 0.5rem',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    ':hover': {
      backgroundColor: 'rgba(0, 240, 255, 0.05)',
      borderColor: 'var(--accent-cyan)',
      color: '#fff',
    }
  },
  socialColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  socialCard: {
    padding: '2.5rem',
    flex: 1,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: 'linear-gradient(to bottom, var(--accent-cyan), var(--accent-purple))',
  },
  socialHeader: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  socialDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginBottom: '2rem',
    lineHeight: '1.5',
  },
  linksBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    cursor: 'pointer',
    position: 'relative',
  },
  socialIconBg: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
  },
  socialName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
  },
  socialHandle: {
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    marginTop: '0.1rem',
  },
  arrowIcon: {
    marginLeft: 'auto',
    opacity: 0.5,
    transition: 'transform 0.3s, opacity 0.3s',
  }
};
