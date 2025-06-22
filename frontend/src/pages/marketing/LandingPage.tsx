import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Generate floating dots
  const generateDots = () => {
    const dots = [];
    for (let i = 0; i < 50; i++) {
      dots.push(
        <div 
          key={i} 
          className="floating-dot" 
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      );
    }
    return dots;
  };

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-dots">
          {generateDots()}
        </div>
        <div className="gradient-orbs">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
          <div className="gradient-orb orb-4"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">
              <div className="brand-icon-inner">✦</div>
            </div>
            <span className="brand-name">ComplyMate</span>
          </div>
          
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          <div className="nav-actions">
            <button 
              className="btn-ghost"
              onClick={() => navigate('/auth/login')}
            >
              Sign In
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/auth/register')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">✨ Powered by AI</span>
            </div>
            
            <h1 className="hero-title">
              Create
              <span className="gradient-text"> OSHA forms</span>
              <br />
              in minutes, not hours
            </h1>
            
            <p className="hero-description">
              Transform complex compliance into simple conversations. 
              Our AI understands OSHA requirements and generates perfect forms automatically.
            </p>

            <div className="hero-actions">
              <button 
                className="btn-primary-large"
                onClick={() => navigate('/auth/register')}
              >
                <span>Create your first form</span>
                <svg className="icon-arrow" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="btn-demo">
                <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Watch demo</span>
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">2 min</div>
                <div className="stat-label">Average completion</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">OSHA compliant</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Form templates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Card */}
        <div className="demo-container">
          <div className="demo-card">
            <div className="demo-header">
              <div className="demo-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="demo-title">ComplyMate AI</div>
            </div>
            <div className="demo-content">
              <div className="chat-bubble user">
                <div className="bubble-content">
                  "An employee slipped in the warehouse yesterday and injured their wrist"
                </div>
              </div>
              <div className="chat-bubble ai">
                <div className="ai-avatar">
                  <div className="ai-icon">✦</div>
                </div>
                <div className="bubble-content">
                  I'll create an OSHA 301 incident report for you. Let me gather the required details...
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="form-preview">
                <div className="form-header">OSHA 301 - Incident Report</div>
                <div className="form-fields">
                  <div className="field">
                    <span className="field-label">Case Number:</span>
                    <span className="field-value">2024-001</span>
                  </div>
                  <div className="field">
                    <span className="field-label">Injury Type:</span>
                    <span className="field-value">Slip and Fall</span>
                  </div>
                  <div className="field">
                    <span className="field-label">Body Part:</span>
                    <span className="field-value">Wrist</span>
                  </div>
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
                <div className="brand-icon-inner">✦</div>
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
                 .landing-page {
           min-height: 100vh;
           background: linear-gradient(135deg, #0f1829 0%, #1e3a8a 50%, #0f172a 100%);
           position: relative;
           overflow-x: hidden;
         }

         /* 60fps Animation Optimization */
         .floating-dot, .gradient-orb {
           will-change: transform;
           backface-visibility: hidden;
           perspective: 1000px;
         }

        /* Animated Background */
        .animated-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

                 /* Floating Dots Animation */
         .floating-dots {
           position: absolute;
           width: 100%;
           height: 100%;
           overflow: hidden;
         }

         .floating-dot {
           position: absolute;
           width: 4px;
           height: 4px;
           background: rgba(59, 130, 246, 0.6);
           border-radius: 50%;
           animation: floatDot infinite ease-in-out;
           box-shadow: 0 0 6px rgba(59, 130, 246, 0.4);
         }

         .floating-dot:nth-child(3n) {
           width: 3px;
           height: 3px;
           background: rgba(147, 197, 253, 0.4);
         }

         .floating-dot:nth-child(5n) {
           width: 5px;
           height: 5px;
           background: rgba(59, 130, 246, 0.8);
           box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
         }

         .floating-dot:nth-child(7n) {
           width: 2px;
           height: 2px;
           background: rgba(191, 219, 254, 0.5);
         }

         @keyframes floatDot {
           0% { 
             transform: translateY(0px) translateX(0px);
             opacity: 0;
           }
           10% {
             opacity: 1;
           }
           90% {
             opacity: 1;
           }
           100% { 
             transform: translateY(-100vh) translateX(10px);
             opacity: 0;
           }
         }

         /* Gradient Orbs */
         .gradient-orbs {
           position: absolute;
           width: 100%;
           height: 100%;
         }

         .gradient-orb {
           position: absolute;
           border-radius: 50%;
           filter: blur(1px);
           animation: floatOrb infinite ease-in-out;
         }

         .orb-1 {
           width: 400px;
           height: 400px;
           background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
           top: 20%;
           left: 10%;
           animation-duration: 20s;
           animation-delay: 0s;
         }

         .orb-2 {
           width: 300px;
           height: 300px;
           background: radial-gradient(circle, rgba(147, 197, 253, 0.08) 0%, transparent 70%);
           top: 50%;
           right: 15%;
           animation-duration: 25s;
           animation-delay: 5s;
         }

         .orb-3 {
           width: 500px;
           height: 500px;
           background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
           bottom: 10%;
           left: 20%;
           animation-duration: 30s;
           animation-delay: 10s;
         }

         .orb-4 {
           width: 250px;
           height: 250px;
           background: radial-gradient(circle, rgba(191, 219, 254, 0.1) 0%, transparent 70%);
           bottom: 40%;
           right: 25%;
           animation-duration: 18s;
           animation-delay: 3s;
         }

         @keyframes floatOrb {
           0%, 100% { 
             transform: translate(0px, 0px) scale(1);
             opacity: 0.4;
           }
           25% { 
             transform: translate(50px, -30px) scale(1.1);
             opacity: 0.6;
           }
           50% { 
             transform: translate(-30px, 40px) scale(0.9);
             opacity: 0.3;
           }
           75% { 
             transform: translate(40px, -20px) scale(1.05);
             opacity: 0.5;
           }
         }

                 /* Navigation */
         .landing-nav {
           position: fixed;
           top: 0;
           left: 0;
           right: 0;
           background: rgba(15, 24, 41, 0.8);
           backdrop-filter: blur(24px);
           border-bottom: 1px solid rgba(59, 130, 246, 0.2);
           z-index: 100;
           padding: 1rem 0;
           box-shadow: 0 4px 32px -8px rgba(59, 130, 246, 0.1);
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
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           border: 1px solid rgba(59, 130, 246, 0.3);
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           backdrop-filter: blur(12px);
           box-shadow: 0 4px 16px -4px rgba(59, 130, 246, 0.3);
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

                 .btn-ghost {
           background: none;
           border: 1px solid rgba(59, 130, 246, 0.4);
           color: white;
           padding: 0.75rem 1.5rem;
           border-radius: 12px;
           font-weight: 500;
           cursor: pointer;
           transition: all 0.2s;
           font-size: 0.95rem;
         }

         .btn-ghost:hover {
           background: rgba(59, 130, 246, 0.1);
           border-color: rgba(59, 130, 246, 0.6);
           box-shadow: 0 4px 16px -4px rgba(59, 130, 246, 0.3);
         }

         .btn-primary {
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           color: white;
           border: none;
           padding: 0.75rem 1.5rem;
           border-radius: 12px;
           font-weight: 600;
           cursor: pointer;
           transition: all 0.2s;
           font-size: 0.95rem;
           box-shadow: 0 4px 16px -4px rgba(59, 130, 246, 0.4);
         }

         .btn-primary:hover {
           background: linear-gradient(135deg, #2563eb, #1e40af);
           transform: translateY(-1px);
           box-shadow: 0 8px 25px -8px rgba(59, 130, 246, 0.5);
         }

                 /* Hero Section */
         .hero-section {
           padding: 8rem 2rem 4rem;
           position: relative;
           min-height: 100vh;
           display: flex;
           flex-direction: column;
           justify-content: center;
           align-items: center;
           z-index: 2;
         }

        .hero-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        /* Floating Elements */
        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          animation: float 6s ease-in-out infinite;
        }

        .card-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .card-2 {
          top: 30%;
          right: 15%;
          animation-delay: 1s;
        }

        .card-3 {
          bottom: 40%;
          left: 5%;
          animation-delay: 2s;
        }

        .card-4 {
          bottom: 20%;
          right: 10%;
          animation-delay: 3s;
        }

        .card-icon {
          font-size: 1.25rem;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }

        .hero-content {
          margin-bottom: 4rem;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          padding: 0.5rem 1.5rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(12px);
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

        .gradient-text {
          background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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

        .btn-primary-large {
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
          border: none;
          padding: 1rem 2rem;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary-large:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.3);
        }

        .icon-arrow {
          width: 20px;
          height: 20px;
          transition: transform 0.2s;
        }

        .btn-primary-large:hover .icon-arrow {
          transform: translateX(2px);
        }

        .btn-demo {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 1rem 2rem;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          backdrop-filter: blur(12px);
        }

        .btn-demo:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
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

        /* Demo Card */
        .demo-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .demo-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .demo-header {
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .demo-dots {
          display: flex;
          gap: 0.5rem;
        }

        .demo-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff5f57;
        }

        .demo-dots span:nth-child(2) {
          background: #ffbd2e;
        }

        .demo-dots span:nth-child(3) {
          background: #28ca42;
        }

        .demo-title {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .demo-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .chat-bubble {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .chat-bubble.user {
          justify-content: flex-end;
        }

        .chat-bubble.user .bubble-content {
          background: #667eea;
          color: white;
          border-radius: 18px 18px 4px 18px;
        }

        .ai-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          flex-shrink: 0;
        }

        .ai-icon {
          font-size: 0.875rem;
        }

        .chat-bubble.ai .bubble-content {
          background: #f3f4f6;
          color: #374151;
          border-radius: 18px 18px 18px 4px;
        }

        .bubble-content {
          padding: 0.75rem 1rem;
          max-width: 300px;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .typing-dots {
          display: flex;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }

        .typing-dots span {
          width: 4px;
          height: 4px;
          background: #9ca3af;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        .typing-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .form-preview {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .form-header {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .field-label {
          color: #6b7280;
          font-weight: 500;
        }

        .field-value {
          color: #374151;
          font-weight: 600;
        }

        /* Features Section */
        .features-section {
          padding: 6rem 2rem;
          background: white;
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
          background: #f9fafb;
          border-radius: 20px;
          border: 1px solid #f3f4f6;
        }

        .feature-number {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
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
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .feature-description {
          color: #6b7280;
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
          background: white;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          padding: 0.75rem;
          display: flex;
          align-items: center;
        }

        .chat-line {
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.2;
        }

        .chat-cursor {
          width: 2px;
          height: 16px;
          background: #667eea;
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
          background: white;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-line {
          height: 2px;
          background: #e5e7eb;
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
          background: linear-gradient(135deg, #10b981, #059669);
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

        /* CTA Section */
        .cta-section {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          color: #667eea;
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
            gap: 0.75rem;
          }

          .btn-primary-large,
          .btn-demo {
            width: 100%;
            justify-content: center;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .stat-divider {
            width: 2rem;
            height: 1px;
          }

          .floating-card {
            display: none;
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
         }

         /* Expanded Features Section */
         .expanded-features-section {
           background: rgba(15, 24, 41, 0.5);
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
           background: rgba(255, 255, 255, 0.05);
           border: 1px solid rgba(59, 130, 246, 0.2);
           border-radius: 16px;
           padding: 2rem;
           text-align: center;
           transition: all 0.3s;
           backdrop-filter: blur(12px);
         }

         .expanded-feature-card:hover {
           transform: translateY(-5px);
           box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.3);
           border-color: rgba(59, 130, 246, 0.4);
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

         .gradient-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
         .gradient-green { background: linear-gradient(135deg, #10b981, #059669); }
         .gradient-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
         .gradient-orange { background: linear-gradient(135deg, #f59e0b, #d97706); }
         .gradient-red { background: linear-gradient(135deg, #ef4444, #dc2626); }
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
           background: rgba(255, 255, 255, 0.02);
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
           background: rgba(255, 255, 255, 0.05);
           border: 1px solid rgba(59, 130, 246, 0.2);
           border-radius: 16px;
           padding: 2rem;
           position: relative;
           transition: all 0.3s;
           backdrop-filter: blur(12px);
         }

         .pricing-card:hover {
           transform: translateY(-5px);
           box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.3);
         }

         .pricing-card.featured {
           border-color: #3b82f6;
           transform: scale(1.05);
           background: rgba(59, 130, 246, 0.1);
         }

         .popular-badge {
           position: absolute;
           top: -10px;
           left: 50%;
           transform: translateX(-50%);
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
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
           color: #10b981;
           font-weight: 600;
         }

         .btn-pricing {
           width: 100%;
           padding: 1rem;
           border: 2px solid rgba(59, 130, 246, 0.3);
           background: rgba(59, 130, 246, 0.1);
           color: white;
           border-radius: 12px;
           font-weight: 600;
           cursor: pointer;
           transition: all 0.3s;
         }

         .btn-pricing:hover {
           border-color: #3b82f6;
           background: rgba(59, 130, 246, 0.2);
         }

         .btn-pricing.primary {
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           color: white;
           border-color: transparent;
         }

         .btn-pricing.primary:hover {
           background: linear-gradient(135deg, #2563eb, #1e40af);
         }

         /* Footer */
         .landing-footer {
           background: rgba(15, 24, 41, 0.8);
           color: white;
           padding: 3rem 0 1rem;
           position: relative;
           z-index: 2;
           border-top: 1px solid rgba(59, 130, 246, 0.2);
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
           color: #3b82f6;
         }

         .footer-bottom {
           border-top: 1px solid rgba(59, 130, 246, 0.2);
           padding-top: 1rem;
           text-align: center;
           color: rgba(255, 255, 255, 0.7);
         }
       `}</style>
    </div>
  );
};

export default LandingPage; 