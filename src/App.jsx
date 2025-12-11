import React, { useState, useMemo } from 'react';
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
  Settings as SettingsIcon,
  Copy,
  Check,
  Link,
  Repeat2,
  Heart,
  AtSign,
  UserPlus,
  Award,
  Star,
  Target,
  Zap,
  Trophy,
  BarChart3,
  Users,
  FileText,
  Clock
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
    commentsList: [
      { id: 1, user: "SpaceNerd42", handle: "@spacenerd", avatar: "bg-indigo-500", content: "Wahnsinn! Die Größe ist kaum vorstellbar 🤯", timestamp: "1h", likes: 234 },
      { id: 2, user: "PhysikProf", handle: "@prof_physik", avatar: "bg-amber-600", content: "Der Sturm wird tatsächlich kleiner - Ende des Jahrhunderts könnte er verschwunden sein.", timestamp: "45m", likes: 89 },
      { id: 3, user: "AstroFan", handle: "@astro_fan", avatar: "bg-pink-500", content: "Kann man sowas auch auf der Erde haben?", timestamp: "30m", likes: 12 }
    ],
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
    commentsList: [
      { id: 1, user: "KlimaAktiv", handle: "@klima_aktiv", avatar: "bg-green-600", content: "Endlich ein Schritt in die richtige Richtung!", timestamp: "3h", likes: 456 },
      { id: 2, user: "Skeptiker99", handle: "@skeptiker", avatar: "bg-gray-600", content: "Die Umsetzung wird spannend.", timestamp: "2h", likes: 78 }
    ],
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
    uScore: 10,
    uScoreReason: "Wenige Übereinstimmungen mit deinem Profil",
    ratingCount: 45,
    likes: 12,
    dislikes: 85,
    commentsList: [
      { id: 1, user: "KaffeeKenner", handle: "@kaffeeguru", avatar: "bg-amber-800", content: "Vielleicht neue Bohnen?", timestamp: "8m", likes: 2 }
    ],
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
    commentsList: [
      { id: 1, user: "VRGamer", handle: "@vr_gamer", avatar: "bg-violet-500", content: "Welches Modell genau? Überlege auch gerade zu kaufen.", timestamp: "45m", likes: 34 },
      { id: 2, user: "TechFan2024", handle: "@techfan", avatar: "bg-cyan-500", content: "Danke für den ehrlichen Test! 👍", timestamp: "30m", likes: 56 }
    ],
    isCurator: true,
    timestamp: "1h",
    category: "tech"
  },
  {
    id: 5,
    user: "Dr. Wellness",
    handle: "@dr_wellness",
    avatar: "bg-teal-500",
    content: "Studie aus Harvard zeigt: Schon 20 Minuten Spaziergang täglich senkt das Risiko für Herzkrankheiten um 31%. Kleine Gewohnheiten, große Wirkung! 🏃‍♀️💚",
    mediaType: "image",
    mediaContent: "walking-health",
    qScore: 85,
    uScore: 72,
    uScoreReason: "Basierend auf deinen Gesundheits-Interessen",
    ratingCount: 520,
    likes: 1850,
    dislikes: 23,
    commentsList: [
      { id: 1, user: "FitnessMom", handle: "@fitness_mom", avatar: "bg-pink-500", content: "Mache seit 3 Monaten täglich 30min - fühle mich so viel besser!", timestamp: "2h", likes: 145 },
      { id: 2, user: "MedStudent", handle: "@med_student", avatar: "bg-blue-600", content: "Die Quelle zur Studie wäre super! Klingt sehr interessant.", timestamp: "1h", likes: 67 }
    ],
    isCurator: true,
    timestamp: "3h",
    category: "education"
  },
  {
    id: 6,
    user: "HistoryGeek",
    handle: "@history_buff",
    avatar: "bg-amber-700",
    content: "Heute vor 80 Jahren: Die erste programmierbare elektronische Rechenmaschine 'Colossus' wurde in Bletchley Park in Betrieb genommen. Der Grundstein für das digitale Zeitalter! 🖥️📜",
    mediaType: "image",
    mediaContent: "colossus-computer",
    qScore: 94,
    uScore: 65,
    uScoreReason: "Trending in #Geschichte",
    ratingCount: 780,
    likes: 2340,
    dislikes: 8,
    commentsList: [
      { id: 1, user: "CompScience", handle: "@comp_sci", avatar: "bg-indigo-600", content: "Alan Turings Beitrag war revolutionär!", timestamp: "4h", likes: 234 },
      { id: 2, user: "RetroTech", handle: "@retro_tech", avatar: "bg-orange-600", content: "Von Colossus zum Smartphone - was für eine Reise!", timestamp: "3h", likes: 189 }
    ],
    isCurator: true,
    timestamp: "5h",
    category: "education"
  },
  {
    id: 7,
    user: "KochKunst",
    handle: "@kochkunst_de",
    avatar: "bg-orange-500",
    content: "Geheimtipp für perfekte Pasta: Das Kochwasser sollte so salzig wie das Mittelmeer sein! 🍝 Etwa 10g Salz pro Liter. Der Geschmacksunterschied ist enorm.",
    mediaType: "video",
    mediaContent: "pasta-cooking",
    qScore: 71,
    uScore: 58,
    uScoreReason: "Ähnlich zu deinen Food-Interaktionen",
    ratingCount: 290,
    likes: 980,
    dislikes: 45,
    commentsList: [
      { id: 1, user: "ItalienFan", handle: "@italia_fan", avatar: "bg-green-600", content: "Meine Nonna macht das schon immer so! 🇮🇹", timestamp: "1h", likes: 89 },
      { id: 2, user: "HomeCook", handle: "@home_cook", avatar: "bg-red-500", content: "Hab's ausprobiert - Gamechanger!", timestamp: "45m", likes: 34 }
    ],
    isCurator: false,
    timestamp: "6h",
    category: "entertainment"
  },
  {
    id: 8,
    user: "BioForschung",
    handle: "@bio_research",
    avatar: "bg-lime-600",
    content: "Durchbruch in der Stammzellenforschung: Forscher aus Kyoto haben eine neue Methode entwickelt, die das Risiko von Tumorbildung bei der Therapie drastisch reduziert. Peer-reviewed in Nature. 🔬",
    mediaType: null,
    qScore: 96,
    uScore: 41,
    uScoreReason: "Top Q-Score in #Wissenschaft",
    ratingCount: 1120,
    likes: 4200,
    dislikes: 15,
    commentsList: [
      { id: 1, user: "Dr.BioTech", handle: "@dr_biotech", avatar: "bg-emerald-600", content: "Das könnte die Transplantationsmedizin revolutionieren!", timestamp: "30m", likes: 567 },
      { id: 2, user: "Pharma_Inside", handle: "@pharma_insider", avatar: "bg-blue-500", content: "Bin gespannt auf die klinischen Trials.", timestamp: "20m", likes: 234 },
      { id: 3, user: "MediNews", handle: "@medi_news", avatar: "bg-red-600", content: "Hier der Link zur Originalstudie: doi.org/...", timestamp: "15m", likes: 445 }
    ],
    isCurator: true,
    timestamp: "1h",
    category: "education"
  },
  {
    id: 9,
    user: "LokalNews Berlin",
    handle: "@lokal_berlin",
    avatar: "bg-yellow-500",
    content: "🚇 BVG Update: U2 zwischen Gleisdreieck und Potsdamer Platz ab morgen für 3 Wochen gesperrt. Ersatzbusse fahren im 5-Minuten-Takt. Alle Infos hier:",
    mediaType: null,
    qScore: 67,
    uScore: 92,
    uScoreReason: "Du bist in Berlin",
    ratingCount: 180,
    likes: 340,
    dislikes: 12,
    commentsList: [
      { id: 1, user: "BerlinPendler", handle: "@pendler_berlin", avatar: "bg-gray-500", content: "Nicht schon wieder 😩", timestamp: "10m", likes: 78 },
      { id: 2, user: "U2Fan", handle: "@u2_nutzer", avatar: "bg-yellow-600", content: "Wenigstens fahren diesmal Ersatzbusse!", timestamp: "5m", likes: 23 }
    ],
    isCurator: false,
    timestamp: "30m",
    category: "news"
  },
  {
    id: 10,
    user: "MusicVibes",
    handle: "@music_vibes",
    avatar: "bg-fuchsia-500",
    content: "Unpopular Opinion: Vinyl-Platten klingen nicht 'wärmer' - der Unterschied ist psychoakustisch. Aber das Ritual des Auflegens macht einfach Spaß! 🎵💿",
    mediaType: "image",
    mediaContent: "vinyl-setup",
    qScore: 54,
    uScore: 78,
    uScoreReason: "Du interagierst mit Musik-Content",
    ratingCount: 420,
    likes: 1200,
    dislikes: 380,
    commentsList: [
      { id: 1, user: "VinylCollector", handle: "@vinyl_collector", avatar: "bg-purple-600", content: "Finally, jemand sagt es! Es geht ums Erlebnis.", timestamp: "2h", likes: 156 },
      { id: 2, user: "AudioPhile", handle: "@audio_phil", avatar: "bg-gray-700", content: "Kommt auf die Anlage an - da gibt es schon Unterschiede.", timestamp: "1h", likes: 89 },
      { id: 3, user: "RetroMusic", handle: "@retro_musik", avatar: "bg-pink-600", content: "Die Cover-Art allein ist es wert! 🎨", timestamp: "45m", likes: 67 }
    ],
    isCurator: false,
    timestamp: "4h",
    category: "entertainment"
  }
];

