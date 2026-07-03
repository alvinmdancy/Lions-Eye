import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function Login() {
    const { loginWithEmail, signUpWithEmail } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);
        setIsLoading(true);
        try {
            if (mode === 'login') {
                await loginWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
                setSuccess('Account created. You can now sign in.');
                setMode('login');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center cyber-grid" style={{ background: '#050A1F' }}>
            {/* Ambient glow */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-sm mx-4">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-cyan flex items-center justify-center shadow-glow-purple">
                        <span className="font-orbitron text-white font-black text-sm">IT</span>
                    </div>
                    <div>
                        <h1 className="font-orbitron font-black text-sm uppercase tracking-widest" style={{ color: '#06B6D4' }}>
                            Lion's Eye
                        </h1>
                        <p className="font-mono-cyber text-xs text-white/30">AI Prompt Engine</p>
                    </div>
                </div>

                {/* Card */}
                <div className="cyber-card rounded-xl p-6 space-y-5">
                    {/* Mode toggle */}
                    <div className="flex rounded-lg border border-white/10 p-1 gap-1">
                        <button
                            onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                            className={`flex-1 py-2 rounded-md font-orbitron text-xs uppercase tracking-widest transition-all ${mode === 'login'
                                ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40'
                                : 'text-white/30 hover:text-white/60'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
                            className={`flex-1 py-2 rounded-md font-orbitron text-xs uppercase tracking-widest transition-all ${mode === 'signup'
                                ? 'bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/40'
                                : 'text-white/30 hover:text-white/60'
                                }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Feedback */}
                    {error && (
                        <p className="font-mono-cyber text-xs text-red-400 border border-red-400/20 bg-red-400/5 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="font-mono-cyber text-xs text-green-400 border border-green-400/20 bg-green-400/5 rounded-lg px-3 py-2">
                            {success}
                        </p>
                    )}

                    {/* Fields */}
                    <div className="space-y-3">
                        <div>
                            <label className="font-orbitron text-xs uppercase tracking-widest text-white/40 block mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono-cyber text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyber-cyan/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="font-orbitron text-xs uppercase tracking-widest text-white/40 block mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono-cyber text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyber-cyan/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !email || !password}
                        className={`w-full py-3 rounded-xl font-orbitron text-sm font-bold uppercase tracking-widest transition-all duration-300 ${!isLoading && email && password
                            ? 'cyber-button-primary shadow-glow-purple'
                            : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">◈</span>
                                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                ◈ {mode === 'login' ? 'Sign In' : 'Create Account'}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
