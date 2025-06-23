import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Neural network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Mouse interaction
        const mouseDistance = Math.sqrt(
          Math.pow(particle.x - mousePosition.x, 2) + 
          Math.pow(particle.y - mousePosition.y, 2)
        );

        if (mouseDistance < 100) {
          const force = (100 - mouseDistance) / 100;
          particle.vx += (particle.x - mousePosition.x) * force * 0.002;
          particle.vy += (particle.y - mousePosition.y) * force * 0.002;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePosition]);

  return (
    <div className="landing-page">
      {/* Neural Network Canvas */}
      <canvas 
        ref={canvasRef}
        className="neural-canvas"
      />

      {/* Animated Background Gradients */}
      <div className="neural-background">
        <div className="neural-gradient neural-gradient-1"></div>
        <div className="neural-gradient neural-gradient-2"></div>
        <div className="neural-gradient neural-gradient-3"></div>
      </div>

      {/* Navigation */}
      <nav className="neural-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon neural-glow">
              <div className="brand-icon-inner">⚡</div>
            </div>
            <span className="brand-name neural-text">ComplyMate</span>
          </div>
          
          <div className="nav-links">
            <a href="#features" className="nav-link neural-link">Features</a>
            <a href="#pricing" className="nav-link neural-link">Pricing</a>
            <a href="#about" className="nav-link neural-link">About</a>
            <a href="#contact" className="nav-link neural-link">Contact</a>
          </div>

          <div className="nav-actions">
            <button 
              className="btn-neural-ghost"
              onClick={() => navigate('/auth/login')}
            >
              Sign In
            </button>
            <button 
              className="btn-neural-primary"
              onClick={() => navigate('/auth/register')}
            >
              <span>Get Started</span>
              <div className="btn-neural-glow"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section neural-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge neural-badge">
              <span className="neural-pulse"></span>
              <span className="badge-text">✨ Powered by Neural AI</span>
            </div>
            
            <h1 className="hero-title">
              Create
              <span className="neural-gradient-text"> OSHA forms</span>
              <br />
              in minutes, not hours
            </h1>
            
            <p className="hero-description neural-text-glow">
              Transform complex compliance into simple conversations. 
              Our Neural AI understands OSHA requirements and generates perfect forms automatically.
            </p>

            <div className="hero-actions">
              <button 
                className="btn-neural-cta"
                onClick={() => navigate('/auth/register')}
              >
                <span>Create your first form</span>
                <div className="btn-neural-energy"></div>
                <svg className="icon-arrow" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="btn-neural-demo">
                <div className="demo-orb"></div>
                <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Watch Neural Demo</span>
              </button>
            </div>

            <div className="hero-stats neural-stats">
              <div className="stat-item neural-stat">
                <div className="stat-number neural-counter">2 min</div>
                <div className="stat-label">Neural completion</div>
              </div>
              <div className="neural-divider"></div>
              <div className="stat-item neural-stat">
                <div className="stat-number neural-counter">100%</div>
                <div className="stat-label">AI accuracy</div>
              </div>
              <div className="neural-divider"></div>
              <div className="stat-item neural-stat">
                <div className="stat-number neural-counter">50+</div>
                <div className="stat-label">Neural templates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Demo Interface */}
        <div className="neural-demo-container">
          <div className="neural-demo-card">
            <div className="neural-demo-header">
              <div className="neural-dots">
                <span className="neural-dot active"></span>
                <span className="neural-dot processing"></span>
                <span className="neural-dot standby"></span>
              </div>
              <div className="neural-demo-title">
                <span className="neural-icon">🧠</span>
                ComplyMate Neural Engine
              </div>
            </div>
            <div className="neural-demo-content">
              <div className="neural-chat-bubble user">
                <div className="bubble-content">
                  "An employee slipped in the warehouse yesterday and injured their wrist"
                </div>
                <div className="neural-energy-trail"></div>
              </div>
              <div className="neural-processing">
                <div className="neural-synapses">
                  <div className="synapse"></div>
                  <div className="synapse"></div>
                  <div className="synapse"></div>
                </div>
                <span className="processing-text">Neural processing...</span>
              </div>
              <div className="neural-chat-bubble ai">
                <div className="neural-ai-avatar">
                  <div className="ai-core">⚡</div>
                  <div className="ai-pulse"></div>
                </div>
                <div className="bubble-content">
                  Analyzing incident parameters... OSHA 301 form generated with 99.9% accuracy.
                  <div className="neural-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="neural-form-preview">
                <div className="form-header neural-form-title">
                  <span className="form-icon">📋</span>
                  OSHA 301 - Neural Generated
                </div>
                <div className="neural-form-fields">
                  <div className="neural-field">
                    <span className="field-label">Case ID:</span>
                    <span className="field-value neural-highlight">NRL-2024-001</span>
                  </div>
                  <div className="neural-field">
                    <span className="field-label">Incident Type:</span>
                    <span className="field-value neural-highlight">Slip & Fall</span>
                  </div>
                  <div className="neural-field">
                    <span className="field-label">Body Part:</span>
                    <span className="field-value neural-highlight">Wrist (Right)</span>
                  </div>
                </div>
                <div className="neural-confidence">
                  <span className="confidence-label">Neural Confidence:</span>
                  <div className="confidence-bar">
                    <div className="confidence-fill"></div>
                  </div>
                  <span className="confidence-value">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">
              Three simple steps to perfect OSHA compliance
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <div className="feature-content">
                <h3 className="feature-title">Describe the incident</h3>
                <p className="feature-description">
                  Simply tell our AI what happened in natural language. No forms, no fields to remember.
                </p>
              </div>
              <div className="feature-visual">
                <div className="visual-chat">
                  <div className="chat-line">"Employee cut finger on machinery"</div>
                  <div className="chat-cursor"></div>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-number">02</div>
              <div className="feature-content">
                <h3 className="feature-title">AI generates the form</h3>
                <p className="feature-description">
                  Our AI understands OSHA requirements and creates the correct form with all required fields.
                </p>
              </div>
              <div className="feature-visual">
                <div className="visual-form">
                  <div className="form-line"></div>
                  <div className="form-line short"></div>
                  <div className="form-line"></div>
                  <div className="form-sparkles">✨</div>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-number">03</div>
              <div className="feature-content">
                <h3 className="feature-title">Review and submit</h3>
                <p className="feature-description">
                  Review the generated form, make any adjustments, and submit directly to OSHA.
                </p>
              </div>
              <div className="feature-visual">
                <div className="visual-check">
                  <div className="check-circle">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Features Section */}
      <section className="expanded-features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose ComplyMate?</h2>
            <p className="section-subtitle">
              Our AI-powered platform transforms complex OSHA compliance into a simple, automated process.
            </p>
          </div>

          <div className="expanded-features-grid">
            <div className="expanded-feature-card">
              <div className="feature-icon gradient-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="expanded-feature-title">AI-Powered Automation</h3>
              <p className="expanded-feature-description">
                Just describe what happened - our AI automatically fills out the correct OSHA forms with 99.9% accuracy.
              </p>
            </div>

            <div className="expanded-feature-card">
              <div className="feature-icon gradient-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="M13 12h3"/>
                  <path d="M8 12H5"/>
                </svg>
              </div>
              <h3 className="expanded-feature-title">Real-Time Validation</h3>
              <p className="expanded-feature-description">
                Every form is validated against current OSHA regulations before submission to ensure 100% compliance.
              </p>
            </div>

            <div className="expanded-feature-card">
              <div className="feature-icon gradient-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3 className="expanded-feature-title">Complete Form Library</h3>
              <p className="expanded-feature-description">
                Access all OSHA forms (300, 300A, 301) with intelligent templates and pre-filled data.
              </p>
            </div>

            <div className="expanded-feature-card">
              <div className="feature-icon gradient-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="expanded-feature-title">Instant PDF Generation</h3>
              <p className="expanded-feature-description">
                Generate professional, submission-ready PDFs instantly with proper formatting and signatures.
              </p>
            </div>

            <div className="expanded-feature-card">
              <div className="feature-icon gradient-red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="expanded-feature-title">Enterprise Security</h3>
              <p className="expanded-feature-description">
                Bank-level encryption, HIPAA compliance, and secure cloud storage for all your sensitive data.
              </p>
            </div>

            <div className="expanded-feature-card">
              <div className="feature-icon gradient-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <h3 className="expanded-feature-title">Smart Notifications</h3>
              <p className="expanded-feature-description">
                Get alerts for regulation changes, form deadlines, and compliance requirements automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">
              Choose the plan that fits your organization's needs. Start free, upgrade anytime.
            </p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Starter</h3>
                <div className="pricing-price">
                  <span className="price-currency">$</span>
                  <span className="price-amount">0</span>
                  <span className="price-period">/month</span>
                </div>
                <p className="pricing-description">Perfect for small businesses getting started</p>
              </div>
              <div className="pricing-features">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Up to 5 forms per month</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Basic AI assistance</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>PDF generation</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Email support</span>
                </div>
              </div>
              <button className="btn-pricing" onClick={() => navigate('/auth/register')}>Get Started Free</button>
            </div>

            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3 className="pricing-name">Professional</h3>
                <div className="pricing-price">
                  <span className="price-currency">$</span>
                  <span className="price-amount">49</span>
                  <span className="price-period">/month</span>
                </div>
                <p className="pricing-description">For growing companies with regular compliance needs</p>
              </div>
              <div className="pricing-features">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Unlimited forms</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Advanced AI features</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Custom templates</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Priority support</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>API access</span>
                </div>
              </div>
              <button className="btn-pricing primary" onClick={() => navigate('/auth/register')}>Start Trial</button>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Enterprise</h3>
                <div className="pricing-price">
                  <span className="price-amount">Custom</span>
                </div>
                <p className="pricing-description">For large organizations with complex requirements</p>
              </div>
              <div className="pricing-features">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Everything in Professional</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Custom integrations</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Dedicated support</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>SLA guarantee</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>On-premise deployment</span>
                </div>
              </div>
              <button className="btn-pricing">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to simplify compliance?</h2>
            <p className="cta-description">
              Join hundreds of companies already using ComplyMate
            </p>
            <button 
              className="btn-cta"
              onClick={() => navigate('/auth/register')}
            >
              <span>Start creating forms</span>
              <svg className="icon-arrow" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-icon">
                <div className="brand-icon-inner">⚡</div>
              </div>
              <span className="brand-name">ComplyMate</span>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#">API</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#">Careers</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Documentation</a>
                <a href="#">Status</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 ComplyMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <style>{`
        /* Neural Network Base */
        .landing-page {
          min-height: 100vh;
          background: #0a0a0f;
          position: relative;
          overflow-x: hidden;
          color: #ffffff;
        }

        /* Neural Network Canvas */
        .neural-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        /* Neural Background Gradients */
        .neural-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .neural-gradient {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: neuralFloat 20s infinite ease-in-out;
        }

        .neural-gradient-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
          top: -300px;
          left: -300px;
          animation-delay: 0s;
        }

        .neural-gradient-2 {
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(138, 43, 226, 0.08) 0%, transparent 70%);
          bottom: -400px;
          right: -400px;
          animation-delay: 10s;
        }

        .neural-gradient-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 107, 53, 0.06) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 5s;
        }

        @keyframes neuralFloat {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(100px, -50px) scale(1.1); }
          66% { transform: translate(-50px, 100px) scale(0.9); }
        }

        /* Neural Navigation */
        .neural-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(10, 10, 15, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 212, 255, 0.3);
          z-index: 100;
          padding: 1rem 0;
          box-shadow: 0 4px 32px -8px rgba(0, 212, 255, 0.2);
        }

        .brand-icon.neural-glow {
          background: linear-gradient(135deg, #00d4ff, #ff6b35);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
          animation: neuralPulse 2s infinite;
        }

        @keyframes neuralPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.5); }
          50% { box-shadow: 0 0 30px rgba(0, 212, 255, 0.8); }
        }

        .brand-name.neural-text {
          background: linear-gradient(45deg, #00d4ff, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-link.neural-link {
          color: rgba(255, 255, 255, 0.8);
          position: relative;
          transition: all 0.3s ease;
        }

        .nav-link.neural-link:hover {
          color: #00d4ff;
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .nav-link.neural-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #00d4ff, #ff6b35);
          transition: width 0.3s ease;
        }

        .nav-link.neural-link:hover::after {
          width: 100%;
        }

        /* Neural Buttons */
        .btn-neural-ghost {
          background: none;
          border: 1px solid rgba(0, 212, 255, 0.4);
          color: #00d4ff;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-neural-ghost:hover {
          background: rgba(0, 212, 255, 0.1);
          border-color: #00d4ff;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
          transform: translateY(-1px);
        }

        .btn-neural-primary {
          background: linear-gradient(135deg, #00d4ff, #0099cc);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-neural-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .btn-neural-primary:hover .btn-neural-glow {
          left: 100%;
        }

        .btn-neural-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
        }

        /* Hero Section */
        .neural-section {
          position: relative;
          z-index: 2;
          padding: 8rem 2rem 4rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .neural-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 50px;
          padding: 0.5rem 1.5rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(12px);
        }

        .neural-pulse {
          width: 8px;
          height: 8px;
          background: #00d4ff;
          border-radius: 50%;
          animation: neuralPulseSmall 1.5s infinite;
        }

        @keyframes neuralPulseSmall {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .neural-gradient-text {
          background: linear-gradient(45deg, #00d4ff, #ff6b35, #00d4ff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: neuralGradientFlow 3s linear infinite;
        }

        @keyframes neuralGradientFlow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .neural-text-glow {
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }

        /* Neural CTA Button */
        .btn-neural-cta {
          background: linear-gradient(135deg, #00d4ff, #0066cc);
          color: white;
          border: none;
          padding: 1.2rem 2.5rem;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-neural-energy {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-100%) skewX(-20deg);
          transition: transform 0.6s ease;
        }

        .btn-neural-cta:hover .btn-neural-energy {
          transform: translateX(100%) skewX(-20deg);
        }

        .btn-neural-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 212, 255, 0.4);
        }

        /* Neural Demo Button */
        .btn-neural-demo {
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #00d4ff;
          padding: 1.2rem 2.5rem;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          backdrop-filter: blur(12px);
          position: relative;
        }

        .demo-orb {
          width: 8px;
          height: 8px;
          background: #00d4ff;
          border-radius: 50%;
          animation: neuralOrb 2s infinite;
        }

        @keyframes neuralOrb {
          0%, 100% { 
            box-shadow: 0 0 5px #00d4ff;
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 20px #00d4ff;
            transform: scale(1.5);
          }
        }

        .btn-neural-demo:hover {
          background: rgba(0, 212, 255, 0.2);
          border-color: #00d4ff;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 212, 255, 0.2);
        }

        /* Neural Stats */
        .neural-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-top: 3rem;
        }

        .neural-stat {
          text-align: center;
          position: relative;
        }

        .neural-counter {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(45deg, #00d4ff, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: neuralCounter 2s ease-in-out infinite alternate;
        }

        @keyframes neuralCounter {
          0% { text-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
          100% { text-shadow: 0 0 20px rgba(0, 212, 255, 0.8); }
        }

        .neural-divider {
          width: 2px;
          height: 3rem;
          background: linear-gradient(180deg, transparent, #00d4ff, transparent);
          opacity: 0.6;
        }

        /* Neural Demo Interface */
        .neural-demo-container {
          max-width: 700px;
          margin: 4rem auto 0;
        }

        .neural-demo-card {
          background: rgba(10, 10, 15, 0.8);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 25px 50px rgba(0, 212, 255, 0.1);
        }

        .neural-demo-header {
          background: rgba(0, 212, 255, 0.1);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        }

        .neural-dots {
          display: flex;
          gap: 0.5rem;
        }

        .neural-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
        }

        .neural-dot.active {
          background: #00ff88;
          box-shadow: 0 0 10px #00ff88;
        }

        .neural-dot.processing {
          background: #ffaa00;
          box-shadow: 0 0 10px #ffaa00;
          animation: neuralProcessing 1s infinite;
        }

        .neural-dot.standby {
          background: #ff4444;
        }

        @keyframes neuralProcessing {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .neural-demo-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #00d4ff;
        }

        .neural-icon {
          font-size: 1.2rem;
          animation: neuralBrain 3s infinite;
        }

        @keyframes neuralBrain {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Neural Chat Interface */
        .neural-demo-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .neural-chat-bubble {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .neural-chat-bubble.user {
          justify-content: flex-end;
        }

        .neural-chat-bubble.user .bubble-content {
          background: linear-gradient(135deg, #00d4ff, #0099cc);
          color: white;
          border-radius: 18px 18px 4px 18px;
          position: relative;
        }

        .neural-energy-trail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: translateX(-100%);
          animation: neuralEnergyTrail 2s infinite;
        }

        @keyframes neuralEnergyTrail {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .neural-ai-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #00d4ff, #ff6b35);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }

        .ai-core {
          font-size: 1.2rem;
          animation: neuralSpin 4s linear infinite;
        }

        .ai-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #00d4ff;
          animation: neuralAiPulse 2s infinite;
        }

        @keyframes neuralSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes neuralAiPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .neural-chat-bubble.ai .bubble-content {
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #ffffff;
          border-radius: 18px 18px 18px 4px;
          backdrop-filter: blur(10px);
        }

        /* Neural Processing */
        .neural-processing {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(0, 212, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.2);
        }

        .neural-synapses {
          display: flex;
          gap: 0.5rem;
        }

        .synapse {
          width: 6px;
          height: 6px;
          background: #00d4ff;
          border-radius: 50%;
          animation: neuralSynapse 1.5s infinite;
        }

        .synapse:nth-child(2) {
          animation-delay: 0.2s;
        }

        .synapse:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes neuralSynapse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.5;
          }
          50% { 
            transform: scale(1.5);
            opacity: 1;
            box-shadow: 0 0 10px #00d4ff;
          }
        }

        .processing-text {
          color: #00d4ff;
          font-weight: 500;
          animation: neuralTyping 2s infinite;
        }

        @keyframes neuralTyping {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Neural Form Preview */
        .neural-form-preview {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
        }

        .neural-form-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .form-icon {
          font-size: 1.2rem;
        }

        .neural-form-fields {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .neural-field {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }

        .field-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .neural-highlight {
          color: #00d4ff;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        }

        /* Neural Confidence Bar */
        .neural-confidence {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .confidence-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .confidence-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .confidence-fill {
          width: 99.9%;
          height: 100%;
          background: linear-gradient(90deg, #00d4ff, #00ff88);
          animation: neuralConfidence 2s ease-in-out;
        }

        @keyframes neuralConfidence {
          0% { width: 0%; }
          100% { width: 99.9%; }
        }

        .confidence-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #00ff88;
        }

        /* Neural Typing Dots */
        .neural-typing-dots {
          display: flex;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }

        .neural-typing-dots span {
          width: 4px;
          height: 4px;
          background: #00d4ff;
          border-radius: 50%;
          animation: neuralTypingDots 1.4s infinite ease-in-out;
        }

        .neural-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .neural-typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        .neural-typing-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes neuralTypingDots {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1.2);
            opacity: 1;
            box-shadow: 0 0 8px #00d4ff;
          }
        }

        /* Performance Optimizations */
        * {
          will-change: auto;
        }

        .neural-canvas,
        .neural-gradient,
        .btn-neural-cta,
        .neural-counter,
        .ai-core {
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }

                 /* Features Section */
         .features-section {
           padding: 6rem 2rem;
           background: rgba(0, 0, 0, 0.3);
           position: relative;
           z-index: 2;
         }

         .section-container {
           max-width: 1200px;
           margin: 0 auto;
         }

         .section-header {
           text-align: center;
           margin-bottom: 4rem;
         }

         .section-title {
           font-size: 2.5rem;
           font-weight: 700;
           color: white;
           margin-bottom: 1rem;
           letter-spacing: -0.02em;
         }

         .section-subtitle {
           font-size: 1.125rem;
           color: rgba(255, 255, 255, 0.8);
         }

         .features-grid {
           display: grid;
           grid-template-columns: 1fr;
           gap: 3rem;
           max-width: 800px;
           margin: 0 auto;
         }

         .feature-card {
           display: grid;
           grid-template-columns: auto 1fr auto;
           gap: 2rem;
           align-items: center;
           padding: 2rem;
           background: rgba(0, 212, 255, 0.05);
           border: 1px solid rgba(0, 212, 255, 0.2);
           border-radius: 20px;
           backdrop-filter: blur(12px);
         }

         .feature-number {
           width: 48px;
           height: 48px;
           background: linear-gradient(135deg, #00d4ff, #0099cc);
           color: white;
           border-radius: 12px;
           display: flex;
           align-items: center;
           justify-content: center;
           font-weight: 700;
           font-size: 1.25rem;
         }

         .feature-content h3 {
           font-size: 1.25rem;
           font-weight: 600;
           color: white;
           margin-bottom: 0.5rem;
         }

         .feature-description {
           color: rgba(255, 255, 255, 0.8);
           line-height: 1.6;
         }

         .feature-visual {
           width: 120px;
           height: 80px;
           display: flex;
           align-items: center;
           justify-content: center;
         }

         .visual-chat {
           position: relative;
           width: 100px;
           height: 60px;
           background: rgba(0, 212, 255, 0.1);
           border-radius: 12px;
           border: 2px solid rgba(0, 212, 255, 0.3);
           padding: 0.75rem;
           display: flex;
           align-items: center;
         }

         .chat-line {
           font-size: 0.75rem;
           color: #00d4ff;
           line-height: 1.2;
         }

         .chat-cursor {
           width: 2px;
           height: 16px;
           background: #00d4ff;
           margin-left: 0.25rem;
           animation: blink 1s infinite;
         }

         @keyframes blink {
           0%, 50% { opacity: 1; }
           51%, 100% { opacity: 0; }
         }

         .visual-form {
           position: relative;
           width: 80px;
           height: 60px;
           background: rgba(0, 212, 255, 0.1);
           border-radius: 8px;
           border: 2px solid rgba(0, 212, 255, 0.3);
           padding: 0.75rem;
           display: flex;
           flex-direction: column;
           gap: 0.5rem;
         }

         .form-line {
           height: 2px;
           background: rgba(0, 212, 255, 0.6);
           border-radius: 1px;
         }

         .form-line.short {
           width: 60%;
         }

         .form-sparkles {
           position: absolute;
           top: -10px;
           right: -10px;
           font-size: 1.25rem;
           animation: sparkle 2s infinite;
         }

         @keyframes sparkle {
           0%, 100% { transform: scale(1); }
           50% { transform: scale(1.2); }
         }

         .visual-check {
           display: flex;
           align-items: center;
           justify-content: center;
         }

         .check-circle {
           width: 48px;
           height: 48px;
           background: linear-gradient(135deg, #00ff88, #00cc66);
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           color: white;
           animation: checkPulse 2s infinite;
         }

         .check-circle svg {
           width: 24px;
           height: 24px;
         }

         @keyframes checkPulse {
           0%, 100% { transform: scale(1); }
           50% { transform: scale(1.05); }
         }

         /* Expanded Features Section */
         .expanded-features-section {
           background: rgba(0, 0, 0, 0.4);
           padding: 6rem 2rem;
           position: relative;
           z-index: 2;
         }

         .expanded-features-grid {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
           gap: 2rem;
           margin-top: 3rem;
         }

         .expanded-feature-card {
           background: rgba(0, 212, 255, 0.05);
           border: 1px solid rgba(0, 212, 255, 0.2);
           border-radius: 16px;
           padding: 2rem;
           text-align: center;
           transition: all 0.3s;
           backdrop-filter: blur(12px);
         }

         .expanded-feature-card:hover {
           transform: translateY(-5px);
           box-shadow: 0 20px 40px -10px rgba(0, 212, 255, 0.3);
           border-color: rgba(0, 212, 255, 0.4);
         }

         .feature-icon {
           width: 64px;
           height: 64px;
           border-radius: 16px;
           display: flex;
           align-items: center;
           justify-content: center;
           margin: 0 auto 1.5rem;
         }

         .feature-icon svg {
           width: 32px;
           height: 32px;
           color: white;
         }

         .gradient-blue { background: linear-gradient(135deg, #00d4ff, #0099cc); }
         .gradient-green { background: linear-gradient(135deg, #00ff88, #00cc66); }
         .gradient-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
         .gradient-orange { background: linear-gradient(135deg, #ff6b35, #e55a2b); }
         .gradient-red { background: linear-gradient(135deg, #ff4444, #cc3333); }
         .gradient-teal { background: linear-gradient(135deg, #06b6d4, #0891b2); }

         .expanded-feature-title {
           font-size: 1.25rem;
           font-weight: 600;
           margin-bottom: 1rem;
           color: white;
         }

         .expanded-feature-description {
           color: rgba(255, 255, 255, 0.8);
           line-height: 1.6;
         }

         /* Pricing Section */
         .pricing-section {
           background: rgba(0, 0, 0, 0.2);
           padding: 6rem 2rem;
           position: relative;
           z-index: 2;
         }

         .pricing-grid {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
           gap: 2rem;
           margin-top: 3rem;
         }

         .pricing-card {
           background: rgba(0, 212, 255, 0.05);
           border: 1px solid rgba(0, 212, 255, 0.2);
           border-radius: 16px;
           padding: 2rem;
           position: relative;
           transition: all 0.3s;
           backdrop-filter: blur(12px);
         }

         .pricing-card:hover {
           transform: translateY(-5px);
           box-shadow: 0 20px 40px -10px rgba(0, 212, 255, 0.3);
         }

         .pricing-card.featured {
           border-color: #00d4ff;
           transform: scale(1.05);
           background: rgba(0, 212, 255, 0.1);
         }

         .popular-badge {
           position: absolute;
           top: -10px;
           left: 50%;
           transform: translateX(-50%);
           background: linear-gradient(135deg, #00d4ff, #0099cc);
           color: white;
           padding: 0.5rem 1rem;
           border-radius: 20px;
           font-size: 0.875rem;
           font-weight: 600;
         }

         .pricing-header {
           text-align: center;
           margin-bottom: 2rem;
         }

         .pricing-name {
           font-size: 1.5rem;
           font-weight: 700;
           margin-bottom: 1rem;
           color: white;
         }

         .pricing-price {
           display: flex;
           align-items: baseline;
           justify-content: center;
           margin-bottom: 1rem;
         }

         .price-currency {
           font-size: 1.5rem;
           font-weight: 600;
           color: rgba(255, 255, 255, 0.7);
         }

         .price-amount {
           font-size: 3rem;
           font-weight: 800;
           color: white;
         }

         .price-period {
           font-size: 1rem;
           color: rgba(255, 255, 255, 0.7);
         }

         .pricing-description {
           color: rgba(255, 255, 255, 0.7);
         }

         .pricing-features {
           margin-bottom: 2rem;
         }

         .feature-item {
           display: flex;
           align-items: center;
           gap: 0.75rem;
           margin-bottom: 1rem;
         }

         .feature-check {
           color: #00ff88;
           font-weight: 600;
         }

         .btn-pricing {
           width: 100%;
           padding: 1rem;
           border: 2px solid rgba(0, 212, 255, 0.3);
           background: rgba(0, 212, 255, 0.1);
           color: white;
           border-radius: 12px;
           font-weight: 600;
           cursor: pointer;
           transition: all 0.3s;
         }

         .btn-pricing:hover {
           border-color: #00d4ff;
           background: rgba(0, 212, 255, 0.2);
         }

         .btn-pricing.primary {
           background: linear-gradient(135deg, #00d4ff, #0099cc);
           color: white;
           border-color: transparent;
         }

         .btn-pricing.primary:hover {
           background: linear-gradient(135deg, #00b8e6, #0088bb);
         }

         /* CTA Section */
         .cta-section {
           padding: 6rem 2rem;
           background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
           text-align: center;
         }

         .cta-container {
           max-width: 600px;
           margin: 0 auto;
         }

         .cta-title {
           font-size: 2.5rem;
           font-weight: 700;
           color: white;
           margin-bottom: 1rem;
           letter-spacing: -0.02em;
         }

         .cta-description {
           font-size: 1.125rem;
           color: rgba(255, 255, 255, 0.8);
           margin-bottom: 2rem;
         }

         .btn-cta {
           background: rgba(255, 255, 255, 0.9);
           color: #00d4ff;
           border: none;
           padding: 1.25rem 2.5rem;
           border-radius: 16px;
           font-weight: 600;
           font-size: 1.1rem;
           cursor: pointer;
           transition: all 0.3s;
           display: inline-flex;
           align-items: center;
           gap: 0.5rem;
         }

         .btn-cta:hover {
           background: white;
           transform: translateY(-2px);
           box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.3);
         }

         .btn-cta:hover .icon-arrow {
           transform: translateX(2px);
         }

         .icon-arrow {
           width: 20px;
           height: 20px;
           transition: transform 0.2s;
         }

         /* Footer */
         .landing-footer {
           background: rgba(0, 0, 0, 0.8);
           color: white;
           padding: 3rem 0 1rem;
           position: relative;
           z-index: 2;
           border-top: 1px solid rgba(0, 212, 255, 0.2);
         }

         .footer-container {
           max-width: 1200px;
           margin: 0 auto;
           padding: 0 2rem;
         }

         .footer-content {
           display: grid;
           grid-template-columns: 1fr 2fr;
           gap: 3rem;
           margin-bottom: 2rem;
         }

         .footer-brand {
           display: flex;
           align-items: center;
           gap: 0.75rem;
         }

         .nav-container {
           max-width: 1200px;
           margin: 0 auto;
           padding: 0 2rem;
           display: flex;
           align-items: center;
           justify-content: space-between;
         }

         .nav-brand {
           display: flex;
           align-items: center;
           gap: 0.75rem;
         }

         .brand-icon {
           width: 32px;
           height: 32px;
           background: linear-gradient(135deg, #00d4ff, #0099cc);
           border: 1px solid rgba(0, 212, 255, 0.3);
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           backdrop-filter: blur(12px);
           box-shadow: 0 4px 16px -4px rgba(0, 212, 255, 0.3);
         }

         .brand-icon-inner {
           color: white;
           font-weight: 600;
           font-size: 1.1rem;
         }

         .brand-name {
           font-size: 1.25rem;
           font-weight: 700;
           color: white;
         }

         .nav-links {
           display: flex;
           align-items: center;
           gap: 2rem;
         }

         .nav-link {
           color: rgba(255, 255, 255, 0.8);
           text-decoration: none;
           font-weight: 500;
           font-size: 0.95rem;
           transition: color 0.2s;
         }

         .nav-link:hover {
           color: white;
         }

         .nav-actions {
           display: flex;
           align-items: center;
           gap: 1rem;
         }

         .hero-container {
           max-width: 800px;
           margin: 0 auto;
           text-align: center;
           position: relative;
           z-index: 2;
         }

         .hero-content {
           margin-bottom: 4rem;
         }

         .badge-text {
           font-size: 0.875rem;
           font-weight: 500;
           color: white;
         }

         .hero-title {
           font-size: 4rem;
           font-weight: 800;
           line-height: 1.1;
           margin-bottom: 1.5rem;
           color: white;
           letter-spacing: -0.02em;
         }

         .hero-description {
           font-size: 1.25rem;
           color: rgba(255, 255, 255, 0.8);
           margin-bottom: 3rem;
           line-height: 1.6;
           max-width: 600px;
           margin-left: auto;
           margin-right: auto;
         }

         .hero-actions {
           display: flex;
           justify-content: center;
           gap: 1rem;
           align-items: center;
           margin-bottom: 4rem;
         }

         .play-icon {
           width: 20px;
           height: 20px;
         }

         .hero-stats {
           display: flex;
           justify-content: center;
           align-items: center;
           gap: 2rem;
           color: rgba(255, 255, 255, 0.8);
           font-size: 0.875rem;
         }

         .stat-item {
           text-align: center;
         }

         .stat-number {
           font-size: 1.5rem;
           font-weight: 700;
           color: white;
           display: block;
           margin-bottom: 0.25rem;
         }

         .stat-label {
           font-weight: 500;
         }

         .stat-divider {
           width: 1px;
           height: 2rem;
           background: rgba(255, 255, 255, 0.3);
         }

         .bubble-content {
           padding: 0.75rem 1rem;
           max-width: 300px;
           font-size: 0.875rem;
           line-height: 1.4;
         }

         .footer-links {
           display: grid;
           grid-template-columns: repeat(3, 1fr);
           gap: 2rem;
         }

         .footer-section h4 {
           font-weight: 600;
           margin-bottom: 1rem;
           color: white;
         }

         .footer-section a {
           display: block;
           color: rgba(255, 255, 255, 0.7);
           text-decoration: none;
           margin-bottom: 0.5rem;
           transition: color 0.2s;
         }

         .footer-section a:hover {
           color: #00d4ff;
         }

         .footer-bottom {
           border-top: 1px solid rgba(0, 212, 255, 0.2);
           padding-top: 1rem;
           text-align: center;
           color: rgba(255, 255, 255, 0.7);
         }

         /* Responsive Design */
         @media (max-width: 768px) {
           .nav-links {
             display: none;
           }

           .hero-title {
             font-size: 2.5rem;
           }

           .hero-actions {
             flex-direction: column;
             gap: 1rem;
           }

           .btn-neural-cta,
           .btn-neural-demo {
             width: 100%;
             justify-content: center;
           }

           .neural-stats {
             flex-direction: column;
             gap: 1.5rem;
           }

           .neural-divider {
             width: 3rem;
             height: 2px;
           }

           .neural-demo-container {
             margin: 2rem auto 0;
             padding: 0 1rem;
           }

           .feature-card {
             grid-template-columns: 1fr;
             text-align: center;
           }

           .feature-visual {
             order: -1;
           }

           .cta-title {
             font-size: 2rem;
           }

           .footer-content {
             grid-template-columns: 1fr;
             gap: 2rem;
           }

           .footer-links {
             grid-template-columns: 1fr;
           }
         }
      `}</style>
    </div>
  );
};

export default LandingPage; 