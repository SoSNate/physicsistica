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

  // ─────────────────────────────────────────────────────────────────
  // [מקורית] שאלה 7: גביש מולקולרי — תנודה + מצב אלקטרוני מנוון (יחידה 4)
  // ━━ דפוס המרצה: הוספת DOF שני עם ניוון (degeneracy) לא-מצופה ━━
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'orig-q1',
    unitId: 4,
    source: 'שאלה מקורית — ראש המרצה (יחידה 4)',
    totalPoints: 100,
    context: (
      <div className="space-y-3 text-sm leading-relaxed" dir="rtl">
        <p>
          גביש של <strong>N מולקולות דו-אטומיות</strong> קבועות על אתרי רשת (מובחנות).
          לכל מולקולה שתי דרגות חופש עצמאיות:
        </p>
        <ul className="list-disc list-inside space-y-1 pr-2">
          <li>
            <strong>תנודה</strong> בין שני האטומים — אוסילטור הרמוני קוונטי בתדר <strong>ω</strong>
          </li>
          <li>
            <strong>מצב אלקטרוני</strong>: מצב בסיס (אנרגיה 0) <em>או</em> מצב מעורר
            (אנרגיה <strong>Δ</strong>) שהוא <strong>שלוש-כפול מנוון</strong> (g=3)
          </li>
        </ul>
        <p className="text-xs opacity-70">
          הנחות: המולקולות עצמאיות. שתי הדרגות אינן מצומדות.
        </p>
      </div>
    ),
    parts: [
      {
        id: 'א',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק א — Z₁ למולקולה בודדת</p>
            <p className="text-sm">
              כתבו את פונקצית החלוקה Z₁ = Z_vib · Z_elec.
              כתבו את Z_elec בבירור — שימו לב לניוון!
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="Z_{\text{vib}} = \frac{e^{-\beta\hbar\omega/2}}{1 - e^{-\beta\hbar\omega}}" />
            <BlockMath tex="Z_{\text{elec}} = 1 + 3e^{-\beta\Delta}" />
            <p className="text-sm">
              ⚠️ המצב המעורר <strong>שלוש-כפול מנוון</strong> — גורם 3, לא 1!
            </p>
            <BlockMath tex="Z_1 = Z_{\text{vib}} \cdot Z_{\text{elec}} = \frac{e^{-\beta\hbar\omega/2}}{1 - e^{-\beta\hbar\omega}}\cdot(1 + 3e^{-\beta\Delta})" />
          </div>
        ),
        trapId: 'Z_count',
      },
      {
        id: 'ב',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ב — Z_N וּפוטנציאל הלמהולץ</p>
            <p className="text-sm">
              כיצד תמצאו Z_N? האם מחלקים ב-N!? הוציאו F = -k_BT ln Z_N.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">
              המולקולות <strong>מובחנות</strong> (אתרי רשת קבועים) — אין כפל קלאסי:
            </p>
            <BlockMath tex="Z_N = (Z_1)^N \quad \text{ללא N!}" />
            <BlockMath tex="F = -Nk_BT\!\left[\ln Z_{\text{vib}} + \ln(1+3e^{-\beta\Delta})\right]" />
          </div>
        ),
        trapId: 'N_factorial',
      },
      {
        id: 'ג',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ג — קיבול חום C_V</p>
            <p className="text-sm">
              חשבו C_V = -T(∂²F/∂T²). הראו שיש שני תרומות מופרדות.
              בשום טמפרטורה עדיפה תרומת ה-Schottky?
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="C_V = C_{\text{vib}} + C_{\text{elec}}" />
            <BlockMath tex="C_{\text{vib}} = Nk_B\left(\frac{\hbar\omega}{k_BT}\right)^2\frac{e^{\beta\hbar\omega}}{(e^{\beta\hbar\omega}-1)^2}" />
            <BlockMath tex="C_{\text{elec}} = Nk_B\left(\frac{\Delta}{k_BT}\right)^2\frac{3e^{-\beta\Delta}}{(1+3e^{-\beta\Delta})^2}" />
            <p className="text-sm">
              C_elec (Schottky) מגיע לפסגה סביב k_BT ≈ 0.4Δ.
              C_vib גדל מונוטונית. בT נמוך מספיק (k_BT ≪ Δ, ℏω), C_elec שולט.
            </p>
          </div>
        ),
      },
      {
        id: 'ד',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ד — גבולות אסימפטוטיים</p>
            <p className="text-sm">
              מצאו את C_V בגבולות T→0 ו-T→∞. בדקו מול משפט שיוות-החלוקה.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm font-semibold">T→0:</p>
            <BlockMath tex="C_{\text{vib}} \to 0 \text{ (exp.)}, \quad C_{\text{elec}} \to 3Nk_B\!\left(\frac{\Delta}{k_BT}\right)^2 e^{-\Delta/k_BT} \to 0" />
            <p className="text-sm font-semibold">T→∞:</p>
            <BlockMath tex="C_{\text{vib}} \to Nk_B \;(\text{equipartition: 1 DOF}), \quad C_{\text{elec}} \to 0" />
            <BlockMath tex="C_V \to Nk_B \quad (T\to\infty)" />
            <p className="text-sm">
              ⚠️ הניוון (g=3) לא תורם ל-C_V ב-T→∞! (C_elec מגיע לפסגה ואז יורד ל-0)
            </p>
          </div>
        ),
        trapId: 'Z_count',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // [מקורית] שאלה 8: שרשרת פולימר שלושה-מצבים (יחידה 2)
  // ━━ דפוס המרצה: מינומיאל (לא בינומיאל!), אלסטיות קווית מאנטרופיה ━━
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'orig-q2',
    unitId: 2,
    source: 'שאלה מקורית — ראש המרצה (יחידה 2)',
    totalPoints: 100,
    context: (
      <div className="space-y-3 text-sm leading-relaxed" dir="rtl">
        <p>
          שרשרת פולימר של <strong>N מונומרים</strong> עצמאיים. לכל מונומר שלושה מצבים:
        </p>
        <ul className="list-disc list-inside space-y-1 pr-2">
          <li>מצב ימין (+a, אנרגיה 0) — מספר מונומרים: <strong>n₊</strong></li>
          <li>מצב שמאל (−a, אנרגיה 0) — מספר מונומרים: <strong>n₋</strong></li>
          <li>מצב מקופל (אורך 0, אנרגיה <strong>ε₀ {'>'} 0</strong>) — מספר מונומרים: <strong>n₀</strong></li>
        </ul>
        <p>
          אורך כולל: <strong>L = (n₊ − n₋)·a</strong>. אנרגיה כוללת: <strong>E = n₀·ε₀</strong>.
          נתון: n₊ + n₋ + n₀ = N.
        </p>
      </div>
    ),
    parts: [
      {
        id: 'א',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק א — פונקציית הריבוי</p>
            <p className="text-sm">
              כתבו את Γ(L, E, N). הביעו n₊, n₋, n₀ בעזרת L, E, N, a, ε₀.
            </p>
            <p className="text-xs opacity-70">⚠️ שלושה סוגי מונומרים — לא שניים!</p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">מהתנאים: n₀ = E/ε₀, n₊ − n₋ = L/a, n₊ + n₋ = N − n₀</p>
            <BlockMath tex="n_+ = \frac{1}{2}\!\left(N - \frac{E}{\varepsilon_0} + \frac{L}{a}\right),\quad n_- = \frac{1}{2}\!\left(N - \frac{E}{\varepsilon_0} - \frac{L}{a}\right)" />
            <BlockMath tex="\Gamma = \frac{N!}{n_+!\, n_-!\, n_0!} \quad \text{(מינומיאל, לא בינומיאל!)}" />
          </div>
        ),
        trapId: 'S0_T0',
      },
      {
        id: 'ב',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ב — אנטרופיה S(L, E, N)</p>
            <p className="text-sm">
              חשבו S = k_B ln Γ בקירוב סטרלינג לשלושת הגורמים.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="S = k_B\!\left[N\ln N - n_+\ln n_+ - n_-\ln n_- - n_0\ln n_0\right]" />
            <p className="text-sm">
              קירוב סטרלינג: ln(n!) ≈ n ln n − n. מניחים n₊, n₋, n₀ ≫ 1.
            </p>
          </div>
        ),
      },
      {
        id: 'ג',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ג — כוח מתיחה ⟨F⟩</p>
            <p className="text-sm">
              הגדירו כוח הפוכל thermodynamics: F = −T(∂S/∂L)|&#8203;_(E,N).
              מצאו F(L,T) ובדקו את גבול L ≪ Na (Hooke).
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="F = -T\frac{\partial S}{\partial L}\bigg|_{E,N} = \frac{k_BT}{a}\ln\frac{n_+}{n_-}" />
            <p className="text-sm">עבור L ≪ Na: n₊ ≈ n₋ ≈ (N−n₀)/2, ולכן ln(n₊/n₋) ≈ L/[a·(N−n₀)/2]:</p>
            <BlockMath tex="F \approx \frac{2k_BT}{a^2(N-n_0(T))}\cdot L \equiv K(T)\cdot L" />
            <p className="text-sm">
              קבוע האלסטיות K(T) תלוי ב-T ובן₀(T) — ככל שT גדל, יותר מונומרים מקופלים, K יורד.
            </p>
          </div>
        ),
      },
      {
        id: 'ד',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ד — גבול T→∞</p>
            <p className="text-sm">
              מה קורה ל-⟨L⟩ ול-S כש-T→∞? הסבירו פיזיקלית.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">
              T→∞: כל שלושת המצבים שווים, n₊ = n₋ = n₀ = N/3. לכן:
            </p>
            <BlockMath tex="\langle L\rangle \to 0 \quad (n_+ = n_-)" />
            <BlockMath tex="S_{\max} = k_B \ln 3^N = Nk_B\ln 3" />
            <p className="text-sm">
              הפולימר מתמוטט לאורך ממוצע אפס. המצב המקופל (אנטרופי) שולט.
              K(T) → 0 עם T→∞ כי n₀ → N/3.
            </p>
          </div>
        ),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // [מקורית] שאלה 9: פרמיונים דו-מימדיים + שדה מגנטי (יחידה 5)
  // ━━ דפוס המרצה: DOF נסתר (צבע g=3), צפיפות מצבים 2D ≠ 3D ━━
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'orig-q3',
    unitId: 5,
    source: 'שאלה מקורית — ראש המרצה (יחידה 5)',
    totalPoints: 100,
    context: (
      <div className="space-y-3 text-sm leading-relaxed" dir="rtl">
        <p>
          <strong>N אלקטרונים</strong> כלואים על מישור 2D (שטח A). לכל אלקטרון:
        </p>
        <ul className="list-disc list-inside space-y-1 pr-2">
          <li>אנרגיה קינטית: <strong>ε(k) = ℏ²k²/2m</strong></li>
          <li>ספין: σ = ±1/2 (שתי דרגות חופש ספין — כמו רגיל)</li>
        </ul>
        <p>
          בממד 2D, צפיפות המצבים (לספין אחד) היא <strong>קבועה</strong>:
        </p>
        <BlockMath tex="g(\varepsilon) = \frac{mA}{\pi\hbar^2}" />
        <p className="text-xs opacity-70">
          (שימו לב: שונה מ-3D שם g(ε) ∝ √ε!)
        </p>
      </div>
    ),
    parts: [
      {
        id: 'א',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק א — אנרגיית פרמי E_F (T=0, H=0)</p>
            <p className="text-sm">
              מצאו E_F עבור N אלקטרונים (כולל שני ספינים) בשטח A ב-2D.
              בידקו: איך שונה מנוסחת 3D?
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">בT=0: N = 2∫₀^(E_F) g(ε) dε (פקטור 2 לשני ספינים):</p>
            <BlockMath tex="N = 2\cdot\frac{mA}{\pi\hbar^2}\cdot E_F \;\Rightarrow\; E_F = \frac{\pi\hbar^2 n}{m}" />
            <p className="text-sm">כאשר n = N/A. בניגוד ל-3D: E_F ∝ n (לא n^(2/3)!)</p>
            <p className="text-sm">זה מכיוון שב-2D g(ε)=const ולכן N ∝ E_F ישירות.</p>
          </div>
        ),
      },
      {
        id: 'ב',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ב — השפעת שדה מגנטי H (T=0)</p>
            <p className="text-sm">
              שדה H מפצל: אנרגיית אלקטרון↑ יורדת ב-μ_B H, אנרגיית ↓ עולה ב-μ_B H.
              מצאו N↑ ו-N↓ כפונקציה של H (עבור H קטן).
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <p className="text-sm">ב-2D, g(ε)=const → הוספת שדה מזיזה גבול פרמי:</p>
            <BlockMath tex="N_\uparrow = \frac{mA}{\pi\hbar^2}(E_F + \mu_B H), \quad N_\downarrow = \frac{mA}{\pi\hbar^2}(E_F - \mu_B H)" />
            <BlockMath tex="N_\uparrow - N_\downarrow = \frac{2mA}{\pi\hbar^2}\mu_B H = \frac{N}{E_F}\mu_B H" />
          </div>
        ),
        trapId: 'fFD_T0_only',
      },
      {
        id: 'ג',
        points: 25,
        prompt: (
          <div className="space-y-2" dir="rtl">
            <p className="font-semibold">חלק ג — Pauli susceptibility ב-2D</p>
            <p className="text-sm">
              מצאו <strong>χ₂D = ∂M/∂H</strong> והשוו לנוסחה ב-3D.
              כיצד תלות ב-n שונה?
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="M = \mu_B(N_\uparrow - N_\downarrow) = \frac{N\mu_B^2 H}{E_F}" />
            <BlockMath tex="\chi_{2D} = \frac{\partial M}{\partial H} = \frac{N\mu_B^2}{E_F} = \frac{mA\mu_B^2}{\pi\hbar^2}\cdot 2 = 2\mu_B^2 g(E_F)" />
            <p className="text-sm">
              ב-3D: χ ∝ n^{1/3} (כי E_F ∝ n^{2/3}).
              ב-2D: E_F ∝ n, לכן χ&#8322;&#8338; = Nμ_B²/E_F = mAμ_B²/(πℏ²) = <strong>const(n)!</strong>
            </p>
            <p className="text-sm">
              ב-2D ה-susceptibility <strong>אינה תלויה בצפיפות</strong> — תוצאה ייחודית לממד 2.
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
            <p className="font-semibold">חלק ד — אנרגיה כוללת E₀ בT=0</p>
            <p className="text-sm">
              חשבו את אנרגיית הבסיס E₀ ב-H=0. מצאו E₀/N. השוו לתוצאה ב-3D.
            </p>
          </div>
        ),
        answer: (
          <div className="space-y-3" dir="rtl">
            <BlockMath tex="E_0 = 2\int_0^{E_F}\varepsilon\cdot g(\varepsilon)\,d\varepsilon = 2\cdot\frac{mA}{\pi\hbar^2}\cdot\frac{E_F^2}{2} = \frac{mA}{\pi\hbar^2}E_F^2 = \frac{N}{2}E_F" />
            <BlockMath tex="\frac{E_0}{N} = \frac{E_F}{2}" />
            <p className="text-sm">
              ב-3D: E₀/N = (3/5)E_F.
              ב-2D: E₀/N = (1/2)E_F.
              הממד משנה את המקדם! (מגיע מהמבנה של g(ε))
            </p>
          </div>
        ),
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