// --- Filter Presets Configuration ---
const FILTER_PRESETS = [
  { id: 'all', label: 'Alle', icon: <Filter size={14} />, minQ: 0 },
  { id: 'entertainment', label: 'Unterhaltung', icon: <PartyPopper size={14} />, minQ: 40 },
  { id: 'education', label: 'Lehrreich', icon: <BookOpen size={14} />, minQ: 70 },
  { id: 'sourced', label: 'Belegt & Seriös', icon: <Scale size={14} />, minQ: 85 },
];

// --- Mock Notifications ---
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'like',
    user: 'SpaceNerd42',
    avatar: 'bg-indigo-500',
    content: 'hat deinen Post geliked',
    postPreview: 'Der Jupiter-Sturm ist wirklich faszinierend...',
    timestamp: '5m',
    isRead: false
  },
  {
    id: 2,
    type: 'comment',
    user: 'PhysikProf',
    avatar: 'bg-amber-600',
    content: 'hat kommentiert:',
    commentText: 'Tolle Erklärung! Hast du Quellen dazu?',
    timestamp: '15m',
    isRead: false
  },
  {
    id: 3,
    type: 'follow',
    user: 'TechReviewer',
    avatar: 'bg-purple-600',
    content: 'folgt dir jetzt',
    timestamp: '1h',
    isRead: false
  },
  {
    id: 4,
    type: 'mention',
    user: 'KlimaAktiv',
    avatar: 'bg-green-600',
    content: 'hat dich erwähnt:',
    mentionText: '@current_user hat eine interessante Perspektive dazu...',
    timestamp: '2h',
    isRead: true
  },
  {
    id: 5,
    type: 'like',
    user: 'VinylCollector',
    avatar: 'bg-purple-600',
    content: 'hat deinen Post geliked',
    postPreview: 'Musik ist mehr als nur Sound...',
    timestamp: '3h',
    isRead: true
  },
  {
    id: 6,
    type: 'comment',
    user: 'MedStudent',
    avatar: 'bg-blue-600',
    content: 'hat kommentiert:',
    commentText: 'Sehr informativ, danke fürs Teilen!',
    timestamp: '4h',
    isRead: true
  },
  {
    id: 7,
    type: 'achievement',
    user: 'Q-Rate System',
    avatar: 'bg-emerald-500',
    content: 'Neues Achievement freigeschaltet:',
    achievementName: 'Wissensträger',
    achievementDesc: '10 Posts mit Q-Score > 80',
    timestamp: '1d',
    isRead: true
  },
  {
    id: 8,
    type: 'follow',
    user: 'BioForschung',
    avatar: 'bg-lime-600',
    content: 'folgt dir jetzt',
    timestamp: '1d',
    isRead: true
  }
];

