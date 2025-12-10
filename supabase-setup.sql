-- =====================================================
-- Q-RATE DATABASE SETUP
-- Führe dieses Script im Supabase SQL Editor aus
-- =====================================================

-- 1. User Profiles Tabelle (verknüpft mit Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  avatar TEXT DEFAULT 'bg-gray-500',
  is_curator BOOLEAN DEFAULT false,
  q_score INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Reactions Tabelle (User Votes auf Posts)
CREATE TABLE IF NOT EXISTS reactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 3. Posts Tabelle: user_id Spalte hinzufügen
ALTER TABLE posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Reactions RLS
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reactions viewable by all" ON reactions;
CREATE POLICY "Reactions viewable by all" ON reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own reactions" ON reactions;
CREATE POLICY "Users can insert own reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reactions" ON reactions;
CREATE POLICY "Users can update own reactions" ON reactions FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reactions" ON reactions;
CREATE POLICY "Users can delete own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- SAMPLE DATA - Posts
-- =====================================================

INSERT INTO posts (user_name, handle, avatar, content, q_score, is_curator, category, upvotes, downvotes, media_type, media_content) VALUES
('AstroAlex', '@astro_alex', 'bg-blue-600', 'Der "Große Rote Fleck" auf dem Jupiter ist ein Sturm, der seit 350 Jahren tobt. Hier ein Größenvergleich zur Erde. Faszinierend, wie dynamisch unser Sonnensystem ist. 🪐', 92, true, 'education', 3500, 45, 'image', 'jupiter-storm'),
('NewsFlash DE', '@newsflash_de', 'bg-red-600', 'Klimakonferenz Update: Fonds für Entwicklungsländer genehmigt, aber Kohleausstieg bleibt strittig. Hier die Zusammenfassung im Video.', 88, false, 'news', 2100, 120, 'video', 'climate-conf'),
('TechReviewer', '@tech_pro', 'bg-purple-600', 'Neue VR-Brille im Härtetest. Display-Auflösung ist top, aber der Tragekomfort lässt nach 30min nach.', 85, true, 'tech', 1800, 30, 'image', 'vr-test'),
('Dr. Wellness', '@dr_wellness', 'bg-teal-500', 'Studie zeigt: 20 Min Spaziergang täglich reduziert Stress um 30%. Kleine Schritte, große Wirkung! 🚶‍♂️', 78, true, 'education', 2500, 15, NULL, NULL),
('HistoryGeek', '@history_buff', 'bg-amber-700', 'Heute vor 80 Jahren: Der erste Computer „Colossus" wird in Betrieb genommen. Er half, den Enigma-Code zu knacken. 🖥️', 91, true, 'education', 3200, 22, NULL, NULL),
('KochKunst', '@kochkunst_de', 'bg-orange-500', '🍳 Profi-Tipp: Eier bei niedriger Hitze braten und am Ende einen Deckel drauflegen. Ergebnis: perfekt cremige Spiegeleier!', 65, false, 'entertainment', 890, 45, 'image', 'perfect-eggs'),
('BioForschung', '@bio_research', 'bg-lime-600', 'Durchbruch in der Stammzellenforschung: Neue Methode reduziert Risiko von Tumorbildung bei der Therapie drastisch. Peer-reviewed in Nature. 🔬', 96, true, 'education', 4200, 15, NULL, NULL),
('LokalNews Berlin', '@lokal_berlin', 'bg-yellow-500', '🚇 BVG Update: U2 zwischen Gleisdreieck und Potsdamer Platz ab morgen für 3 Wochen gesperrt. Ersatzbusse fahren im 5-Minuten-Takt.', 67, false, 'news', 340, 12, NULL, NULL),
('MusicVibes', '@music_vibes', 'bg-fuchsia-500', 'Unpopular Opinion: Vinyl-Platten klingen nicht "wärmer" - der Unterschied ist psychoakustisch. Aber das Ritual des Auflegens macht einfach Spaß! 🎵💿', 54, false, 'entertainment', 1200, 380, 'image', 'vinyl-setup'),
('ChillDude22', '@chiller', 'bg-green-500', 'Boah Leute, mein Kaffee schmeckt heute irgendwie anders. Keine Ahnung warum lol. ☕️', 12, false, 'entertainment', 12, 85, NULL, NULL);

-- =====================================================
-- SAMPLE DATA - Comments
-- =====================================================

-- Hole die Post-IDs dynamisch (da sie auto-generiert werden)
DO $$
DECLARE
  post1_id BIGINT;
  post2_id BIGINT;
  post3_id BIGINT;
  post4_id BIGINT;
  post5_id BIGINT;
  post7_id BIGINT;
  post8_id BIGINT;
  post9_id BIGINT;
BEGIN
  SELECT id INTO post1_id FROM posts WHERE handle = '@astro_alex' LIMIT 1;
  SELECT id INTO post2_id FROM posts WHERE handle = '@newsflash_de' LIMIT 1;
  SELECT id INTO post3_id FROM posts WHERE handle = '@tech_pro' LIMIT 1;
  SELECT id INTO post4_id FROM posts WHERE handle = '@dr_wellness' LIMIT 1;
  SELECT id INTO post5_id FROM posts WHERE handle = '@history_buff' LIMIT 1;
  SELECT id INTO post7_id FROM posts WHERE handle = '@bio_research' LIMIT 1;
  SELECT id INTO post8_id FROM posts WHERE handle = '@lokal_berlin' LIMIT 1;
  SELECT id INTO post9_id FROM posts WHERE handle = '@music_vibes' LIMIT 1;

  -- Comments für Post 1 (AstroAlex)
  INSERT INTO comments (post_id, user_name, handle, avatar, content, likes) VALUES
  (post1_id, 'SpaceNerd42', '@spacenerd', 'bg-indigo-500', 'Wahnsinn! Die Größe ist kaum vorstellbar 🤯', 234),
  (post1_id, 'PhysikProf', '@prof_physik', 'bg-amber-600', 'Der Sturm wird tatsächlich kleiner - Ende des Jahrhunderts könnte er verschwunden sein.', 89),
  (post1_id, 'AstroFan', '@astro_fan', 'bg-pink-500', 'Kann man sowas auch auf der Erde haben?', 12);

  -- Comments für Post 2 (NewsFlash)
  INSERT INTO comments (post_id, user_name, handle, avatar, content, likes) VALUES
  (post2_id, 'KlimaAktiv', '@klima_aktiv', 'bg-green-600', 'Endlich ein Schritt in die richtige Richtung!', 456),
  (post2_id, 'Skeptiker99', '@skeptiker', 'bg-gray-600', 'Die Umsetzung wird spannend.', 78);

  -- Comments für Post 3 (TechReviewer)
  INSERT INTO comments (post_id, user_name, handle, avatar, content, likes) VALUES
  (post3_id, 'VREnthusiast', '@vr_fan', 'bg-blue-500', 'Welches Modell ist das? Interessiert mich!', 67),
  (post3_id, 'TechFan2024', '@techfan', 'bg-cyan-500', 'Danke für den ehrlichen Test! 👍', 56);

  -- Comments für Post 5 (HistoryGeek)
  INSERT INTO comments (post_id, user_name, handle, avatar, content, likes) VALUES
  (post5_id, 'CryptoHistorian', '@crypto_hist', 'bg-slate-600', 'Fun Fact: Colossus war streng geheim und wurde erst in den 70ern öffentlich bekannt!', 234),
  (post5_id, 'RetroTech', '@retro_tech', 'bg-orange-600', 'Von Colossus zum Smartphone - was für eine Reise!', 189);

  -- Comments für Post 7 (BioForschung)
  INSERT INTO comments (post_id, user_name, handle, avatar, content, likes) VALUES
  (post7_id, 'Dr.BioTech', '@dr_biotech', 'bg-emerald-600', 'Das könnte die Transplantationsmedizin revolutionieren!', 567),
  (post7_id, 'Pharma_Inside', '@pharma_insider', 'bg-blue-500', 'Bin gespannt auf die klinischen Trials.', 234),
  (post7_id, 'MediNews', '@medi_news', 'bg-red-600', 'Hier der Link zur Originalstudie: doi.org/...', 445);

  -- Comments für Post 8 (LokalNews Berlin)
  INSERT INTO comments (post_id, user_name, handle, avatar, content, likes) VALUES
  (post8_id, 'BerlinPendler', '@pendler_berlin', 'bg-gray-500', 'Nicht schon wieder 😩', 78),
  (post8_id, 'U2Fan', '@u2_nutzer', 'bg-yellow-600', 'Wenigstens fahren diesmal Ersatzbusse!', 23);

  -- Comments für Post 9 (MusicVibes)
  INSERT INTO comments (post_id, user_name, handle, avatar, content, likes) VALUES
  (post9_id, 'VinylCollector', '@vinyl_collector', 'bg-purple-600', 'Finally, jemand sagt es! Es geht ums Erlebnis.', 156),
  (post9_id, 'AudioPhile', '@audio_phil', 'bg-gray-700', 'Kommt auf die Anlage an - da gibt es schon Unterschiede.', 89),
  (post9_id, 'RetroMusic', '@retro_musik', 'bg-pink-600', 'Die Cover-Art allein ist es wert! 🎨', 67);

END $$;

-- =====================================================
-- FERTIG! Deine Datenbank ist jetzt eingerichtet.
-- =====================================================
