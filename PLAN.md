# Physicsistica — מסמך תכנון ופיתוח
> קורס 20314-3011 | פיזיקה סטטיסטית | HIT / האוניברסיטה הפתוחה

---

## ✅ מה הושלם

### תשתית
- [x] React 18 + TypeScript + Vite + Tailwind CSS v4
- [x] KaTeX (BlockMath / M components עם `tex=` prop)
- [x] Framer Motion לאנימציות
- [x] GitHub Actions — deploy אוטומטי ל-GitHub Pages בכל push
- [x] Dark/Light mode עם CSS custom properties
- [x] LocalStorage — שמירת התקדמות לכל node
- [x] `NodeLayout` עם 3 פאזות: Explore / Build / Apply
- [x] `ScaffoldedDerivation` — שחרור שלבים סדרתי עם שאלות ביניים
- [x] `TrapCard` — טעויות נפוצות (wrongFormula / rightFormula)
- [x] `WhatIfExplorer` — חקירה פרמטרית
- [x] `KnowledgeGraph` — גרף ידע אינטראקטיבי
- [x] `PracticeMode` + `PracticeCard` — מצב תרגול עם Spaced Repetition
- [x] `usePracticeSession` hook — ניהול תורים לפי confidence
- [x] `practiceBank.tsx` — ~90 שאלות ל-28 נודים

### תוכן — 28 נודים מלאים
| יחידה | נודים | סטטוס |
|-------|-------|--------|
| 1 — קינטיקה | 1.1–1.6 | ✅ |
| 2 — אנטרופיה | 2.1–2.5 | ✅ |
| 3 — תרמודינמיקה | 3.1–3.6 | ✅ |
| 4 — קנוני | 4.1–4.6 | ✅ |
| 5 — קוונטי | 5.1–5.5 | ✅ |

---

## ✅ Phase 2 — הושלם

### B — Practice Mode ✅
- [x] SM-2 spaced repetition algorithm (interval × easiness factor)
- [x] Streak counter + daily goal ring (5 שאלות/יום)
- [x] XP system (10/5/2 XP לפי confidence × difficulty multiplier)
- [x] Badge system (15 תגים: streak, mastery, perfect session, etc.)
- [x] Badge toast animation
- [x] Stats panel — per-unit progress bars + total XP
- [x] Difficulty filter (★☆☆ / ★★☆ / ★★★)
- [x] Session summary עם XP earned
- [x] +17 extra questions → ~107 סה"כ

### C — UX ✅
- [x] Breadcrumb בתוך node (יחידה › שם node)
- [x] Continue button — "המשך: [node אחרון]" בHome
- [x] Exam mode button בHome
- [x] Confetti animation בכניסה ל-Apply phase
- [x] Loading skeleton (במקום spinner גנרי)
- [x] "הושלם" badge בheader של node

### D — Exam Mode ✅
- [x] 90-min countdown timer עם warning באדום
- [x] 20 שאלות קשות מכל היחידות
- [x] Self-assessment (ידעתי/לא ידעתי) per question
- [x] Score ring animation
- [x] Per-unit breakdown בתוצאות

### G — Infrastructure ✅
- [x] PWA manifest.json
- [x] Service Worker (offline cache)
- [x] Vite manualChunks (vendor-react/motion/katex/lucide)
- [x] meta description + theme-color בindex.html

---

## 🚧 יעדים פתוחים

### E — גמיפיקציה (חלקי — XP+Badges done, נותר:)
- [ ] Leaderboard (LocalStorage based, אנונימי)
- [ ] Level system (XP → level 1-10 עם title)
- [ ] Profile screen — סיכום XP + badges + streak

### F — נגישות (נותר:)
- [ ] `lang="he"` על html element
- [ ] `aria-label` על אייקונים ב-KnowledgeGraph
- [ ] Skip-to-content link
- [ ] Focus styles visible בkeyboard nav

### A — QA ושיפור איכות תוכן
- [ ] **בדיקת כל 28 נודים** — בדיקה ידנית: האם הסימולטור עובד, האם המתמטיקה נכונה
- [ ] **ScaffoldedDerivation** — לוודא שכל validate() מקבל תשובות נכונות בפועל
- [ ] **TrapCard** בכל node — לוודא שהנוסחאות הלא-נכונות אכן מוצגות נכון ב-KaTeX
- [ ] **WhatIfExplorer** — לוודא שהחישובים בכל answer function נכונים מתמטית
- [ ] הוספת **examExample** ל-TrapInfo (שאלות בחינה אמיתיות) ב-10 נודים מרכזיים

