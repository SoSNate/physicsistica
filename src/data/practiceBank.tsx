/**
 * practiceBank.ts — מאגר שאלות תרגול לכל 28 הצמתים
 * פורמט CBL: prompt → חשוב → גלה answer
 * ~90 שאלות: numeric / conceptual / visual / estimation
 */
import type { PracticeQuestion } from '../types'
import { BlockMath, M } from '../components/MathBlock'

// ─── עזרים ───────────────────────────────────────────────────────────
const q = (
  id: string,
  nodeId: string,
  unitId: number,
  type: PracticeQuestion['type'],
  difficulty: 1|2|3,
  prompt: React.ReactNode,
  answer: React.ReactNode,
  tags: string[],
): PracticeQuestion => ({ id, nodeId, unitId, type, difficulty, prompt, answer, tags })

import React from 'react'

// ════════════════════════════════════════════════════════════════════
// יחידה 1 — תיאוריה קינטית של גזים
// ════════════════════════════════════════════════════════════════════
const unit1: PracticeQuestion[] = [
  // 1.1 — לחץ קינטי
  q('1.1-q1','1.1',1,'numeric',1,
    <p>1 mol He (m=4 u) ב-T=300K. חשב <M tex="v_{rms}=\sqrt{3RT/M}" /></p>,
    <div className="space-y-1 text-sm">
      <p><M tex="v_{rms}=\sqrt{3\times8.314\times300/0.004}\approx 1368\;\text{m/s}" /></p>
      <p className="text-xs opacity-70">He קל מאוד → מהיר מאוד בטמפ׳ חדר</p>
    </div>,
    ['vrms','kinetic','temperature']),

  q('1.1-q2','1.1',1,'conceptual',1,
    <p>מה קורה ללחץ הגז כשמכפילים את הנפח (T קבוע)?</p>,
    <div className="space-y-1 text-sm">
      <p><M tex="PV=Nk_BT\Rightarrow P\propto 1/V" /></p>
      <p>הלחץ יורד לחצי — פחות התנגשויות בשטח נתון</p>
    </div>,
    ['pressure','volume','ideal-gas']),

  q('1.1-q3','1.1',1,'conceptual',2,
    <p>מדוע לחץ גז תלוי ב-<M tex="v^2" /> ולא ב-<M tex="v" />?</p>,
    <div className="space-y-1 text-sm">
      <p>שני תרומות: <strong>תנע</strong> = mv (מועבר בהתנגשות) × <strong>תדירות</strong> ∝ v</p>
      <p><M tex="P\propto mv\cdot v=mv^2" /></p>
    </div>,
    ['pressure','momentum','derivation']),

  // 1.2 — משוואת המצב הקינטית
  q('1.2-q1','1.2',1,'numeric',2,
    <p>בקופסה 1m³ יש 10²⁴ מולקולות N₂ ב-T=300K. מה הלחץ?</p>,
    <div className="space-y-1 text-sm">
      <p><M tex="P=\frac{N}{V}k_BT=\frac{10^{24}}{1}\times1.38\times10^{-23}\times300\approx4.1\;\text{kPa}" /></p>
    </div>,
    ['pressure','ideal-gas','calculation']),

  q('1.2-q2','1.2',1,'conceptual',1,
    <p>מה ההנחה שמאפשרת לכתוב <M tex="PV=Nk_BT" />?</p>,
    <div className="space-y-1 text-sm">
      <p>• מולקולות נקודתיות (V מולקולה ≈ 0)</p>
      <p>• אין אינטראקציות בין מולקולות (גז אידיאלי)</p>
      <p>• התנגשויות אלסטיות</p>
    </div>,
    ['ideal-gas','assumptions']),

  // 1.3 — אנרגיה קינטית וטמפרטורה
  q('1.3-q1','1.3',1,'numeric',1,
    <p>מה האנרגיה הקינטית הממוצעת של מולקולה ב-T=300K?</p>,
    <div className="space-y-1 text-sm">
      <p><M tex="\langle E_k\rangle=\tfrac{3}{2}k_BT=\tfrac{3}{2}\times1.38\times10^{-23}\times300\approx6.2\times10^{-21}\;\text{J}" /></p>
    </div>,
    ['kinetic-energy','temperature','equipartition']),

  q('1.3-q2','1.3',1,'conceptual',1,
    <p>שני גזים בטמפ׳ שיווי משקל — N₂ ו-He. לאיזה <M tex="\langle E_k\rangle" /> גבוה יותר?</p>,
    <div className="text-sm">
      <p>שניהם שווים! <M tex="\langle E_k\rangle=\tfrac{3}{2}k_BT" /> לא תלוי במסה</p>
      <p className="text-xs opacity-70">אבל He מהיר יותר כי m קטן יותר</p>
    </div>,
    ['kinetic-energy','equipartition','temperature']),

  // 1.4 — שיוויון ה-equipartition
  q('1.4-q1','1.4',1,'numeric',2,
    <p>מה Cv של גז חד-אטומי, דו-אטומי (T=300K), ותלת-אטומי ליניארי (קלאסי)?</p>,
    <div className="space-y-1 text-sm">
      <p>חד-אטומי: <M tex="C_v=\tfrac{3}{2}R\approx12.5\;\text{J/(mol·K)}" /></p>
      <p>דו-אטומי: <M tex="C_v=\tfrac{5}{2}R\approx20.8" /> (trans+rot, ויב. קפוי)</p>
      <p>תלת-ליניארי: <M tex="C_v\approx\tfrac{7}{2}R" /> (trans+2rot+2vib-modes)</p>
    </div>,
    ['Cv','equipartition','DOF']),

  q('1.4-q2','1.4',1,'conceptual',2,
    <p>מדוע ויברציה "לא נחשבת" ב-Cv של N₂ בטמפ׳ חדר?</p>,
    <div className="text-sm">
      <p><M tex="k_BT\approx26\;\text{meV}\ll\hbar\omega_{vib}\approx293\;\text{meV}" /></p>
      <p>המצב הוויברציוני הנמוך ביותר לא מאוכלס — DOF "קפוי"</p>
    </div>,
    ['DOF','quantum-freezing','Cv']),

  // 1.5 — התפלגות מקסוול
  q('1.5-q1','1.5',1,'numeric',2,
    <p>מה יחס <M tex="v_{mp}:v_{avg}:v_{rms}" /> (לפי מקסוול)?</p>,
    <div className="text-sm">
      <p><M tex="v_{mp}=\sqrt{2RT/M},\quad v_{avg}=\sqrt{8RT/\pi M},\quad v_{rms}=\sqrt{3RT/M}" /></p>
      <p>יחס: <M tex="1:\sqrt{4/\pi}:\sqrt{3/2}\approx1:1.128:1.225" /></p>
    </div>,
    ['maxwell','velocity-distribution']),

  q('1.5-q2','1.5',1,'conceptual',1,
    <p>מה קורה לצורת התפלגות מקסוול כש-T עולה?</p>,
    <div className="text-sm">
      <p>• הפיק נע ימינה (<M tex="v_{mp}\propto\sqrt{T}" />)</p>
      <p>• התפלגות מתרחבת ומשתטחת</p>
      <p>• שטח מתחת לגרף = 1 תמיד</p>
    </div>,
    ['maxwell','temperature','distribution']),

  // 1.6 — ממוצעים קינטיים
  q('1.6-q1','1.6',1,'estimation',3,
    <p>הערך: כמה פעמים בשניה מתנגשת מולקולת N₂ ב-STP?</p>,
    <div className="text-sm">
      <p>מסלול חופשי ממוצע: <M tex="\lambda\approx70\;\text{nm}" /></p>
      <p><M tex="z=v_{avg}/\lambda\approx500/70\times10^{-9}\approx7\times10^9\;\text{/s}" /></p>
    </div>,
    ['mean-free-path','collision-rate','estimation']),
]

