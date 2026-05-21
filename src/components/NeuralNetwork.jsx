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
        this.vx = 0.05;
        this.vy = -0.02;
      }

      update(width, totalVirtualHeight) {
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around boundaries
        if (this.x < -this.radius * 4) this.x = width + this.radius * 4;
        if (this.x > width + this.radius * 4) this.x = -this.radius * 4;
        if (this.y < -this.radius * 4) this.y = totalVirtualHeight + this.radius * 4;
        if (this.y > totalVirtualHeight + this.radius * 4) this.y = -this.radius * 4;
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
        // Drifting speeds
        this.vx = (Math.random() - 0.5) * 0.12 - 0.06;
        this.vy = (Math.random() - 0.5) * 0.12 + 0.06;
      }

      update(width, totalVirtualHeight) {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < -this.radius * 3) this.x = width + this.radius * 3;
        if (this.x > width + this.radius * 3) this.x = -this.radius * 3;
        if (this.y < -this.radius * 3) this.y = totalVirtualHeight + this.radius * 3;
        if (this.y > totalVirtualHeight + this.radius * 3) this.y = -this.radius * 3;
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
          grad.addColorStop(0.25, '#00f0ff');
          grad.addColorStop(0.7, '#9d4edd');
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
        // Galactic drift speeds
        this.vx = (Math.random() - 0.5) * 0.1 + 0.04;
        this.vy = (Math.random() - 0.5) * 0.1 - 0.04;
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

      update(width, totalVirtualHeight) {
        this.angle += this.rotSpeed;
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < -this.radius * 2) this.x = width + this.radius * 2;
        if (this.x > width + this.radius * 2) this.x = -this.radius * 2;
        if (this.y < -this.radius * 2) this.y = totalVirtualHeight + this.radius * 2;
        if (this.y > totalVirtualHeight + this.radius * 2) this.y = -this.radius * 2;
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

    class CosmicRobo {
      constructor(x, y, radius, color, parallax) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.35 + 0.15; // Hovering drift speeds
        this.vy = (Math.random() - 0.5) * 0.35 - 0.15;
        this.radius = radius;
        this.color = color; // 'cyan' or 'purple'
        this.parallax = parallax;
        this.bobAngle = Math.random() * Math.PI * 2;
        this.bobSpeed = 0.015 + Math.random() * 0.02;
        this.eyeOffset = 0;
        this.eyeDirection = 1;
        this.blinkTimer = 0;
        this.isBlinking = false;
      }

      update(width, totalVirtualHeight) {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < -this.radius * 3) this.x = width + this.radius * 3;
        if (this.x > width + this.radius * 3) this.x = -this.radius * 3;
        if (this.y < -this.radius * 3) this.y = totalVirtualHeight + this.radius * 3;
        if (this.y > totalVirtualHeight + this.radius * 3) this.y = -this.radius * 3;

        this.bobAngle += this.bobSpeed;

        // Visor scanner movement
        this.eyeOffset += 0.25 * this.eyeDirection;
        if (Math.abs(this.eyeOffset) > this.radius * 0.35) {
          this.eyeDirection *= -1;
        }

        // Periodic blinking
        this.blinkTimer++;
        if (this.isBlinking) {
          if (this.blinkTimer > 12) {
            this.isBlinking = false;
            this.blinkTimer = 0;
          }
        } else {
          if (this.blinkTimer > 180 + Math.random() * 220) {
            this.isBlinking = true;
            this.blinkTimer = 0;
          }
        }
      }

      draw(ctx, scrollY) {
        const drawY = this.y - scrollY * this.parallax + Math.sin(this.bobAngle) * 7;
        ctx.save();

        const mainColor = this.color === 'cyan' ? '#00f0ff' : '#9d4edd';
        const glowColor = this.color === 'cyan' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(157, 78, 221, 0.4)';

        ctx.shadowBlur = 14;
        ctx.shadowColor = mainColor;

        // Draw robotic head outer casing (glowing capsule design)
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius, Math.PI, 0); // Rounded top
        ctx.lineTo(this.x + this.radius, drawY + this.radius * 0.4);
        ctx.quadraticCurveTo(this.x, drawY + this.radius * 0.85, this.x - this.radius, drawY + this.radius * 0.4);
        ctx.closePath();
        ctx.fillStyle = 'rgba(5, 5, 12, 0.9)';
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.fill();

        // Antenna
        ctx.beginPath();
        ctx.moveTo(this.x, drawY - this.radius);
        ctx.lineTo(this.x, drawY - this.radius * 1.45);
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glowing antenna tip
        ctx.beginPath();
        ctx.arc(this.x, drawY - this.radius * 1.45, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = Math.sin(this.bobAngle * 4.5) > 0 ? '#ffffff' : mainColor;
        ctx.fill();

        // Ears/Tension bolts
        ctx.fillStyle = mainColor;
        ctx.fillRect(this.x - this.radius - 2.5, drawY - 3, 2.5, 6);
        ctx.fillRect(this.x + this.radius, drawY - 3, 2.5, 6);

        // Robotic Visor
        ctx.beginPath();
        ctx.ellipse(this.x, drawY + this.radius * 0.1, this.radius * 0.65, this.radius * 0.22, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.fill();

        // Eye scanning light
        if (!this.isBlinking) {
          ctx.beginPath();
          ctx.arc(this.x + this.eyeOffset, drawY + this.radius * 0.1, 2, 0, Math.PI * 2);
          ctx.fillStyle = mainColor;
          ctx.shadowBlur = 10;
          ctx.shadowColor = mainColor;
          ctx.fill();
        }

        // Hover flame jet particles
        ctx.shadowBlur = 0;
        const flameParticles = 3;
        for (let i = 0; i < flameParticles; i++) {
          const px = this.x + (Math.random() - 0.5) * this.radius * 0.9;
          const py = drawY + this.radius * 0.85 + Math.random() * 8;
          ctx.beginPath();
          ctx.arc(px, py, Math.random() * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color === 'cyan' ? '0, 240, 255' : '157, 78, 221'}, ${Math.random() * 0.5})`;
          ctx.fill();
        }

        // Outer 3D orbital rings spinning around robot
        ctx.beginPath();
        ctx.ellipse(this.x, drawY + this.radius * 0.15, this.radius * 1.55, this.radius * 0.32, Math.PI / 8, this.bobAngle, this.bobAngle + Math.PI);
        ctx.strokeStyle = `rgba(${this.color === 'cyan' ? '0, 240, 255' : '157, 78, 221'}, 0.28)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      }
    }

    class CosmicAI {
      constructor(x, y, radius, color, parallax) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.25 - 0.1; // slow drift
        this.vy = (Math.random() - 0.5) * 0.25 + 0.1;
        this.radius = radius;
        this.color = color;
        this.parallax = parallax;

        // 3D rotation parameters
        this.angleX = Math.random() * Math.PI;
        this.angleY = Math.random() * Math.PI;
        this.rotSpeedX = 0.007 + Math.random() * 0.005;
        this.rotSpeedY = 0.005 + Math.random() * 0.007;

        // Define 3D octahedron points (6 vertices)
        this.vertices = [
          { x: 0, y: -1, z: 0 },  // top
          { x: 0, y: 1, z: 0 },   // bottom
          { x: -1, y: 0, z: -1 }, // front-left
          { x: 1, y: 0, z: -1 },  // front-right
          { x: 1, y: 0, z: 1 },   // back-right
          { x: -1, y: 0, z: 1 }   // back-left
        ];

        this.vertices.forEach(v => {
          v.x *= radius;
          v.y *= radius;
          v.z *= radius;
        });

        // Orbiting halo communication signals
        this.signals = [];
        for (let i = 0; i < 3; i++) {
          this.signals.push({
            angle: (i * Math.PI * 2) / 3,
            dist: radius * 1.45 + Math.random() * 8,
            speed: 0.015 + Math.random() * 0.012,
            yOffset: (Math.random() - 0.5) * radius * 0.7
          });
        }
      }

      update(width, totalVirtualHeight) {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < -this.radius * 3) this.x = width + this.radius * 3;
        if (this.x > width + this.radius * 3) this.x = -this.radius * 3;
        if (this.y < -this.radius * 3) this.y = totalVirtualHeight + this.radius * 3;
        if (this.y > totalVirtualHeight + this.radius * 3) this.y = -this.radius * 3;

        this.angleX += this.rotSpeedX;
        this.angleY += this.rotSpeedY;

        this.signals.forEach(s => {
          s.angle += s.speed;
        });
      }

      draw(ctx, scrollY) {
        const drawY = this.y - scrollY * this.parallax;
        ctx.save();

        const mainColor = this.color === 'cyan' ? '#00f0ff' : '#9d4edd';
        const secondaryColor = this.color === 'cyan' ? '#9d4edd' : '#00f0ff';

        // 3D rotation mathematical transforms
        const rotateX = (x, y, z, angle) => {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          return {
            x: x,
            y: y * cos - z * sin,
            z: y * sin + z * cos
          };
        };

        const rotateY = (x, y, z, angle) => {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          return {
            x: x * cos - z * sin,
            y: y,
            z: x * sin + z * cos
          };
        };

        // Project all vertices to 2D screen coordinate space
        const projected = this.vertices.map(v => {
          let rotated = rotateX(v.x, v.y, v.z, this.angleX);
          rotated = rotateY(rotated.x, rotated.y, rotated.z, this.angleY);
          return {
            x: this.x + rotated.x,
            y: drawY + rotated.y,
            z: rotated.z
          };
        });

        // Draw 3D octahedron wireframe connector lines
        ctx.shadowBlur = 7;
        ctx.shadowColor = mainColor;
        ctx.strokeStyle = `rgba(${this.color === 'cyan' ? '0, 240, 255' : '157, 78, 221'}, 0.45)`;
        ctx.lineWidth = 1.1;

        const drawEdge = (i, j) => {
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.stroke();
        };

        // Connect mid ring and to top/bottom poles
        for (let m = 2; m <= 5; m++) {
          drawEdge(0, m);
          drawEdge(1, m);
          const next = m === 5 ? 2 : m + 1;
          drawEdge(m, next);
        }

        // Draw glowing nodes at vertices
        ctx.shadowBlur = 10;
        projected.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        });

        // Pulsating glowing inner processor core
        ctx.shadowBlur = 18;
        const radialGrad = ctx.createRadialGradient(this.x, drawY, 0, this.x, drawY, this.radius * 0.45);
        radialGrad.addColorStop(0, '#ffffff');
        radialGrad.addColorStop(0.35, `rgba(${this.color === 'cyan' ? '0, 240, 255' : '157, 78, 221'}, 0.8)`);
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = radialGrad;
        ctx.fill();

        // Draw flat orbital path ring and signaling dots
        this.signals.forEach(s => {
          const sx = this.x + Math.cos(s.angle) * s.dist;
          const sy = drawY + Math.sin(s.angle) * s.dist * 0.35 + s.yOffset;

          // Elliptical path trace line
          ctx.beginPath();
          ctx.ellipse(this.x, drawY + s.yOffset, s.dist, s.dist * 0.35, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${this.color === 'cyan' ? '0, 240, 255' : '157, 78, 221'}, 0.05)`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Outer signaling dot
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fillStyle = secondaryColor;
          ctx.shadowBlur = 8;
          ctx.shadowColor = secondaryColor;
          ctx.fill();

          // Spark synaptic discharges to core
          if (Math.random() > 0.8) {
            ctx.beginPath();
            ctx.moveTo(this.x, drawY);
            ctx.lineTo(sx, sy);
            ctx.strokeStyle = `rgba(${this.color === 'cyan' ? '0, 240, 255' : '157, 78, 221'}, 0.12)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
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

      // 7. Interactive Hovering CosmicRobo 1 (Hero section)
      spaceObjects.push(new CosmicRobo(w * 0.75, h * 0.25, 20, 'cyan', 0.32));

      // 8. Rotating octahedron CosmicAI 1 (Hero / About transition)
      spaceObjects.push(new CosmicAI(w * 0.3, h * 0.85, 22, 'purple', 0.34));

      // 9. Interactive Hovering CosmicRobo 2 (Experience section)
      spaceObjects.push(new CosmicRobo(w * 0.8, h * 1.35, 18, 'purple', 0.36));

      // 10. Rotating octahedron CosmicAI 2 (Projects section)
      spaceObjects.push(new CosmicAI(w * 0.25, h * 1.6, 24, 'cyan', 0.42));

      // 11. Interactive Hovering CosmicRobo 3 (Laboratories section)
      spaceObjects.push(new CosmicRobo(w * 0.7, h * 2.1, 22, 'cyan', 0.38));

      // 12. Rotating octahedron CosmicAI 3 (Contact section)
      spaceObjects.push(new CosmicAI(w * 0.35, h * 2.8, 20, 'purple', 0.40));
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

      // 3. Update & Draw spinning galaxies, celestial bodies, robos, and AI cores
      spaceObjects.forEach(obj => {
        if (obj.update) obj.update(canvas.width, totalVirtualHeight);
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
