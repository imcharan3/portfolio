import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

export default function NeuralSphere3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSpeed, setActiveSpeed] = useState(1); // multiplier
  
  // Track rotation angles, velocities, and drag states
  const stateRef = useRef({
    angleX: 0.005,
    angleY: 0.005,
    rotX: 0.003,
    rotY: 0.003,
    isDragging: false,
    startX: 0,
    startY: 0,
    friction: 0.96, // slow deceleration
    lastMouseX: 0,
    lastMouseY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    const numParticles = 85;
    const sphereRadius = Math.min(window.innerWidth < 768 ? 110 : 150, 150);
    const focalLength = 300;

    const resizeCanvas = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    // Initialize particles on a 3D sphere using Fibonacci distribution
    const initSphere = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        // Fibonacci lattice coordinates
        const phi = Math.acos(-1 + (2 * i) / numParticles);
        const theta = Math.sqrt(numParticles * Math.PI) * phi;

        const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
        const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
        const z = sphereRadius * Math.cos(phi);

        // Mix cyan and purple colors for nodes
        const color = i % 2 === 0 ? 'rgba(0, 240, 255,' : 'rgba(157, 78, 221,';
        particles.push({ x, y, z, color });
      }
    };

    const rotateX = (p, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y1 = p.y * cos - p.z * sin;
      const z1 = p.y * sin + p.z * cos;
      p.y = y1;
      p.z = z1;
    };

    const rotateY = (p, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x1 = p.x * cos - p.z * sin;
      const z1 = p.x * sin + p.z * cos;
      p.x = x1;
      p.z = z1;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const state = stateRef.current;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Apply rotation velocities
      if (isPlaying) {
        state.angleX += state.rotX * activeSpeed;
        state.angleY += state.rotY * activeSpeed;
      }

      // Decelerate drag velocities slowly using friction
      if (!state.isDragging) {
        state.rotX *= state.friction;
        state.rotY *= state.friction;

        // Maintain a slow minimal constant auto-rotation
        if (Math.abs(state.rotX) < 0.001) state.rotX = 0.001;
        if (Math.abs(state.rotY) < 0.001) state.rotY = 0.001;
      }

      // Rotate and project all points
      const projected = [];
      particles.forEach((p) => {
        // Create duplicate object for rotation
        const temp = { x: p.x, y: p.y, z: p.z, color: p.color };
        
        // Rotate on X & Y axes
        rotateX(temp, state.angleX);
        rotateY(temp, state.angleY);

        // Perspective divide
        const scale = focalLength / (focalLength + temp.z);
        const projX = centerX + temp.x * scale;
        const projY = centerY + temp.y * scale;

        projected.push({
          x: projX,
          y: projY,
          z: temp.z,
          scale: scale,
          color: temp.color
        });
      });

      // Sort by depth (Z-index descending) so foreground renders on top of background
      projected.sort((a, b) => b.z - a.z);

      // Draw connection lines in 3D space
      const maxDistance = 75;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            // Lines are more opaque in foreground, invisible in background
            const averageZ = (p1.z + p2.z) / 2;
            const opacity = (1 - dist / maxDistance) * (1 - averageZ / sphereRadius) * 0.15;
            
            if (opacity > 0) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              
              const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
              grad.addColorStop(0, p1.color + `${opacity})`);
              grad.addColorStop(1, p2.color + `${opacity})`);

              ctx.strokeStyle = grad;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }

      // Draw particle nodes
      projected.forEach((p) => {
        // Map depth Z to opacity: -sphereRadius (near) to +sphereRadius (far)
        const opacity = (1 - p.z / sphereRadius) * 0.45 + 0.1;
        const radius = Math.max(1, p.scale * 2.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        
        ctx.fillStyle = p.color + `${opacity})`;
        ctx.shadowBlur = p.z < 0 ? 8 : 0; // only glow foreground nodes
        ctx.shadowColor = p.color === 'rgba(0, 240, 255,' ? '#00f0ff' : '#bd59ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(animate);
    };

    // DRAG MOUSE HANDLERS
    const handleMouseDown = (e) => {
      const state = stateRef.current;
      state.isDragging = true;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      state.startX = x;
      state.startY = y;
      state.lastMouseX = x;
      state.lastMouseY = y;
    };

    const handleMouseMove = (e) => {
      const state = stateRef.current;
      if (!state.isDragging) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate instantaneous drag speed/velocity
      const dx = x - state.lastMouseX;
      const dy = y - state.lastMouseY;

      // Assign rotation speeds based on drag velocity
      state.rotY = dx * 0.0008;
      state.rotX = -dy * 0.0008;

      // Instantly apply translation delta to coordinates
      state.angleX += state.rotX;
      state.angleY += state.rotY;

      state.lastMouseX = x;
      state.lastMouseY = y;
    };

    const handleMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    // TOUCH HANDLERS (Mobile support)
    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const state = stateRef.current;
      state.isDragging = true;
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      state.startX = x;
      state.startY = y;
      state.lastMouseX = x;
      state.lastMouseY = y;
    };

    const handleTouchMove = (e) => {
      const state = stateRef.current;
      if (!state.isDragging || e.touches.length !== 1) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;

      const dx = x - state.lastMouseX;
      const dy = y - state.lastMouseY;

      state.rotY = dx * 0.001;
      state.rotX = -dy * 0.001;

      state.angleX += state.rotX;
      state.angleY += state.rotY;

      state.lastMouseX = x;
      state.lastMouseY = y;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleMouseUp);

    resizeCanvas();
    initSphere();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, activeSpeed]);

  const resetRotation = () => {
    const state = stateRef.current;
    state.rotX = 0.003;
    state.rotY = 0.003;
    state.angleX = 0;
    state.angleY = 0;
  };

  return (
    <div ref={containerRef} style={styles.container} className="glass-panel">
      {/* Dynamic Subhead Indicator */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={styles.blinkDot} />
          <span style={styles.title}>3D_MODEL_WEIGHTS_SPHERE</span>
        </div>
        <span style={styles.telemetryText}>ANGULAR_DECEL: 0.96 | PERSPECTIVE: 300px</span>
      </div>

      {/* Main interactive 3D canvas */}
      <div style={styles.canvasContainer}>
        <canvas ref={canvasRef} style={styles.canvas} />
        
        {/* Floating tooltip overlay */}
        <div style={styles.instructionOverlay}>
          <span>🖱️ DRAG TO ROTATE DATA MATRIX</span>
        </div>
      </div>

      {/* Dashboard control bar */}
      <div style={styles.controlsBar}>
        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          style={styles.controlBtn}
          className="border-glow-cyan"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? 'PAUSE' : 'ORBIT'}</span>
        </button>

        <button 
          onClick={resetRotation} 
          style={styles.controlBtn}
          className="border-glow-purple"
        >
          <RefreshCw size={14} />
          <span>RE-CENTER</span>
        </button>

        <div style={styles.speedControlRow}>
          <span style={styles.speedLabel}>SPEED:</span>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setActiveSpeed(spd)}
              style={{
                ...styles.speedBtn,
                color: activeSpeed === spd ? '#fff' : 'var(--text-secondary)',
                backgroundColor: activeSpeed === spd ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                borderColor: activeSpeed === spd ? 'var(--accent-cyan)' : 'transparent'
              }}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '420px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  blinkDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#00f0ff',
    boxShadow: '0 0 8px #00f0ff',
    animation: 'pulse 1.8s infinite',
  },
  title: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#fff',
  },
  telemetryText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
    cursor: 'grab',
    ':active': {
      cursor: 'grabbing',
    }
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  instructionOverlay: {
    position: 'absolute',
    bottom: '0.75rem',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    backgroundColor: 'rgba(3, 3, 7, 0.65)',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  controlsBar: {
    padding: '0.75rem 1.25rem',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  controlBtn: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    border: '1px solid var(--border-color)',
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    padding: '0.35rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s',
  },
  speedControlRow: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    '@media (max-width: 500px)': {
      marginLeft: '0',
    }
  },
  speedLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
    marginRight: '0.3rem',
  },
  speedBtn: {
    background: 'transparent',
    border: '1px solid transparent',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    padding: '0.15rem 0.4rem',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }
};