// --- Trending Topics ---
const TRENDING_TOPICS = [
  { tag: '#KlimaGipfel2024', posts: 12400, qAvg: 87, category: 'news' },
  { tag: '#SpaceFacts', posts: 8900, qAvg: 92, category: 'education' },
  { tag: '#TechReview', posts: 6200, qAvg: 78, category: 'tech' },
  { tag: '#Wissenschaft', posts: 15600, qAvg: 89, category: 'education' },
  { tag: '#Gesundheit', posts: 4800, qAvg: 81, category: 'education' },
  { tag: '#Gaming', posts: 22000, qAvg: 52, category: 'entertainment' }
];

// --- Explore Categories ---
const EXPLORE_CATEGORIES = [
  { id: 'all', label: 'Alle', icon: <Filter size={14} /> },
  { id: 'education', label: 'Bildung', icon: <BookOpen size={14} /> },
  { id: 'tech', label: 'Tech', icon: <Zap size={14} /> },
  { id: 'news', label: 'News', icon: <FileText size={14} /> },
  { id: 'entertainment', label: 'Unterhaltung', icon: <PartyPopper size={14} /> }
];

// --- User Profile Data ---
const USER_PROFILE = {
  name: 'Max Mustermann',
  handle: '@current_user',
  avatar: 'bg-indigo-500',
  bio: 'Wissenschafts-Enthusiast | Tech-Lover | Immer neugierig 🔬✨',
  level: 3,
  levelName: 'Q-Rator',
  xp: 2450,
  xpToNext: 3000,
  joinedDate: 'März 2024',
  stats: {
    posts: 47,
    followers: 284,
    following: 156,
    avgQScore: 74
  },
  achievements: [
    { id: 1, name: 'Erste Schritte', desc: 'Erster Post veröffentlicht', icon: '🚀', unlocked: true },
    { id: 2, name: 'Qualitätsbewusst', desc: '10 Posts mit Q-Score > 70', icon: '⭐', unlocked: true },
    { id: 3, name: 'Wissensträger', desc: '10 Posts mit Q-Score > 80', icon: '📚', unlocked: true },
    { id: 4, name: 'Community Leader', desc: '100 Follower erreicht', icon: '👥', unlocked: true },
    { id: 5, name: 'Fact Checker', desc: '50 Posts bewertet', icon: '✅', unlocked: true },
    { id: 6, name: 'Elite Q-Rator', desc: 'Level 5 erreicht', icon: '💎', unlocked: false },
    { id: 7, name: 'Influencer', desc: '1000 Follower erreicht', icon: '🌟', unlocked: false },
    { id: 8, name: 'Perfectionist', desc: 'Post mit Q-Score 100', icon: '🏆', unlocked: false }
  ]
};

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

