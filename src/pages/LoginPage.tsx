import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sprout,
  ArrowLeft,
  Users,
  ShieldCheck,
  Zap,
  Truck,
  Sparkles,
  Award,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';

// Slideshow background images
import slideImg1 from '../assets/services-hero-banner.jpg';
import slideImg2 from '../assets/sustainable-farm.jpg';
import slideImg3 from '../assets/farm-visit-inspection.jpg';

import './LoginPage.css';

interface SlideData {
  image: string;
}

const SLIDES: SlideData[] = [
  { image: slideImg1 },
  { image: slideImg2 },
  { image: slideImg3 },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoggingIn, isRegistering, isAuthenticated } = useAuth();
  const { addToast } = useUIStore();

  // Determine initial mode from URL pathname or state
  const isSignupPath = location.pathname.includes('signup') || location.pathname.includes('register');
  const [mode, setMode] = useState<'login' | 'signup'>(isSignupPath ? 'signup' : 'login');

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form states
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'agronomist' | 'buyer'>('farmer');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Background Slideshow Timer (Changes every 6 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Sync mode if URL changes
  useEffect(() => {
    if (location.pathname.includes('signup') || location.pathname.includes('register')) {
      setMode('signup');
    } else if (location.pathname.includes('login') || location.pathname.includes('signin')) {
      setMode('login');
    }
  }, [location.pathname]);

  // If already authenticated, redirect to home or dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailOrPhone.trim()) {
      setError('Please enter your email address or phone number');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      if (mode === 'login') {
        await login({ email: emailOrPhone.trim(), password });
        addToast({ type: 'success', message: 'Welcome back! Logged in successfully.' });
        navigate('/dashboard');
      } else {
        if (!name.trim()) {
          setError('Please enter your full name');
          return;
        }
        await register({ name: name.trim(), email: emailOrPhone.trim(), password });
        addToast({ type: 'success', message: 'Account created! Welcome to AgriConnect.' });
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Authentication failed. Please check your credentials.';
      setError(errorMsg);
      addToast({ type: 'error', message: errorMsg });
    }
  };

  const handleFillDemo = (type: 'admin' | 'farmer') => {
    setError(null);
    if (type === 'admin') {
      setEmailOrPhone('admin@formerbench.dev');
      setPassword('DemoPass123!');
      addToast({ type: 'info', message: 'Admin demo credentials autofilled' });
    } else {
      setEmailOrPhone('customer@formerbench.dev');
      setPassword('DemoPass123!');
      addToast({ type: 'info', message: 'Farmer demo credentials autofilled' });
    }
  };

  const handleGoogleAuth = () => {
    addToast({ type: 'info', message: 'Connecting to Google Secure Sign-In...' });
    setTimeout(() => {
      handleFillDemo('farmer');
    }, 600);
  };

  const handleEmailOTP = () => {
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone to receive OTP');
      return;
    }
    addToast({ type: 'success', message: `OTP sent to ${emailOrPhone}! Demo code: 123456` });
  };

  return (
    <div className="auth-page-root">
      {/* 1. Floating Top-Left "Back to Home" Button */}
      <Link to="/" className="auth-back-home-btn" title="Return to Homepage">
        <ArrowLeft size={16} strokeWidth={2.4} />
        <span>Back to Home</span>
      </Link>

      {/* 2. Full Page Animated Background Slideshow */}
      <div className="auth-slideshow-container">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`auth-bg-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      {/* 3. Full Page Dark Emerald Vignette Overlay */}
      <div className="auth-page-backdrop-overlay" />

      {/* 4. Full Page 2-Column Sliding Stage */}
      <div className={`auth-full-stage ${mode === 'signup' ? 'signup-mode' : 'login-mode'}`}>
        
        {/* =========================================================================
            Hero Text Block (Displays distinct content for Login vs Sign Up)
            ========================================================================= */}
        <div className="auth-hero-text-block">
          {/* Sprout Badge */}
          <div className="auth-sprout-badge">
            <Sprout size={26} strokeWidth={2.4} />
          </div>

          {/* Hero Views Dual Stage (Smooth 1.05s Crossfade Transition in Both Directions) */}
          <div className="auth-hero-views-container">
            {/* LOGIN HERO VIEW (Active in Login Mode) */}
            <div className={`auth-hero-content-view ${mode === 'login' ? 'active' : 'inactive'}`}>
              <span className="auth-hero-tag">SMART AGRICULTURE</span>

              <h1 className="auth-hero-title">
                Growing<br />
                a better<br />
                tomorrow
              </h1>

              <div className="auth-hero-bar" />

              <p className="auth-hero-desc">
                Smart solutions for modern farming. Manage, Monitor and Maximize your yield with technology.
              </p>

              {/* Login Feature Highlights */}
              <div className="auth-hero-features-list">
                <div className="auth-hero-feature-pill">
                  <Users size={16} className="auth-hero-feature-icon" />
                  <span>10,000+ Active Growers Across Tamil Nadu</span>
                </div>
                <div className="auth-hero-feature-pill">
                  <Award size={16} className="auth-hero-feature-icon" />
                  <span>50+ Certified On-Field Agronomists</span>
                </div>
                <div className="auth-hero-feature-pill">
                  <Zap size={16} className="auth-hero-feature-icon" />
                  <span>15-Min Priority Advisory Response</span>
                </div>
              </div>
            </div>

            {/* SIGN UP HERO VIEW (Active in Sign Up Mode) */}
            <div className={`auth-hero-content-view ${mode === 'signup' ? 'active' : 'inactive'}`}>
              <span className="auth-hero-tag">GROWER COMMUNITY</span>

              <h1 className="auth-hero-title">
                Empowering<br />
                Sustainable<br />
                Agriculture
              </h1>

              <div className="auth-hero-bar" />

              <p className="auth-hero-desc">
                Unlock personalized crop charts, doorstep agronomist visits, and lab-tested organic farm products at exclusive member prices.
              </p>

              {/* Member Benefits Highlights */}
              <div className="auth-hero-features-list">
                <div className="auth-hero-feature-pill">
                  <Sparkles size={16} className="auth-hero-feature-icon" />
                  <span>Free Soil Health & Crop Assessment</span>
                </div>
                <div className="auth-hero-feature-pill">
                  <Truck size={16} className="auth-hero-feature-icon" />
                  <span>Free Express Delivery on Orders &gt; ₹999</span>
                </div>
                <div className="auth-hero-feature-pill">
                  <ShieldCheck size={16} className="auth-hero-feature-icon" />
                  <span>100% Certified Bio-Organic Products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slideshow Indicator Dots */}
          <div className="auth-slideshow-dots">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`auth-slide-dot ${idx === currentSlide ? 'active' : ''}`}
                aria-label={`Go to background slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* =========================================================================
            Floating Sliding Form Card (With Internal 2-Panel Slider Track)
            ========================================================================= */}
        <div className="auth-sliding-card-wrap">
          <div className="auth-form-card">
            
            {/* Top Tab Switcher: LOGIN | SIGN UP */}
            <div className="auth-tab-bar">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              >
                SIGN UP
              </button>
            </div>

            {/* Brand Logo & Tagline */}
            <div className="auth-brand-group">
              <div className="auth-brand-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L15 8H9L12 2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M5 11C5 11 8 9 12 11C16 9 19 11 19 11C19 16 16 20 12 22C8 20 5 16 5 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11V18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="auth-brand-name">AgriConnect</h2>
              <p className="auth-brand-tagline">Connect. Cultivate. Thrive.</p>
              <div className="auth-brand-divider-bar" />
            </div>

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #F87171',
                  color: '#991B1B',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                {error}
              </div>
            )}

            {/* =========================================================================
                Internal Sliding Form Viewport & Track
                ========================================================================= */}
            <div className="auth-form-slider-viewport">
              <div className={`auth-form-slider-track ${mode === 'signup' ? 'signup-track' : 'login-track'}`}>
                
                {/* -------------------------------------------------------------------
                    Pane 1: LOGIN FORM
                    ------------------------------------------------------------------- */}
                <div className="auth-form-slide-pane">
                  <h3 className="auth-welcome-title">Welcome Back!</h3>
                  <p className="auth-welcome-sub">Login to continue your journey</p>

                  <form onSubmit={handleSubmit} className="auth-form">
                    {/* Email or Phone Number */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <Mail size={18} />
                      </div>
                      <input
                        type="text"
                        placeholder="Email or Phone Number"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className="auth-input"
                        required={mode === 'login'}
                      />
                    </div>

                    {/* Password Field with Show/Hide Eye Toggle */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        required={mode === 'login'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="auth-input-toggle-eye"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Remember me & Forgot password */}
                    <div className="auth-meta-row">
                      <label className="auth-remember-label">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          style={{ accentColor: '#165B2E', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span>Remember me</span>
                      </label>

                      <a
                        href="#forgot"
                        onClick={(e) => {
                          e.preventDefault();
                          addToast({ type: 'info', message: 'Password reset link will be sent to your email.' });
                        }}
                        className="auth-forgot-link"
                      >
                        Forgot Password?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="auth-submit-btn"
                    >
                      <span>{isLoggingIn ? 'Logging in...' : 'Login'}</span>
                      <Sprout size={18} strokeWidth={2.4} />
                    </button>
                  </form>
                </div>

                {/* -------------------------------------------------------------------
                    Pane 2: SIGN UP FORM
                    ------------------------------------------------------------------- */}
                <div className="auth-form-slide-pane">
                  <h3 className="auth-welcome-title">Create Your Account</h3>
                  <p className="auth-welcome-sub">Join thousands of growers cultivating smarter</p>

                  <form onSubmit={handleSubmit} className="auth-form">
                    {/* Full Name */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <UserIcon size={18} />
                      </div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="auth-input"
                        required={mode === 'signup'}
                      />
                    </div>

                    {/* Email or Phone Number */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <Mail size={18} />
                      </div>
                      <input
                        type="text"
                        placeholder="Email or Phone Number"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className="auth-input"
                        required={mode === 'signup'}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        required={mode === 'signup'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="auth-input-toggle-eye"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Role Selection */}
                    <div className="auth-role-selector">
                      <button
                        type="button"
                        onClick={() => setRole('farmer')}
                        className={`auth-role-btn ${role === 'farmer' ? 'active' : ''}`}
                      >
                        🌾 Farmer
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('agronomist')}
                        className={`auth-role-btn ${role === 'agronomist' ? 'active' : ''}`}
                      >
                        🔬 Agronomist
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('buyer')}
                        className={`auth-role-btn ${role === 'buyer' ? 'active' : ''}`}
                      >
                        🛒 Partner
                      </button>
                    </div>

                    {/* Terms Agreement */}
                    <div className="auth-meta-row">
                      <label className="auth-remember-label" style={{ fontSize: '0.78rem' }}>
                        <input
                          type="checkbox"
                          defaultChecked
                          required
                          style={{ accentColor: '#165B2E', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span>I accept the Terms of Service & Privacy Policy</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="auth-submit-btn"
                    >
                      <span>{isRegistering ? 'Creating Account...' : 'Create Account'}</span>
                      <Sprout size={18} strokeWidth={2.4} />
                    </button>
                  </form>
                </div>

              </div>
            </div>

            {/* "or" Divider */}
            <div className="auth-or-divider">
              <span>or</span>
            </div>

            {/* Social / Alternative Sign In Buttons */}
            <div className="auth-social-group">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="auth-social-btn"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleEmailOTP}
                className="auth-social-btn"
              >
                <Sprout size={18} style={{ color: '#165B2E' }} />
                <span>Continue with Email OTP</span>
              </button>
            </div>

            {/* Quick Demo Autofill Box */}
            <div className="auth-demo-box">
              <span className="auth-demo-title">Quick Demo Login:</span>
              <div className="auth-demo-actions">
                <button
                  type="button"
                  onClick={() => handleFillDemo('farmer')}
                  className="auth-demo-btn"
                >
                  Farmer Account
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="auth-demo-btn"
                >
                  Admin Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