// ════════════════════════════════════════════════════════════════════
// יחידה 2 — סטטיסטיקה ואנטרופיה
// ════════════════════════════════════════════════════════════════════
const unit2: PracticeQuestion[] = [
  // 2.1 — מיקרו ומקרוסטייטים
  q('2.1-q1','2.1',2,'numeric',1,
    <p>מערכת 4 ספינים. כמה מיקרוסטייטים יש למקרוסטייט <M tex="N_\uparrow=3" />?</p>,
    <div className="text-sm">
      <p><M tex="\Omega(4,3)=\binom{4}{3}=4" /></p>
    </div>,
    ['microstates','combinatorics','spin']),

  q('2.1-q2','2.1',2,'conceptual',1,
    <p>מדוע המצב <M tex="N_\uparrow=N/2" /> הוא שיווי המשקל?</p>,
    <div className="text-sm">
      <p>כי <M tex="\Omega(N,N/2)=\binom{N}{N/2}" /> — מקסימלי</p>
      <p>בתנאי מאגר אחיד: המקרוסטייט הסביר ביותר = שיווי משקל</p>
    </div>,
    ['equilibrium','microstates','entropy']),

  // 2.2 — פונקציית הרבוי ו-Stirling
  q('2.2-q1','2.2',2,'numeric',2,
    <p>חשב <M tex="\ln\Omega(100,50)" /> באמצעות קירוב סטירלינג</p>,
    <div className="text-sm">
      <p><M tex="\ln\Omega\approx N\ln 2=100\ln 2\approx69.3" /></p>
      <p className="text-xs opacity-70">סטירלינג: <M tex="\ln N!\approx N\ln N-N" /></p>
    </div>,
    ['stirling','omega','entropy']),

  q('2.2-q2','2.2',2,'conceptual',1,
    <p>מה תנאי תקפות קירוב סטירלינג?</p>,
    <div className="text-sm">
      <p><M tex="N\gg1" /> — עבור N=100 השגיאה &lt;1%</p>
    </div>,
    ['stirling','approximation']),

  // 2.3 — אנטרופיה ו-Boltzmann
  q('2.3-q1','2.3',2,'conceptual',1,
    <p>מה משמעות <M tex="S=k_B\ln\Omega" />? מה קורה ל-S כש-Ω גדול?</p>,
    <div className="text-sm">
      <p>S = מדד לאי-סדר / חוסר ידיעה. Ω גדול → ריבוי מיקרוסטייטים → אנטרופיה גבוהה</p>
      <p>בשיווי משקל Ω מקס → S מקסימלי (חוק 2)</p>
    </div>,
    ['entropy','Boltzmann','second-law']),

  q('2.3-q2','2.3',2,'numeric',2,
    <p>10²³ ספינים ב-N↑=N/2. חשב S בקירוב</p>,
    <div className="text-sm">
      <p><M tex="S=k_BN\ln2=1.38\times10^{-23}\times10^{23}\times0.693\approx0.96\;\text{J/K}" /></p>
    </div>,
    ['entropy','calculation','spin']),

  // 2.4 — טמפרטורה סטטיסטית
  q('2.4-q1','2.4',2,'conceptual',2,
    <p>הגדרה סטטיסטית: מה זה טמפרטורה?</p>,
    <div className="text-sm">
      <p><M tex="\frac{1}{T}=\frac{\partial S}{\partial U}\bigg|_{V,N}" /></p>
      <p>T = "קצב עליית אנטרופיה עם האנרגיה". שיווי משקל: <M tex="\partial S_1/\partial U=\partial S_2/\partial U" /></p>
    </div>,
    ['temperature','entropy','statistical']),

  // 2.5 — פרה-מגנט דו-רמתי
  q('2.5-q1','2.5',2,'numeric',2,
    <p>פרה-מגנט עם N ספינים בשדה B. מה <M tex="\langle m\rangle" /> ב-T→∞?</p>,
    <div className="text-sm">
      <p>ב-T→∞: כל המצבים שקולים → <M tex="\langle m\rangle=0" /></p>
      <p className="text-xs opacity-70">חצי ↑ וחצי ↓ בממוצע</p>
    </div>,
    ['paramagnet','magnetization','limit']),

  q('2.5-q2','2.5',2,'conceptual',2,
    <p>מדוע אנטרופיית הפרה-מגנט <em>יורדת</em> כש-B גדל (T קבוע)?</p>,
    <div className="text-sm">
      <p>שדה חזק "מיישר" ספינים → פחות מיקרוסטייטים → <M tex="\Omega\downarrow\Rightarrow S\downarrow" /></p>
    </div>,
    ['entropy','paramagnet','magnetic-field']),
]

// ════════════════════════════════════════════════════════════════════
// יחידה 3 — תרמודינמיקה
// ════════════════════════════════════════════════════════════════════
const unit3: PracticeQuestion[] = [
  // 3.1 — החוק הראשון
  q('3.1-q1','3.1',3,'numeric',1,
    <p>1 mol גז חד-אטומי (Cv=3R/2) מחומם ב-Q=300J בנפח קבוע. מה ΔT?</p>,
    <div className="text-sm">
      <p><M tex="\Delta T=Q/(nC_v)=300/(1\times12.47)\approx24\;\text{K}" /></p>
    </div>,
    ['first-law','isochoric','temperature']),

  q('3.1-q2','3.1',3,'conceptual',1,
    <p>מדוע <M tex="C_p > C_v" /> לכל גז?</p>,
    <div className="text-sm">
      <p>בתהליך P=const: חלק מהחום הולך לעבודה <M tex="W=P\Delta V=nR\Delta T" /></p>
      <p><M tex="C_p=C_v+R" /> — "עלות נוספת" לעבודת התפשטות</p>
    </div>,
    ['Cp','Cv','work']),

  q('3.1-q3','3.1',3,'numeric',2,
    <p>גז דו-אטומי מתפשט אדיאבטית מ-V ל-2V. מה <M tex="T_f/T_i" />? (γ=7/5)</p>,
    <div className="text-sm">
      <p><M tex="TV^{\gamma-1}=\text{const}\Rightarrow T_f=T_i(V/2V)^{2/5}=T_i\cdot0.758" /></p>
    </div>,
    ['adiabatic','temperature','expansion']),

  // 3.2 — מחזור קרנו
  q('3.2-q1','3.2',3,'numeric',1,
    <p>מנוע קרנו עם <M tex="T_H=600K,\;T_C=300K" />. מה היעילות המקסימלית?</p>,
    <div className="text-sm">
      <p><M tex="\eta=1-T_C/T_H=1-300/600=50\%" /></p>
    </div>,
    ['Carnot','efficiency','heat-engine']),

  q('3.2-q2','3.2',3,'conceptual',2,
    <p>מדוע מנוע קרנו הוא הגבול העליון ליעילות?</p>,
    <div className="text-sm">
      <p>מחזור קרנו בלבד הפיך — ה-entropy המלא מוחזר. כל תהליך אחר יוצר אנטרופיה → יעילות נמוכה יותר</p>
    </div>,
    ['Carnot','entropy','reversibility']),

  // 3.3 — פוטנציאלים תרמודינמיים
  q('3.3-q1','3.3',3,'conceptual',2,
    <p>מתי משתמשים ב-F (אנרגיה חופשית של Helmholtz) במקום ב-U?</p>,
    <div className="text-sm">
      <p>כש-T,V קבועים (מעבדה סגורה, תרמוסטט). <M tex="F=U-TS" /> מינימלי בשיווי משקל</p>
    </div>,
    ['Helmholtz','free-energy','equilibrium']),

  q('3.3-q2','3.3',3,'conceptual',2,
    <p>מה יחס מקסוול <M tex="\left(\partial S/\partial V\right)_T=\left(\partial P/\partial T\right)_V" /> אומר פיזיקלית?</p>,
    <div className="text-sm">
      <p>"קצב שינוי אנטרופיה עם נפח = קצב שינוי לחץ עם טמפ׳"</p>
      <p>מאפשר למדוד כמויות שקשה למדוד ישירות</p>
    </div>,
    ['Maxwell-relations','thermodynamics']),

  // 3.4 — החוק השני ואנטרופיה
  q('3.4-q1','3.4',3,'conceptual',1,
    <p>מה המשמעות של <M tex="\Delta S_{univ}\geq0" />?</p>,
    <div className="text-sm">
      <p>תהליך ספונטני: אנטרופיה כוללת (מערכת+סביבה) לא יורדת</p>
      <p>תהליך הפיך: <M tex="\Delta S_{univ}=0" />; בלתי הפיך: &gt;0</p>
    </div>,
    ['second-law','entropy','spontaneous']),

  q('3.4-q2','3.4',3,'numeric',2,
    <p>חשב ΔS כש-1 mol גז אידיאלי מתפשט איזו-תרמי מ-V ל-2V</p>,
    <div className="text-sm">
      <p><M tex="\Delta S=nR\ln(V_2/V_1)=1\times8.314\times\ln2\approx5.76\;\text{J/K}" /></p>
    </div>,
    ['entropy','isothermal','expansion']),

  // 3.5 — מעברי פאזה
  q('3.5-q1','3.5',3,'conceptual',2,
    <p>מה קורה ל-G (גיבס) בנקודת מעבר פאזה?</p>,
    <div className="text-sm">
      <p>שתי הפאזות בשיווי משקל: <M tex="G_{liquid}=G_{solid}" /></p>
      <p>בדיאגרמת P-T: על קו גבול הפאזות</p>
    </div>,
    ['phase-transition','Gibbs','equilibrium']),

  // 3.6 — משוואת Van der Waals
  q('3.6-q1','3.6',3,'conceptual',2,
    <p>מה המשמעות של הפרמטרים a,b במשוואת Van der Waals?</p>,
    <div className="text-sm">
      <p><strong>a</strong>: תיקון למשיכה בין מולקולות (מוריד לחץ)</p>
      <p><strong>b</strong>: נפח עצמי של המולקולות (co-volume)</p>
      <p><M tex="\left(P+\frac{aN^2}{V^2}\right)(V-Nb)=Nk_BT" /></p>
    </div>,
    ['van-der-Waals','real-gas','parameters']),
]

