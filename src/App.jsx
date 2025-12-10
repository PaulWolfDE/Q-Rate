import React, { useState } from 'react';
import {
  MessageCircle,
  Share2,
  Hexagon,
  TrendingUp,
  Search,
  Bell,
  Menu,
  Filter,
  Info,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  PlayCircle,
  Shield,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Database,
  EyeOff,
  BookOpen,
  PartyPopper,
  Scale,
  Send,
  X,
  Settings as SettingsIcon
} from 'lucide-react';

// --- Mock Data ---

const INITIAL_POSTS = [
  {
    id: 1,
    user: "AstroAlex",
    handle: "@astro_alex",
    avatar: "bg-blue-600",
    content: "Der 'Große Rote Fleck' auf dem Jupiter ist ein Sturm, der seit 350 Jahren tobt. Hier ein Größenvergleich zur Erde. Faszinierend, wie dynamisch unser Sonnensystem ist. 🪐",
    mediaType: "image",
    mediaContent: "jupiter-storm",
    qScore: 92,
    uScore: 88,
    uScoreReason: "Du interagierst oft mit #Wissenschaft",
    ratingCount: 1420,
    likes: 3500,
    dislikes: 45,
    comments: 120,
    isCurator: true,
    timestamp: "2h",
    category: "education"
  },
  {
    id: 2,
    user: "NewsFlash DE",
    handle: "@newsflash_de",
    avatar: "bg-red-600",
    content: "Klimakonferenz Update: Fonds für Entwicklungsländer genehmigt, aber Kohleausstieg bleibt strittig. Hier die Zusammenfassung im Video.",
    mediaType: "video",
    mediaContent: "climate-conf",
    qScore: 88,
    uScore: 45,
    uScoreReason: "Trend in deiner Region",
    ratingCount: 850,
    likes: 2100,
    dislikes: 120,
    comments: 340,
    isCurator: false,
    timestamp: "4h",
    category: "news"
  },
  {
    id: 3,
    user: "ChillDude22",
    handle: "@chiller",
    avatar: "bg-green-500",
    content: "Boah Leute, mein Kaffee schmeckt heute irgendwie anders. Keine Ahnung warum lol. ☕️",
    mediaType: null,
    qScore: 12,
    aScore: 10,
    uScoreReason: "Wenige Übereinstimmungen mit deinem Profil",
    ratingCount: 45,
    likes: 12,
    dislikes: 85,
    comments: 5,
    isCurator: false,
    timestamp: "10m",
    category: "entertainment"
  },
  {
    id: 4,
    user: "TechReviewer",
    handle: "@tech_pro",
    avatar: "bg-purple-600",
    content: "Neue VR-Brille im Härtetest. Display-Auflösung ist top, aber der Tragekomfort lässt nach 30min nach.",
    mediaType: "image",
    mediaContent: "vr-headset",
    qScore: 78,
    uScore: 95,
    uScoreReason: "Du hast ähnliche Tech-Reviews geliked",
    ratingCount: 300,
    likes: 890,
    dislikes: 12,
    comments: 56,
    isCurator: true,
    timestamp: "1h",
    category: "tech"
  }
];

// --- Filter Presets Configuration ---
const FILTER_PRESETS = [
  { id: 'all', label: 'Alle', icon: <Filter size={14} />, minQ: 0 },
  { id: 'entertainment', label: 'Unterhaltung', icon: <PartyPopper size={14} />, minQ: 40 },
  { id: 'education', label: 'Lehrreich', icon: <BookOpen size={14} />, minQ: 70 },
  { id: 'sourced', label: 'Belegt & Seriös', icon: <Scale size={14} />, minQ: 85 },
];

// --- Sub-Components ---

