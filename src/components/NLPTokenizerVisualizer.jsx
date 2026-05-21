import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Eye, BrainCircuit } from 'lucide-react';

export default function NLPTokenizerVisualizer() {
  const [inputText, setInputText] = useState('Natural language processing builds semantic pathways of understanding.');
  const [tokens, setTokens] = useState([]);
  const [hoveredTokenIdx, setHoveredTokenIdx] = useState(null);
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const nodesRef = useRef([]);

  // Tokenize the input text on text change
  useEffect(() => {
    // Simple regex tokenizer: split by space, keeping punctuation adjacent
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    setTokens(words);
  }, [inputText]);

  // Handle particle node setup on token array change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // We want to reuse coordinate positions if count is same, otherwise initialize new
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    nodesRef.current = tokens.map((t, idx) => {
      // Find existing node if index matches to prevent jumping
      const existing = nodesRef.current[idx];
      
      // Stagger initial positions in a circular orbit
      const angle = (idx / tokens.length) * Math.PI * 2;
      const radius = Math.min(rect.width, rect.height) * 0.3;
      const targetX = centerX + Math.cos(angle) * radius;
      const targetY = centerY + Math.sin(angle) * radius;

      return {
        text: t,
        x: existing ? existing.x : targetX,
        y: existing ? existing.y : targetY,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        angleOffset: Math.random() * Math.PI * 2, // for gentle drift
        color: idx % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-purple)',
      };
    });
  }, [tokens]);

  // Main Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height || 260;
      }
    };

    // Deterministic hash to map attention scores between tokens
    const getAttentionScore = (t1, t2) => {
      if (t1 === t2) return 1.0;
      let hash = 0;
      const combined = t1 + t2;
      for (let i = 0; i < combined.length; i++) {
        hash = combined.charCodeAt(i) + ((hash << 5) - hash);
      }
      // Return score between 0.05 and 0.85
      return 0.05 + (Math.abs(hash) % 80) / 100;
    };

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Update positions (gentle drift and repulsion bounds)
      nodes.forEach((n, idx) => {
        // Organic sinusoidal floating drift
        n.angleOffset += 0.008;
        n.x += n.vx + Math.sin(n.angleOffset) * 0.08;
        n.y += n.vy + Math.cos(n.angleOffset) * 0.08;

        // Keep inside boundaries with margin
        const pad = 40;
        if (n.x < pad || n.x > canvas.width - pad) n.vx = -n.vx;
        if (n.y < pad || n.y > canvas.height - pad) n.vy = -n.vy;

        // Pull slowly back to orbit center if they float too far
        const distToCenter = Math.hypot(n.x - centerX, n.y - centerY);
        if (distToCenter > Math.min(canvas.width, canvas.height) * 0.45) {
          n.vx += (centerX - n.x) * 0.0001;
          n.vy += (centerY - n.y) * 0.0001;
        }
      });

      // 1. Draw Attention connection vectors
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          
          const isHighlighted = hoveredTokenIdx === i || hoveredTokenIdx === j;
          const isDirectMatch = hoveredTokenIdx === i && hoveredTokenIdx !== null;

          const baseScore = getAttentionScore(n1.text, n2.text);
          
          let opacity = baseScore * 0.2;
          let lineWidth = baseScore * 0.8;

          if (hoveredTokenIdx !== null) {
            if (isHighlighted) {
              opacity = baseScore * 0.55;
              lineWidth = baseScore * 1.5;
            } else {
              opacity = 0.02; // dim unrelated paths
            }
          }

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          
          const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
          if (isHighlighted) {
            // Bright cyber gradients for highlighted active vector paths
            grad.addColorStop(0, n1.color === 'var(--accent-cyan)' ? `rgba(0, 240, 255, ${opacity})` : `rgba(157, 78, 221, ${opacity})`);
            grad.addColorStop(1, n2.color === 'var(--accent-cyan)' ? `rgba(0, 240, 255, ${opacity})` : `rgba(157, 78, 221, ${opacity})`);
          } else {
            grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);
          }

          ctx.strokeStyle = grad;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }

      // 2. Draw nodes and text labels
      nodes.forEach((n, idx) => {
        const isHovered = hoveredTokenIdx === idx;
        const colorHex = n.color === 'var(--accent-cyan)' ? '#00f0ff' : '#bd59ff';

        // Draw particle core
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHovered ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = colorHex;
        ctx.shadowBlur = isHovered ? 12 : 0;
        ctx.shadowColor = colorHex;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw text token label
        ctx.font = isHovered ? 'bold 11px var(--font-mono)' : '9px var(--font-mono)';
        ctx.fillStyle = isHovered ? '#ffffff' : 'var(--text-secondary)';
        
        // Render slight background bubble for hovered token text
        const textWidth = ctx.measureText(n.text).width;
        ctx.fillStyle = isHovered ? 'rgba(5, 5, 12, 0.85)' : 'transparent';
        ctx.fillRect(n.x - textWidth/2 - 4, n.y - 18, textWidth + 8, 12);
        if (isHovered) {
          ctx.strokeStyle = colorHex;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(n.x - textWidth/2 - 4, n.y - 18, textWidth + 8, 12);
        }

        ctx.fillStyle = isHovered ? '#ffffff' : 'var(--text-secondary)';
        ctx.textAlign = 'center';
        ctx.fillText(n.text, n.x, n.y - 9);
      });

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [tokens, hoveredTokenIdx]);

  // Generate deterministic embedding mock array
  const getMockEmbedding = (word) => {
    let list = [];
    let seed = word.charCodeAt(0) || 12;
    for (let i = 0; i < 4; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const num = (seed / 233280 * 2 - 1).toFixed(4);
      list.push(num);
    }
    return `[${list.join(', ')}, ...]`;
  };

  return (
    <div ref={containerRef} style={styles.container} className="glass-panel">
      {/* Visual Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BrainCircuit size={14} color="var(--accent-cyan)" />
          <span style={styles.title}>LIVE_NLP_TOKENIZER_LAB</span>
        </div>
        <span style={styles.statusBadge}>STABLE_RUN_200</span>
      </div>

      <div style={styles.labLayout}>
        {/* Left column: Text Input and token list */}
        <div style={styles.interactiveArea}>
          <span style={styles.label}>ENTER SENTENCE FOR PARSING:</span>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={styles.textArea}
            maxLength={100}
          />
          
          <div style={styles.tokenSection}>
            <span style={styles.label}>GENERATED TOKENS:</span>
            <div style={styles.tokensGrid}>
              {tokens.map((token, idx) => (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    ...styles.tokenPill,
                    borderColor: hoveredTokenIdx === idx ? 'var(--accent-cyan)' : 'var(--border-color)',
                    backgroundColor: hoveredTokenIdx === idx ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255,255,255,0.01)'
                  }}
                  onMouseEnter={() => setHoveredTokenIdx(idx)}
                  onMouseLeave={() => setHoveredTokenIdx(null)}
                >
                  <span style={styles.pillIndex}>{idx}</span>
                  <span style={styles.pillText}>{token}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: 2D Attention Canvas and side Telemetry metrics */}
        <div style={styles.visualizerArea}>
          <div style={styles.canvasContainer}>
            <canvas ref={canvasRef} style={styles.canvas} />
            <span style={styles.canvasHint}>INTERACTION: HOVER TOKENS OR NODES</span>
          </div>

          {/* Telemetry panel */}
          <div style={styles.telemetryCard}>
            <div style={styles.telemetryCardHeader}>
              <Terminal size={12} color="var(--accent-purple)" />
              <span>TOKEN_EMBEDDING_DEBUGGER</span>
            </div>
            {hoveredTokenIdx !== null && tokens[hoveredTokenIdx] ? (
              <div style={styles.telemetryContent}>
                <div><span style={styles.subLbl}>TOKEN:</span> "{tokens[hoveredTokenIdx]}"</div>
                <div><span style={styles.subLbl}>INDEX_ID:</span> {hoveredTokenIdx}</div>
                <div><span style={styles.subLbl}>LENGTH:</span> {tokens[hoveredTokenIdx].length} chars</div>
                <div><span style={styles.subLbl}>DIMENSIONS:</span> 768d (Dense Vector)</div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={styles.subLbl}>EMBEDDING_SUBSET:</span>
                  <div style={styles.embeddingBlock}>{getMockEmbedding(tokens[hoveredTokenIdx])}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={styles.subLbl}>POSITION_ENCODING:</span>
                  <div style={styles.posBlock}>
                    PE({hoveredTokenIdx}) = sin(x), cos(y) active
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.emptyTelemetry}>
                <span>🤖 Waiting for node inspection query...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: '420px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#fff',
  },
  statusBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: '#10b981',
    fontWeight: '700',
  },
  labLayout: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '5fr 7fr',
    alignItems: 'stretch',
    '@media (max-width: 850px)': {
      gridTemplateColumns: '1fr',
    }
  },
  interactiveArea: {
    padding: '1.25rem',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: 'rgba(0,0,0,0.1)',
    '@media (max-width: 850px)': {
      borderRight: 'none',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    }
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
    textAlign: 'left',
  },
  textArea: {
    width: '100%',
    height: '70px',
    backgroundColor: '#020204',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '6px',
    padding: '0.75rem',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.92rem',
    outline: 'none',
    resize: 'none',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
    ':focus': {
      borderColor: 'var(--accent-cyan)',
    }
  },
  tokenSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  tokensGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    maxHeight: '180px',
    overflowY: 'auto',
    paddingRight: '0.2rem',
  },
  tokenPill: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    border: '1px solid var(--border-color)',
    transition: 'all 0.2s',
  },
  pillIndex: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    marginRight: '0.35rem',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    paddingRight: '0.35rem',
  },
  pillText: {
    fontSize: '0.8rem',
    color: '#fff',
    fontWeight: '500',
  },
  visualizerArea: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  canvasContainer: {
    height: '190px',
    backgroundColor: '#020205',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    position: 'relative',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  canvasHint: {
    position: 'absolute',
    top: '0.5rem',
    left: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  telemetryCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    padding: '0.75rem',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  telemetryCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    fontWeight: '700',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.4rem',
    marginBottom: '0.6rem',
  },
  telemetryContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.4rem 1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  subLbl: {
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  embeddingBlock: {
    backgroundColor: '#020204',
    padding: '0.35rem 0.5rem',
    borderRadius: '4px',
    color: '#a7f3d0',
    fontSize: '0.7rem',
    marginTop: '0.15rem',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  posBlock: {
    backgroundColor: '#020204',
    padding: '0.3rem 0.5rem',
    borderRadius: '4px',
    color: 'var(--accent-cyan)',
    fontSize: '0.7rem',
    marginTop: '0.15rem',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  emptyTelemetry: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    padding: '1.5rem',
  }
};