// ════════════════════════════════════════════════════════════════════
// יחידה 4 — אנסמבל קנוני
// ════════════════════════════════════════════════════════════════════
const unit4: PracticeQuestion[] = [
  // 4.1 — גורם בולצמן ו-Z
  q('4.1-q1','4.1',4,'numeric',1,
    <p>מערכת 2 רמות: <M tex="\varepsilon_0=0,\;\varepsilon_1=k_BT" />. מה Z?</p>,
    <div className="text-sm">
      <p><M tex="Z=e^0+e^{-1}=1+e^{-1}\approx1.368" /></p>
    </div>,
    ['partition-function','Boltzmann','two-level']),

  q('4.1-q2','4.1',4,'conceptual',1,
    <p>מה Z מייצג פיזיקלית?</p>,
    <div className="text-sm">
      <p>Z = "מספר המצבים האפקטיבי" — סכום משוקלל של כל המצבים</p>
      <p>ב-T→∞: <M tex="Z\to\text{מספר המצבים הכולל}" /> (כולם שווה)</p>
      <p>ב-T→0: <M tex="Z\to1" /> (רק מצב הבסיס)</p>
    </div>,
    ['partition-function','physical-meaning']),

  q('4.1-q3','4.1',4,'numeric',2,
    <p>מ-Z ניתן לחשב <M tex="\langle E\rangle=-\partial\ln Z/\partial\beta" />. מה <M tex="\langle E\rangle" /> למערכת 2 רמות מ-q1?</p>,
    <div className="text-sm">
      <p><M tex="\langle E\rangle=\frac{k_BT\cdot e^{-1}}{1+e^{-1}}=\frac{k_BT}{e+1}\approx0.269k_BT" /></p>
    </div>,
    ['partition-function','energy','derivative']),

  // 4.2 — פונקציות תרמודינמיות מ-Z
  q('4.2-q1','4.2',4,'conceptual',2,
    <p>איך מחשבים F, S, P מ-Z?</p>,
    <div className="text-sm">
      <p><M tex="F=-k_BT\ln Z" /></p>
      <p><M tex="S=-\partial F/\partial T,\quad P=-\partial F/\partial V" /></p>
    </div>,
    ['free-energy','thermodynamic-potentials','partition-function']),

  // 4.3 — קרינת גוף שחור
  q('4.3-q1','4.3',4,'conceptual',2,
    <p>מה פוטון בהקשר סטטיסטי? מה Z שלו?</p>,
    <div className="text-sm">
      <p>פוטון = אוסילטור הרמוני קוונטי עם <M tex="\mu=0" /></p>
      <p><M tex="Z_{ph}=\frac{1}{1-e^{-\beta\hbar\omega}}" /></p>
    </div>,
    ['photon','black-body','boson']),

  q('4.3-q2','4.3',4,'numeric',3,
    <p>חוק ווין: לאיזה <M tex="\lambda_{max}" /> מקרין גוף שחור ב-T=5800K (שמש)?</p>,
    <div className="text-sm">
      <p><M tex="\lambda_{max}=b/T=2.898\times10^{-3}/5800\approx500\;\text{nm}" /></p>
      <p className="text-xs opacity-70">אור ירוק-צהוב — פסגת הרגישות העינית!</p>
    </div>,
    ['Wien','black-body','wavelength']),

  // 4.4 — DOF פנימיות
  q('4.4-q1','4.4',4,'numeric',2,
    <p>מה Cv/R של H₂ ב-T=100K, 1000K, 10000K?</p>,
    <div className="text-sm">
      <p>100K: Θ_R=85K &lt; T → rot פעיל → <M tex="C_v/R=5/2" /></p>
      <p>1000K: ויב. עדיין קפוי (Θ_V=6300K) → <M tex="5/2" /></p>
      <p>10000K: ויב. פעיל → <M tex="7/2" /></p>
    </div>,
    ['Cv','DOF','diatomic','quantum-freezing']),

  // 4.5 — מודל דביי/אינשטיין
  q('4.5-q1','4.5',4,'conceptual',2,
    <p>מה ההבדל בין מודל אינשטיין לדביי למוצקים?</p>,
    <div className="text-sm">
      <p><strong>אינשטיין</strong>: כל האטומים רוטטים באותה תדירות ω₀</p>
      <p><strong>דביי</strong>: תפלגות תדירויות 0 עד ω_D (גלים אקוסטיים)</p>
      <p>דביי מסביר <M tex="C_v\propto T^3" /> ב-T נמוך; אינשטיין לא</p>
    </div>,
    ['Debye','Einstein','solid','Cv']),

  q('4.5-q2','4.5',4,'numeric',2,
    <p>מה <M tex="C_v" /> של מוצק קלאסי לפי Dulong-Petit?</p>,
    <div className="text-sm">
      <p><M tex="C_v=3Nk_B=3R\approx24.9\;\text{J/(mol·K)}" /></p>
      <p className="text-xs opacity-70">תקף ב-T גבוה בלבד (T ≫ Θ_D)</p>
    </div>,
    ['Dulong-Petit','solid','classical']),

  // 4.6 — גז אידיאלי קנוני
  q('4.6-q1','4.6',4,'numeric',2,
    <p>מה <M tex="\ln Z_1" /> למולקולה חד-אטומית? (Z_1 = פונקציית חלוקה חד-חלקיקית)</p>,
    <div className="text-sm">
      <p><M tex="Z_1=V/\lambda^3,\quad\lambda=h/\sqrt{2\pi mk_BT}" /></p>
      <p>λ = אורך גל דה-ברויי תרמי</p>
    </div>,
    ['partition-function','ideal-gas','de-Broglie']),
]