const ScoreBadge = ({ value, type = "q", size = "md" }) => {
  let colorClass = "text-red-500 border-red-500 shadow-red-500/20";
  if (value >= 70) colorClass = "text-emerald-400 border-emerald-400 shadow-emerald-400/20";
  else if (value >= 40) colorClass = "text-yellow-400 border-yellow-400 shadow-yellow-400/20";

  if (type === "u") {
    colorClass = "text-cyan-400 border-cyan-500 shadow-cyan-500/20 border-dashed";
  }

  const sizeClass = size === "lg" ? "w-16 h-16 text-2xl border-4" : "w-10 h-10 text-sm border-2";

  return (
    <div className={`flex items-center justify-center rounded-full font-bold shadow-lg bg-gray-900 ${colorClass} ${sizeClass} relative`}>
      {value}
      {type === "u" && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-black"></span>
      )}
    </div>
  );
};

const MediaPlaceholder = ({ type, content }) => {
  if (!type) return null;
  return (
    <div className="mt-3 w-full h-64 bg-gray-800 rounded-xl overflow-hidden relative flex items-center justify-center border border-gray-700 group cursor-pointer hover:border-gray-600 transition-colors">
      {type === 'image' ? (
        <div className="flex flex-col items-center text-gray-500">
          <ImageIcon size={48} className="mb-2 opacity-50" />
          <span className="text-xs uppercase tracking-widest opacity-50">Image: {content}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
            <PlayCircle size={32} className="text-white" fill="currentColor" />
          </div>
          <span className="text-xs uppercase tracking-widest opacity-50">Video: {content}</span>
        </div>
      )}
    </div>
  );
};