### B — Practice Mode — שיפורים
- [ ] **Spaced Repetition אמיתי** — SM-2 algorithm (interval × easiness factor)
- [ ] **סטטיסטיקות לסטודנט** — streak, accuracy per unit, weak spots
- [ ] **Session summary** — בסוף כל סשן: כמה ידעתי / לא ידעתי / צריך לחזור
- [ ] **Daily goal** — "5 שאלות ליום" עם progress ring
- [ ] **Filter by difficulty** — הצג רק קשות / רק קלות
- [ ] הוספת ~30 שאלות נוספות (ל-118 סה"כ) — דגש על חישוביות לבחינה

### C — ניווט ו-UX
- [ ] **Breadcrumb** בתוך node — "יחידה 3 › node 3.2"
- [ ] **Progress bar** בראש כל unit page — X/Y nodes completed
- [ ] **כפתור "המשך מאיפה עצרתי"** ב-Home screen
- [ ] **Confetti animation** בסיום node מלא (100% complete)
- [ ] **Mobile responsive** — בדיקה ייעודית ב-375px (iPhone SE)
- [ ] **Loading skeleton** בזמן lazy load של node במקום spinner גנרי

---

## 🔭 יעדים עתידיים (Phase 3)

### D — חיזוק למבחן
- [ ] **מצב בחינה** — שאלות מבחן מלאות (מהמועדים הקודמים) עם טיימר
- [ ] **תרגולי חישוב** — קלט מספרי עם בדיקה אוטומטית (± 5% tolerance)
- [ ] **"הסבר לי שוב"** — כפתור שפותח הסבר פשוט יותר לכל Build step
- [ ] **Summary card** לכל node — דף סיכום הדפסה (PDF export)

### E — גמיפיקציה
- [ ] **XP system** — נקודות לפי difficulty × confidence
- [ ] **Badges** — "מאסטר קינטיקה", "פרמיוניסט" וכו'
- [ ] **Streak counter** — רצף ימי לימוד
- [ ] **Leaderboard** (אופציונלי, LocalStorage based)

### F — נגישות ומולטי-לשוני
- [ ] `aria-label` על כל כפתורי אינטראקציה
- [ ] `role="img"` + alt-text על SVG סימולטורים
- [ ] תמיכה בקורא מסך לנוסחאות KaTeX
- [ ] **אנגלית** — toggle EN/HE (לסטודנטים בינלאומיים)

### G — תשתית טכנית
- [ ] **Service Worker** — offline support (PWA)
- [ ] **Analytics** — Plausible / Umami (privacy-first) לראות אלו nodes פותחים
- [ ] **Error boundary** יפה — כרגע ComingSoon, צריך ErrorBoundary מעוצב
- [ ] **Unit tests** — vitest לפונקציות validate() ו-hooks
- [ ] **E2E tests** — Playwright — קורס זרימה בסיסית לכל יחידה

---

## 📐 ארכיטקטורה נוכחית

```
src/
├── App.tsx                    # router ראשי (28 lazy nodes)
├── types.ts                   # כל ה-interfaces
├── components/
│   ├── NodeLayout.tsx         # עטיפה לכל node (Explore/Build/Apply tabs)
│   ├── ScaffoldedDerivation.tsx
│   ├── TrapCard.tsx
│   ├── WhatIfExplorer.tsx
│   ├── KnowledgeGraph.tsx
│   ├── PracticeMode.tsx       # ✨ חדש
│   ├── PracticeCard.tsx       # ✨ חדש
│   ├── GlassCard.tsx
│   ├── MathBlock.tsx
│   └── ThemeToggle.tsx
├── data/
│   ├── units.ts               # מטא-דאטה לכל 28 nodes
│   └── practiceBank.tsx       # ✨ ~90 שאלות תרגול
├── hooks/
│   ├── useNodeProgress.ts
│   └── usePracticeSession.ts  # ✨ חדש
└── units/
    ├── unit1/ (Node11–Node16)
    ├── unit2/ (Node21–Node25)
    ├── unit3/ (Node31–Node36)
    ├── unit4/ (Node41–Node46)
    └── unit5/ (Node51–Node55)
```

---

## 🔗 לינקים
- **Production**: https://sosnate.github.io/physicsistica/
- **Repo**: https://github.com/SoSNate/physicsistica
- **Actions**: https://github.com/SoSNate/physicsistica/actions