// ════════════════════════════════════════════════════════════════════
// יחידה 5 — סטטיסטיקה קוונטית
// ════════════════════════════════════════════════════════════════════
const unit5: PracticeQuestion[] = [
  // 5.1 — אנסמבל גרנד-קנוני
  q('5.1-q1','5.1',5,'conceptual',1,
    <p>מה תפקיד הפוטנציאל הכימי μ באנסמבל גרנד-קנוני?</p>,
    <div className="text-sm">
      <p>μ שולט בחילוף חלקיקים עם המאגר — "מחיר" להוספת חלקיק</p>
      <p>שיווי משקל: <M tex="\mu_{system}=\mu_{reservoir}" /></p>
    </div>,
    ['chemical-potential','grand-canonical','equilibrium']),

  q('5.1-q2','5.1',5,'conceptual',2,
    <p>מה סימן μ לגז אידיאלי קלאסי ב-T גבוה?</p>,
    <div className="text-sm">
      <p><M tex="\mu=k_BT\ln(n\lambda^3)\xrightarrow{T\to\infty}-\infty" /></p>
      <p>T גבוה → λ קטן → nλ³≪1 → ln שלילי → μ&lt;0</p>
    </div>,
    ['chemical-potential','classical-limit','ideal-gas']),

  // 5.2 — פרמי-דיראק
  q('5.2-q1','5.2',5,'conceptual',1,
    <p>מה <M tex="\langle n\rangle_{FD}" /> ב-T=0 עבור <M tex="\varepsilon<\varepsilon_F" /> ו-<M tex="\varepsilon>\varepsilon_F" />?</p>,
    <div className="text-sm">
      <p><M tex="\varepsilon<\varepsilon_F" />: <M tex="\langle n\rangle=1" /> (מלא)</p>
      <p><M tex="\varepsilon>\varepsilon_F" />: <M tex="\langle n\rangle=0" /> (ריק)</p>
      <p>ב-T=0: מדרגה מדויקת בε_F</p>
    </div>,
    ['Fermi-Dirac','occupation','Fermi-energy']),

  q('5.2-q2','5.2',5,'numeric',2,
    <p>מה <M tex="\langle n\rangle_{FD}" /> בדיוק ב-<M tex="\varepsilon=\varepsilon_F" /> לכל T?</p>,
    <div className="text-sm">
      <p><M tex="\langle n\rangle=\frac{1}{e^0+1}=\frac{1}{2}" /> תמיד</p>
    </div>,
    ['Fermi-Dirac','Fermi-energy','occupation']),

  q('5.2-q3','5.2',5,'conceptual',2,
    <p>מדוע פרמיונים לא יכולים לאכלס את מצב הבסיס כולם (כמו בוזונים)?</p>,
    <div className="text-sm">
      <p>עיקרון האיסור של פאולי: לא יותר מפרמיון אחד בכל מצב קוונטי</p>
      <p>→ ב-T=0 ממלאים רמות עד E_F (ים פרמי)</p>
    </div>,
    ['Pauli','fermion','exclusion-principle']),

  // 5.3 — בוז-איינשטיין
  q('5.3-q1','5.3',5,'conceptual',1,
    <p>מה ההבדל בין <M tex="\langle n\rangle_{BE}" /> ל-<M tex="\langle n\rangle_{FD}" />?</p>,
    <div className="text-sm">
      <p><M tex="\langle n\rangle_{BE}=\frac{1}{e^{\beta(\varepsilon-\mu)}-1}" />, <M tex="\langle n\rangle_{FD}=\frac{1}{e^{\beta(\varepsilon-\mu)}+1}" /></p>
      <p>BE: −1 מאפשר ריבוי אכלוס (bosons "אוהבים" אותו מצב)</p>
    </div>,
    ['BE','FD','statistics','boson']),

  q('5.3-q2','5.3',5,'conceptual',2,
    <p>מדוע חייב <M tex="\mu<0" /> לגז בוזוני?</p>,
    <div className="text-sm">
      <p>אם <M tex="\mu\geq\varepsilon_{min}" />: <M tex="\langle n\rangle_{BE}\to\infty" /> (סדרה מתבדרת)</p>
      <p>→ <M tex="\mu" /> חייב להיות שלילי כדי שהסדרה תתכנס</p>
    </div>,
    ['BE','chemical-potential','convergence']),

  // 5.4 — גז אלקטרונים מנוון
  q('5.4-q1','5.4',5,'numeric',2,
    <p>מה אנרגיית פרמי E_F לאלקטרוני נחושת (n≈8.5×10²⁸ m⁻³)?</p>,
    <div className="text-sm">
      <p><M tex="E_F=\frac{\hbar^2}{2m}(3\pi^2n)^{2/3}\approx7\;\text{eV}" /></p>
      <p className="text-xs opacity-70">טמפ׳ פרמי: T_F = E_F/k_B ≈ 81,000K ≫ T_room</p>
    </div>,
    ['Fermi-energy','electron-gas','metals']),

  q('5.4-q2','5.4',5,'conceptual',2,
    <p>מדוע לחץ אלקטרונים בננס לבן לא קורס למרות T≈0?</p>,
    <div className="text-sm">
      <p>לחץ דגנרציה קוונטי: אסור לשני אלקטרונים לאכלס אותו מצב</p>
      <p><M tex="P\propto E_F\propto n^{5/3}" /> — לחץ "פאולי" שאינו תרמי</p>
    </div>,
    ['white-dwarf','degeneracy-pressure','Pauli']),

  // 5.5 — עיבוי בוז-איינשטיין
  q('5.5-q1','5.5',5,'conceptual',2,
    <p>מה תנאי עיבוי בוז-איינשטיין? מה קורה ל-μ?</p>,
    <div className="text-sm">
      <p>ב-T_c: <M tex="\mu\to0" /> — כשהפוטנציאל הכימי מגיע לרמת הבסיס</p>
      <p>מתחת ל-T_c: שבר מקרוסקופי מאכלס את <M tex="\varepsilon=0" /></p>
    </div>,
    ['BEC','phase-transition','chemical-potential']),

  q('5.5-q2','5.5',5,'conceptual',3,
    <p>מדוע פוטונים לא עוברים עיבוי BE?</p>,
    <div className="text-sm">
      <p>לפוטונים <M tex="\mu=0" /> תמיד (מספרם לא שמור) → לא ניתן "לצבור" פוטונים ב-ε=0</p>
      <p className="text-xs opacity-70">בניגוד לאטומים שמספרם שמור</p>
    </div>,
    ['BEC','photon','chemical-potential']),
]

