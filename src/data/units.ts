import type { UnitMeta } from '../types'

export const UNITS: UnitMeta[] = [
  {
    id: 1,
    title: 'התאוריה הקינטית של הגזים',
    subtitle: 'מיקרוסקופי → מאקרוסקופי',
    icon: '🌬️',
    color: 'linear-gradient(135deg, #0D9488 0%, #0369A1 100%)',
    nodes: [
      { id: '1.1', unitId: 1, title: 'מודל הגז האידיאלי ומושג הלחץ',       subtitle: 'התנגשויות מיקרוסקופיות ↔ לחץ מאקרוסקופי', type: 'Concept',     isScaffolded: false, prereqs: [], color: 'from-teal-500/20 to-cyan-500/10' },
      { id: '1.2', unitId: 1, title: 'משוואת המצב הקינטית',                subtitle: 'גזירת P = ⅓nmv²',                          type: 'Theorem',     isScaffolded: true,  prereqs: ['1.1'], color: 'from-blue-500/20 to-teal-500/10' },
      { id: '1.3', unitId: 1, title: 'טמפרטורה ואנרגיה קינטית',            subtitle: 'T כמדד לאנרגיה הקינטית הממוצעת',           type: 'Concept',     isScaffolded: false, prereqs: ['1.2'], color: 'from-cyan-500/20 to-blue-500/10' },
      { id: '1.4', unitId: 1, title: 'חוק חלוקת האנרגיה השווה',            subtitle: 'Equipartition — דרגות חופש וקיבול חום',     type: 'Theorem',     isScaffolded: false, prereqs: ['1.3'], color: 'from-violet-500/20 to-blue-500/10' },
      { id: '1.5', unitId: 1, title: 'התפלגות המהירויות של מקסוול',         subtitle: 'v_mp, v̄, v_rms',                           type: 'Procedure',   isScaffolded: true,  prereqs: ['1.3'], color: 'from-indigo-500/20 to-violet-500/10' },
      { id: '1.6', unitId: 1, title: 'מהלך חופשי ממוצע ותופעות מעבר',      subtitle: 'התנגשויות, אפוזיה, דיפוזיה',               type: 'Application', isScaffolded: false, prereqs: ['1.5'], color: 'from-sky-500/20 to-indigo-500/10' },
    ],
  },
  {
    id: 2,
    title: 'פיסיקה סטטיסטית של פרה-מגנט',
    subtitle: 'ספינים, אנטרופיה, טמפרטורה סטטיסטית',
    icon: '🧲',
    color: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
    nodes: [
      { id: '2.1', unitId: 2, title: 'מיקרו-מצבים ומקרו-מצבים',            subtitle: 'ספינים למעלה/למטה — גשר לסטטיסטיקה',      type: 'Concept',   isScaffolded: false, prereqs: [], color: 'from-violet-500/20 to-purple-500/10' },
      { id: '2.2', unitId: 2, title: 'פונקציית הריבוי וקירוב סטרלינג',     subtitle: 'Ω(N,N↑) — N גדול → לוגריתם',              type: 'Procedure', isScaffolded: true,  prereqs: ['2.1'], color: 'from-purple-500/20 to-pink-500/10' },
      { id: '2.3', unitId: 2, title: 'ההגדרה הסטטיסטית של האנטרופיה',      subtitle: 'S = k_B ln Ω',                             type: 'Concept',   isScaffolded: false, prereqs: ['2.2'], color: 'from-pink-500/20 to-rose-500/10' },
      { id: '2.4', unitId: 2, title: 'טמפרטורה סטטיסטית והחוק השני',       subtitle: '1/T = (∂S/∂E)',                            type: 'Theorem',   isScaffolded: true,  prereqs: ['2.3'], color: 'from-rose-500/20 to-orange-500/10' },
      { id: '2.5', unitId: 2, title: 'טמפרטורה שלילית בפרה-מגנט',          subtitle: 'מה קורה כש-E גדול מ-E_max/2',             type: 'Application', isScaffolded: false, prereqs: ['2.4'], color: 'from-orange-500/20 to-amber-500/10' },
    ],
  },
  {
    id: 3,
    title: 'פיסיקה סטטיסטית ותרמודינמיקה',
    subtitle: 'פוטנציאלים, קרנו, מעברי פאזה',
    icon: '🔥',
    color: 'linear-gradient(135deg, #EA580C 0%, #CA8A04 100%)',
    nodes: [
      { id: '3.1', unitId: 3, title: 'החוק הראשון של התרמודינמיקה',         subtitle: 'dU = dQ + dW, עבודה תרמודינמית',          type: 'Concept',     isScaffolded: false, prereqs: ['2.3'], color: 'from-orange-500/20 to-amber-500/10' },
      { id: '3.2', unitId: 3, title: 'מנועי חום ומעגל קרנו',               subtitle: 'נצילות מקסימלית, תהליכים אדיאבטיים',       type: 'Application', isScaffolded: true,  prereqs: ['3.1'], color: 'from-amber-500/20 to-yellow-500/10' },
      { id: '3.3', unitId: 3, title: 'פוטנציאלים תרמודינמיים',              subtitle: 'F, H, G — התמרות לז\'נדר',                 type: 'Procedure',   isScaffolded: true,  prereqs: ['3.1'], color: 'from-yellow-500/20 to-lime-500/10' },
      { id: '3.4', unitId: 3, title: 'קשרי מקסוול',                        subtitle: 'גזירה חלקית מעורבת — יחסי הדדיות',         type: 'Theorem',     isScaffolded: false, prereqs: ['3.3'], color: 'from-lime-500/20 to-green-500/10' },
      { id: '3.5', unitId: 3, title: 'מעברי פאזה',                         subtitle: 'שוויון פוטנציאלים כימיים',                 type: 'Concept',     isScaffolded: false, prereqs: ['3.3'], color: 'from-green-500/20 to-teal-500/10' },
      { id: '3.6', unitId: 3, title: 'משוואת קלאוזיוס-קלפרון',             subtitle: 'לחץ כפונקציה של טמפרטורה בדו-קיום',        type: 'Theorem',     isScaffolded: true,  prereqs: ['3.5'], color: 'from-teal-500/20 to-cyan-500/10' },
    ],
  },
  {
    id: 4,
    title: 'מגז אידיאלי עד גז פוטונים',
    subtitle: 'הצבר קנוני, פונקציית חלוקה Z',
    icon: '⚛️',
    color: 'linear-gradient(135deg, #0369A1 0%, #7C3AED 100%)',
    nodes: [
      { id: '4.1', unitId: 4, title: 'הצבר הקנוני ופקטור בולצמן',           subtitle: 'מבודד → T קבוע: e^(-E/kT)',                type: 'Concept',     isScaffolded: false, prereqs: ['2.3'], color: 'from-blue-500/20 to-indigo-500/10' },
      { id: '4.2', unitId: 4, title: 'פונקציית החלוקה Z',                   subtitle: 'Z = Σe^(-βε) — גזירת כל הגדלים',          type: 'Theorem',     isScaffolded: true,  prereqs: ['4.1'], color: 'from-indigo-500/20 to-violet-500/10' },
      { id: '4.3', unitId: 4, title: 'גז אידיאלי מונואטומי ופרדוקס גיבס',  subtitle: 'N! לחלקיקים בלתי-מובחנים',                 type: 'Application', isScaffolded: true,  prereqs: ['4.2'], color: 'from-violet-500/20 to-purple-500/10' },
      { id: '4.4', unitId: 4, title: 'דרגות חופש פנימיות בגז דו-אטומי',    subtitle: 'רוטציות, ויברציות — תלות בטמפרטורה',       type: 'Procedure',   isScaffolded: false, prereqs: ['4.3'], color: 'from-purple-500/20 to-fuchsia-500/10' },
      { id: '4.5', unitId: 4, title: 'מודל מוצק — איינשטיין ודביי',         subtitle: 'קיבול חום בטמפ׳ נמוכות: T³ של דביי',       type: 'Application', isScaffolded: true,  prereqs: ['4.2'], color: 'from-fuchsia-500/20 to-pink-500/10' },
      { id: '4.6', unitId: 4, title: 'קרינת גוף שחור וגז פוטונים',          subtitle: 'חוק פלאנק, חוק סטפן-בולצמן',              type: 'Theorem',     isScaffolded: true,  prereqs: ['4.2'], color: 'from-pink-500/20 to-rose-500/10' },
    ],
  },
  {
    id: 5,
    title: 'בוזונים ופרמיונים',
    subtitle: 'סטטיסטיקות קוונטיות',
    icon: '🌀',
    color: 'linear-gradient(135deg, #BE185D 0%, #1D4ED8 100%)',
    nodes: [
      { id: '5.1', unitId: 5, title: 'הצבר הגרנד-קנוני',                   subtitle: 'חילוף אנרגיה וחלקיקים — פוטנציאל כימי μ',  type: 'Concept',     isScaffolded: false, prereqs: ['4.1'], color: 'from-rose-500/20 to-pink-500/10' },
      { id: '5.2', unitId: 5, title: 'סטטיסטיקת פרמי-דיראק',              subtitle: 'עקרון האיסור של פאולי → פונקציית אכלוס',   type: 'Theorem',     isScaffolded: true,  prereqs: ['5.1'], color: 'from-blue-500/20 to-indigo-500/10' },
      { id: '5.3', unitId: 5, title: 'סטטיסטיקת בוז-איינשטיין',           subtitle: 'בוזונים — ריבוי אכלוס מותר',              type: 'Theorem',     isScaffolded: true,  prereqs: ['5.1', '5.2'], color: 'from-violet-500/20 to-purple-500/10' },
      { id: '5.4', unitId: 5, title: 'גז אלקטרונים מנוון',                subtitle: 'אנרגיית פרמי, לחץ ב-T=0 (ננסים לבנים)',    type: 'Application', isScaffolded: false, prereqs: ['5.2'], color: 'from-indigo-500/20 to-blue-500/10' },
      { id: '5.5', unitId: 5, title: 'עיבוי בוז-איינשטיין',               subtitle: 'מעבר פאזה קוונטי בטמפרטורות נמוכות',       type: 'Application', isScaffolded: false, prereqs: ['5.3'], color: 'from-purple-500/20 to-fuchsia-500/10' },
    ],
  },
]

export const ALL_NODES = UNITS.flatMap(u => u.nodes)