const Post = ({ post, onRate, onVote, onAddComment, showUScore }) => {
  const [isRating, setIsRating] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [hasRated, setHasRated] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);

  // Comments State
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.commentsList || []);

  // Share State
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: "Du",
      handle: "@current_user",
      avatar: "bg-indigo-500",
      content: commentText,
      timestamp: "Gerade eben",
      likes: 0
    };

    setComments([...comments, newComment]);
    setCommentText("");
    if (onAddComment) onAddComment(post.id, newComment);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://q-rate.app/post/${post.id}`);
      setCopiedLink(true);
      setTimeout(() => {
        setCopiedLink(false);
        setShowShareMenu(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy link:', err);
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

            {/* Comments Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 transition-colors ${showComments ? 'text-blue-400' : 'text-gray-500 hover:text-blue-400'}`}
            >
              <MessageCircle size={18} fill={showComments ? "currentColor" : "none"} />
              <span className="text-sm">{comments.length}</span>
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

            {/* Share Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className={`text-gray-500 hover:text-white transition-colors p-1.5 rounded-full ${showShareMenu ? 'bg-gray-800 text-white' : ''}`}
              >
                <Share2 size={18} />
              </button>

              {showShareMenu && (
                <div className="absolute bottom-10 right-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-20 w-52 animate-in fade-in zoom-in duration-200 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-700">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Teilen</span>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700/50 transition-colors text-left"
                  >
                    {copiedLink ? (
                      <>
                        <Check size={18} className="text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Link kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Link size={18} className="text-gray-400" />
                        <span className="text-gray-200">Link kopieren</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowShareMenu(false);
                      // Future: Open repost modal
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <Repeat2 size={18} className="text-gray-400" />
                    <span className="text-gray-200">Auf Q-Rate teilen</span>
                  </button>

                  <button
                    onClick={() => setShowShareMenu(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700/50 transition-colors text-left border-t border-gray-700"
                  >
                    <Copy size={18} className="text-gray-400" />
                    <span className="text-gray-200">Post kopieren</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-800 animate-in slide-in-from-top-2 duration-300">
              {/* Comment Input */}
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-xs font-bold">Du</div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Kommentar schreiben..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${commentText.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-400'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">Noch keine Kommentare. Sei der Erste!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 ${comment.avatar}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-white text-sm">{comment.user}</span>
                          <span className="text-gray-500 text-xs">{comment.handle}</span>
                          <span className="text-gray-600 text-xs">· {comment.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                        <div className="flex items-center gap-4 mt-1.5">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-green-400 transition-colors text-xs">
                            <ThumbsUp size={12} />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-gray-500 hover:text-blue-400 transition-colors text-xs">
                            Antworten
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Explore Tab Component ---
const ExploreTab = ({ posts, onRate, onVote, onAddComment, dataCollectionEnabled }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === '' ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.handle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {/* Search Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-10 p-4 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Suche nach Posts, Nutzern oder Themen..."
            className="w-full bg-gray-900 border border-gray-700 rounded-full pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {EXPLORE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${selectedCategory === cat.id
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:border-gray-500'
                }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      {searchQuery === '' && (
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={20} />
            Trending Topics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRENDING_TOPICS.map((topic, i) => (
              <button
                key={i}
                onClick={() => setSearchQuery(topic.tag)}
                className="flex items-center justify-between p-3 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors text-left group"
              >
                <div>
                  <div className="text-emerald-400 font-mono text-sm mb-1">{topic.tag}</div>
                  <div className="text-gray-500 text-xs">{topic.posts.toLocaleString()} Posts</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-xs font-bold px-2 py-1 rounded border ${topic.qAvg >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                    topic.qAvg >= 60 ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                      'text-red-400 border-red-500/30 bg-red-500/10'
                    }`}>
                    Ø {topic.qAvg}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-800">
          <span className="text-gray-400 text-sm">
            {filteredPosts.length} Ergebnis{filteredPosts.length !== 1 ? 'se' : ''} für "{searchQuery}"
          </span>
        </div>
      )}

      {/* Posts */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <Post
            key={post.id}
            post={post}
            onRate={onRate}
            onVote={onVote}
            onAddComment={onAddComment}
            showUScore={dataCollectionEnabled}
          />
        ))
      ) : (
        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
          <Search size={32} className="text-gray-700 mb-4" />
          <p className="text-lg font-medium text-white">Keine Ergebnisse</p>
          <p className="text-sm max-w-xs mx-auto mt-2">
            Keine Posts gefunden für "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
};

// --- Notifications Tab Component ---
const NotificationsTab = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.isRead);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={16} className="text-pink-500" />;
      case 'comment': return <MessageCircle size={16} className="text-blue-400" />;
      case 'follow': return <UserPlus size={16} className="text-purple-400" />;
      case 'mention': return <AtSign size={16} className="text-cyan-400" />;
      case 'achievement': return <Award size={16} className="text-yellow-400" />;
      default: return <Bell size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-10 border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-white">Mitteilungen</h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-emerald-400 text-sm hover:underline"
            >
              Alle als gelesen markieren
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 px-4 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${filter === 'all'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-white'
              }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${filter === 'unread'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-white'
              }`}
          >
            Ungelesen
            {unreadCount > 0 && (
              <span className="bg-emerald-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-800">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 flex gap-4 hover:bg-gray-900/50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-emerald-500/5' : ''
                }`}
            >
              {/* Avatar with type indicator */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-full ${notif.avatar} flex items-center justify-center text-white font-bold`}>
                  {notif.user.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-800">
                  {getNotificationIcon(notif.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-white">{notif.user}</span>
                    <span className="text-gray-400 ml-2">{notif.content}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm whitespace-nowrap">{notif.timestamp}</span>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Additional content based on type */}
                {notif.type === 'comment' && notif.commentText && (
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">"{notif.commentText}"</p>
                )}
                {notif.type === 'like' && notif.postPreview && (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-1">{notif.postPreview}</p>
                )}
                {notif.type === 'mention' && notif.mentionText && (
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">"{notif.mentionText}"</p>
                )}
                {notif.type === 'achievement' && (
                  <div className="mt-2 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                    <span className="text-2xl">{notif.achievementName === 'Wissensträger' ? '📚' : '🏆'}</span>
                    <div>
                      <div className="text-yellow-400 font-bold text-sm">{notif.achievementName}</div>
                      <div className="text-gray-400 text-xs">{notif.achievementDesc}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Bell size={32} className="text-gray-700 mb-4" />
            <p className="text-lg font-medium text-white">Keine Mitteilungen</p>
            <p className="text-sm max-w-xs mx-auto mt-2">
              {filter === 'unread' ? 'Du hast alle Mitteilungen gelesen!' : 'Deine Mitteilungen erscheinen hier'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Q-Rator Hub Tab Component ---
const QRatorHubTab = ({ posts, onRate, onVote, onAddComment, dataCollectionEnabled }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const userPosts = posts.filter(p => p.handle === '@current_user');

  const progressPercentage = (USER_PROFILE.xp / USER_PROFILE.xpToNext) * 100;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/20 p-6 border-b border-gray-800">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-20 h-20 rounded-2xl ${USER_PROFILE.avatar} flex items-center justify-center text-3xl font-bold text-white shadow-xl`}>
            {USER_PROFILE.name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-white">{USER_PROFILE.name}</h2>
              <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 text-xs font-bold">
                <Hexagon size={12} fill="currentColor" />
                Lvl {USER_PROFILE.level} {USER_PROFILE.levelName}
              </div>
            </div>
            <p className="text-gray-500">{USER_PROFILE.handle}</p>
            <p className="text-gray-300 mt-2">{USER_PROFILE.bio}</p>

            {/* Level Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Level {USER_PROFILE.level}</span>
                <span>{USER_PROFILE.xp.toLocaleString()} / {USER_PROFILE.xpToNext.toLocaleString()} XP</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Posts', value: USER_PROFILE.stats.posts, icon: <FileText size={18} /> },
            { label: 'Follower', value: USER_PROFILE.stats.followers, icon: <Users size={18} /> },
            { label: 'Following', value: USER_PROFILE.stats.following, icon: <UserCheck size={18} /> },
            { label: 'Ø Q-Score', value: USER_PROFILE.stats.avgQScore, icon: <BarChart3 size={18} /> }
          ].map((stat, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-center">
              <div className="flex justify-center text-gray-400 mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-gray-800 bg-black/50 sticky top-0 z-10">
        {[
          { id: 'overview', label: 'Übersicht', icon: <Target size={16} /> },
          { id: 'achievements', label: 'Achievements', icon: <Trophy size={16} /> },
          { id: 'posts', label: 'Meine Posts', icon: <FileText size={16} /> }
        ].map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-all ${activeSection === section.id
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-900/50'
              }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeSection === 'overview' && (
        <div className="p-4 space-y-4">
          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 p-4 rounded-xl border border-emerald-500/20">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Star className="text-yellow-400" size={18} />
              Q-Rator Status
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Dein Rating-Einfluss</p>
                <p className="text-emerald-400 text-lg font-bold">1.5x</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Posts bewertet</p>
                <p className="text-white text-lg font-bold">127</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Accuracy Score</p>
                <p className="text-cyan-400 text-lg font-bold">92%</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Community Rank</p>
                <p className="text-yellow-400 text-lg font-bold">#847</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Clock className="text-gray-400" size={18} />
              Aktivität diese Woche
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Posts erstellt</span>
                <span className="text-white font-bold">3</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Ratings abgegeben</span>
                <span className="text-white font-bold">24</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400">Kommentare</span>
                <span className="text-white font-bold">12</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'achievements' && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {USER_PROFILE.achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border transition-all ${achievement.unlocked
                  ? 'bg-gray-900 border-gray-700 hover:border-gray-600'
                  : 'bg-gray-900/50 border-gray-800 opacity-50'
                  }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className={`font-bold text-sm ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                  {achievement.name}
                </div>
                <div className="text-gray-500 text-xs mt-1">{achievement.desc}</div>
                {achievement.unlocked && (
                  <div className="mt-2">
                    <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                      <Check size={12} /> Freigeschaltet
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'posts' && (
        <div>
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <Post
                key={post.id}
                post={post}
                onRate={onRate}
                onVote={onVote}
                onAddComment={onAddComment}
                showUScore={dataCollectionEnabled}
              />
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <FileText size={32} className="text-gray-700 mb-4" />
              <p className="text-lg font-medium text-white">Noch keine Posts</p>
              <p className="text-sm max-w-xs mx-auto mt-2">
                Deine Posts erscheinen hier. Teile dein Wissen mit der Community!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function QRateApp() {
  // Mock-based state (no auth)
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState('feed');
  const [userAvgQScore, setUserAvgQScore] = useState(74);

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
      qScore: userAvgQScore,
      uScore: 100,
      uScoreReason: "Dein eigener Beitrag",
      ratingCount: 0,
      likes: 0,
      dislikes: 0,
      commentsList: [],
      isCurator: false,
      timestamp: "Gerade eben",
      category: "general"
    };

    setPosts([newPost, ...posts]);
    setPostText("");
  };

  const handleAddComment = (postId, comment) => {
    setPosts(posts.map(p =>
      p.id === postId
        ? { ...p, commentsList: [...(p.commentsList || []), comment] }
        : p
    ));
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
        </div >

        {/* Main Feed */}
        < main className="flex-1 flex flex-col border-r border-gray-800 relative max-w-2xl w-full" >

          {/* Feed Tab Content */}
          {activeTab === 'feed' && (
            <>
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
                      onAddComment={(postId, comment) => {
                        setPosts(posts.map(p =>
                          p.id === postId
                            ? { ...p, commentsList: [...(p.commentsList || []), comment] }
                            : p
                        ));
                      }}
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
            </>
          )}

          {/* Explore Tab */}
          {activeTab === 'explore' && (
            <ExploreTab
              posts={posts}
              onRate={handleRate}
              onVote={handleVote}
              onAddComment={(postId, comment) => {
                setPosts(posts.map(p =>
                  p.id === postId
                    ? { ...p, commentsList: [...(p.commentsList || []), comment] }
                    : p
                ));
              }}
              dataCollectionEnabled={dataCollectionEnabled}
            />
          )}

          {/* Notifications Tab */}
          {activeTab === 'notif' && (
            <NotificationsTab />
          )}

          {/* Q-Rator Hub Tab */}
          {activeTab === 'qrator' && (
            <QRatorHubTab
              posts={posts}
              onRate={handleRate}
              onVote={handleVote}
              onAddComment={(postId, comment) => {
                setPosts(posts.map(p =>
                  p.id === postId
                    ? { ...p, commentsList: [...(p.commentsList || []), comment] }
                    : p
                ));
              }}
              dataCollectionEnabled={dataCollectionEnabled}
            />
          )}

        </main>

        {/* Right Sidebar */}
        < div className="w-80 hidden lg:block p-6 space-y-6" >
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
