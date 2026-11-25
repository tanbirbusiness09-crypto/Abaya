import { KeyRound, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SeoHead } from '../components/ui/SeoHead';
import { useLocale } from '../context/LocaleContext';
import { useStore } from '../context/StoreContext';
import { formatSaudiPhone, isValidSaudiPhone } from '../utils/catalogLogic';

export function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const navigate = useNavigate();
  const { lang } = useLocale();
  const { loginDemoUser, showToast } = useStore();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+966 5');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  const titles = {
    login: lang === 'ar' ? 'تسجيل الدخول إلى ليانا' : 'Sign In to LAYANA',
    register: lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Your LAYANA Account',
    forgot: lang === 'ar' ? 'استعادة كلمة المرور' : 'Reset Your Password',
  };

  const handlePrimarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError(lang === 'ar' ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name');
        return;
      }
      if (!isValidSaudiPhone(phone)) {
        setError(lang === 'ar' ? 'يرجى إدخال رقم جوال سعودي صحيح' : 'Enter a valid Saudi mobile number');
        return;
      }
    }

    if (!email.trim() || !email.includes('@')) {
      setError(lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Enter a valid email address');
      return;
    }

    if (mode !== 'forgot' && password.length < 4) {
      setError(lang === 'ar' ? 'كلمة المرور يجب أن لا تقل عن 4 أحرف' : 'Password must be at least 4 characters');
      return;
    }

    setStep('otp');
    showToast(
      lang === 'ar'
        ? 'تم إرسال رمز تحقق تجريبي (أدخلي أي 4 أرقام مثل 1234)'
        : 'Demo OTP sent (enter any 4 digits such as 1234)',
      'info'
    );
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 4) {
      setError(lang === 'ar' ? 'يرجى إدخال رمز التحقق المكون من 4 أرقام' : 'Please enter the 4-digit verification code');
      return;
    }

    if (mode === 'forgot') {
      showToast(
        lang === 'ar'
          ? 'تم التحقق بنجاح! يمكنك الآن تسجيل الدخول (محاكاة تجريبية).'
          : 'Verified! You may now sign in (demo simulation).'
      );
      navigate('/login');
      return;
    }

    loginDemoUser({
      fullName: fullName.trim() || 'العنود العتيبي',
      email: email.trim(),
      phone: isValidSaudiPhone(phone) ? formatSaudiPhone(phone) : '+966 55 412 8901',
    });
    showToast(lang === 'ar' ? 'مرحباً بكِ في حسابك لدى ليانا' : 'Welcome to your LAYANA account');
    navigate('/account');
  };

  return (
    <>
      <SeoHead title={titles[mode]} />
      <div className="max-w-md mx-auto px-4 py-10 sm:py-14">
        <div className="bg-white rounded-2xl border border-[#EAE5DF] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <p className="font-editorial text-2xl font-bold text-[#581C32]">LAYANA | ليانا</p>
            <h1 className="text-xl font-bold text-[#202020]">{titles[mode]}</h1>
            <p className="text-xs text-[#777777]">
              {lang === 'ar'
                ? 'محاكاة تسجيل دخول تجريبية للواجهة الأمامية قبل ربط الخادم'
                : 'Frontend demonstration authentication simulation prior to backend setup'}
            </p>
          </div>

          {step === 'form' ? (
            <form onSubmit={handlePrimarySubmit} noValidate className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#202020] mb-1.5">
                      {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#777777] absolute start-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={lang === 'ar' ? 'العنود العتيبي' : 'AlAnoud Al-Otaibi'}
                        className="w-full h-11 ps-10 pe-3 rounded-lg border border-[#EAE5DF] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#202020] mb-1.5">
                      {lang === 'ar' ? 'رقم الجوال السعودي (+966)' : 'Saudi Mobile (+966)'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#777777] absolute start-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(formatSaudiPhone(e.target.value))}
                        placeholder="+966 55 123 4567"
                        className="w-full h-11 ps-10 pe-3 rounded-lg border border-[#EAE5DF] text-sm tabular-nums text-start"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#202020] mb-1.5">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#777777] absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 ps-10 pe-3 rounded-lg border border-[#EAE5DF] text-sm"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#202020]">
                      {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    {mode === 'login' && (
                      <Link to="/forgot-password" className="text-xs text-[#581C32] hover:underline">
                        {lang === 'ar' ? 'نسيتِ كلمة المرور؟' : 'Forgot password?'}
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#777777] absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 ps-10 pe-3 rounded-lg border border-[#EAE5DF] text-sm"
                    />
                  </div>
                </div>
              )}

              {error && <p className="text-xs font-semibold text-[#D92D39]">{error}</p>}

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold transition-colors"
              >
                {mode === 'login'
                  ? lang === 'ar' ? 'متابعة للتحقق (OTP)' : 'Continue to OTP Verification'
                  : mode === 'register'
                    ? lang === 'ar' ? 'إنشاء الحساب' : 'Create Account'
                    : lang === 'ar' ? 'إرسال رمز الاستعادة' : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="p-3.5 rounded-lg bg-[#F8F4ED] text-xs text-[#777777] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#581C32] shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'أدخلي رمز التحقق التجريبي المكون من 4 أرقام (مثال: 1 2 3 4).'
                    : 'Enter any 4-digit demo verification code (e.g. 1 2 3 4) to complete verification.'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5" dir="ltr">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    aria-label={`OTP digit ${idx + 1}`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 1);
                      const next = [...otp];
                      next[idx] = val;
                      setOtp(next);
                    }}
                    className="h-12 text-center text-lg font-bold rounded-lg border border-[#EAE5DF] focus:border-[#581C32] tabular-nums"
                  />
                ))}
              </div>

              {error && <p className="text-xs font-semibold text-[#D92D39]">{error}</p>}

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold inline-flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تأكيد الرمز' : 'Verify & Continue'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full text-xs font-semibold text-[#777777] hover:text-[#581C32]"
              >
                {lang === 'ar' ? 'العودة لتعديل البيانات' : 'Back to previous step'}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#EAE5DF] text-center text-xs text-[#777777]">
            {mode === 'login' ? (
              <>
                {lang === 'ar' ? 'جديدة في ليانا؟ ' : 'New to LAYANA? '}
                <Link to="/register" className="font-bold text-[#581C32] hover:underline">
                  {lang === 'ar' ? 'أنشئي حساباً' : 'Create Account'}
                </Link>
              </>
            ) : (
              <>
                {lang === 'ar' ? 'لديكِ حساب بالفعل؟ ' : 'Already have an account? '}
                <Link to="/login" className="font-bold text-[#581C32] hover:underline">
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
