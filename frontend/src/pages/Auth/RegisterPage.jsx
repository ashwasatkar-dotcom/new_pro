import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [roleMode, setRoleMode] = useState('ROLE_STUDENT'); // 'ROLE_STUDENT' | 'ROLE_WARDEN'
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [academicYear, setAcademicYear] = useState('1st Yr');
  const [blockAssigned, setBlockAssigned] = useState('Wing B');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setRoleMode(role);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the campus residence regulations to proceed.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName: fullName.trim(),
      username: username.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      role: roleMode,
      department: department.trim(),
      academicYear: roleMode === 'ROLE_STUDENT' ? academicYear : null,
      rollNumber: roleMode === 'ROLE_STUDENT' ? username.trim().toUpperCase() : null,
      blockAssigned: roleMode === 'ROLE_WARDEN' ? blockAssigned : null,
    };

    const result = await register(payload);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Registration successful! Redirecting to your dashboard...');
      setTimeout(() => {
        if (roleMode === 'ROLE_WARDEN') {
          navigate('/warden/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 1200);
    } else {
      setErrorMessage(result.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-gutter-mobile py-8">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Crest & Context Header */}
        <div className="flex flex-col items-center text-center mb-space-md">
          <div className="relative flex items-center justify-center w-16 h-16 bg-surface-container-lowest shadow-md rounded-2xl p-1.5 mb-space-xs border border-slate-200">
            <div className="w-full h-full rounded-xl bg-primary flex items-center justify-center text-on-primary font-extrabold text-2xl shadow-inner">
              H
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary-container"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-secondary-container text-on-secondary-container rounded-full shadow-sm mb-1.5">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              app_registration
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider">New Resident / Staff Registry</span>
          </div>

          <h2 className="font-title-md text-title-md text-secondary tracking-tight">
            St. Jude's University Residence Halls
          </h2>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold mt-0.5">
            Create an Institutional Account
          </h1>
          <p className="font-body-sm text-body-sm text-secondary mt-1 max-w-md">
            Register your profile to access automated room allocations, curfew attendance tracking, and maintenance requests.
          </p>
        </div>

        {/* Role Switcher Segmented Control */}
        <div className="w-full bg-surface-container p-1 rounded-full shadow-sm mb-space-md flex relative">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-label-md text-label-md transition-all duration-200 ${
              roleMode === 'ROLE_STUDENT'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
            onClick={() => handleRoleChange('ROLE_STUDENT')}
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            <span>Student Resident</span>
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-label-md text-label-md transition-all duration-200 ${
              roleMode === 'ROLE_WARDEN'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
            onClick={() => handleRoleChange('ROLE_WARDEN')}
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>Warden / Staff</span>
          </button>
        </div>

        {/* Card Container */}
        <div className="w-full bg-surface-container-lowest p-6 rounded-2xl shadow-card border border-slate-100">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-space-md p-3.5 bg-error-container text-on-error-container rounded-xl flex items-start gap-2.5 text-body-sm animate-shake">
              <span className="material-symbols-outlined text-[20px] text-error flex-shrink-0 mt-0.5">
                error
              </span>
              <span className="font-medium leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-space-md p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-body-sm">
              <span className="material-symbols-outlined text-[20px] text-emerald-600 flex-shrink-0">
                check_circle
              </span>
              <span className="font-medium leading-snug">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
            {/* Full Name & Username / Roll No */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-label-md font-medium text-secondary mb-1">
                  Full Name <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessica Taylor"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-container border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md font-medium text-secondary mb-1">
                  {roleMode === 'ROLE_STUDENT' ? 'Roll Number / Student ID' : 'Staff / Warden ID'} <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">
                    badge
                  </span>
                  <input
                    type="text"
                    required
                    placeholder={roleMode === 'ROLE_STUDENT' ? 'e.g. STU-2024-405' : 'e.g. WARDEN-108'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-surface-container border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-label-md font-medium text-secondary mb-1">
                  Institutional Email <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md font-medium text-secondary mb-1">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">
                    call
                  </span>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-surface-container border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Department & Year / Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-label-md font-medium text-secondary mb-1">
                  Academic Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-surface-container border border-slate-200 rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all cursor-pointer"
                >
                  <option value="Computer Science">B.Tech Computer Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Student Affairs">Student Affairs / Operations</option>
                </select>
              </div>

              {roleMode === 'ROLE_STUDENT' ? (
                <div>
                  <label className="block font-label-md text-label-md font-medium text-secondary mb-1">
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-surface-container border border-slate-200 rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all cursor-pointer"
                  >
                    <option value="1st Yr">1st Year (Freshman)</option>
                    <option value="2nd Yr">2nd Year (Sophomore)</option>
                    <option value="3rd Yr">3rd Year (Junior)</option>
                    <option value="4th Yr">4th Year (Senior)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-label-md text-label-md font-medium text-secondary mb-1">
                    Assigned Residential Wing
                  </label>
                  <select
                    value={blockAssigned}
                    onChange={(e) => setBlockAssigned(e.target.value)}
                    className="w-full bg-surface-container border border-slate-200 rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all cursor-pointer"
                  >
                    <option value="Wing A">Wing A (Executive)</option>
                    <option value="Wing B">Wing B (Engineering)</option>
                    <option value="Wing C">Wing C (Standard)</option>
                    <option value="Block Alpha & Bravo">All Blocks (General)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-label-md text-label-md font-medium text-secondary">
                    Password <span className="text-error">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="font-label-sm text-[11px] text-primary hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">
                    key
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md font-medium text-secondary mb-1">
                  Confirm Password <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">
                    lock_reset
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface-container border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 mt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="terms" className="font-body-sm text-body-sm text-secondary select-none">
                I acknowledge and agree to abide by the university residence conduct policy, curfew timing regulations, and electronic record guidelines.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-on-primary-fixed-variant active:scale-[0.99] text-on-primary py-3 rounded-lg font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-150 disabled:opacity-60 mt-1"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Registering Profile in Registry...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span>Complete Registration</span>
                </>
              )}
            </button>
          </form>

          {/* Link back to login */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-body-sm text-secondary">
            <span>Already registered with an active account?</span>
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1"
            >
              <span>Sign In Here</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
