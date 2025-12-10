import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook für Posts-Management mit Supabase
 * Inkl. User-spezifische Vote-Persistenz
 */
export function usePosts(userId) {
    const [posts, setPosts] = useState([]);
    const [userVotes, setUserVotes] = useState({}); // { postId: 'like' | 'dislike' | null }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // User Votes laden
    const fetchUserVotes = useCallback(async () => {
        if (!userId) {
            setUserVotes({});
            return;
        }

        try {
            const { data, error } = await supabase
                .from('reactions')
                .select('post_id, type')
                .eq('user_id', userId);

            if (error) throw error;

            const votesMap = {};
            data.forEach(reaction => {
                votesMap[reaction.post_id] = reaction.type;
            });
            setUserVotes(votesMap);
        } catch (err) {
            console.error('User Votes laden fehlgeschlagen:', err);
        }
    }, [userId]);

    // Posts laden
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Posts mit zugehörigen Comments laden
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (postsError) throw postsError;

            // Comments für jeden Post laden
            const postsWithComments = await Promise.all(
                postsData.map(async (post) => {
                    const { data: comments, error: commentsError } = await supabase
                        .from('comments')
                        .select('*')
                        .eq('post_id', post.id)
                        .order('created_at', { ascending: true });

                    if (commentsError) {
                        console.error('Comments laden fehlgeschlagen:', commentsError);
                        return { ...transformPost(post), commentsList: [] };
                    }

                    return {
                        ...transformPost(post),
                        commentsList: comments.map(transformComment)
                    };
                })
            );

            setPosts(postsWithComments);
        } catch (err) {
            console.error('Posts laden fehlgeschlagen:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialer Load
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // User Votes laden wenn userId sich ändert
    useEffect(() => {
        fetchUserVotes();
    }, [fetchUserVotes]);

    // Post erstellen
    const createPost = async (postData) => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .insert([{
                    user_name: postData.user,
                    handle: postData.handle,
                    avatar: postData.avatar,
                    content: postData.content,
                    media_type: postData.mediaType || null,
                    media_content: postData.mediaContent || null,
                    q_score: postData.qScore || 50,
                    is_curator: postData.isCurator || false,
                    category: postData.category || 'general',
                    user_id: userId || null
                }])
                .select()
                .single();

            if (error) throw error;

            const newPost = { ...transformPost(data), commentsList: [] };
            setPosts(prev => [newPost, ...prev]);
            return { success: true, post: newPost };
        } catch (err) {
            console.error('Post erstellen fehlgeschlagen:', err);
            return { success: false, error: err.message };
        }
    };

    // Post bewerten (Q-Score aktualisieren)
    const ratePost = async (postId, newRating) => {
        try {
            // Aktuellen Post finden
            const currentPost = posts.find(p => p.id === postId);
            if (!currentPost) return;

            // Neuen Q-Score berechnen (Durchschnitt)
            const currentScore = currentPost.qScore;
            const newScore = Math.round((currentScore + newRating) / 2);

            const { error } = await supabase
                .from('posts')
                .update({ q_score: newScore })
                .eq('id', postId);

            if (error) throw error;

            setPosts(prev => prev.map(p =>
                p.id === postId ? { ...p, qScore: newScore } : p
            ));
        } catch (err) {
            console.error('Bewertung fehlgeschlagen:', err);
        }
    };

    // Upvote/Downvote mit Persistenz
    const votePost = async (postId, type) => {
        if (!userId) {
            console.warn('Benutzer muss eingeloggt sein um zu voten');
            return { success: false, requiresAuth: true };
        }

        try {
            const currentVote = userVotes[postId];
            const currentPost = posts.find(p => p.id === postId);
            if (!currentPost) return { success: false };

            let newVote = type;
            let upvoteDelta = 0;
            let downvoteDelta = 0;

            // Toggle-Logik: Wenn gleicher Vote erneut geklickt, entfernen
            if (currentVote === type) {
                newVote = null;
                if (type === 'like') upvoteDelta = -1;
                else downvoteDelta = -1;

                // Vote aus DB entfernen
                await supabase
                    .from('reactions')
                    .delete()
                    .eq('user_id', userId)
                    .eq('post_id', postId);
            } else {
                // Vorherigen Vote rückgängig machen
                if (currentVote === 'like') upvoteDelta = -1;
                if (currentVote === 'dislike') downvoteDelta = -1;

                // Neuen Vote hinzufügen
                if (type === 'like') upvoteDelta += 1;
                else downvoteDelta += 1;

                // Upsert in reactions Tabelle
                const { error: upsertError } = await supabase
                    .from('reactions')
                    .upsert({
                        user_id: userId,
                        post_id: postId,
                        type: type
                    }, {
                        onConflict: 'user_id,post_id'
                    });

                if (upsertError) throw upsertError;
            }

            // Post-Zähler in DB aktualisieren
            const { error: updateError } = await supabase
                .from('posts')
                .update({
                    upvotes: currentPost.likes + upvoteDelta,
                    downvotes: currentPost.dislikes + downvoteDelta
                })
                .eq('id', postId);

            if (updateError) throw updateError;

            // Lokalen State aktualisieren
            setUserVotes(prev => ({
                ...prev,
                [postId]: newVote
            }));

            setPosts(prev => prev.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        likes: p.likes + upvoteDelta,
                        dislikes: p.dislikes + downvoteDelta
                    }
                    : p
            ));

            return { success: true };
        } catch (err) {
            console.error('Vote fehlgeschlagen:', err);
            return { success: false, error: err.message };
        }
    };

    // Comment hinzufügen
    const addComment = async (postId, commentData) => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert([{
                    post_id: postId,
                    user_name: commentData.user,
                    handle: commentData.handle,
                    avatar: commentData.avatar,
                    content: commentData.content,
                    user_id: userId || null
                }])
                .select()
                .single();

            if (error) throw error;

            const newComment = transformComment(data);
            setPosts(prev => prev.map(p =>
                p.id === postId
                    ? { ...p, commentsList: [...p.commentsList, newComment] }
                    : p
            ));
            return { success: true, comment: newComment };
        } catch (err) {
            console.error('Comment hinzufügen fehlgeschlagen:', err);
            return { success: false, error: err.message };
        }
    };

    return {
        posts,
        userVotes,
        loading,
        error,
        fetchPosts,
        createPost,
        ratePost,
        votePost,
        addComment
    };
}

// Hilfsfunktionen für Daten-Transformation
function transformPost(dbPost) {
    return {
        id: dbPost.id,
        user: dbPost.user_name,
        handle: dbPost.handle,
        avatar: dbPost.avatar,
        content: dbPost.content,
        mediaType: dbPost.media_type,
        mediaContent: dbPost.media_content,
        qScore: Number(dbPost.q_score),
        isCurator: dbPost.is_curator,
        category: dbPost.category,
        timestamp: formatTimestamp(dbPost.created_at),
        upvotes: dbPost.upvotes || 0,
        downvotes: dbPost.downvotes || 0
    };
}

function transformComment(dbComment) {
    return {
        id: dbComment.id,
        user: dbComment.user_name,
        handle: dbComment.handle,
        avatar: dbComment.avatar,
        content: dbComment.content,
        timestamp: formatTimestamp(dbComment.created_at),
        likes: dbComment.likes || 0
    };
}

function formatTimestamp(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'gerade eben';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('de-DE');
}
