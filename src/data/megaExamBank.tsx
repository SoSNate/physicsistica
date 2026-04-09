/**
 * megaExamBank — 6 real Open University exam questions
 * Each MegaQuestion has 3-4 parts, 25 pts each, totaling ~100 pts.
 *
 * Sources: 2022ב מועד א, 2022ב מועד ב, 2023ב מועד 84, 2024ב מועד 81
 */
import type { MegaQuestion } from '../types'
import { BlockMath } from '../components/MathBlock'

export const MEGA_EXAM_BANK: MegaQuestion[] = [

  // ─────────────────────────────────────────────────────────────────
  // 2022ב מועד א — שאלה 1: מערכת 1D עם 3 מצבים (יחידה 2)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'm2022a-q1',
    unitId: 2,
    source: '2022ב מועד א, שאלה 1',
    totalPoints: 100,
    context: (
      <div className="space-y-3 text-sm leading-relaxed" dir="rtl">
        <p>
          מערכת של <strong>N חלקיקים עצמאיים</strong> בחד-מימד. לכל חלקיק שלושה מצבים אפשריים:
        </p>
        <ul className="list-disc list-inside space-y-1 pr-2 text-sm">
          <li>מצב 1: אנרגיה <strong>ε₀</strong>, אורך <strong>a</strong></li>
          <li>מצב 2: אנרגיה <strong>ε₀</strong>, אורך <strong>b</strong></li>
          <li>מצב 3: אנרגיה <strong>0</strong>, אורך <strong>b</strong></li>
        </ul>
        <p>
          האנרגיה הכוללת של המערכת היא <strong>E</strong> והאורך הכולל הוא <strong>L</strong>.
          מספר החלקיקים במצב 1 הוא <em>n₁</em>, במצב 2 הוא <em>n₂</em>, במצב 3 הוא <em>n₃</em>.
        </p>
        <p className="text-xs opacity-70">נתון: n₁+n₂+n₃=N, n₁ε₀+n₂ε₀=E, n₁a+(n₂+n₃)b=L</p>
      </div>
    ),
    parts: [
      {
        id: 'א',
        points: 30,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק א — פונקציית הריבוי</p>
            <p className="text-sm">
              מצאו את <strong>Γ(E, L, N)</strong> — מספר המיקרו-מצבים התואמים לאנרגיה E ואורך L.
            </p>
            <p className="text-xs opacity-70">
              רמז: בטאו n₁, n₂, n₃ בעזרת E, L, N, ואז חשבו את מספר הדרכים להפיץ.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm font-semibold">פתרון:</p>
            <p className="text-sm">
              משלוש המשוואות: n₁ = (L − Nb)/[(a−b)] · ... נקבל כי n₁ ו-n₂ קבועים ע"י E ו-L:
            </p>
            <BlockMath tex="n_1 = \frac{L - Nb}{a - b}, \quad n_3 = N - n_1 - n_2, \quad n_2 = \frac{E}{\varepsilon_0} - n_1" />
            <p className="text-sm">מספר המיקרו-מצבים הוא מקדם הבינום הרב-ממדי:</p>
            <BlockMath tex="\Gamma(E,L,N) = \frac{N!}{n_1!\, n_2!\, n_3!}" />
          </div>
        ),
        trapId: 'S0_T0',
      },
      {
        id: 'ב',
        points: 30,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ב — אנטרופיה</p>
            <p className="text-sm">
              חשבו את האנטרופיה <strong>S(E, L, N)</strong> בקירוב סטרלינג.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm font-semibold">פתרון:</p>
            <BlockMath tex="S = k_B \ln \Gamma = k_B \ln \frac{N!}{n_1!\,n_2!\,n_3!}" />
            <p className="text-sm">בקירוב סטרלינג (ln n! ≈ n ln n − n):</p>
            <BlockMath tex="S = k_B \bigl[N\ln N - n_1\ln n_1 - n_2\ln n_2 - n_3\ln n_3\bigr]" />
          </div>
        ),
      },
      {
        id: 'ג',
        points: 40,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ג — טמפרטורה</p>
            <p className="text-sm">
              גזרו את הטמפרטורה מהגדרה סטטיסטית: <strong>1/T = ∂S/∂E</strong>.
            </p>
            <p className="text-xs opacity-70">
              ⚠️ שימו לב: כאשר S=0 בגבול מסוים, האם בהכרח T=0?
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm font-semibold">פתרון:</p>
            <BlockMath tex="\frac{1}{T} = \frac{\partial S}{\partial E}\bigg|_{L,N} = \frac{k_B}{\varepsilon_0}\ln\frac{n_3}{n_2}" />
            <p className="text-sm">כלומר:</p>
            <BlockMath tex="T = \frac{\varepsilon_0}{k_B \ln(n_3/n_2)}" />
            <p className="text-sm font-semibold text-red-500">
              כאשר n₂=n₃ → T→∞ (לא T=0!). S=0 קורה רק כש-n₁=N או n₃=N — מצב ייחודי, לאו דווקא T=0.
            </p>
          </div>
        ),
        trapId: 'S0_T0',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2022ב מועד א — שאלה 2: גביש איינשטיין + מומנט מגנטי (יחידה 4)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'm2022a-q2',
    unitId: 4,
    source: '2022ב מועד א, שאלה 2',
    totalPoints: 100,
    context: (
      <div className="space-y-3 text-sm leading-relaxed" dir="rtl">
        <p>
          גביש איינשטיין של <strong>N אוסילטורים הרמוניים</strong> על רשת, כל אחד בתדר ω.
          בנוסף, לכל אוסילטור מומנט מגנטי שיכול להיות <strong>+μ₀</strong> או <strong>−μ₀</strong>.
        </p>
        <p>
          שדה מגנטי חיצוני <strong>B</strong> מופעל על הגביש.
          האנרגיה של אוסילטור בודד עם ספין σ = ±1 ורמת n:
        </p>
        <BlockMath tex="\varepsilon_{n,\sigma} = \hbar\omega\!\left(n+\tfrac{1}{2}\right) - \sigma\mu_0 B, \quad n=0,1,2,\ldots" />
        <p className="text-xs opacity-70">
          האוסילטורים <strong>מובחנים</strong> — הם יושבים על אתרים קבועים ברשת.
        </p>
      </div>
    ),
    parts: [
      {
        id: 'א',
        points: 30,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק א — Z₁ לאוסילטור בודד</p>
            <p className="text-sm">
              חשבו את פונקצית החלוקה Z₁ לאוסילטור בודד (סכמו על n ועל σ).
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm font-semibold">פתרון:</p>
            <BlockMath tex="Z_1 = \sum_{n=0}^{\infty}\sum_{\sigma=\pm1} e^{-\beta\hbar\omega(n+\frac{1}{2})+\beta\sigma\mu_0 B}" />
            <BlockMath tex="= \underbrace{\frac{e^{-\beta\hbar\omega/2}}{1-e^{-\beta\hbar\omega}}}_{Z_{\text{osc}}} \cdot \underbrace{2\cosh(\beta\mu_0 B)}_{Z_{\text{spin}}}" />
          </div>
        ),
        trapId: 'N_factorial',
      },
      {
        id: 'ב',
        points: 30,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ב — Z_N לכל הגביש</p>
            <p className="text-sm">
              כיצד מחשבים Z_N מ-Z₁? האם מחלקים ב-N! ?
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">
              האוסילטורים <strong>מובחנים</strong> (אתרים ברשת) — אין כפילות קלאסית:
            </p>
            <BlockMath tex="Z_N = (Z_1)^N \quad \text{(ללא חלוקה ב-}N!\text{!)}" />
            <p className="text-sm font-semibold text-red-500">
              לגז חופשי (בלתי-מובחן): Z_N = Z₁^N / N!. לרשת: אסור לחלק ב-N!
            </p>
          </div>
        ),
        trapId: 'N_factorial',
      },
      {
        id: 'ג',
        points: 40,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ג — אנרגיה וקיבול חום</p>
            <p className="text-sm">
              מצאו <strong>⟨E⟩</strong> ו-<strong>C_V</strong> לגביש כולו.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="\langle E\rangle = -\frac{\partial \ln Z_N}{\partial\beta} = N\!\left[\frac{\hbar\omega}{2}+\frac{\hbar\omega}{e^{\beta\hbar\omega}-1} - \mu_0 B\tanh(\beta\mu_0 B)\right]" />
            <BlockMath tex="C_V = \frac{\partial\langle E\rangle}{\partial T} = Nk_B\!\left[{\left(\frac{\hbar\omega}{k_BT}\right)^2\!\frac{e^{\beta\hbar\omega}}{(e^{\beta\hbar\omega}-1)^2}} + \frac{(\mu_0 B)^2}{k_B^2 T^2}\,\text{sech}^2(\beta\mu_0 B)\right]" />
          </div>
        ),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2022ב מועד ב — שאלה 3: O₂+O₃ שיווי משקל כימי (יחידה 5)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'm2022b-q3',
    unitId: 5,
    source: '2022ב מועד ב, שאלה 3',
    totalPoints: 100,
    context: (
      <div className="space-y-3 text-sm leading-relaxed" dir="rtl">
        <p>
          תערובת של גז <strong>O₂</strong> וגז <strong>O₃</strong> בשיווי משקל תרמי ב-T.
          בכלי הם מתנהגים כ<strong>גזים אידאליים</strong>.
          התגובה הכימית במשקל:
        </p>
        <BlockMath tex="3\,\text{O}_2 \;\rightleftharpoons\; 2\,\text{O}_3" />
        <p>
          הפרש האנרגיה הפנימית לתגובה: <strong>ΔE = ε</strong> (אנרגיה נדרשת ליצור 2 מולקולות O₃ מ-3 O₂).
        </p>
        <p className="text-xs opacity-70">
          מסת O₂: m₂, מסת O₃: m₃ = (3/2)m₂. ריכוזים: n₂ = N₂/V, n₃ = N₃/V.
        </p>
      </div>
    ),
    parts: [
      {
        id: 'א',
        points: 30,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק א — פוטנציאל כימי</p>
            <p className="text-sm">
              כתבו את הפוטנציאל הכימי <strong>μ</strong> לגז אידאלי חד-אטומי כפונקציה של T ו-n.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm font-semibold">פתרון:</p>
            <BlockMath tex="\mu(T,n) = -k_BT\ln\!\left(\frac{n_Q(T)}{n}\right), \quad n_Q = \left(\frac{mk_BT}{2\pi\hbar^2}\right)^{3/2}" />
            <p className="text-sm">
              μ <strong>אינו</strong> רק ³⁄₂k_BT! הוא כולל גם איבר לוגריתמי בצפיפות — שנובע מהאנטרופיה.
            </p>
          </div>
        ),
        trapId: 'mu_kinetic',
      },
      {
        id: 'ב',
        points: 35,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ב — תנאי שיווי המשקל</p>
            <p className="text-sm">
              כתבו את תנאי שיווי המשקל הכימי למינימום אנרגיה חופשית, ופשטו.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">
              בשיווי משקל: שינוי בN₂ ובN₃ בהתאם לסטויכיומטריה (dN₂=−3δ, dN₃=+2δ):
            </p>
            <BlockMath tex="3\mu(\text{O}_2) = 2\mu(\text{O}_3)" />
            <p className="text-sm">זהו המקבילה לחוק הפעולה-מסה (law of mass action).</p>
          </div>
        ),
      },
      {
        id: 'ג',
        points: 35,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ג — יחס הצפיפויות</p>
            <p className="text-sm">
              מצאו את <strong>n₃² / n₂³</strong> כפונקציה של T.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">הצבת הנוסחה לμ לתוך תנאי שיווי המשקל:</p>
            <BlockMath tex="\frac{n_3^2}{n_2^3} = \frac{n_{Q,3}^2}{n_{Q,2}^3}\,e^{-\beta\varepsilon} = \left(\frac{m_3}{m_2}\right)^3 \!\left(\frac{k_BT}{2\pi\hbar^2}\right)^{-3/2} e^{-\varepsilon/(k_BT)}" />
            <p className="text-sm">
              ה-Boltzmann factor e^&#123;-βε&#125; שולט: בT נמוך — בעיקר O₂; בT גבוה — יותר O₃.
            </p>
          </div>
        ),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2023ב מועד 84 — שאלה 2: גביש 3D + מומנט 3 ערכים (יחידה 4)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'm2023-q2',
    unitId: 4,
    source: '2023ב מועד 84, שאלה 2',
    totalPoints: 100,
    context: (
      <div className="space-y-3 text-sm leading-relaxed" dir="rtl">
        <p>
          גביש תלת-מימדי של <strong>N אטומים</strong>. לכל אטום מומנט מגנטי מגנטי עם שלושה ערכים:
        </p>
        <BlockMath tex="m = -1,\; 0,\; +1" />
        <p>
          שדה מגנטי חיצוני <strong>B</strong>. אנרגיית אינטראקציה: ε = −m·μ_B·B.
          האטומים <strong>קבועים על אתרי הרשת</strong> (מובחנים).
        </p>
      </div>
    ),
    parts: [
      {
        id: 'א',
        points: 30,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק א — Z₁ לאטום יחיד</p>
            <p className="text-sm">
              חשבו Z₁ וציינו בבירור אם אתם מחלקים ב-N! ולמה.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="Z_1 = e^{\beta\mu_B B} + 1 + e^{-\beta\mu_B B} = 1 + 2\cosh(\beta\mu_B B)" />
            <BlockMath tex="Z_N = Z_1^N \quad \text{(מובחנים — אין N!)}" />
          </div>
        ),
        trapId: 'Z_count',
      },
      {
        id: 'ב',
        points: 35,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ב — ⟨m⟩ ו-⟨E⟩</p>
            <p className="text-sm">
              מצאו את הממוצע ⟨m⟩ לאטום ואת האנרגיה הכוללת ⟨E⟩.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="\langle m\rangle = \frac{2\sinh(\beta\mu_B B)}{1+2\cosh(\beta\mu_B B)}" />
            <BlockMath tex="\langle E\rangle = -N\mu_B B\langle m\rangle = -\frac{2N\mu_B B\sinh(\beta\mu_B B)}{1+2\cosh(\beta\mu_B B)}" />
          </div>
        ),
      },
      {
        id: 'ג',
        points: 35,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ג — גבולות</p>
            <p className="text-sm">
              מה הגבולות של ⟨m⟩ כאשר T→0 וכאשר T→∞?
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm font-semibold">T→0 (β→∞):</p>
            <BlockMath tex="\langle m\rangle \to 1 \quad\text{(המצב m=+1 שולט)}" />
            <p className="text-sm font-semibold">T→∞ (β→0):</p>
            <BlockMath tex="\langle m\rangle \to \frac{2\beta\mu_B B}{3} \to 0 \quad\text{(כל המצבים שווים, Z\to3)}" />
            <p className="text-sm">
              ⚠️ בT→∞: Z₁→3 = <em>מספר המצבים</em>. זה הגבול הנכון, לא הכלל הכללי.
            </p>
          </div>
        ),
        trapId: 'Z_count',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2024ב מועד 81 — שאלה 1: דיפול חשמלי 5 ערכים (יחידה 4)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'm2024-q1',
    unitId: 4,
    source: '2024ב מועד 81, שאלה 1',
    totalPoints: 100,
    context: (
      <div className="space-y-3 text-sm leading-relaxed" dir="rtl">
        <p>
          מערכת של <strong>N אטומים עצמאיים</strong>. לכל אטום דיפול חשמלי P עם חמישה ערכים:
        </p>
        <BlockMath tex="P \in \{0,\;\pm P_0,\;\pm 2P_0\}" />
        <p>
          שדה חשמלי חיצוני <strong>ℰ</strong>. אנרגיית אינטראקציה: ε = −P·ℰ.
        </p>
      </div>
    ),
    parts: [
      {
        id: 'א',
        points: 30,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק א — Z₁ לאטום יחיד</p>
            <p className="text-sm">
              חשבו את פונקצית החלוקה Z₁. פשטו עם cosh.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="Z_1 = \sum_P e^{\beta P\mathcal{E}} = e^0 + e^{\beta P_0\mathcal{E}} + e^{-\beta P_0\mathcal{E}} + e^{2\beta P_0\mathcal{E}} + e^{-2\beta P_0\mathcal{E}}" />
            <BlockMath tex="= 1 + 2\cosh(\beta P_0\mathcal{E}) + 2\cosh(2\beta P_0\mathcal{E})" />
            <p className="text-sm font-semibold text-red-500">
              ⚠️ Z₁ ≠ 5 ! בטמפ׳ כללית יש לשקלל. רק בT→∞: cosh→1 ולכן Z₁→5.
            </p>
          </div>
        ),
        trapId: 'Z_count',
      },
      {
        id: 'ב',
        points: 35,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ב — ⟨P⟩ ו-⟨E⟩</p>
            <p className="text-sm">
              מצאו את הפולריזציה הממוצעת ⟨P⟩ לאטום ואת האנרגיה הממוצעת ⟨E⟩.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="\langle E\rangle = -\frac{\partial\ln Z_N}{\partial\beta} = -N\frac{\partial\ln Z_1}{\partial\beta}" />
            <BlockMath tex="= -N\mathcal{E}\cdot\frac{P_0\sinh(\beta P_0\mathcal{E}) + 2P_0\sinh(2\beta P_0\mathcal{E})}{1+2\cosh(\beta P_0\mathcal{E})+2\cosh(2\beta P_0\mathcal{E})}" />
          </div>
        ),
      },
      {
        id: 'ג',
        points: 35,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ג — קיבול חום בT→∞</p>
            <p className="text-sm">
              חשבו את C_V בגבול T→∞. מה אפשר לאמר על תרומת הדרגות חופש?
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">בT→∞ פותחים לפי סדר β² (פיתוח קטן של cosh):</p>
            <BlockMath tex="\langle E\rangle \approx -N\mathcal{E}^2\beta\,\frac{P_0^2+4P_0^2}{5} = -\frac{N\mathcal{E}^2\beta\cdot 5P_0^2}{5}" />
            <BlockMath tex="C_V = \frac{\partial\langle E\rangle}{\partial T} \approx \frac{N(P_0\mathcal{E})^2}{k_BT^2}\cdot\text{const}" />
            <p className="text-sm">זהו מקרה של מדינת הבולצמן: C_V∝1/T² — לא k_B/2 לדרגת חופש!</p>
          </div>
        ),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2024ב מועד 81 — שאלה 4: אלקטרונים + שדה מגנטי (יחידה 5)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'm2024-q4',
    unitId: 5,
    source: '2024ב מועד 81, שאלה 4',
    totalPoints: 100,
    context: (
      <div className="space-y-3 text-sm leading-relaxed" dir="rtl">
        <p>
          <strong>N אלקטרונים</strong> בקובייה בת נפח V. שדה מגנטי חיצוני <strong>H</strong>.
          לכל אלקטרון ספין σ = ±1 (up/down).
        </p>
        <p>האנרגיה האינדיווידואלית:</p>
        <BlockMath tex="\varepsilon_{k,\sigma} = \frac{\hbar^2 k^2}{2m} - \sigma\mu_B H" />
        <p>
          בT=0 ובH=0, אנרגיית פרמי: <strong>E_F</strong>.
          צפיפות מצבים: <strong>g(E) = C·√E</strong> (תלת-מימדי).
        </p>
        <p className="text-xs opacity-70">
          C = (V/2π²)(2m/ħ²)^{3/2}. ריכוז: n = N/V.
        </p>
      </div>
    ),
    parts: [
      {
        id: 'א',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק א — אנרגיית פרמי בT=0, H=0</p>
            <p className="text-sm">
              מצאו <strong>E_F</strong> כפונקציה של n (ריכוז האלקטרונים).
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">בT=0: N = ∫₀^E_F g(ε) dε (פקטור 2 לספין):</p>
            <BlockMath tex="N = 2\int_0^{E_F} C\sqrt{\varepsilon}\,d\varepsilon = \frac{4C}{3}E_F^{3/2}" />
            <BlockMath tex="E_F = \frac{\hbar^2}{2m}\left(3\pi^2 n\right)^{2/3}" />
          </div>
        ),
      },
      {
        id: 'ב',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ב — מגנטיזציה</p>
            <p className="text-sm">
              כתבו את המגנטיזציה <strong>M = μ_B(N↑ − N↓)</strong> בT=0 עבור שדה H קטן.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">בT=0 ובH קטן, הספינים עד E_F±μ_BH מתמלאים:</p>
            <BlockMath tex="N_\uparrow - N_\downarrow \approx g(E_F)\cdot \mu_B H" />
            <BlockMath tex="M = \mu_B^2 H \cdot g(E_F) = \mu_B^2 H \cdot \frac{3N}{2E_F}" />
          </div>
        ),
        trapId: 'fFD_T0_only',
      },
      {
        id: 'ג',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ג — Pauli susceptibility</p>
            <p className="text-sm">
              חשבו <strong>χ = ∂M/∂H</strong> בT=0. מה מבדיל אותו מ-Curie (χ∝1/T)?
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="\chi_{\text{Pauli}} = \mu_B^2 g(E_F) = \frac{3N\mu_B^2}{2E_F} = \text{const}(T)" />
            <p className="text-sm">
              Pauli: χ לא תלוי T. Curie (ספינים מובחנים): χ∝1/T.
              ההבדל: עקרון האיסור של פרמי — רוב האלקטרונים "קפואים" מתחת ל-E_F.
            </p>
          </div>
        ),
        trapId: 'fFD_T0_only',
      },
      {
        id: 'ד',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ד — היפוך שדה</p>
            <p className="text-sm">
              שדה H מופעל, המערכת בשיווי משקל. לאחר מכן מהפכים את כיוון H.
              מה קורה לצפיפויות n↑ ו-n↓ ולמה?
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">
              לפני היפוך: n↑ {'>'} n↓ (ספינות מקבילות לH גבוהות יותר).
              אחרי היפוך: H→−H, אך מיידית n↑ ו-n↓ עדיין אסימטריים.
              המערכת <strong>לא בשיווי משקל</strong> — אלקטרונים יתפזרו עד שמגיעים לμ(↑)=μ(↓):
            </p>
            <BlockMath tex="\mu_\uparrow = \mu_\downarrow \;\Rightarrow\; f(\mu) = \tfrac{1}{2} \text{ לכל T}" />
            <p className="text-sm font-semibold text-red-500">
              f(μ)=½ היא תמיד נכון — לא רק ב-T=0! זוהי הגדרת μ.
            </p>
          </div>
        ),
        trapId: 'fFD_T0_only',
      },
    ],
  },
]

// Build exam: pick 4 random questions
export function buildMegaExam(): MegaQuestion[] {
  const pool = [...MEGA_EXAM_BANK]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 4)
}

// Trap metadata for results display
export const TRAP_META: Record<string, { label: string; nodeId: string }> = {
  S0_T0:       { label: 'S=0 ≠ T=0',               nodeId: '2.3' },
  Z_count:     { label: 'Z ≠ מספר המצבים',          nodeId: '4.1' },
  N_factorial: { label: 'N! רק לבלתי-מובחנים',      nodeId: '4.2' },
  T3_all_temps:{ label: 'T³ רק ב-T≪Θ_D',           nodeId: '4.5' },
  mu_kinetic:  { label: 'μ ≠ אנרגיה קינטית',        nodeId: '5.1' },
  fFD_T0_only: { label: 'f(μ)=½ תמיד (לא רק T=0)',  nodeId: '5.2' },
}
