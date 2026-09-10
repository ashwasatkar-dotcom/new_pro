import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CREDENTIALS } from '../../constants';

const LoginPage = () => {
  const [roleMode, setRoleMode] = useState('warden'); // 'warden' | 'student'
  const [username, setUsername] = useState(DEMO_CREDENTIALS.warden.username);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.warden.password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (role) => {
    setRoleMode(role);
    setErrorMessage('');
    if (role === 'warden') {
      setUsername(DEMO_CREDENTIALS.warden.username);
      setPassword(DEMO_CREDENTIALS.warden.password);
    } else {
      setUsername(DEMO_CREDENTIALS.student.username);
      setPassword(DEMO_CREDENTIALS.student.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const result = await login(username, password, roleMode);
    setIsSubmitting(false);

    if (result.success) {
      if (result.user.role === 'ROLE_WARDEN' || result.user.role === 'ROLE_STAFF') {
        navigate('/warden/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setErrorMessage(result.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-gutter-mobile py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Top Crest & Context */}
        <div className="flex flex-col items-center text-center mb-space-lg">
          <div className="relative flex items-center justify-center w-20 h-20 bg-surface-container-lowest shadow-md rounded-2xl p-2 mb-space-sm border border-slate-200">
            <div className="w-full h-full rounded-xl bg-primary flex items-center justify-center text-on-primary font-extrabold text-3xl shadow-inner">
              H
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-container"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full shadow-sm mb-space-xs">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Academic Year 2024-2025</span>
          </div>

          <h2 className="font-title-md text-title-md text-secondary tracking-tight">
            St. Jude's University Residence Halls
          </h2>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold mt-1 max-w-xs">
            Smart & Efficient Hostel Administration
          </h1>
        </div>

        {/* Role Switcher Segmented Control */}
        <div className="w-full bg-surface-container p-1 rounded-full shadow-sm mb-space-lg flex relative">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full font-label-md text-label-md transition-all duration-200 ${
              roleMode === 'warden'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
            onClick={() => handleRoleSwitch('warden')}
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>Warden / Staff</span>
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full font-label-md text-label-md transition-all duration-200 ${
              roleMode === 'student'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
            onClick={() => handleRoleSwitch('student')}
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            <span>Student Resident</span>
          </button>
        </div>

        {/* Login Card Form */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col gap-space-md border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-label-sm text-label-sm uppercase">
                {roleMode === 'warden' ? 'Faculty / Warden Portal' : 'Student Resident Portal'}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">cell_tower</span>
              SSO Active
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-error-container/40 border border-error/20 text-on-error-container rounded-lg font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-error">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
            {/* ID Input */}
            <div className="flex flex-col gap-space-2xs">
              <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="username-input">
                {roleMode === 'warden' ? 'Institutional Warden ID' : 'Resident Roll Number'}
                <span className="text-secondary font-body-sm text-body-sm">
                  {roleMode === 'warden' ? 'e.g. WARDEN-104' : 'e.g. STU-2024-089'}
                </span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">badge</span>
                <input
                  id="username-input"
                  className="w-full bg-surface-container-low text-on-surface pl-10 pr-4 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest border border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder={roleMode === 'warden' ? 'Enter WARDEN-XXX or Email' : 'Enter STU-XXXX-XXX or Email'}
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-space-2xs">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="password-input">
                  Campus Password
                </label>
                <a className="font-label-sm text-label-sm text-primary hover:underline" href="#forgot" onClick={(e) => e.preventDefault()}>
                  Forgot Password?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">key</span>
                <input
                  id="password-input"
                  className="w-full bg-surface-container-low text-on-surface pl-10 pr-10 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest border border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder="••••••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  className="absolute right-3 text-secondary hover:text-on-surface flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Terminal */}
            <div className="flex items-center justify-between pt-space-2xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberTerminal}
                  onChange={(e) => setRememberTerminal(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <span className="font-body-sm text-body-sm text-secondary select-none">Remember this terminal</span>
              </label>
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-[12px] text-primary">gpp_maybe</span>
                2FA Active
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-on-primary-fixed-variant active:scale-[0.99] text-on-primary py-3 rounded-lg font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-150 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Verifying Credential Registry...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  <span>Sign In to Residence Portal</span>
                </>
              )}
            </button>

            {/* Link to Register */}
            <div className="mt-1 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-1 text-body-sm text-secondary">
              <span>New student or resident staff?</span>
              <Link
                to="/register"
                className="font-semibold text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1"
              >
                <span>Create Account / Sign Up</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Quick Demo Autofill Pills */}
        <div className="w-full mt-space-md flex flex-col gap-space-xs">
          <div className="flex items-center justify-between px-1">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span> Quick Demo Fill
            </span>
            <span className="font-label-sm text-[11px] text-secondary">Pre-configured Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSwitch('warden')}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                roleMode === 'warden'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 bg-surface-container-lowest text-secondary hover:border-slate-300'
              }`}
            >
              <div className="font-label-md text-label-md font-bold">Warden Demo</div>
              <div className="font-body-sm text-[11px] text-secondary">WARDEN-104 / password123</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                roleMode === 'student'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 bg-surface-container-lowest text-secondary hover:border-slate-300'
              }`}
            >
              <div className="font-label-md text-label-md font-bold">Student Demo</div>
              <div className="font-body-sm text-[11px] text-secondary">STU-2024-089 / password123</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
