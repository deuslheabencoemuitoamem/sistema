import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthGateProps {
  onAuthenticate: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'lorena10@') {
      setError(false);
      onAuthenticate();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      {/* Background glow */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Acesso Restrito</h1>
            <p className="text-xs text-slate-400 mt-1">
              Digite a senha de segurança para acessar o Extrator de Leads
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Senha de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Informe sua senha..."
                autoFocus
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-950/80 border border-rose-800/80 text-rose-300 p-3 rounded-xl flex items-center gap-2 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Senha incorreta. Tente novamente.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-95 cursor-pointer text-sm"
          >
            <span>Entrar no Sistema</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-4 text-center">
          <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Protegido por senha individual
          </span>
        </div>

      </div>
    </div>
  );
};