const Post = ({ post, onRate, onVote, showUScore }) => {
  const [isRating, setIsRating] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [hasRated, setHasRated] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);

  const handleRateSubmit = () => {
    onRate(post.id, sliderValue);
    setHasRated(true);
    setIsRating(false);
  };

  const handleVote = (type) => {
    if (voteStatus === type) {
      setVoteStatus(null);
      if (type === 'like') setLikes(l => l - 1);
      else setDislikes(d => d - 1);
    } else {
      if (voteStatus === 'like') setLikes(l => l - 1);
      if (voteStatus === 'dislike') setDislikes(d => d - 1);

      setVoteStatus(type);
      if (type === 'like') setLikes(l => l + 1);
      else setDislikes(d => d + 1);

      onVote(post.id, type);
    }
  };

  return (
    <div className="border-b border-gray-800 p-5 hover:bg-gray-900/40 transition-colors animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-full flex-shrink-0 ${post.avatar}`} />

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{post.user}</span>
              {post.isCurator && (
                <span className="text-emerald-400" title="Verifizierter Q-Rator">
                  <Hexagon size={14} fill="currentColor" />
                </span>
              )}
              <span className="text-gray-500 text-sm">{post.handle} · {post.timestamp}</span>
            </div>

            {/* Scores Area */}
            <div className="flex gap-3">
              {showUScore && (
                <div className="flex flex-col items-center group relative cursor-help">
                  <ScoreBadge value={post.uScore} type="u" />
                  <span className="text-[10px] text-cyan-500/70 font-mono mt-1">U-SCORE</span>

                  {/* U-Score Transparency Tooltip */}
                  <div className="absolute right-0 top-10 mt-2 w-56 bg-gray-800 p-3 rounded-lg border border-gray-700 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl pointer-events-none">
                    <div className="font-bold text-cyan-400 mb-1 border-b border-gray-700 pb-1 flex items-center gap-2">
                      <UserCheck size={12} /> Warum dieser Score?
                    </div>
                    <p className="leading-relaxed">{post.uScoreReason || "Neu im Feed"}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center group relative cursor-help">
                <ScoreBadge value={post.qScore} type="q" />
                <span className="text-[10px] text-emerald-500/70 font-mono mt-1">Q-SCORE</span>

                {/* Q-Score Tooltip */}
                <div className="absolute right-0 top-10 mt-2 w-48 bg-gray-800 p-3 rounded-lg border border-gray-700 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl pointer-events-none">
                  <div className="flex justify-between mb-1">
                    <span>Q-Rator Score:</span>
                    <span className="font-bold text-white">{(post.qScore + 5) > 100 ? 100 : post.qScore + 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Rating:</span>
                    <span className="font-bold text-white">{post.qScore - 5}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-1 text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          <MediaPlaceholder type={post.mediaType} content={post.mediaContent} />

          {/* Actions Bar */}
          <div className="flex items-center justify-between mt-4 pt-2">
            <div className="flex items-center bg-gray-900/80 rounded-full px-1 border border-gray-800">
              <button
                onClick={() => handleVote('like')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${voteStatus === 'like' ? 'text-green-400' : 'text-gray-500 hover:text-green-400'}`}
              >
                <ThumbsUp size={18} fill={voteStatus === 'like' ? "currentColor" : "none"} />
                <span className="text-sm font-medium">{likes}</span>
              </button>
              <div className="w-px h-4 bg-gray-700"></div>
              <button
                onClick={() => handleVote('dislike')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${voteStatus === 'dislike' ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
              >
                <ThumbsDown size={18} fill={voteStatus === 'dislike' ? "currentColor" : "none"} />
                <span className="text-sm font-medium">{dislikes}</span>
              </button>
            </div>

            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors">
              <MessageCircle size={18} />
              <span className="text-sm">{post.comments}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => !hasRated && setIsRating(!isRating)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all ${hasRated
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10 cursor-default"
                    : "border-gray-600 hover:border-emerald-400 hover:text-emerald-400 hover:bg-emerald-500/5"
                  }`}
              >
                <TrendingUp size={16} />
                <span className="text-sm font-bold">
                  {hasRated ? "Rated" : "Rate Q"}
                </span>
              </button>

              {isRating && (
                <div className="absolute bottom-10 right-0 bg-gray-800 border border-gray-600 p-4 rounded-xl shadow-2xl z-20 w-64 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-bold">Informationsgehalt?</span>
                    <span className={`font-mono font-bold ${sliderValue < 40 ? 'text-red-400' : sliderValue > 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {sliderValue}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <button
                    onClick={handleRateSubmit}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-1.5 rounded-lg text-sm transition-colors mt-2"
                  >
                    Bestätigen
                  </button>
                </div>
              )}
            </div>

            <button className="text-gray-500 hover:text-white transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function QRateApp() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState('feed');
  const [userAvgQScore, setUserAvgQScore] = useState(74); // User's own score

  // State
  const [minQScore, setMinQScore] = useState(40);
  const [dataCollectionEnabled, setDataCollectionEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Filter UI State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('entertainment');

  // Posting State
  const [postText, setPostText] = useState("");

  const displayedPosts = posts.filter(p => p.qScore >= minQScore);

  const handleRate = (id, newRating) => {
    setPosts(posts.map(post => {
      if (post.id !== id) return post;
      const newScore = Math.round(((post.qScore * post.ratingCount) + newRating) / (post.ratingCount + 1));
      return { ...post, qScore: newScore, ratingCount: post.ratingCount + 1 };
    }));
  };

  const handleVote = (id, type) => {
    setPosts(posts.map(post => {
      if (post.id !== id) return post;

      let scoreModifier = 0;
      if (type === 'like') scoreModifier = 0.5;
      if (type === 'dislike') scoreModifier = -1.5;

      const newQ = Math.max(0, Math.min(100, post.qScore + scoreModifier));
      const updates = {};
      updates.qScore = Math.round(newQ);
      if (type === 'like') updates.likes = post.likes + 1;
      if (type === 'dislike') updates.dislikes = post.dislikes + 1;

      return { ...post, ...updates };
    }));
  };

  const handlePostSubmit = () => {
    if (!postText.trim()) return;

    const newPost = {
      id: Date.now(),
      user: "Du",
      handle: "@current_user",
      avatar: "bg-indigo-500",
      content: postText,
      mediaType: null,
      qScore: userAvgQScore, // Inherits user's reputation initially
      uScore: 100, // Always relevant to self
      uScoreReason: "Dein eigener Beitrag",
      ratingCount: 0,
      likes: 0,
      dislikes: 0,
      comments: 0,
      isCurator: false,
      timestamp: "Gerade eben",
      category: "general"
    };

    setPosts([newPost, ...posts]);
    setPostText("");
  };

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setMinQScore(preset.minQ);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-emerald-500/30 flex justify-center">

      <div className="w-full max-w-7xl flex h-screen overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-20 xl:w-72 hidden sm:flex flex-col border-r border-gray-800 p-4">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <span className="font-black text-black text-2xl">Q</span>
            </div>
            <div className="hidden xl:block">
              <span className="text-2xl font-bold tracking-tighter block leading-none">Q-Rate</span>
              <span className="text-xs text-gray-500 tracking-widest">QUALITY FIRST</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2 space-y-1">
            {[
              { icon: <Menu />, label: "Feed", id: 'feed' },
              { icon: <Search />, label: "Entdecken", id: 'explore' },
              { icon: <Bell />, label: "Mitteilungen", id: 'notif' },
              { icon: <Hexagon />, label: "Q-Rator Hub", id: 'qrator' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id ? 'bg-gray-900 text-white font-bold translate-x-1' : 'text-gray-400 hover:bg-gray-900/50 hover:text-white'}`}
              >
                {React.cloneElement(item.icon, { size: 24 })}
                <span className="hidden xl:block text-lg">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl hidden xl:block border border-gray-700">
              <h3 className="font-bold text-white mb-1">Dein Status</h3>
              <div className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/30 w-max mb-3">Lvl 3 Q-Rator</div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 w-[75%] h-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <main className="flex-1 flex flex-col border-r border-gray-800 relative max-w-2xl w-full">

          {/* Collapsible Top Bar */}
          <div className="sticky top-0 bg-black/95 backdrop-blur-md z-10 border-b border-gray-800">
            {/* Header / Trigger */}
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <h2 className="text-xl font-bold">Home</h2>
                <span className="text-gray-500 text-sm">/</span>
                <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                  {FILTER_PRESETS.find(p => p.id === activePreset)?.label || 'Benutzerdefiniert'}
                  <span className="text-xs bg-emerald-500/10 px-1 rounded border border-emerald-500/20">Q {minQScore}+</span>
                </span>
                <button className="ml-1 w-6 h-6 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  {isFilterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Settings Toggle (Always Visible) */}
              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`p-2 rounded-full transition-colors ${isSettingsOpen ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <SettingsIcon size={20} />
                </button>

                {/* Settings Dropdown */}
                {isSettingsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <Shield size={12} />
                      <span>Einstellungen</span>
                    </div>
                    <div className={`rounded-lg p-3 border transition-colors duration-300 ${dataCollectionEnabled ? 'bg-gray-800/50 border-gray-700' : 'bg-red-900/10 border-red-900/30'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {dataCollectionEnabled ? <Database size={16} className="text-cyan-400" /> : <EyeOff size={16} className="text-red-400" />}
                          <span className="font-bold text-sm text-gray-200">U-Score / Daten</span>
                        </div>
                        <button
                          onClick={() => setDataCollectionEnabled(!dataCollectionEnabled)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${dataCollectionEnabled ? 'bg-cyan-600' : 'bg-gray-700'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${dataCollectionEnabled ? 'left-6' : 'left-1'}`}></div>
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        {dataCollectionEnabled
                          ? "Analyse deiner Vorlieben ist AKTIV. Dein Feed ist personalisiert."
                          : "Datensparmodus. Keine Analyse, kein U-Score."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Collapsible Content */}
            {isFilterOpen && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200 border-t border-gray-800/50 pt-2">
                <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                  {FILTER_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${activePreset === preset.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:border-gray-500'
                        }`}
                    >
                      {preset.icon}
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                  <div className={`flex flex-col items-center justify-center w-10 h-10 rounded bg-gray-800 border ${minQScore >= 70 ? 'border-emerald-500 text-emerald-400' : minQScore >= 40 ? 'border-yellow-500 text-yellow-400' : 'border-red-500 text-red-500'}`}>
                    <span className="text-sm font-bold">{minQScore}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Noise</span>
                      <span>Signal</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={minQScore}
                      onChange={(e) => {
                        setMinQScore(parseInt(e.target.value));
                        setActivePreset('custom');
                      }}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feed Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">

            {/* Post Input Area */}
            <div className="p-4 border-b border-gray-800 flex gap-4 bg-black/50">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center font-bold text-white text-sm">
                Du
              </div>
              <div className="flex-1">
                {/* User Status Badge inline */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Dein Status</span>
                  <div className="flex items-center gap-1 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                    <div className={`w-2 h-2 rounded-full ${userAvgQScore >= 70 ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
                    <span className={`text-xs font-mono font-bold ${userAvgQScore >= 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>Ø Q-Score: {userAvgQScore}</span>
                  </div>
                </div>

                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Teile Wissen, keine Gerüchte..."
                  className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder-gray-600 text-white resize-none h-20 p-0"
                />
                <div className="flex justify-between items-center mt-2 border-t border-gray-800/50 pt-2">
                  <div className="flex gap-2">
                    <button className="text-emerald-500 hover:bg-emerald-500/10 p-2 rounded-full transition-colors"><ImageIcon size={20} /></button>
                    <button className="text-emerald-500 hover:bg-emerald-500/10 p-2 rounded-full transition-colors"><PlayCircle size={20} /></button>
                  </div>
                  <button
                    onClick={handlePostSubmit}
                    disabled={!postText.trim()}
                    className={`flex items-center gap-2 px-5 py-1.5 rounded-full font-bold transition-all ${postText.trim()
                        ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <span>Posten</span>
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Posts List */}
            {displayedPosts.length > 0 ? (
              displayedPosts.map(post => (
                <Post
                  key={post.id}
                  post={post}
                  onRate={handleRate}
                  onVote={handleVote}
                  showUScore={dataCollectionEnabled}
                />
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <Filter size={32} className="text-gray-700 mb-4" />
                <p className="text-lg font-medium text-white">Filter zu streng?</p>
                <p className="text-sm max-w-xs mx-auto mt-2">Keine Posts mit Q-Score &gt; {minQScore} in dieser Kategorie.</p>
                <button
                  onClick={() => { setMinQScore(0); setActivePreset('all'); }}
                  className="mt-6 text-emerald-400 text-sm hover:underline"
                >
                  Alles anzeigen
                </button>
              </div>
            )}

            {/* End of Feed */}
            {displayedPosts.length > 0 && (
              <div className="p-8 text-center border-t border-gray-800 pb-20">
                <p className="text-emerald-500 font-medium text-sm tracking-widest uppercase">End of Signal</p>
                <p className="text-gray-600 text-xs mt-2">Du hast alle relevanten Inhalte gesehen.</p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="w-80 hidden lg:block p-6 space-y-6">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 shadow-xl">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Info className="text-emerald-400" size={20} />
              Legende
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">Q</div>
                <div>
                  <p className="font-bold text-white text-sm">Quality Score</p>
                  <p className="text-xs text-gray-400">Objektive Qualität.</p>
                </div>
              </div>

              <div className={`flex items-start gap-3 transition-all duration-300 ${!dataCollectionEnabled ? 'opacity-30 grayscale' : ''}`}>
                <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">U</div>
                <div>
                  <p className="font-bold text-white text-sm">User Score</p>
                  <p className="text-xs text-gray-400">
                    {dataCollectionEnabled ? "Individuelle Relevanz für dich." : "Deaktiviert durch Datenschutzeinstellungen."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 px-1">Top Q-Rated 🔥</h3>
            <div className="space-y-3">
              {[
                { tag: "#SpaceFacts", score: 98, title: "Jupiter Mission" },
                { tag: "#KlimaGipfel", score: 92, title: "Neue Beschlüsse" },
              ].map((trend, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                  <div>
                    <div className="text-xs text-emerald-400 font-mono mb-1">{trend.tag}</div>
                    <div className="font-bold text-white text-sm">{trend.title}</div>
                  </div>
                  <div className="text-emerald-400 text-xs font-black border border-emerald-500/30 w-8 h-8 flex items-center justify-center rounded bg-emerald-500/10">
                    {trend.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