// ════════════════════════════════════════════════════════════════════
// שאלות חישוב נוספות — כל היחידות (בחינה ממוקדת)
// ════════════════════════════════════════════════════════════════════
const extra: PracticeQuestion[] = [
  // ── יחידה 1 ──
  q('1.x1','1.3',1,'numeric',2,
    <p>טמפרטורה T=600K. חשב את <M tex="\bar{v}" /> של O₂ (M=32 g/mol).</p>,
    <div className="space-y-1 text-sm">
      <p><M tex="\bar{v}=\sqrt{8RT/\pi M}=\sqrt{8\times8.314\times600/(\pi\times0.032)}\approx 561\text{ m/s}" /></p>
    </div>,
    ['kinetic','speed','numeric']),

  q('1.x2','1.6',1,'numeric',2,
    <p>N₂ ב-T=300K, P=1atm. אורך מסלול חופשי ממוצע. (σ≈3.7Å)</p>,
    <div className="space-y-1 text-sm">
      <p><M tex="\lambda=\frac{k_BT}{\sqrt{2}\pi\sigma^2 P}\approx\frac{1.38\times10^{-23}\times300}{\sqrt{2}\pi(3.7\times10^{-10})^2\times10^5}\approx 68\text{ nm}" /></p>
    </div>,
    ['mean-free-path','numeric']),

  q('1.x3','1.4',1,'conceptual',1,
    <p>כמה דרגות חופש יש לגז חד-אטומי? לדו-אטומי ליניארי?</p>,
    <div className="text-sm space-y-1">
      <p>חד-אטומי: <M tex="f=3" /> (תנועה בלבד)</p>
      <p>דו-אטומי ליניארי: <M tex="f=5" /> (3 תנועה + 2 סיבוב)</p>
    </div>,
    ['DOF','equipartition']),

  // ── יחידה 2 ──
  q('2.x1','2.1',2,'numeric',2,
    <p>N=4 ספינים. כמה מיקרו-מצבים ל-N↑=2? מה האנטרופיה?</p>,
    <div className="text-sm space-y-1">
      <p><M tex="\Omega=\binom{4}{2}=6" /></p>
      <p><M tex="S=k_B\ln 6\approx 1.79\,k_B" /></p>
    </div>,
    ['microstate','entropy','numeric']),

  q('2.x2','2.3',2,'conceptual',2,
    <p>מה הגדרת הטמפרטורה דרך האנטרופיה?</p>,
    <div className="text-sm">
      <BlockMath tex="\frac{1}{T}=\left(\frac{\partial S}{\partial E}\right)_N" />
      <p className="text-xs opacity-70">שיפוע S(E) = הופכי של T</p>
    </div>,
    ['temperature','entropy','definition']),

  q('2.x3','2.5',2,'conceptual',3,
    <p>מתי T שלילי אפשרי? האם הוא "קר" יותר מT=+∞?</p>,
    <div className="text-sm space-y-1">
      <p>T{'<'}0 אפשרי רק כאשר יש <strong>ספקטרום אנרגיה חסום מלמעלה</strong> (ספינים, לייזר).</p>
      <p>T={'<'}0 הוא <em>חם יותר</em> מ-T=+∞ — סדר: 0⁺→+∞→−∞→0⁻</p>
    </div>,
    ['negative-T','entropy']),

  // ── יחידה 3 ──
  q('3.x1','3.1',3,'numeric',1,
    <p>תהליך איזוכורי: חממת 1 mol He מ-300K ל-500K. מה ΔU?</p>,
    <div className="text-sm">
      <p><M tex="\Delta U = nC_V\Delta T = 1\times\frac{3}{2}R\times200\approx 2494\text{ J}" /></p>
      <p className="text-xs opacity-70">He חד-אטומי: C_V=(3/2)R</p>
    </div>,
    ['first-law','numeric','internal-energy']),

  q('3.x2','3.2',3,'numeric',2,
    <p>מנוע קרנו: T_H=600K, T_C=300K. מה היעילות המקסימלית?</p>,
    <div className="text-sm">
      <p><M tex="\eta=1-\frac{T_C}{T_H}=1-\frac{300}{600}=50\%" /></p>
    </div>,
    ['carnot','efficiency','numeric']),

  q('3.x3','3.5',3,'conceptual',2,
    <p>מה קורה לנקודת הרתיחה של מים בפסגת הר גבוה? למה?</p>,
    <div className="text-sm">
      <p>P נמוך → T_boil נמוך (פחות מ-100°C). לפי Clausius-Clapeyron: dP/dT {'>'} 0, כלומר P נמוך ↔ T רתיחה נמוך.</p>
    </div>,
    ['clausius-clapeyron','phase-transition']),

  q('3.x4','3.3',3,'conceptual',3,
    <p>מה ההבדל בין F (אנרגיה חופשית של הלמהולץ) ל-G (גיבס)?</p>,
    <div className="text-sm space-y-1">
      <p>F = U - TS: מינימלי בשיווי-משקל בT,V קבועים</p>
      <p>G = H - TS: מינימלי בשיווי-משקל בT,P קבועים</p>
      <p className="text-xs opacity-70">ניסויים ב-P קבוע → G רלוונטי יותר</p>
    </div>,
    ['free-energy','helmholtz','gibbs']),

  // ── יחידה 4 ──
  q('4.x1','4.1',4,'numeric',2,
    <p>מערכת 3-רמות (ε=0,1,2 eV) ב-kT=0.5 eV. מה ⟨E⟩?</p>,
    <div className="text-sm space-y-1">
      <p><M tex="Z=1+e^{-2}+e^{-4}\approx 1+0.135+0.018=1.153" /></p>
      <p><M tex="\langle E\rangle=\frac{0+1\cdot e^{-2}+2\cdot e^{-4}}{Z}\approx\frac{0.171}{1.153}\approx 0.148\text{ eV}" /></p>
    </div>,
    ['partition-function','average-energy','numeric']),

  q('4.x2','4.2',4,'conceptual',2,
    <p>מה הקשר בין F לZ (פונקציית חלוקה)?</p>,
    <div className="text-sm">
      <BlockMath tex="F = -k_BT\ln Z" />
      <p className="text-xs opacity-70">ממנה נגזרים כל שאר הפוטנציאלים</p>
    </div>,
    ['free-energy','partition-function']),

  q('4.x3','4.6',4,'numeric',2,
    <p>מה תדר השיא (Wien) לT=5778K (שמש)? (b=2.898×10⁻³ m·K)</p>,
    <div className="text-sm">
      <p><M tex="\lambda_{max}=\frac{b}{T}=\frac{2.898\times10^{-3}}{5778}\approx 501\text{ nm}" /></p>
      <p className="text-xs opacity-70">ירוק-צהוב — שיא הרגישות של העין!</p>
    </div>,
    ['planck','wien','numeric']),

  q('4.x4','4.4',4,'conceptual',2,
    <p>מדוע C_V של H₂ ב-T=50K קטן בהרבה מב-T=300K?</p>,
    <div className="text-sm">
      <p>ב-50K: kT ≪ ε_rot → רמות הסיבוב <strong>קפואות</strong> (לא מופעלות). רק 3 דרגות תנועה → C_V=(3/2)R.</p>
      <p>ב-300K: kT ≈ ε_rot → סיבוב מופעל → C_V=(5/2)R.</p>
    </div>,
    ['heat-capacity','quantum-freezing','diatomic']),

  // ── יחידה 5 ──
  q('5.x1','5.2',5,'numeric',2,
    <p>אלקטרונים ב-T=0. E_F=7eV. מה f_FD(6.5eV)?</p>,
    <div className="text-sm">
      <p>ב-T=0: f_FD(ε) = 1 אם ε {'<'} E_F, 0 אחרת.</p>
      <p>6.5 {'<'} 7 → <M tex="f_{FD}(6.5)=1" /></p>
    </div>,
    ['fermi-dirac','T=0','numeric']),

  q('5.x2','5.4',5,'numeric',2,
    <p>Cu: n=8.5×10²⁸ m⁻³. אמוד E_F (m_e=9.1×10⁻³¹ kg).</p>,
    <div className="text-sm space-y-1">
      <p><M tex="E_F=\frac{\hbar^2}{2m}(3\pi^2 n)^{2/3}" /></p>
      <p>חישוב מספרי → <M tex="E_F\approx 7\text{ eV}" /></p>
    </div>,
    ['fermi-energy','numeric','metal']),

  q('5.x3','5.3',5,'conceptual',2,
    <p>מדוע לייזר הוא פנומן BE ולא FD?</p>,
    <div className="text-sm">
      <p>פוטונים הם בוזונים (ספין 1). BE מאפשר ⟨n⟩ גדול לאין-שיעור במצב יחיד — זו <strong>לכידות לייזר</strong>. פרמיונים לא יכולים לצבור.</p>
    </div>,
    ['bosons','laser','statistics']),

  q('5.x4','5.5',5,'conceptual',3,
    <p>מה T_c של BEC תלויה בצפיפות n? (N₀/N=0 בT=T_c)</p>,
    <div className="text-sm">
      <BlockMath tex="k_BT_c\propto\frac{\hbar^2}{m}n^{2/3}" />
      <p>n גדולה יותר → T_c גבוה יותר. לגזים אטומיים קפואים (n נמוכה מאוד) → T_c~nK.</p>
    </div>,
    ['BEC','critical-temperature','density']),

  q('5.x5','5.1',5,'conceptual',2,
    <p>מה המשמעות הפיזיקלית של הפוטנציאל הכימי μ?</p>,
    <div className="text-sm">
      <p><M tex="\mu=\left(\frac{\partial F}{\partial N}\right)_{T,V}" /> — אנרגיה הנדרשת להוספת חלקיק בודד למערכת.</p>
      <p className="text-xs opacity-70">שיווי-משקל: μ_1 = μ_2 (כמו T לחום, P לנפח)</p>
    </div>,
    ['chemical-potential','grand-canonical']),

  // ── שאלות גבול אסימפטוטי (Tier 2 additions) ──────────────────────
  q('asym-q1','4.2',4,'conceptual',3,
    <p>
      מה גבול פונקציית החלוקה <M tex="Z" /> של אוסצילטור הרמוני קוונטי
      (תדר <M tex="\omega" />) כאשר <M tex="T\to 0" />?
      מה ה-<M tex="\langle E\rangle" /> המתאים, ולמה הוא <em>אינו</em> אפס?
    </p>,
    <div className="text-sm space-y-2">
      <p>
        <M tex="Z=\sum_{n=0}^\infty e^{-\beta\hbar\omega(n+\tfrac{1}{2})}
          =\frac{e^{-\beta\hbar\omega/2}}{1-e^{-\beta\hbar\omega}}" />
      </p>
      <p>
        כאשר <M tex="T\to 0" /> (כלומר <M tex="\beta\to\infty" />):
        <M tex="Z \to e^{-\beta\hbar\omega/2}" /> (רק הרמה הבסיסית תורמת).
      </p>
      <p>
        <M tex="\langle E\rangle = -\frac{\partial\ln Z}{\partial\beta}
          \xrightarrow{T\to 0} \frac{\hbar\omega}{2}" />
      </p>
      <p className="text-xs opacity-70">
        אנרגיית האפס (<M tex="\hbar\omega/2" />) נובעת מעקרון אי-הוודאות של הייזנברג —
        האוסצילטור אינו יכול לנוח. זהו מקור הלחץ הקוונטי בננסים לבנים.
      </p>
    </div>,
    ['partition-function','zero-point-energy','T-to-zero','asymptotic']),

  q('asym-q2','2.2',2,'conceptual',3,
    <p>
      עבור מערכת פרה-מגנטית של <M tex="N" /> ספינים עם <M tex="q" /> ספינים למעלה,
      הראה שהרוחב היחסי של פיק <M tex="\Omega" /> סביב המקסימום הוא
      מסדר <M tex="1/\sqrt{N}" />.
      מה המסקנה עבור <M tex="N\to\infty" />?
    </p>,
    <div className="text-sm space-y-2">
      <p>
        <M tex="\Omega(N,q)\approx\Omega_{max}\exp\!\left(-\frac{2(q-N/2)^2}{N}\right)" />
      </p>
      <p>
        הגאוסיין יש רוחב (סטיית תקן) <M tex="\sigma_q=\sqrt{N}/2" />,
        כך שהרוחב <em>היחסי</em>:
        <M tex="\frac{\sigma_q}{N/2}=\frac{1}{\sqrt{N}}" />
      </p>
      <p>
        <M tex="N\to\infty" />: הפיק מתחדד כ-<M tex="1/\sqrt{N}\to 0" /> — המצב המאקרוסקופי
        שנצפה הוא המצב היחיד שתורם. זו הסיבה שתרמודינמיקה "עובדת".
      </p>
      <p className="text-xs opacity-70">
        הרחב: שגיאת המדידה של <M tex="\langle E\rangle" /> יורדת כ-<M tex="1/\sqrt{N}" /> —
        אותה סיבה שמשתנים מאקרוסקופיים מוגדרים היטב.
      </p>
    </div>,
    ['multiplicity','stirling','N-to-infinity','asymptotic','fluctuations']),

  q('asym-q3','5.2',5,'conceptual',3,
    <p>
      הראה שסטטיסטיקת פרמי-דיראק מתנוונת לסטטיסטיקה קלאסית (מקסוול-בולצמן)
      בגבול <M tex="e^{\beta(\varepsilon-\mu)}\gg 1" />.
      באיזה תנאי פיזיקלי מתקיים תנאי זה?
    </p>,
    <div className="text-sm space-y-2">
      <p>
        פונקציית אכלוס פרמי-דיראק:
        <M tex="\bar{n}_{FD}=\frac{1}{e^{\beta(\varepsilon-\mu)}+1}" />
      </p>
      <p>
        אם <M tex="e^{\beta(\varepsilon-\mu)}\gg 1" /> אזי <M tex="+1" /> זניח:
        <M tex="\bar{n}_{FD}\approx e^{-\beta(\varepsilon-\mu)}=e^{\beta\mu}\cdot e^{-\beta\varepsilon}" />
      </p>
      <p>
        זהו בדיוק גורם בולצמן של מ"ב, עם <M tex="e^{\beta\mu}" /> כקבוע נירמול.
      </p>
      <p>
        התנאי מתקיים כאשר <M tex="n\lambda^3\ll 1" /> (<M tex="\lambda" /> — גל דה-ברויי):
        טמפרטורה גבוהה או צפיפות נמוכה. כלומר: גז דליל וחם = קלאסי.
      </p>
      <p className="text-xs opacity-70">
        עבור בוזונים (BE): אותו גבול, אך <M tex="-1" /> במכנה → MB. שתי הסטטיסטיקות מתמזגות.
      </p>
    </div>,
    ['fermi-dirac','maxwell-boltzmann','classical-limit','asymptotic','chemical-potential']),
]

