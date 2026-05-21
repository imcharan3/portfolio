import React, { useEffect, useRef } from 'react';

export default function NeuralNetwork() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, radius: 150 });
  const scrollRef = useRef(0);
  const targetScrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Arrays for space layers
    let starfield = [];
    let spaceObjects = [];
    let particles = [];
    
    const maxStarfield = 150;
    const connectionDist = 110;
    const neuralNetParallax = 0.35; // unified speed for stable node connections

    // Helper classes for background rendering
    class Star {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        // Distribute stars evenly across the reachable virtual height
        this.y = Math.random() * window.innerHeight * 3.2;
        this.size = Math.random() * 1.3 + 0.3;
        this.opacity = Math.random();
        this.twinkleSpeed = 0.008 + Math.random() * 0.015;
        this.parallax = 0.04 + Math.random() * 0.05; // deep background depth
      }

      update() {
        // Subtle twinkling animation
        this.opacity += this.twinkleSpeed;
        if (this.opacity < 0.15 || this.opacity > 0.85) {
          this.twinkleSpeed = -this.twinkleSpeed;
        }
      }

      draw(ctx, scrollY) {
        // Warp scroll wrap-around
        let drawY = (this.y - scrollY * this.parallax) % window.innerHeight;
        if (drawY < 0) drawY += window.innerHeight;

        ctx.beginPath();
        ctx.arc(this.x, drawY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    class CosmicSun {
      constructor(x, y, radius, parallax) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.parallax = parallax;
      }

      draw(ctx, scrollY) {
        const drawY = this.y - scrollY * this.parallax;
        ctx.save();

        // Outer intense radial solar flare glow
        const flareGrad = ctx.createRadialGradient(this.x, drawY, this.radius * 0.4, this.x, drawY, this.radius * 3.5);
        flareGrad.addColorStop(0, 'rgba(255, 230, 160, 0.45)');
        flareGrad.addColorStop(0.25, 'rgba(255, 120, 30, 0.2)');
        flareGrad.addColorStop(0.6, 'rgba(230, 40, 10, 0.04)');
        flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = flareGrad;
        ctx.fill();

        // High intensity core sphere
        const coreGrad = ctx.createRadialGradient(this.x - this.radius * 0.1, drawY - this.radius * 0.1, 0, this.x, drawY, this.radius);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.2, '#fff6d6');
        coreGrad.addColorStop(0.55, '#ffa21f');
        coreGrad.addColorStop(0.85, '#e64a00');
        coreGrad.addColorStop(1, '#991f00');

        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.shadowBlur = 50;
        ctx.shadowColor = 'rgba(255, 90, 0, 0.85)';
        ctx.fill();

        ctx.restore();
      }
    }

    class CosmicPlanet {
      constructor(x, y, radius, parallax, hasRings = false, theme = 'cyan-purple') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.parallax = parallax;
        this.hasRings = hasRings;
        this.theme = theme;
      }

      draw(ctx, scrollY) {
        const drawY = this.y - scrollY * this.parallax;
        ctx.save();

        const ringTilt = -Math.PI / 8;

        // 1. Draw background half of the rings (sandwich depth)
        if (this.hasRings) {
          ctx.beginPath();
          ctx.ellipse(this.x, drawY, this.radius * 2.2, this.radius * 0.48, ringTilt, Math.PI, Math.PI * 2);
          ctx.strokeStyle = 'rgba(157, 78, 221, 0.25)';
          ctx.lineWidth = 7;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(this.x, drawY, this.radius * 1.9, this.radius * 0.4, ringTilt, Math.PI, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // 2. Draw Planet Body Sphere
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(this.x - this.radius * 0.3, drawY - this.radius * 0.3, 0, this.x, drawY, this.radius);

        if (this.theme === 'cyan-purple') {
          grad.addColorStop(0, '#eefeff');
          grad.addColorStop(0.25, '#00f0ff'); // Fixed: Changed from dynamic CSS variable to explicit color hex
          grad.addColorStop(0.7, '#9d4edd');  // Fixed: Changed from dynamic CSS variable to explicit color hex
          grad.addColorStop(1, '#0e031b');
        } else if (this.theme === 'red-orange') {
          grad.addColorStop(0, '#fff4ed');
          grad.addColorStop(0.25, '#ff783c');
          grad.addColorStop(0.7, '#8f0d3b');
          grad.addColorStop(1, '#240010');
        } else { // deep water-ice giant
          grad.addColorStop(0, '#eefaff');
          grad.addColorStop(0.25, '#38bdf8');
          grad.addColorStop(0.75, '#1e3a8a');
          grad.addColorStop(1, '#030712');
        }

        ctx.fillStyle = grad;
        ctx.shadowBlur = 24;
        ctx.shadowColor = this.theme === 'cyan-purple' 
          ? 'rgba(157, 78, 221, 0.5)' 
          : this.theme === 'red-orange' 
          ? 'rgba(255, 120, 60, 0.5)' 
          : 'rgba(56, 189, 248, 0.4)';
        ctx.fill();

        // 3. Draw foreground half of the rings (wraps over front of planet)
        if (this.hasRings) {
          ctx.beginPath();
          ctx.ellipse(this.x, drawY, this.radius * 2.2, this.radius * 0.48, ringTilt, 0, Math.PI);
          ctx.strokeStyle = 'rgba(157, 78, 221, 0.55)';
          ctx.lineWidth = 7;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(this.x, drawY, this.radius * 1.9, this.radius * 0.4, ringTilt, 0, Math.PI);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // 4. Overlap detailed 3D atmosphere crescent shadow
        ctx.shadowBlur = 0;
        const shadowGrad = ctx.createRadialGradient(this.x + this.radius * 0.25, drawY + this.radius * 0.25, 0, this.x + this.radius * 0.25, drawY + this.radius * 0.25, this.radius * 1.4);
        shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shadowGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.7)');
        shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.96)');
        
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = shadowGrad;
        ctx.fill();

        ctx.restore();
      }
    }

    class CosmicGalaxy {
      constructor(x, y, radius, color, parallax, arms = 2) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.parallax = parallax;
        this.angle = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.0008 + Math.random() * 0.001);
        this.dust = [];

        const numParticles = 140;
        for (let i = 0; i < numParticles; i++) {
          const arm = i % arms;
          const t = Math.random(); // arm progression
          const r = t * radius; 
          const armAngle = (arm * Math.PI * 2) / arms;
          const theta = r * 0.045 + armAngle + (Math.random() - 0.5) * 0.35; // spiral math + Scatter

          const size = Math.random() * 1.3 + 0.4;
          const opacity = (1 - t) * (Math.random() * 0.55 + 0.25); // brighter at galactic center
          this.dust.push({ r, theta, size, opacity });
        }
      }

      update() {
        this.angle += this.rotSpeed;
      }

      draw(ctx, scrollY) {
        const drawY = this.y - scrollY * this.parallax;
        ctx.save();

        // Intense core bulge glow
        const coreGrad = ctx.createRadialGradient(this.x, drawY, 0, this.x, drawY, this.radius * 0.28);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreGrad.addColorStop(0.35, this.color === 'cyan' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(157, 78, 221, 0.5)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // Draw spiral arms dust
        this.dust.forEach(d => {
          const currentTheta = d.theta + this.angle;
          const dx = this.x + Math.cos(currentTheta) * d.r;
          const dy = drawY + Math.sin(currentTheta) * d.r;

          ctx.beginPath();
          ctx.arc(dx, dy, d.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color === 'cyan' 
            ? `rgba(0, 240, 255, ${d.opacity})` 
            : `rgba(157, 78, 221, ${d.opacity})`;
          ctx.fill();
        });

        ctx.restore();
      }
    }

    class NeuralNode {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1.5;
        this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.75)' : 'rgba(157, 78, 221, 0.75)';
      }

      update(totalVirtualHeight) {
        // slow drifting motion
        this.x += this.vx;
        this.y += this.vy;

        // Virtual map boundary bouncing (No wrapping to avoid dynamic line stretching glitch)
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > totalVirtualHeight) this.vy = -this.vy;
      }

      draw(ctx, drawY) {
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    // Initialize cosmic background objects with dynamic, section-aligned placement
    const initSpaceObjects = () => {
      spaceObjects = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // 1. Glowing Sun at top of Hero
      spaceObjects.push(new CosmicSun(w * 0.16, h * 0.35, 48, 0.3));
      
      // 2. Spinning Cyan Galaxy 1 (About section)
      spaceObjects.push(new CosmicGalaxy(w * 0.82, h * 0.7, 110, 'cyan', 0.35, 2));

      // 3. Ringed Gas Giant (Experience section)
      spaceObjects.push(new CosmicPlanet(w * 0.18, h * 1.2, 36, 0.4, true, 'cyan-purple'));

      // 4. Red Desert Planet (Projects section)
      spaceObjects.push(new CosmicPlanet(w * 0.84, h * 1.7, 20, 0.45, false, 'red-orange'));

      // 5. Spinning Purple Galaxy 2 (Labs section)
      spaceObjects.push(new CosmicGalaxy(w * 0.15, h * 1.82, 95, 'purple', 0.38, 3));

      // 6. Deep Blue Ice Giant (Contact section)
      spaceObjects.push(new CosmicPlanet(w * 0.78, h * 2.5, 28, 0.42, false, 'blue'));
    };

    const initStarfield = () => {
      starfield = [];
      for (let i = 0; i < maxStarfield; i++) {
        starfield.push(new Star());
      }
    };

    const initParticles = () => {
      particles = [];
      const h = window.innerHeight;
      const totalVirtualHeight = h * 3.2; // Match total scroll reach boundary
      const totalParticles = window.innerWidth < 768 ? 70 : 155;
      for (let i = 0; i < totalParticles; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * totalVirtualHeight;
        particles.push(new NeuralNode(x, y));
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStarfield();
      initSpaceObjects();
      initParticles();
    };

    const drawConnections = (visibleNodes) => {
      for (let i = 0; i < visibleNodes.length; i++) {
        for (let j = i + 1; j < visibleNodes.length; j++) {
          const n1 = visibleNodes[i];
          const n2 = visibleNodes[j];
          const dist = Math.hypot(n1.drawX - n2.drawX, n1.drawY - n2.drawY);

          if (dist < connectionDist) {
            const opacity = (1 - dist / connectionDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(n1.drawX, n1.drawY);
            ctx.lineTo(n2.drawX, n2.drawY);
            
            const gradient = ctx.createLinearGradient(n1.drawX, n1.drawY, n2.drawX, n2.drawY);
            gradient.addColorStop(0, n1.node.color.replace('0.75', opacity.toString()));
            gradient.addColorStop(1, n2.node.color.replace('0.75', opacity.toString()));
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const h = window.innerHeight;
      const totalVirtualHeight = h * 3.2;

      // 1. Lerp scroll values for liquid-smooth parallax movement
      scrollRef.current += (targetScrollRef.current - scrollRef.current) * 0.08;
      const scrollY = scrollRef.current;

      // 2. Draw infinite background starfield
      starfield.forEach(s => {
        s.update();
        s.draw(ctx, scrollY);
      });

      // 3. Update & Draw spinning galaxies and celestial bodies
      spaceObjects.forEach(obj => {
        if (obj.update) obj.update();
        obj.draw(ctx, scrollY);
      });

      // 4. Update, filter, & Repel neural nodes currently inside viewport
      const visibleNodes = [];
      const mouse = mouseRef.current;

      particles.forEach(p => {
        p.update(totalVirtualHeight);

        // Map particle Y coordinate based on parallax scroll
        const drawY = p.y - scrollY * neuralNetParallax;

        // Filter: only process and draw nodes that reside inside screen boundaries
        if (drawY >= -connectionDist && drawY <= canvas.height + connectionDist) {
          // Interactive cursor repulsion
          if (mouse.x !== null && mouse.y !== null) {
            const dx = p.x - mouse.x;
            const dy = drawY - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              const angle = Math.atan2(dy, dx);
              
              // Apply repulsion directly to virtual coordinates
              p.x += Math.cos(angle) * force * 3.8;
              p.y += Math.sin(angle) * force * 3.8;
            }
          }

          p.draw(ctx, drawY);

          // Save current drawn positions for grid connection map
          visibleNodes.push({ node: p, drawX: p.x, drawY: drawY });
        }
      });

      // 5. Draw local network connections in viewport
      drawConnections(visibleNodes);

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const handleScroll = () => {
      targetScrollRef.current = window.scrollY;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: '#010103', // Slightly darker charcoal gray cosmic space backdrop
      }}
    />
  );
}
