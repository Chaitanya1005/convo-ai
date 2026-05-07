"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Shield, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email] = useState("rm@rupeezy.in");
  const [password] = useState("rupeezy@2026");

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    router.push("/workspace");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex w-[480px] bg-brand-700 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none">Rupeezy</div>
              <div className="text-blue-200 text-xs">Investment Platform</div>
            </div>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-6">
              <Zap size={12} className="text-yellow-300" />
              <span className="text-white/80 text-xs font-medium">AI-Powered Lead Engine</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Convo-AI<br />
              <span className="text-blue-200">RM Workspace</span>
            </h1>
            <p className="text-blue-100 mt-4 text-sm leading-relaxed">
              Intelligent lead processing system. Automate conversations, classify prospects, and close more with AI.
            </p>
          </div>

          <div className="space-y-3">
            {["Lead analysis in under 2 seconds", "Smart objection detection", "Auto Hot/Warm/Cold classification"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-blue-200/60 text-xs">© 2026 Rupeezy Financial Services Pvt Ltd</p>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={16} />
            </div>
            <span className="font-bold text-slate-800">Convo-AI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to your RM workspace</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Shield size={16} className="text-brand-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-brand-700">Demo credentials pre-filled</p>
              <p className="text-xs text-slate-500 mt-0.5">Email: rm@rupeezy.in · Password: rupeezy@2026</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email address</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent pr-12"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>Enter RM Workspace <ArrowRight size={16} /></>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            Secured by Rupeezy Infrastructure · Internal use only
          </p>
        </div>
      </div>
    </div>
  );
}
