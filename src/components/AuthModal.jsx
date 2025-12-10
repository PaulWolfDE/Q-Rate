import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onAuth }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (!username.trim()) {
                    throw new Error('Benutzername ist erforderlich');
                }
                if (username.length < 3) {
                    throw new Error('Benutzername muss mindestens 3 Zeichen haben');
                }
            }

            if (!email.trim() || !password.trim()) {
                throw new Error('E-Mail und Passwort sind erforderlich');
            }

            if (password.length < 6) {
                throw new Error('Passwort muss mindestens 6 Zeichen haben');
            }

            const result = await onAuth(mode, email, password, username);

            if (!result.success) {
                throw new Error(result.error);
            }

            // Erfolg - Modal schließen
            onClose();
            setEmail('');
            setPassword('');
            setUsername('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                            <span className="font-black text-black text-xl">Q</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {mode === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
                            </h2>
                            <p className="text-sm text-gray-400">
                                {mode === 'login' ? 'Melde dich bei Q-Rate an' : 'Werde Teil der Community'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Benutzername
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="DeinName"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            E-Mail
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="deine@email.de"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Passwort
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                <span>Wird verarbeitet...</span>
                            </>
                        ) : (
                            <span>{mode === 'login' ? 'Anmelden' : 'Registrieren'}</span>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="px-6 pb-6 text-center">
                    <p className="text-gray-400 text-sm">
                        {mode === 'login' ? 'Noch kein Konto? ' : 'Bereits registriert? '}
                        <button
                            onClick={switchMode}
                            className="text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                            {mode === 'login' ? 'Jetzt registrieren' : 'Jetzt anmelden'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
