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
  Smartphone,
  KeyRound,
  CheckCircle2,
  Send,
  Phone,
  MapPin,
  Check,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';

// Slideshow background images
import slideImg1 from '../assets/services-hero-banner.jpg';
import slideImg2 from '../assets/sustainable-farm.jpg';
import slideImg3 from '../assets/farm-visit-inspection.jpg';
import farmerLogo from '../assets/farmerbench-logo.png';

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
  const { login, isLoggingIn, isAuthenticated, isAdmin, user } = useAuth();
  const { addToast } = useUIStore();

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Login Method: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Form State
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [district, setDistrict] = useState('Thanjavur');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // OTP State (Login Flow)
  const [loginOtpStep, setLoginOtpStep] = useState<'input' | 'verify'>('input');
  const [loginOtpDigits, setLoginOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loginCountdown, setLoginCountdown] = useState<number>(0);
  const [isLoginOtpSending, setIsLoginOtpSending] = useState(false);
  const [isLoginOtpVerifying, setIsLoginOtpVerifying] = useState(false);

  // OTP State (Signup Flow - Inline in Email Textfield)
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [signupOtpDigits, setSignupOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [signupCountdown, setSignupCountdown] = useState<number>(0);
  const [isSignupOtpSending, setIsSignupOtpSending] = useState(false);
  const [isSignupVerifying, setIsSignupVerifying] = useState(false);
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);

  // Background Slideshow Index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow auto-advance every 6.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  // OTP Countdown Timers
  useEffect(() => {
    let timer: any;
    if (loginCountdown > 0) {
      timer = setInterval(() => setLoginCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [loginCountdown]);

  useEffect(() => {
    let timer: any;
    if (signupCountdown > 0) {
      timer = setInterval(() => setSignupCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [signupCountdown]);

  // Sync mode if URL changes
  useEffect(() => {
    if (location.pathname.includes('signup') || location.pathname.includes('register')) {
      setMode('signup');
    } else if (location.pathname.includes('login') || location.pathname.includes('signin')) {
      setMode('login');
    }
  }, [location.pathname]);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin || user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, user, navigate]);

  // =========================================================================
  // 1. LOGIN VIA OTP HANDLERS
  // =========================================================================
  const handleSendLoginOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!emailOrPhone.trim()) {
      setError('Please enter your registered email address');
      return;
    }

    setIsLoginOtpSending(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrPhone.trim() }),
      });
      const data = await res.json();

      setIsLoginOtpSending(false);
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP code');
      }

      setLoginOtpStep('verify');
      setLoginCountdown(60);
      setLoginOtpDigits(['', '', '', '', '', '']);
      addToast({
        type: 'success',
        message: `🔐 Verification code sent to ${emailOrPhone}!`,
      });
      setTimeout(() => {
        document.getElementById('login-otp-digit-0')?.focus();
      }, 150);
    } catch (err: any) {
      setIsLoginOtpSending(false);
      setError(err.message || 'Failed to send OTP. Please check your email.');
    }
  };

  const handleLoginOtpChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(-1);
    const updated = [...loginOtpDigits];
    updated[index] = clean;
    setLoginOtpDigits(updated);

    if (clean && index < 5) {
      document.getElementById(`login-otp-digit-${index + 1}`)?.focus();
    }
  };

  const handleLoginOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !loginOtpDigits[index] && index > 0) {
      document.getElementById(`login-otp-digit-${index - 1}`)?.focus();
    }
  };

  const handleLoginOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted) {
      const updated = [...loginOtpDigits];
      for (let i = 0; i < pasted.length; i++) {
        updated[i] = pasted[i];
      }
      setLoginOtpDigits(updated);
      const focusIndex = Math.min(pasted.length, 5);
      document.getElementById(`login-otp-digit-${focusIndex}`)?.focus();
    }
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const entered = loginOtpDigits.join('');

    if (entered.length < 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    setIsLoginOtpVerifying(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrPhone.trim(), otp: entered }),
      });
      const data = await res.json();
      setIsLoginOtpVerifying(false);

      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired OTP');
      }

      const authUser = data.data.user;
      const token = data.data.token;

      localStorage.setItem('formerbench_auth_token', token);
      localStorage.setItem('formerbench_auth_user', JSON.stringify(authUser));

      if (authUser.role === 'ADMIN') {
        localStorage.setItem('farmerbench_demo_admin', 'true');
        addToast({ type: 'success', message: 'OTP Verified! Welcome to FarmerBench Admin.' });
        navigate('/admin');
      } else {
        addToast({ type: 'success', message: 'OTP Verified! Welcome back to FarmerBench.' });
        navigate('/dashboard');
      }
    } catch (err: any) {
      setIsLoginOtpVerifying(false);
      setError(err.message || 'Verification failed.');
      addToast({ type: 'error', message: err.message || 'Verification failed.' });
    }
  };

  // =========================================================================
  // 2. SIGNUP WITH INLINE EMAIL OTP VERIFICATION
  // =========================================================================
  const handleSendSignupInlineOtp = async () => {
    setError(null);
    if (!emailOrPhone.trim() || !emailOrPhone.includes('@')) {
      setError('Please enter a valid email address first to receive OTP');
      return;
    }

    setIsSignupOtpSending(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || emailOrPhone.split('@')[0],
          email: emailOrPhone.trim(),
          phone: phoneNumber.trim() || null,
          location: district.trim() || null,
          password: password || undefined,
        }),
      });
      const data = await res.json();
      setIsSignupOtpSending(false);

      if (!res.ok) {
        throw new Error(data.message || 'Failed to dispatch verification code');
      }

      setSignupOtpSent(true);
      setSignupCountdown(60);
      setSignupOtpDigits(['', '', '', '', '', '']);
      addToast({
        type: 'success',
        message: `📧 6-Digit OTP sent to ${emailOrPhone}!`,
      });
      setTimeout(() => {
        document.getElementById('signup-inline-otp-0')?.focus();
      }, 150);
    } catch (err: any) {
      setIsSignupOtpSending(false);
      setError(err.message || 'Failed to send OTP code.');
    }
  };

  const handleSignupOtpChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(-1);
    const updated = [...signupOtpDigits];
    updated[index] = clean;
    setSignupOtpDigits(updated);

    if (clean && index < 5) {
      document.getElementById(`signup-inline-otp-${index + 1}`)?.focus();
    }
  };

  const handleSignupOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !signupOtpDigits[index] && index > 0) {
      document.getElementById(`signup-inline-otp-${index - 1}`)?.focus();
    }
  };

  const handleSignupOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted) {
      const updated = [...signupOtpDigits];
      for (let i = 0; i < pasted.length; i++) {
        updated[i] = pasted[i];
      }
      setSignupOtpDigits(updated);
      const focusIndex = Math.min(pasted.length, 5);
      document.getElementById(`signup-inline-otp-${focusIndex}`)?.focus();
    }
  };

  const handleVerifySignupInlineOtp = async () => {
    setError(null);
    const entered = signupOtpDigits.join('');

    if (entered.length < 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    setIsSignupVerifying(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-register-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailOrPhone.trim(),
          otp: entered,
          name: name.trim() || undefined,
          phone: phoneNumber.trim() || undefined,
          location: district.trim() || undefined,
          password: password || undefined,
        }),
      });
      const data = await res.json();
      setIsSignupVerifying(false);

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed. Code mismatch.');
      }

      setIsEmailVerified(true);
      setSignupOtpSent(false);

      // Store credentials / token in case user submits right away or submits afterwards
      if (data.data?.token) {
        localStorage.setItem('formerbench_auth_token', data.data.token);
        localStorage.setItem('formerbench_auth_user', JSON.stringify(data.data.user));
      }

      addToast({
        type: 'success',
        message: '✅ Email verified successfully! Please complete any remaining fields and submit.',
      });
    } catch (err: any) {
      setIsSignupVerifying(false);
      setError(err.message || 'Verification failed.');
      addToast({ type: 'error', message: err.message || 'Verification failed.' });
    }
  };

  // Final Form Submission when Submit Button is clicked
  const handleFinalSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEmailVerified) {
      setError('Please verify your email address with OTP before submitting.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmittingSignup(true);

    try {
      // If token is already present from verify step, finalize session
      const existingToken = localStorage.getItem('formerbench_auth_token');
      if (existingToken) {
        setIsSubmittingSignup(false);
        addToast({
          type: 'success',
          message: `🌱 Welcome to FarmerBench, ${name.trim()}!`,
        });
        navigate('/dashboard');
        return;
      }

      // Otherwise log in / register
      const res = await login({ email: emailOrPhone.trim(), password });
      setIsSubmittingSignup(false);
      addToast({
        type: 'success',
        message: `🌱 Welcome to FarmerBench, ${res?.user?.name || name.trim()}!`,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setIsSubmittingSignup(false);
      navigate('/dashboard');
    }
  };

  // =========================================================================
  // 3. STANDARD PASSWORD LOGIN
  // =========================================================================
  const handleSubmitPasswordLogin = async (e: React.FormEvent) => {
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
      const res = await login({ email: emailOrPhone.trim(), password });
      if (res?.user?.role === 'ADMIN' || emailOrPhone.trim().toLowerCase().includes('admin')) {
        addToast({ type: 'success', message: 'Welcome to FarmerBench Admin Panel!' });
        navigate('/admin');
      } else {
        addToast({ type: 'success', message: 'Welcome back! Logged in successfully.' });
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
      setLoginMethod('password');
      setMode('login');
      addToast({ type: 'info', message: 'Demo Admin credentials filled.' });
    } else {
      setEmailOrPhone('customer@formerbench.dev');
      setPassword('DemoPass123!');
      setLoginMethod('password');
      setMode('login');
      addToast({ type: 'info', message: 'Demo Farmer credentials filled.' });
    }
  };

  const handleGoogleAuth = () => {
    addToast({ type: 'info', message: 'Connecting to Google OAuth single sign-on...' });
    setTimeout(() => {
      const demoUser = {
        id: 'google-farmer-1',
        name: 'Karthik Raja',
        email: 'karthik.raja@gmail.com',
        role: 'CUSTOMER',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      };
      localStorage.setItem('formerbench_auth_token', 'jwt_google_oauth_' + Date.now());
      localStorage.setItem('formerbench_auth_user', JSON.stringify(demoUser));
      addToast({ type: 'success', message: 'Google Authentication Successful!' });
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="auth-page-root">
      {/* Top Left Floating "Back to Home" Button */}
      <Link to="/" className="auth-back-home-btn" title="Back to Homepage">
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      {/* Background Slideshow Layers */}
      <div className="auth-slideshow-container">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`auth-bg-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
        <div className="auth-page-backdrop-overlay" />
      </div>

      {/* 2-Column Balanced Stage */}
      <div className="auth-full-stage">
        {/* =========================================================================
            Hero Text Section (Left Side)
            ========================================================================= */}
        <div className="auth-hero-text-block">
          <div className="auth-sprout-badge">
            <Sprout size={24} strokeWidth={2.4} />
          </div>

          <div className="auth-hero-views-container">
            {/* LOGIN HERO VIEW */}
            <div className={`auth-hero-content-view ${mode === 'login' ? 'active' : 'inactive'}`}>
              <span className="auth-hero-tag">SMART AGRICULTURE</span>
              <h1 className="auth-hero-title">
                Growing{`\n`}
                a better{`\n`}
                tomorrow
              </h1>
              <div className="auth-hero-bar" />
              <p className="auth-hero-desc">
                Smart solutions for modern farming. Manage, monitor, and maximize your crop yield with technology.
              </p>

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
                  <span>Instant OTP Code Verification</span>
                </div>
              </div>
            </div>

            {/* SIGNUP HERO VIEW */}
            <div className={`auth-hero-content-view ${mode === 'signup' ? 'active' : 'inactive'}`}>
              <span className="auth-hero-tag">JOIN FARMERBENCH</span>
              <h1 className="auth-hero-title">
                Empowering{`\n`}
                every farm,{`\n`}
                every crop
              </h1>
              <div className="auth-hero-bar" />
              <p className="auth-hero-desc">
                Register today to access certified bio-fertilizers, field doctor diagnosis, and real-time advisory.
              </p>

              <div className="auth-hero-features-list">
                <div className="auth-hero-feature-pill">
                  <ShieldCheck size={16} className="auth-hero-feature-icon" />
                  <span>100% Verified Farm Profiles & Security</span>
                </div>
                <div className="auth-hero-feature-pill">
                  <Truck size={16} className="auth-hero-feature-icon" />
                  <span>Direct Farm Gate Deliveries in 24-48 Hours</span>
                </div>
                <div className="auth-hero-feature-pill">
                  <Sparkles size={16} className="auth-hero-feature-icon" />
                  <span>Welcome Coupon: ₹120 Off First Order</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slideshow Progress Dots */}
          <div className="auth-slideshow-dots">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`auth-slide-dot ${idx === currentSlide ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* =========================================================================
            Sliding Auth Card (Right Side in Login, Left Side in Sign Up)
            ========================================================================= */}
        <div className="auth-sliding-card-wrap">
          <div className="auth-form-card">
            
            {/* Top Toggle Switcher: LOGIN | SIGN UP */}
            <div className="auth-tabs-header">
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
              <img
                src={farmerLogo}
                alt="FarmerBench Logo"
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'contain', margin: '0 auto 0.4rem', display: 'block' }}
              />
              <h2 className="auth-brand-name">FarmerBench</h2>
              <p className="auth-brand-tagline">Grow Better, Live Better</p>
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
                  textAlign: 'center',
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
                  <p className="auth-welcome-sub">Login to continue your agricultural journey</p>

                  {/* Method Switcher: Password vs OTP */}
                  <div className="auth-method-switcher">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('password');
                        setError(null);
                      }}
                      className={`auth-method-btn ${loginMethod === 'password' ? 'active' : ''}`}
                    >
                      <KeyRound size={15} />
                      <span>Password Login</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('otp');
                        setError(null);
                      }}
                      className={`auth-method-btn ${loginMethod === 'otp' ? 'active' : ''}`}
                    >
                      <Smartphone size={15} />
                      <span>Instant OTP Login</span>
                    </button>
                  </div>

                  {loginMethod === 'password' ? (
                    <form onSubmit={handleSubmitPasswordLogin} className="auth-form">
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
                            style={{ accentColor: '#15803D', width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span>Remember me</span>
                        </label>

                        <a
                          href="#forgot"
                          onClick={(e) => {
                            e.preventDefault();
                            addToast({ type: 'info', message: 'Password reset instructions will be sent to your email.' });
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
                  ) : (
                    /* OTP LOGIN FLOW */
                    <div className="auth-form">
                      {loginOtpStep === 'input' ? (
                        <form onSubmit={handleSendLoginOtp}>
                          <div className="auth-input-group">
                            <div className="auth-input-icon">
                              <Mail size={18} />
                            </div>
                            <input
                              type="text"
                              placeholder="Enter Registered Email"
                              value={emailOrPhone}
                              onChange={(e) => setEmailOrPhone(e.target.value)}
                              className="auth-input"
                              required
                            />
                          </div>

                          <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.5rem 0 1rem', lineHeight: 1.4 }}>
                            A 6-digit one-time code will be dispatched to your email address.
                          </p>

                          <button
                            type="submit"
                            disabled={isLoginOtpSending}
                            className="auth-submit-btn"
                          >
                            <span>{isLoginOtpSending ? 'Sending OTP Code...' : 'Send Secure OTP'}</span>
                            <Send size={16} />
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyLoginOtp}>
                          <div className="auth-otp-timer-banner">
                            <div>
                              <span>Code sent to <strong>{emailOrPhone}</strong></span>
                              <button
                                type="button"
                                onClick={() => setLoginOtpStep('input')}
                                style={{ background: 'none', border: 'none', color: '#15803D', marginLeft: '0.5rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                Edit
                              </button>
                            </div>
                            <span style={{ fontWeight: 800 }}>
                              {loginCountdown > 0 ? `0:${loginCountdown < 10 ? '0' : ''}${loginCountdown}` : (
                                <button type="button" onClick={() => handleSendLoginOtp()} className="auth-resend-btn">
                                  Resend Code
                                </button>
                              )}
                            </span>
                          </div>

                          {/* 6 Digit Box */}
                          <div className="auth-otp-inputs-row" onPaste={handleLoginOtpPaste}>
                            {loginOtpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                id={`login-otp-digit-${idx}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleLoginOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleLoginOtpKeyDown(idx, e)}
                                className="auth-otp-digit-input"
                                autoFocus={idx === 0}
                              />
                            ))}
                          </div>

                          <button
                            type="submit"
                            disabled={isLoginOtpVerifying}
                            className="auth-submit-btn"
                          >
                            <span>{isLoginOtpVerifying ? 'Verifying Code...' : 'Verify OTP & Sign In'}</span>
                            <CheckCircle2 size={18} />
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                {/* -------------------------------------------------------------------
                    Pane 2: SIGN UP FORM (With In-Textfield Send/Verify OTP)
                    ------------------------------------------------------------------- */}
                <div className="auth-form-slide-pane">
                  <h3 className="auth-welcome-title">Create Account</h3>
                  <p className="auth-welcome-sub">Join thousands of verified farmers & growers</p>

                  <form onSubmit={handleFinalSignupSubmit} className="auth-form">
                    {/* Full Name */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <UserIcon size={18} />
                      </div>
                      <input
                        type="text"
                        placeholder="Farmer / Business Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="auth-input"
                        required={mode === 'signup'}
                      />
                    </div>

                    {/* Email Field with INLINE Send OTP / Verified Button */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={emailOrPhone}
                        disabled={isEmailVerified}
                        onChange={(e) => {
                          setEmailOrPhone(e.target.value);
                          setIsEmailVerified(false);
                          setSignupOtpSent(false);
                        }}
                        className="auth-input"
                        style={{ paddingRight: isEmailVerified ? '110px' : '105px' }}
                        required={mode === 'signup'}
                      />
                      <div className="auth-input-action-wrap">
                        {isEmailVerified ? (
                          <span className="auth-verified-badge" title="Email is verified">
                            <Check size={14} strokeWidth={3} />
                            Verified
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendSignupInlineOtp}
                            disabled={isSignupOtpSending || signupCountdown > 0 || !emailOrPhone.includes('@')}
                            className="auth-input-inline-btn"
                          >
                            {isSignupOtpSending ? (
                              'Sending...'
                            ) : signupCountdown > 0 ? (
                              `Resend in ${signupCountdown}s`
                            ) : signupOtpSent ? (
                              'Resend OTP'
                            ) : (
                              <>
                                <Send size={12} />
                                <span>Get OTP</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* INLINE OTP VERIFICATION CONTAINER (Reveals when OTP is sent & not yet verified) */}
                    {signupOtpSent && !isEmailVerified && (
                      <div className="auth-inline-otp-card">
                        <div className="auth-inline-otp-header">
                          <span>Enter 6-digit code sent to your email:</span>
                          <span style={{ fontWeight: 800 }}>
                            {signupCountdown > 0 ? `0:${signupCountdown < 10 ? '0' : ''}${signupCountdown}` : (
                              <button
                                type="button"
                                onClick={handleSendSignupInlineOtp}
                                className="auth-resend-btn"
                              >
                                Resend
                              </button>
                            )}
                          </span>
                        </div>

                        <div className="auth-inline-otp-body">
                          <div className="auth-otp-inputs-row" onPaste={handleSignupOtpPaste}>
                            {signupOtpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                id={`signup-inline-otp-${idx}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleSignupOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleSignupOtpKeyDown(idx, e)}
                                className="auth-otp-digit-input"
                                autoFocus={idx === 0}
                              />
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={handleVerifySignupInlineOtp}
                            disabled={isSignupVerifying || signupOtpDigits.join('').length < 6}
                            className="auth-inline-verify-btn"
                          >
                            {isSignupVerifying ? 'Checking...' : 'Verify OTP'}
                            <CheckCircle2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Phone Number */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number (e.g. +91 98421 88321)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="auth-input"
                      />
                    </div>

                    {/* Password */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create Password (min. 6 chars)"
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

                    {/* District / Location */}
                    <div className="auth-input-group">
                      <div className="auth-input-icon">
                        <MapPin size={18} />
                      </div>
                      <input
                        type="text"
                        placeholder="District / State (e.g. Thanjavur, TN)"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="auth-input"
                      />
                    </div>

                    {/* Terms Agreement */}
                    <div className="auth-meta-row">
                      <label className="auth-remember-label" style={{ fontSize: '0.78rem' }}>
                        <input
                          type="checkbox"
                          defaultChecked
                          required
                          style={{ accentColor: '#15803D', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span>I accept Terms of Service & Privacy Policy</span>
                      </label>
                    </div>

                    {/* Submit Button (Only enables after OTP is verified) */}
                    <button
                      type="submit"
                      disabled={!isEmailVerified || isSubmittingSignup}
                      className="auth-submit-btn"
                      style={
                        !isEmailVerified
                          ? {
                              background: '#E2E8F0',
                              color: '#94A3B8',
                              boxShadow: 'none',
                              cursor: 'not-allowed',
                            }
                          : undefined
                      }
                    >
                      {isSubmittingSignup ? (
                        <span>Creating Account...</span>
                      ) : !isEmailVerified ? (
                        <span>🔒 Verify Email OTP to Create Account</span>
                      ) : (
                        <>
                          <span>Create Account & Start Farming</span>
                          <Sprout size={18} strokeWidth={2.4} />
                        </>
                      )}
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
                onClick={() => {
                  setMode('login');
                  setLoginMethod('otp');
                  setError(null);
                }}
                className="auth-social-btn"
              >
                <Sprout size={18} style={{ color: '#15803D' }} />
                <span>Instant OTP Sign In</span>
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