// ════════════════════════════════════════════════════════════════════
// שאלות בסגנון ראש המרצה — מלכודות, גבולות, DOF נוסף
// ════════════════════════════════════════════════════════════════════
const profStyle: PracticeQuestion[] = [

  // ── מלכודת Z_count: Z ≠ מספר מצבים ─────────────────────────────
  q('prof-z1','4.1',4,'conceptual',2,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>אטום בעל שלושה מצבים אנרגטיים: אנרגיות 0, ε, 2ε.</p>
      <p>סטודנט טוען: "ב-<M tex="T\to\infty" /> מתקיים <M tex="Z=3" /> כי יש שלושה מצבים".</p>
      <p className="font-semibold">מה נכון ומה שגוי בטענה זו?</p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p>
        <strong>נכון:</strong> בגבול <M tex="T\to\infty" />:
        <M tex="Z=e^0+e^{-\beta\varepsilon}+e^{-2\beta\varepsilon}\xrightarrow{\beta\to0}1+1+1=3" />
      </p>
      <p>
        <strong>שגוי:</strong> בכל T כללי <M tex="Z\neq3" />.
        פונקציית החלוקה <em>תמיד</em> שוקלת לפי <M tex="e^{-\beta\varepsilon_i}" />.
        Z=מספר מצבים רק בגבול <M tex="T\to\infty" />.
      </p>
      <p className="text-xs opacity-70">
        ⚠️ מלכודת בחינה: "כמה מצבים יש?" ≠ "מה Z?"
      </p>
    </div>,
    ['partition-function','Z-count-trap','T-infinity','degeneracy']),

  q('prof-z2','4.1',4,'numeric',3,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        דיפול חשמלי עם ערכי אנרגיה <M tex="\varepsilon_n=-nPE,\;n=-2,-1,0,1,2" />.
        (5 מצבים, שדה <M tex="E" />, דיפול <M tex="P" />)
      </p>
      <p className="font-semibold">
        כתבו <M tex="Z_1" /> ופשטו תוך שימוש בזהות cosh.
        מהו <M tex="Z_1" /> בגבול <M tex="T\to\infty" />?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <BlockMath tex="Z_1=\sum_{n=-2}^{2}e^{n\beta PE}=1+2\cosh(\beta PE)+2\cosh(2\beta PE)" />
      <p>
        גבול <M tex="T\to\infty" /> (<M tex="\beta\to0" />):
        <M tex="\cosh(x)\to1" /> לכן <M tex="Z_1\to1+2+2=5" /> — מספר המצבים.
      </p>
      <p className="text-xs opacity-70">
        ⚠️ קל לבדוק: Z בגבול חם = מספר מצבים. תמיד בדקו!
      </p>
    </div>,
    ['partition-function','dipole','cosh','T-infinity']),

  // ── מלכודת N_factorial: N! רק לבלתי-מובחנים ───────────────────
  q('prof-nfac1','4.2',4,'conceptual',2,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        שני מקרים: (א) N אוסילטורים הרמוניים על <strong>רשת קריסטלית</strong>.
        (ב) N מולקולות גז חד-אטומי <strong>חופשיות בקופסה</strong>.
      </p>
      <p className="font-semibold">
        באיזה מקרה כותבים <M tex="Z_N=Z_1^N/N!" /> ובאיזה <M tex="Z_N=Z_1^N" />? מדוע?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p>
        <strong>(א) רשת — מובחנים:</strong> לכל אוסילטור יש מיקום קבוע על הרשת.
        <M tex="Z_N=Z_1^N" /> (ללא N!)
      </p>
      <p>
        <strong>(ב) גז — בלתי-מובחנים:</strong> מולקולות גז זהות אינן ניתנות לזיהוי.
        <M tex="Z_N=Z_1^N/N!" /> (תיקון גיבס)
      </p>
      <p className="text-xs opacity-70">
        ⚠️ כלל: N! רק כשהחלקיקים חופשיים לנוע ולהחליף מקומות (גז).
        רשת, פולימר, ספינים קבועים — <strong>לעולם לא</strong> N!
      </p>
    </div>,
    ['N-factorial','distinguishable','gibbs-paradox','crystal-vs-gas']),

  q('prof-nfac2','4.2',4,'conceptual',3,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        גביש: N אוסילטורים עם מומנט מגנטי <M tex="\pm\mu_0" /> לכל אחד, שדה B.
      </p>
      <p className="font-semibold">
        האם <M tex="Z_N=Z_1^N" /> או <M tex="Z_1^N/N!" />?
        כיצד מחשבים <M tex="Z_1" /> כאשר לכל אוסילטור יש גם DOF תרמי וגם מגנטי?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p>
        <strong>מובחנים</strong> (רשת) → <M tex="Z_N=Z_1^N" />, ללא N!.
      </p>
      <p>
        שתי הדרגות <em>עצמאיות</em> (תרמי + מגנטי) →
        <M tex="Z_1=Z_{\text{osc}}\cdot Z_{\text{mag}}" />
      </p>
      <BlockMath tex="Z_1=\frac{e^{-\beta\hbar\omega/2}}{1-e^{-\beta\hbar\omega}}\cdot 2\cosh(\beta\mu_0 B)" />
      <p className="text-xs opacity-70">עצמאות DOF ↔ כפל פונקציות חלוקה</p>
    </div>,
    ['N-factorial','partition-function','crystal','magnetic','independence']),

  // ── מלכודת mu_kinetic: μ ≠ אנרגיה קינטית ────────────────────────
  q('prof-mu1','5.1',5,'conceptual',2,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        גז אידיאלי קלאסי בטמפ׳ T. סטודנט כותב:
        "<M tex="\mu=\tfrac{3}{2}k_BT" /> — אנרגיה קינטית ממוצעת למולקולה".
      </p>
      <p className="font-semibold">מה הטעות? כיצד מחשבים μ נכון?</p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p>
        <strong>הטעות:</strong> μ כולל גם תרומת האנטרופיה, לא רק אנרגיה.
      </p>
      <p>
        הגדרה נכונה: <M tex="\mu=\left(\frac{\partial F}{\partial N}\right)_{T,V}" />
      </p>
      <BlockMath tex="\mu=k_BT\ln\!\left(\frac{n}{n_Q}\right),\quad n_Q=\left(\frac{2\pi mk_BT}{h^2}\right)^{3/2}" />
      <p>
        שימו לב: <M tex="\mu\ll 0" /> עבור גז דליל (n≪n_Q).
        ואם <M tex="\mu=\tfrac{3}{2}k_BT" /> — זה שגוי ממדית בחלק מהמקרים.
      </p>
      <p className="text-xs opacity-70">⚠️ μ תלוי גם בצפיפות n — לא רק ב-T!</p>
    </div>,
    ['chemical-potential','classical-limit','entropy-contribution','trap']),

  q('prof-mu2','5.1',5,'conceptual',3,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        תגובה כימית: <M tex="3\text{O}_2\rightleftharpoons 2\text{O}_3" />.
        כתבו את תנאי שיווי המשקל באמצעות פוטנציאלים כימיים.
        מהי המשמעות הפיזיקלית?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p>
        תנאי שיווי משקל: שינוי G = 0 תחת תגובה →
      </p>
      <BlockMath tex="3\mu(\text{O}_2)=2\mu(\text{O}_3)" />
      <p>
        עבור גז אידיאלי: <M tex="\mu_i=\mu_i^0(T)+k_BT\ln n_i" />
      </p>
      <BlockMath tex="\frac{n_{\text{O}_3}^2}{n_{\text{O}_2}^3}=\exp\!\left(\frac{3\mu_0(O_2)-2\mu_0(O_3)}{k_BT}\right)\equiv K(T)" />
      <p className="text-xs opacity-70">
        K(T) — קבוע שיווי משקל. תלוי ב-T בלבד, לא בצפיפויות!
      </p>
    </div>,
    ['chemical-potential','chemical-equilibrium','grand-canonical','unit5']),

  // ── שאלות גבול T→0 ────────────────────────────────────────────────
  q('prof-t0-1','4.1',4,'conceptual',2,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        מערכת דו-מצבית: אנרגיות 0 ו-ε. מה <M tex="Z" />, <M tex="\langle E\rangle" />
        ו-<M tex="C_V" /> בגבולות <M tex="T\to0" /> ו-<M tex="T\to\infty" />?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <BlockMath tex="Z=1+e^{-\beta\varepsilon}" />
      <p>
        <strong><M tex="T\to0" />:</strong>{' '}
        <M tex="Z\to1" />, <M tex="\langle E\rangle\to0" />, <M tex="C_V\to0" /> (רק המצב הבסיסי)
      </p>
      <p>
        <strong><M tex="T\to\infty" />:</strong>{' '}
        <M tex="Z\to2" />, <M tex="\langle E\rangle\to\varepsilon/2" />, <M tex="C_V\to0" /> (שיווי משקל)
      </p>
      <p>
        פיק ב-<M tex="C_V" /> (Schottky) בין שני הגבולות, ב-<M tex="k_BT\approx\varepsilon/2" />.
      </p>
      <p className="text-xs opacity-70">⚠️ C_V→0 בשני הגבולות! הפיק אינו במקסימום Z.</p>
    </div>,
    ['two-level','schottky','T-to-zero','T-infinity','heat-capacity']),

  q('prof-t0-2','4.5',4,'conceptual',3,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        גביש דביי: מדוע <M tex="C_V\propto T^3" /> בלבד עבור <M tex="T\ll\Theta_D" />,
        ואיזה שגיאה עושים כשמשתמשים בזה לכל T?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <BlockMath tex="C_V^{Debye}=9Nk_B\left(\frac{T}{\Theta_D}\right)^3\int_0^{\Theta_D/T}\!\frac{x^4e^x}{(e^x-1)^2}\,dx" />
      <p>
        בגבול <M tex="T\ll\Theta_D" />: גבול העליון → ∞, אינטגרל → קבוע (4π⁴/15) →
        <M tex="C_V\propto T^3" />.
      </p>
      <p>
        עבור <M tex="T\gg\Theta_D" />: <M tex="C_V\to3Nk_B" /> (דולונג-פטי), לא T³.
      </p>
      <p className="text-xs opacity-70">
        ⚠️ T³ תקף רק ב-T≪Θ_D. כלל: הכנס ערכים ובדוק!
      </p>
    </div>,
    ['debye','T-cubed','low-temperature','heat-capacity','Debye-limit']),

  // ── אנומליה שוטקי (Schottky) ──────────────────────────────────────
  q('prof-schottky1','4.1',4,'numeric',3,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        N אטומים עם שני מצבים: אנרגיות 0 ו-ε. הראו שמקסימום <M tex="C_V" />
        (אנומליית שוטקי) מתרחש בערך בגובה <M tex="0.44Nk_B" />
        בטמפרטורה <M tex="k_BT^*\approx 0.42\varepsilon" />.
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <BlockMath tex="C_V=Nk_B\left(\frac{\varepsilon}{k_BT}\right)^2\frac{e^{\varepsilon/k_BT}}{(1+e^{\varepsilon/k_BT})^2}" />
      <p>
        נגזור ונשווה לאפס. תוצאה נומרית (פתרון משוואה טרנסצנדנטית):
      </p>
      <p>
        <M tex="x^*=\varepsilon/k_BT^*\approx 2.40" /> →
        <M tex="k_BT^*\approx 0.42\varepsilon" />
      </p>
      <p>
        גובה מקסימום: <M tex="C_V^{max}\approx0.44Nk_B" />
      </p>
      <p className="text-xs opacity-70">
        המרצה אוהב לשאול: "מה קורה לאחר הפיק?" — C_V→0 מחדש.
      </p>
    </div>,
    ['schottky','two-level','heat-capacity','maximum','numeric']),

  // ── צפיפות מצבים: 3D מול 2D ──────────────────────────────────────
  q('prof-dos1','5.2',5,'conceptual',3,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        גז אלקטרונים <strong>דו-ממדי</strong> (שטח A, לא נפח V).
        מה צפיפות המצבים <M tex="g(\varepsilon)" /> ב-2D?
        כיצד שונה אנרגיית פרמי מהמקרה התלת-ממדי?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p><strong>2D:</strong> ספירת מצבים בעיגול k-מרחב:</p>
      <BlockMath tex="N=2\cdot\frac{A}{(2\pi)^2}\cdot\pi k_F^2\Rightarrow k_F=\sqrt{2\pi n_s}" />
      <p>
        צפיפות מצבים לשטח: <M tex="g_{2D}(\varepsilon)=\frac{m}{\pi\hbar^2}=\text{const}" />
        (לא תלוי באנרגיה!)
      </p>
      <BlockMath tex="E_F^{2D}=\frac{\hbar^2 k_F^2}{2m}=\frac{\pi\hbar^2 n_s}{m}" />
      <p>
        <strong>הפרש מ-3D:</strong> ב-3D <M tex="g(\varepsilon)\propto\sqrt{\varepsilon}" />;
        ב-2D g קבוע → תכונות שונות לחלוטין.
      </p>
      <p className="text-xs opacity-70">⚠️ רמת פרמי ב-2D: <M tex="\chi_{Pauli}" /> לא תלוי בצפיפות!</p>
    </div>,
    ['density-of-states','2D','fermi-energy','pauli-paramagnetism']),

  q('prof-dos2','5.2',5,'conceptual',3,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        רגישות מגנטית (Pauli) של גז אלקטרונים ב-3D:
        <M tex="\chi_{Pauli}\propto g(E_F)\propto n^{1/3}" />.
        ב-2D: <M tex="g_{2D}=const" />.
        מה ניבוי שונה עבור <M tex="\chi" /> ב-2D?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p>
        <strong>3D:</strong> <M tex="\chi_{Pauli}\propto g(E_F)\propto E_F^{-1/2}\cdot n^{1/3}" />
        — תלוי בצפיפות.
      </p>
      <p>
        <strong>2D:</strong> <M tex="g_{2D}=m/(\pi\hbar^2)" /> קבוע →
        <M tex="\chi_{Pauli}^{2D}\propto g_{2D}=\text{const}" />
      </p>
      <p>
        מסקנה: ב-גז אלקטרונים 2D, הרגישות המגנטית <em>אינה תלויה</em> בצפיפות המשטח!
        זה ניבוי ניסיוני שנבדק במבנים קוונטיים (GaAs heterostructures).
      </p>
      <p className="text-xs opacity-70">
        שאלת "DOF extra twist" של המרצה: עשה 2D במקום 3D.
      </p>
    </div>,
    ['pauli-paramagnetism','2D','density-of-states','susceptibility','fermi-gas']),

  // ── שאלת "Extra DOF Twist" — תבנית מועדפת ────────────────────────
  q('prof-dof1','4.4',4,'conceptual',3,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        גז H₂ (דו-אטומי). בתחום קלאסי: <M tex="C_V=(5/2)Nk_B" />.
        הוסיפו: כל מולקולה גם ספין-½ (מומנט <M tex="\mu_0" />) בשדה B.
      </p>
      <p className="font-semibold">מה <M tex="C_V" /> הכולל? האם ה-DOF המגנטי תמיד פעיל?</p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p>
        שתי הדרגות עצמאיות → <M tex="Z_1=Z_{mech}\cdot Z_{spin}" />
      </p>
      <BlockMath tex="C_V=\underbrace{\frac{5}{2}Nk_B}_{\text{מכני}}+\underbrace{C_V^{spin}}_{\text{מגנטי}}" />
      <p>
        <M tex="C_V^{spin}=Nk_B\left(\frac{\mu_0 B}{k_BT}\right)^2\!\text{sech}^2\!\left(\frac{\mu_0 B}{k_BT}\right)" />
      </p>
      <p>
        הפעלה: <M tex="k_BT\sim\mu_0 B" />.
        ב-<M tex="T\gg\mu_0B/k_B" />: <M tex="C_V^{spin}\to0" /> (ה-DOF המגנטי "כבוי").
      </p>
      <p className="text-xs opacity-70">
        ⚠️ תבנית המרצה: הוסף DOF → בדוק באיזה T הוא מתעורר.
      </p>
    </div>,
    ['diatomic','magnetic-DOF','heat-capacity','activation','extra-dof']),

  q('prof-dof2','4.3',4,'conceptual',3,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        גז חד-אטומי N אטומים בנפח V. כל אטום גם <strong>מצב אלקטרוני פנימי</strong>
        בעל ניוון <M tex="g_e=3" /> ואנרגיה אפס (מצב בסיס).
      </p>
      <p className="font-semibold">
        כיצד משפיע הניוון על F, S, <M tex="\mu" />?
        האם הוא משפיע על <M tex="C_V" />?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p>
        <M tex="Z_1=Z_{trans}\cdot Z_{elec}" />, כאשר <M tex="Z_{elec}=g_e=3" /> (לא תלוי ב-T!)
      </p>
      <BlockMath tex="F=-Nk_BT\ln Z_1=-Nk_BT(\ln Z_{trans}+\ln 3)" />
      <p>
        <M tex="\Delta F=-Nk_BT\ln 3" />,
        <M tex="\Delta S=Nk_B\ln 3" /> (אנטרופיית תצורה)
      </p>
      <p>
        <M tex="\Delta\mu=-k_BT\ln 3" /> (מוריד את הפוטנציאל הכימי)
      </p>
      <p>
        <strong>C_V לא מושפע</strong>: <M tex="\ln 3" /> קבוע → נגזרת שנייה של F לפי T = 0.
      </p>
      <p className="text-xs opacity-70">
        ⚠️ ניוון קבוע משנה S ו-μ אך לא C_V — שאלת מבחן קלאסית!
      </p>
    </div>,
    ['degeneracy','free-energy','entropy','chemical-potential','Cv-unchanged']),

  // ── גבול T→∞ על ספינים ───────────────────────────────────────────
  q('prof-tinf1','2.5',2,'conceptual',2,
    <div className="space-y-1 text-sm" dir="rtl">
      <p>
        N ספינים-½ פרה-מגנטיים, שדה B. הרגישות המגנטית (Curie):
        <M tex="\chi=\frac{N\mu_0^2}{k_BT}" />.
      </p>
      <p className="font-semibold">
        מה קורה ל-<M tex="\chi" /> כאשר <M tex="T\to0" /> ו-<M tex="T\to\infty" />?
        מה האיום ב-<M tex="T=0" />?
      </p>
    </div>,
    <div className="text-sm space-y-2" dir="rtl">
      <p>
        <M tex="T\to\infty" />: <M tex="\chi\to0" /> — מגנטיות נעלמת (חום מערבב ספינים)
      </p>
      <p>
        <M tex="T\to0" />: <M tex="\chi\to\infty" /> (לפי קירוב קורי)
      </p>
      <p>
        <strong>האיום:</strong> קירוב קורי שבור ב-T→0!
        בפועל: ב-T נמוך <M tex="M\to N\mu_0" /> (רווייה מגנטית) — לא אינסוף.
      </p>
      <p className="text-xs opacity-70">
        הנוסחה המדויקת עם Langevin/tanh נותנת רווייה; קורי תקף רק ב-<M tex="\mu_0B\ll k_BT" />.
      </p>
    </div>,
    ['paramagnetism','curie-law','T-to-zero','saturation','limits']),
]

// ════════════════════════════════════════════════════════════════════
// מאגר מלא
// ════════════════════════════════════════════════════════════════════
export const PRACTICE_BANK: PracticeQuestion[] = [
  ...unit1,
  ...unit2,
  ...unit3,
  ...unit4,
  ...unit5,
  ...extra,
  ...profStyle,
]
