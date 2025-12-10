import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook für Supabase Authentication
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Session beim Start laden
    useEffect(() => {
        // Aktuelle Session holen
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        };

        getSession();

        // Auth State Changes listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // User Profile laden
    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Profil laden fehlgeschlagen:', error);
            }
            setProfile(data);
        } catch (err) {
            console.error('Profil laden Fehler:', err);
        }
    };

    // Registrierung
    const signUp = async (email, password, username) => {
        try {
            setLoading(true);

            // 1. User erstellen
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            // 2. Profil erstellen
            if (authData.user) {
                const handle = `@${username.toLowerCase().replace(/\s+/g, '_')}`;
                const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'];
                const randomAvatar = avatarColors[Math.floor(Math.random() * avatarColors.length)];

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: authData.user.id,
                        username,
                        handle,
                        avatar: randomAvatar,
                    }]);

                if (profileError) throw profileError;
            }

            return { success: true, user: authData.user };
        } catch (err) {
            console.error('Registrierung fehlgeschlagen:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Anmeldung
    const signIn = async (email, password) => {
        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            return { success: true, user: data.user };
        } catch (err) {
            console.error('Anmeldung fehlgeschlagen:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Abmeldung
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setProfile(null);
            return { success: true };
        } catch (err) {
            console.error('Abmeldung fehlgeschlagen:', err);
            return { success: false, error: err.message };
        }
    };

    return {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
    };
}
