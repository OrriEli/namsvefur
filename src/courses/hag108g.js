// Búið til af scripts/extract-legacy.js úr legacy/HAG108G prófæfing.html. Ekki breyta í höndunum.
import * as L from './legacy/hag108g.js';
import adapt from './adapters/lecture.js';

export const meta = {
  "id": "hag108g",
  "code": "HAG108G",
  "name": "Líkindafræði og forritun",
  "short": "Líkindi",
  "color": "--c-hag108g",
  "engine": "lecture",
  "topics": [
    {
      "id": "L00",
      "name": "Inngangur og R",
      "ref": "–"
    },
    {
      "id": "L01",
      "name": "Útkomurúm og líkindi",
      "ref": "SBE 3.1–3.5"
    },
    {
      "id": "L02",
      "name": "Strjálar slembibreytur",
      "ref": "SBE 4.1–4.3"
    },
    {
      "id": "L03",
      "name": "Strjálar dreifingar",
      "ref": "SBE 4.4–4.5"
    },
    {
      "id": "L04",
      "name": "Samfelldar slembibreytur",
      "ref": "SBE 5.1–5.2"
    },
    {
      "id": "L05",
      "name": "Samfelldar dreifingar",
      "ref": "SBE 5.3–5.5"
    },
    {
      "id": "L06",
      "name": "Margvíðar slembibreytur og skilyrt vægi",
      "ref": "SBE 4.7, 5.6, 7.1–7.4"
    },
    {
      "id": "L07",
      "name": "Úrtök og höfuðmarkgildissetningin",
      "ref": "SBE 6.1–6.4"
    },
    {
      "id": "L08",
      "name": "Metlar og punktamat",
      "ref": "SBE 9.1–9.4"
    },
    {
      "id": "L09",
      "name": "Tilgátupróf og öryggisbil",
      "ref": "SBE 9.1–9.6"
    }
  ],
  "levels": {
    "1": {
      "name": "Grunnur",
      "desc": "Skilgreining, ein formúla, eitt skref."
    },
    "2": {
      "name": "Prófstig",
      "desc": "Í stíl við heimaverkefnin. Kjarninn, því prófið líkist þeim."
    },
    "3": {
      "name": "Erfitt",
      "desc": "Margþrepa dæmi, samdreifingar, skilyrt vægi og útleiðslur."
    }
  },
  "modes": [
    {
      "id": "pick",
      "label": "Valin stig"
    },
    {
      "id": "adapt",
      "label": "Stigvaxandi",
      "adapt": true
    },
    {
      "id": "cards",
      "label": "Aðeins spjöld",
      "cards": true
    }
  ],
  "examFormats": [
    {
      "id": "blandad",
      "name": "Próf á tíma",
      "desc": "Snið lokaprófsins er óstaðfest. Kennarinn segir að allt til prófs sé í glærunum og að spurningarnar líkist heimaverkefnunum; R er líka prófað.",
      "style": "mixed",
      "pick": {
        "by": "levels",
        "mixes": [
          {
            "id": "exam",
            "name": "Eins og prófið",
            "w": [
              0.2,
              0.5,
              0.3
            ]
          },
          {
            "id": "hard",
            "name": "Erfitt",
            "w": [
              0.1,
              0.3,
              0.6
            ]
          }
        ],
        "lengths": [
          {
            "id": "short",
            "minutes": 90,
            "n": 12,
            "cards": 1
          },
          {
            "id": "long",
            "minutes": 180,
            "n": 24,
            "cards": 2
          }
        ],
        "defaultLength": "long",
        "explain": true,
        "stepCapL3": 0.3333333333333333,
        "points": {
          "mc": 1,
          "num": 1,
          "steps": 3,
          "card": 0
        },
        "rShare": {
          "topic": "L00",
          "share": 0.15
        }
      }
    }
  ],
  "sheet": {
    "head": "\n    <div class=\"stack\" style=\"gap:6px\"><span class=\"eyebrow\">Formúlublað · dreifingar · R · gildrur</span><h1>Blaðið</h1><p class=\"muted\" style=\"max-width:64ch\">Allt sem þarf að muna, eftir fyrirlestrum. Óstaðfest hvort formúlublaðið er eigið eða frá kennara. Töflur fyrir N, t, χ² og F eru leyfðar á prófinu.</p></div>\n    ",
    "sections": [
      {
        "id": "hag108g-Σ",
        "n": "Σ",
        "title": "Allar dreifingar",
        "html": "<section><h2><span class=\"n\">Σ</span>Allar dreifingar</h2><div class=\"scroll\"><table class=\"tt dist\"><thead><tr><th>Dreifing</th><th>PMF / PDF</th><th>CDF</th><th>E[X]</th><th>Var[X]</th><th>R</th></tr></thead><tbody><tr><td>Bernoulli(p)</td><td>\\(p^x(1-p)^{1-x}\\)</td><td>\\(F(0) = 1 - p\\)</td><td>\\(p\\)</td><td>\\(p(1-p)\\)</td><td><code>dbinom(x, 1, p)</code></td></tr><tr><td>Bin(n, p)</td><td>\\(\\binom{n}{x}p^x(1-p)^{n-x}\\)</td><td>\\(\\sum_{i \\le x} f(i)\\)</td><td>\\(np\\)</td><td>\\(np(1-p)\\)</td><td><code>dbinom pbinom rbinom</code></td></tr><tr><td>Poisson(λ)</td><td>\\(\\frac{e^{-\\lambda}\\lambda^x}{x!}\\)</td><td>\\(\\sum_{i \\le x} f(i)\\)</td><td>\\(\\lambda\\)</td><td>\\(\\lambda\\)</td><td><code>dpois ppois rpois</code></td></tr><tr><td>Unif(a, b)</td><td>\\(\\frac{1}{b-a}\\)</td><td>\\(\\frac{x-a}{b-a}\\)</td><td>\\(\\frac{a+b}{2}\\)</td><td>\\(\\frac{(b-a)^2}{12}\\)</td><td><code>punif runif</code></td></tr><tr><td>Exp(λ)</td><td>\\(\\lambda e^{-\\lambda x}\\)</td><td>\\(1 - e^{-\\lambda x}\\)</td><td>\\(1/\\lambda\\)</td><td>\\(1/\\lambda^2\\)</td><td><code>pexp(x, rate = λ) qexp rexp</code></td></tr><tr><td>N(μ, σ²)</td><td>\\(\\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}\\)</td><td>\\(\\Phi\\left(\\frac{x-\\mu}{\\sigma}\\right)\\)</td><td>\\(\\mu\\)</td><td>\\(\\sigma^2\\)</td><td><code>pnorm(x, mean, sd)</code> · <b>sd, ekki σ²</b></td></tr><tr><td>χ²(k)</td><td>Gamma-fall</td><td>tafla / R</td><td>\\(k\\)</td><td>\\(2k\\)</td><td><code>pchisq(x, k) qchisq</code></td></tr><tr><td>t(k)</td><td>flókin</td><td>tafla / R</td><td>0 (k &gt; 1)</td><td>\\(\\frac{k}{k-2}\\) (k &gt; 2)</td><td><code>pt(x, k)</code>*</td></tr><tr><td>F(k₁, k₂)</td><td>Beta-fall</td><td>tafla / R</td><td>\\(\\frac{k_2}{k_2-2}\\) (k₂ &gt; 2)</td><td>\\(\\frac{2k_2^2(k_1+k_2-2)}{k_1(k_2-2)^2(k_2-4)}\\)</td><td><code>pf(x, k1, k2)</code>*</td></tr></tbody></table></div><p class=\"hint\">d = þéttleiki, p = F(x), q = hlutfallsmark, r = slembidráttur. * Fallið kemur ekki fyrir í glærunum; sama regla gildir.</p></section>"
      },
      {
        "id": "hag108g-=",
        "n": "=",
        "title": "Reglur um E, Var og Cov",
        "html": "<section><h2><span class=\"n\">=</span>Reglur um E, Var og Cov</h2><div class=\"scroll\"><table class=\"tt\"><tbody><tr><td>\\(E[aX + b] = aE[X] + b\\)</td><td>alltaf</td></tr><tr><td>\\(E[X + Y] = E[X] + E[Y]\\)</td><td><b>alltaf</b>, líka háðar</td></tr><tr><td>\\(E[XY] = E[X]E[Y]\\)</td><td>aðeins óháðar</td></tr><tr><td>\\(\\mathrm{Var}[aX + b] = a^2\\mathrm{Var}[X], \\; SD = |a|\\,SD[X]\\)</td><td>fastinn b hverfur</td></tr><tr><td>\\(\\mathrm{Var}[X \\pm Y] = \\mathrm{Var}[X] + \\mathrm{Var}[Y] \\pm 2\\mathrm{Cov}[X,Y]\\)</td><td>Cov = 0 ef óháðar</td></tr><tr><td>\\(\\mathrm{Var}[aX + bY] = a^2\\mathrm{Var}[X] + b^2\\mathrm{Var}[Y] + 2ab\\,\\mathrm{Cov}\\)</td><td>almennt</td></tr><tr><td>\\(\\mathrm{Cov}[aX + b, cY + d] = ac\\,\\mathrm{Cov}[X, Y]\\)</td><td>\\(\\mathrm{Cov}[X, X] = \\mathrm{Var}[X]\\)</td></tr><tr><td>\\(E[\\bar{X}] = \\mu, \\; \\mathrm{Var}[\\bar{X}] = \\sigma^2/n, \\; E[S^2] = \\sigma^2\\)</td><td>slembiúrtak</td></tr><tr><td>\\(E[X] = E[E[X \\mid Y]]\\)</td><td>endurteknar væntingar</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-L00",
        "n": "L00",
        "title": "Inngangur og R",
        "html": "<section><h2><span class=\"n\">L00</span>Inngangur og R</h2><div class=\"scroll\"><ul><li>Túlkað mál (R, Python, Matlab): línu fyrir línu, gagnvirkt en hægara · þýtt (C, C++, Java): allt í einu, hraðara</li><li>Tög: numeric · integer (<code>1L</code>) · complex · character · logical; 0 = FALSE í skilyrðum</li><li>Aðgerðir: <code>&lt;-</code> <code>+ - * / ^</code> <code>%/%</code> (heiltöludeiling) <code>%%</code> (afgangur) · <code>== != &gt; &gt;= &lt; &lt;=</code></li><li>Forgangur: <code>:</code> á undan <code>* /</code> á undan <code>+ -</code> → <code>365 - 1:3 + 1</code> = 365 364 363</li><li>Inntök: nefnd fyrst, ónefnd fylla lausu sætin í röð; sjálfgefin gildi <code>function(x, y = 3)</code></li></ul></div></section>"
      },
      {
        "id": "hag108g-L01",
        "n": "L01",
        "title": "Útkomurúm og líkindi",
        "html": "<section><h2><span class=\"n\">L01</span>Útkomurúm og líkindi</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(\\Pr(A^c)\\)</td><td class=\"eq\">=</td><td>\\(1 - \\Pr(A)\\)</td></tr><tr><td>\\(\\Pr(A \\cup B)\\)</td><td class=\"eq\">=</td><td>\\(\\Pr(A) + \\Pr(B) - \\Pr(A \\cap B)\\)</td></tr><tr><td>\\((A \\cup B)^c\\)</td><td class=\"eq\">=</td><td>\\(A^c \\cap B^c, \\quad (A \\cap B)^c\\)</td><td class=\"eq\">=</td><td>\\(A^c \\cup B^c\\)</td></tr><tr><td>\\(P(n,k)\\)</td><td class=\"eq\">=</td><td>\\(\\frac{n!}{(n-k)!}, \\quad C(n,k)\\)</td><td class=\"eq\">=</td><td>\\(\\binom{n}{k}\\)</td><td class=\"eq\">=</td><td>\\(\\frac{n!}{k!(n-k)!}\\)</td></tr><tr><td>\\(\\Pr(A \\mid B)\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\Pr(A \\cap B)}{\\Pr(B)}\\)</td></tr><tr><td>\\(\\Pr(A)\\)</td><td class=\"eq\">=</td><td>\\(\\sum_i \\Pr(B_i)\\Pr(A \\mid B_i)\\)</td></tr><tr><td>\\(\\Pr(A_j \\mid B)\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\Pr(A_j)\\Pr(B \\mid A_j)}{\\sum_i \\Pr(A_i)\\Pr(B \\mid A_i)}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Óháð: Pr(A ∩ B) = Pr(A)Pr(B)</td></tr><tr><td colspan=\"9\" class=\"txt\">A.m.k. einn af n óháðum: 1 − (1 − p)ⁿ</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L02",
        "n": "L02",
        "title": "Strjálar slembibreytur",
        "html": "<section><h2><span class=\"n\">L02</span>Strjálar slembibreytur</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(F(x)\\)</td><td class=\"eq\">=</td><td>\\(\\Pr(X \\le x)\\)</td><td class=\"eq\">=</td><td>\\(\\sum_{t \\le x} f(t)\\)</td></tr><tr><td>\\(E[X]\\)</td><td class=\"eq\">=</td><td>\\(\\sum x f(x), \\quad E[g(X)]\\)</td><td class=\"eq\">=</td><td>\\(\\sum g(x) f(x)\\)</td></tr><tr><td>\\(\\mathrm{Var}[X]\\)</td><td class=\"eq\">=</td><td>\\(E[(X - \\mu)^2]\\)</td><td class=\"eq\">=</td><td>\\(E[X^2] - E[X]^2\\)</td></tr><tr><td>\\(\\mathrm{Skew}\\)</td><td class=\"eq\">=</td><td>\\(E\\left[\\left(\\tfrac{X - \\mu}{\\sigma}\\right)^3\\right], \\quad \\mathrm{Kurt}\\)</td><td class=\"eq\">=</td><td>\\(E\\left[\\left(\\tfrac{X - \\mu}{\\sigma}\\right)^4\\right]\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Strjált miðgildi / p-hlutfallsmark: minnsta x með F(x) ≥ p</td></tr><tr><td>\\(Q\\)</td><td class=\"eq\">=</td><td>\\(a + \\frac{p - F(a)}{F(b) - F(a)}(b - a) \\quad \\text{(flokkuð gögn)}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Jensen: g kúpt ⇒ E[g(X)] ≥ g(E[X]); g hvelft ⇒ ≤</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L03",
        "n": "L03",
        "title": "Strjálar dreifingar",
        "html": "<section><h2><span class=\"n\">L03</span>Strjálar dreifingar</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(\\text{Bernoulli: } p^x(1-p)^{1-x}, \\; E\\)</td><td class=\"eq\">=</td><td>\\(p, \\; \\mathrm{Var}\\)</td><td class=\"eq\">=</td><td>\\(p(1-p)\\)</td></tr><tr><td>\\(\\text{Bin: } \\binom{n}{x}p^x(1-p)^{n-x}, \\; E\\)</td><td class=\"eq\">=</td><td>\\(np, \\; \\mathrm{Var}\\)</td><td class=\"eq\">=</td><td>\\(np(1-p)\\)</td></tr><tr><td>\\(\\text{Poisson: } \\frac{e^{-\\lambda}\\lambda^x}{x!}, \\; E\\)</td><td class=\"eq\">=</td><td>\\(\\mathrm{Var}\\)</td><td class=\"eq\">=</td><td>\\(\\lambda\\)</td></tr><tr><td>\\(\\mathrm{Bin}(n_1, p) + \\mathrm{Bin}(n_2, p)\\)</td><td class=\"eq\">=</td><td>\\(\\mathrm{Bin}(n_1 + n_2, p)\\)</td></tr><tr><td>\\(\\mathrm{Pois}(\\lambda_1) + \\mathrm{Pois}(\\lambda_2)\\)</td><td class=\"eq\">=</td><td>\\(\\mathrm{Pois}(\\lambda_1 + \\lambda_2)\\)</td></tr><tr><td>\\(\\mathrm{Bin}(n, \\lambda/n) \\to \\mathrm{Pois}(\\lambda), \\; n \\to \\infty\\)</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L04",
        "n": "L04",
        "title": "Samfelldar slembibreytur",
        "html": "<section><h2><span class=\"n\">L04</span>Samfelldar slembibreytur</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(F(x)\\)</td><td class=\"eq\">=</td><td>\\(\\int_{-\\infty}^x f(t)\\,dt, \\quad f(x)\\)</td><td class=\"eq\">=</td><td>\\(F'(x)\\)</td></tr><tr><td>\\(f \\ge 0, \\quad \\int_{-\\infty}^{\\infty} f\\)</td><td class=\"eq\">=</td><td>\\(1 \\quad (f \\text{ má vera} > 1)\\)</td></tr><tr><td>\\(\\Pr(a < X < b)\\)</td><td class=\"eq\">=</td><td>\\(F(b) - F(a), \\quad \\Pr(X = x)\\)</td><td class=\"eq\">=</td><td>\\(0\\)</td></tr><tr><td>\\(E[X]\\)</td><td class=\"eq\">=</td><td>\\(\\int x f(x)\\,dx, \\quad E[X^2]\\)</td><td class=\"eq\">=</td><td>\\(\\int x^2 f(x)\\,dx\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Miðgildi: F(x) = 0,5 · p-hlutfallsmark: F(x) = p</td></tr><tr><td colspan=\"9\" class=\"txt\">Uppskrift: heilda f → F · F(∞) = 1 · líkur = mismunur · vægi með heildum · F(x) = p</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L05",
        "n": "L05",
        "title": "Samfelldar dreifingar",
        "html": "<section><h2><span class=\"n\">L05</span>Samfelldar dreifingar</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(Z\\)</td><td class=\"eq\">=</td><td>\\(\\frac{X - \\mu}{\\sigma} \\sim N(0, 1), \\quad \\Phi(-z)\\)</td><td class=\"eq\">=</td><td>\\(1 - \\Phi(z)\\)</td></tr><tr><td>\\(aX + b \\sim N(a\\mu + b,\\; a^2\\sigma^2)\\)</td></tr><tr><td>\\(\\sum X_i \\sim N\\left(\\sum \\mu_i,\\; \\sum \\sigma_i^2\\right) \\;(\\text{óháðar})\\)</td></tr><tr><td>\\(\\chi^2(k)\\)</td><td class=\"eq\">=</td><td>\\(Z_1^2 + \\dots + Z_k^2, \\quad F\\)</td><td class=\"eq\">=</td><td>\\(\\frac{Y_1/k_1}{Y_2/k_2}, \\quad T\\)</td><td class=\"eq\">=</td><td>\\(\\frac{Z}{\\sqrt{Y/k}}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">68,3% / 95,4% / 99,7% innan 1σ / 2σ / 3σ</td></tr><tr><td colspan=\"9\" class=\"txt\">Hermun: X = F⁻¹(U), U ~ Unif(0, 1)</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L06",
        "n": "L06",
        "title": "Margvíðar slembibreytur og skilyrt vægi",
        "html": "<section><h2><span class=\"n\">L06</span>Margvíðar slembibreytur og skilyrt vægi</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(F(x, y)\\)</td><td class=\"eq\">=</td><td>\\(\\Pr(X \\le x, Y \\le y)\\)</td></tr><tr><td>\\(f_X(x)\\)</td><td class=\"eq\">=</td><td>\\(\\sum_y f(x, y) \\;\\text{ eða }\\; \\int f(x, y)\\,dy\\)</td></tr><tr><td>\\(\\Pr(x_1 < X < x_2, y_1 < Y < y_2)\\)</td><td class=\"eq\">=</td><td>\\(F(x_2,y_2) - F(x_1,y_2) - F(x_2,y_1) + F(x_1,y_1)\\)</td></tr><tr><td>\\(\\mathrm{Cov}[X,Y]\\)</td><td class=\"eq\">=</td><td>\\(E[XY] - E[X]E[Y], \\quad \\rho\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\mathrm{Cov}}{\\sigma_X\\sigma_Y} \\in [-1, 1]\\)</td></tr><tr><td>\\(\\Sigma\\)</td><td class=\"eq\">=</td><td>\\(\\begin{pmatrix} \\mathrm{Var}[X] & \\mathrm{Cov} \\\\ \\mathrm{Cov} & \\mathrm{Var}[Y] \\end{pmatrix}\\)</td></tr><tr><td>\\(f_{Y|X}(y \\mid x)\\)</td><td class=\"eq\">=</td><td>\\(\\frac{f(x, y)}{f_X(x)}, \\quad E[X]\\)</td><td class=\"eq\">=</td><td>\\(E[E[X \\mid Y]]\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Óháðar ⇔ f(x, y) = f<sub>X</sub>(x)f<sub>Y</sub>(y)</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L07",
        "n": "L07",
        "title": "Úrtök og höfuðmarkgildissetningin",
        "html": "<section><h2><span class=\"n\">L07</span>Úrtök og höfuðmarkgildissetningin</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(\\bar{X}\\)</td><td class=\"eq\">=</td><td>\\(\\frac{1}{n}\\sum X_i, \\quad E[\\bar{X}]\\)</td><td class=\"eq\">=</td><td>\\(\\mu, \\quad \\mathrm{Var}[\\bar{X}]\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\sigma^2}{n}\\)</td></tr><tr><td>\\(S^2\\)</td><td class=\"eq\">=</td><td>\\(\\frac{1}{n-1}\\sum (X_i - \\bar{X})^2\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\sum X_i^2 - n\\bar{X}^2}{n - 1}, \\quad E[S^2]\\)</td><td class=\"eq\">=</td><td>\\(\\sigma^2\\)</td></tr><tr><td>\\(\\mathrm{Var}[S^2]\\)</td><td class=\"eq\">=</td><td>\\(\\frac{2\\sigma^4}{n-1} \\;(\\text{normalt þýði})\\)</td></tr><tr><td>\\(\\text{CLT: } \\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\approx N(0, 1)\\)</td></tr><tr><td>\\(\\frac{\\bar{X} - \\mu}{S/\\sqrt{n}} \\sim t_{n-1} \\;(\\text{normalt þýði, } \\sigma \\text{ óþekkt})\\)</td></tr><tr><td>\\(z\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\hat{p} - p}{\\sqrt{p(1-p)/n}}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Veldisdreifing: λ̂ = 1/X̄</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L08",
        "n": "L08",
        "title": "Metlar og punktamat",
        "html": "<section><h2><span class=\"n\">L08</span>Metlar og punktamat</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(B(\\hat\\theta)=E[\\hat\\theta] - \\theta, \\quad \\text{óbjagaður ef } B=0\\)</td></tr><tr><td>\\(\\mathrm{MAE}=E[|\\hat\\theta - \\theta|], \\quad \\mathrm{MSE}=E[(\\hat\\theta - \\theta)^2]=\\mathrm{Var}[\\hat\\theta] + B^2\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Skilvirkari: minni dreifni (af óbjöguðum) · samkvæmur: Var[θ̂] → 0 þegar n → ∞</td></tr><tr><td>\\(E[\\tilde S^2]=\\frac{n-1}{n}\\sigma^2 \\quad (\\tilde S^2 \\text{ deilir með } n)\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Vægjaaðferð: úrtaksvægi = vægi þýðis, eitt vægi á hvern stika</td></tr><tr><td>\\(\\text{Unif}(\\alpha,\\beta): \\; \\frac{\\hat\\alpha + \\hat\\beta}{2}=\\bar x, \\; \\frac{(\\hat\\beta - \\hat\\alpha)^2}{12}=S^2\\)</td></tr><tr><td>\\(\\text{Bin}(n,p): \\; \\hat p=1 - \\frac{S^2}{\\bar x}, \\; \\hat n=\\frac{\\bar x}{\\hat p}\\)</td></tr><tr><td>\\(\\hat\\theta=\\arg\\max_\\theta \\ell(\\theta), \\quad \\ell(\\theta)=\\sum \\log f(x_i \\mid \\theta), \\quad \\frac{d\\ell}{d\\theta}=0\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Sennileikamat: Exp λ̂ = n/Σxᵢ · Poisson λ̂ = x̄ · Unif(0, β) β̂ = max xᵢ · N: μ̂ = x̄, σ̂² = Σ(xᵢ − x̄)²/n (bjagað)</td></tr><tr><td>\\(E[\\max X_i]=\\frac{n\\beta + \\alpha}{n + 1}\\)</td></tr><tr><td>\\(\\hat\\beta=\\frac{\\sum (x_i - \\bar x)(y_i - \\bar y)}{\\sum (x_i - \\bar x)^2}, \\quad \\hat\\alpha=\\bar y - \\hat\\beta \\bar x\\)</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L09",
        "n": "L09",
        "title": "Tilgátupróf og öryggisbil",
        "html": "<section><h2><span class=\"n\">L09</span>Tilgátupróf og öryggisbil</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(\\bar x \\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt n} \\;(\\sigma \\text{ þekkt}), \\quad \\bar x \\pm t_{n-1,\\alpha/2}\\frac{s}{\\sqrt n} \\;(\\sigma \\text{ metið})\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Einhliða bil: z<sub>α</sub> eða t<sub>α</sub> og aðeins önnur mörkin · z<sub>0,05</sub> = 1,645 · z<sub>0,025</sub> = 1,96 · z<sub>0,01</sub> = 2,33 · z<sub>0,005</sub> = 2,58</td></tr><tr><td>\\(T=\\frac{\\bar x - \\mu_0}{s/\\sqrt n} \\sim t_{n-1}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Hafna H₀: efra einhliða T > t(n−1; α) · neðra T < −t(n−1; α) · tvíhliða |T| > t(n−1; α/2)</td></tr><tr><td>\\(T=\\frac{\\bar x - \\bar y - D_0}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}, \\quad \\nu=\\frac{(s_1^2/n_1 + s_2^2/n_2)^2}{\\frac{(s_1^2/n_1)^2}{n_1 - 1} + \\frac{(s_2^2/n_2)^2}{n_2 - 1}}\\)</td></tr><tr><td>\\(\\chi^2=\\frac{(n-1)s^2}{\\sigma_0^2} \\sim \\chi^2_{n-1}\\)</td></tr><tr><td>\\(\\left[\\frac{(n-1)s^2}{\\chi^2_{1-\\alpha/2}},\\; \\frac{(n-1)s^2}{\\chi^2_{\\alpha/2}}\\right] \\;(\\text{hlutfallsmörk neðan frá})\\)</td></tr><tr><td>\\(F=\\frac{s_1^2}{s_2^2} \\sim F_{n_1 - 1,\\, n_2 - 1}\\)</td></tr><tr><td>\\(JB=\\frac{n}{6}\\left(S^2 + \\frac{(K-3)^2}{4}\\right) \\sim \\chi^2_2, \\quad S=\\text{skeifni}, \\; K=\\text{ferilris}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">p-gildi: efri Pr(T ≥ t) · neðri Pr(T ≤ t) · tvíhliða 2·min · hafna ef p < α</td></tr><tr><td colspan=\"9\" class=\"txt\">Villa 1: hafna sannri H₀ (α) · villa 2: hafna ekki ósannri H₀ (β) · styrkur 1 − β</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-✓",
        "n": "✓",
        "title": "Ákvörðunarreglur",
        "html": "<section><h2><span class=\"n\">✓</span>Ákvörðunarreglur</h2><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Þegar…</th><th>…þá</th></tr></thead><tbody><tr><td>Fastur fjöldi n óháðra tilrauna, sama p, talið hve margar heppnast</td><td><b>Bin(n, p)</b></td></tr><tr><td>Fjöldi atburða á tímabili; aðeins meðaltalið þekkt</td><td><b>Poisson(λ)</b>, með λ skalað á tímabilið sem spurt er um</td></tr><tr><td>Biðtími á milli atburða (samfelldur)</td><td><b>Exp(λ)</b>, λ = 1/meðalbið</td></tr><tr><td>Bin með stórt n og lítið p</td><td>Poisson(np)</td></tr><tr><td>σ þekkt, eða n stórt (CLT)</td><td><b>z</b> og N(0, 1)</td></tr><tr><td>Normaldreift þýði, σ óþekkt, lítið n (oft ≤ 30)</td><td><b>t</b> með n − 1 frígráðum</td></tr><tr><td>Hlutfall p̂</td><td>z með p úr tilgátunni í nefnara</td></tr><tr><td>„Að minnsta kosti einn\", „einhver\", „fleiri en\" í Poisson</td><td><b>Fyllireglan</b>: 1 − Pr(engin) / 1 − F(k)</td></tr><tr><td>„X > a og Y > b\" í samdreifingu</td><td>Fyllireglan virkar <b>ekki</b> beint (De Morgan); heilda/summa yfir svæðið</td></tr><tr><td>Summa eða mismunur <b>óháðra</b> breyta</td><td><b>Dreifnir leggjast saman</b>, líka við frádrátt; staðalfrávik aldrei</td></tr><tr><td>Summa háðra breyta</td><td>Bæta ±2Cov við</td></tr><tr><td>Hlutfallsmark strjálrar breytu</td><td>min{x : F(x) ≥ p}; brúun aðeins fyrir flokkuð gögn</td></tr><tr><td>Hlutfallsmark samfelldrar breytu</td><td>Leysa F(x) = p</td></tr><tr><td>Spurt um líkur á prófstærð</td><td>Taka alltaf fram <b>einhliða</b> eða <b>tvíhliða</b></td></tr><tr><td>Tilgáta um eitt meðaltal</td><td><b>t-próf</b> (σ metið) eða z (σ þekkt)</td></tr><tr><td>Tvö óháð úrtök, munur á meðaltölum</td><td><b>Welch t-próf</b> með ν frígráðum</td></tr><tr><td>Tilgáta um dreifni eða staðalfrávik eins þýðis</td><td><b>χ²-próf</b> með n − 1 frígráðum (staðalfrávik → dreifni)</td></tr><tr><td>Tvær dreifnir bornar saman</td><td><b>F-próf</b>, F = s₁²/s₂² með (n₁ − 1, n₂ − 1)</td></tr><tr><td>Eru gögnin normaldreifð?</td><td><b>Jarque–Bera</b>, χ²₂; hafna ef JB &gt; 5,99 (α = 0,05)</td></tr><tr><td>H₁ með ≠</td><td>Tvíhliða: α/2 í hvorum hala</td></tr><tr><td>H₁ með &gt; eða &lt;</td><td>Einhliða: allt α í þeim hala sem H₁ bendir á</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-R",
        "n": "R",
        "title": "R í hnotskurn",
        "html": "<section><h2><span class=\"n\">R</span>R í hnotskurn</h2><div class=\"scroll\"><table class=\"tt\"><tbody><tr><td><b>Tilvísanir</b></td><td><code>x[1]</code> fyrsta stak (byrjar á 1) · <code>x[c(1,3)]</code> · <code>x[2:4]</code> · <code>x[-1]</code> allt nema 1 · <code>x[x &gt; 5]</code> síun</td></tr><tr><td><b>matrix</b></td><td><code>matrix(1:12, nrow = 3)</code> fyllist <b>dálk fyrir dálk</b> (byrow = TRUE fyrir raðir) · <code>m[i, j]</code> · <code>m[2, ]</code> röð · <code>m[, 3]</code> dálkur</td></tr><tr><td><b>Listar</b></td><td><code>y[1]</code> undirlisti · <code>y[[1]]</code> stakið sjálft · <code>y[[2]][2]</code> · <code>y$nafn</code> = <code>y[[\"nafn\"]]</code></td></tr><tr><td><b>Gerðir</b></td><td>vektor (eitt tag) · listi (mörg tög) · matrix (2 víddir, eitt tag) · array (fleiri víddir) · data.frame (tafla, dálkar með nöfnum)</td></tr><tr><td><b>apply</b></td><td><code>apply(m, 1, f)</code> raðir · <code>apply(m, 2, f)</code> dálkar · <code>lapply</code> → listi · <code>sapply</code> → vektor · <code>vapply(x, f, numeric(1))</code> · <code>tapply(x, hópur, f)</code> · <code>mapply(f, x, y)</code></td></tr><tr><td><b>data.frame</b></td><td><code>df$Aldur</code> · <code>df[df$Aldur &lt; 30, ]</code> (tómt eftir kommu = allir dálkar) · <code>tapply(df$Aldur, df$Hópur, mean)</code> · <code>head(df)</code></td></tr><tr><td><b>Föll</b></td><td><code>f &lt;- function(x, y = 3) { return(x + y) }</code> · skilar síðustu segð eða return()</td></tr><tr><td><b>Pakkar</b></td><td><code>install.packages(\"nafn\")</code> einu sinni · <code>library(nafn)</code> í hverri keyrslu · <code>pakki::fall</code> tekur af vafa</td></tr><tr><td><b>Dreifingar</b></td><td>d = þéttleiki · p = F(x) · q = hlutfallsmark · r = slembidráttur · <code>pnorm(x, mean, sd)</code></td></tr><tr><td><b>Próf</b></td><td><code>t.test(x, mu = 6.5, alternative = \"greater\")</code> · <code>t.test(x, y)</code> (Welch) · <code>var.test(x, y)</code> (F) · <code>$statistic</code>, <code>$p.value</code>, <code>$conf.int</code> · <code>jarque.bera.test(x)</code> (pakkinn tseries)</td></tr><tr><td><b>Aðhvarf</b></td><td><code>m &lt;- lm(y ~ x)</code> · <code>coef(m)</code> · <code>summary(m)</code> gefur t-gildi og p-gildi fyrir H₀: β = 0 · <code>lm(y ~ 0 + I(x^2) + x)</code> án fastaliðar</td></tr><tr><td><b>Annað</b></td><td><code>na.rm = TRUE</code> · <code>var()</code>, <code>sd()</code> deila með n − 1 · <code>prod(365 - 1:n + 1)</code> · <code>table(x)/length(x)</code> mælt PMF · <code>replicate(n, {…})</code></td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-Φ",
        "n": "Φ",
        "title": "Staðlaða normaldreifingin Φ(z) = Pr(Z ≤ z)",
        "html": "<section><h2><span class=\"n\">Φ</span>Staðlaða normaldreifingin Φ(z) = Pr(Z ≤ z)</h2><p class=\"hint\">Röð = z með einum aukastaf, dálkur = annar aukastafur. Fyrir neikvætt z: Φ(−z) = 1 − Φ(z).</p><div class=\"scroll\"><table class=\"phi\"><thead><tr><th>z</th><th>,00</th><th>,01</th><th>,02</th><th>,03</th><th>,04</th><th>,05</th><th>,06</th><th>,07</th><th>,08</th><th>,09</th></tr></thead><tbody><tr><th>0,0</th><td>0,5000</td><td>0,5040</td><td>0,5080</td><td>0,5120</td><td>0,5160</td><td>0,5199</td><td>0,5239</td><td>0,5279</td><td>0,5319</td><td>0,5359</td></tr><tr><th>0,1</th><td>0,5398</td><td>0,5438</td><td>0,5478</td><td>0,5517</td><td>0,5557</td><td>0,5596</td><td>0,5636</td><td>0,5675</td><td>0,5714</td><td>0,5753</td></tr><tr><th>0,2</th><td>0,5793</td><td>0,5832</td><td>0,5871</td><td>0,5910</td><td>0,5948</td><td>0,5987</td><td>0,6026</td><td>0,6064</td><td>0,6103</td><td>0,6141</td></tr><tr><th>0,3</th><td>0,6179</td><td>0,6217</td><td>0,6255</td><td>0,6293</td><td>0,6331</td><td>0,6368</td><td>0,6406</td><td>0,6443</td><td>0,6480</td><td>0,6517</td></tr><tr><th>0,4</th><td>0,6554</td><td>0,6591</td><td>0,6628</td><td>0,6664</td><td>0,6700</td><td>0,6736</td><td>0,6772</td><td>0,6808</td><td>0,6844</td><td>0,6879</td></tr><tr><th>0,5</th><td>0,6915</td><td>0,6950</td><td>0,6985</td><td>0,7019</td><td>0,7054</td><td>0,7088</td><td>0,7123</td><td>0,7157</td><td>0,7190</td><td>0,7224</td></tr><tr><th>0,6</th><td>0,7257</td><td>0,7291</td><td>0,7324</td><td>0,7357</td><td>0,7389</td><td>0,7422</td><td>0,7454</td><td>0,7486</td><td>0,7517</td><td>0,7549</td></tr><tr><th>0,7</th><td>0,7580</td><td>0,7611</td><td>0,7642</td><td>0,7673</td><td>0,7704</td><td>0,7734</td><td>0,7764</td><td>0,7794</td><td>0,7823</td><td>0,7852</td></tr><tr><th>0,8</th><td>0,7881</td><td>0,7910</td><td>0,7939</td><td>0,7967</td><td>0,7995</td><td>0,8023</td><td>0,8051</td><td>0,8078</td><td>0,8106</td><td>0,8133</td></tr><tr><th>0,9</th><td>0,8159</td><td>0,8186</td><td>0,8212</td><td>0,8238</td><td>0,8264</td><td>0,8289</td><td>0,8315</td><td>0,8340</td><td>0,8365</td><td>0,8389</td></tr><tr><th>1,0</th><td>0,8413</td><td>0,8438</td><td>0,8461</td><td>0,8485</td><td>0,8508</td><td>0,8531</td><td>0,8554</td><td>0,8577</td><td>0,8599</td><td>0,8621</td></tr><tr><th>1,1</th><td>0,8643</td><td>0,8665</td><td>0,8686</td><td>0,8708</td><td>0,8729</td><td>0,8749</td><td>0,8770</td><td>0,8790</td><td>0,8810</td><td>0,8830</td></tr><tr><th>1,2</th><td>0,8849</td><td>0,8869</td><td>0,8888</td><td>0,8907</td><td>0,8925</td><td>0,8944</td><td>0,8962</td><td>0,8980</td><td>0,8997</td><td>0,9015</td></tr><tr><th>1,3</th><td>0,9032</td><td>0,9049</td><td>0,9066</td><td>0,9082</td><td>0,9099</td><td>0,9115</td><td>0,9131</td><td>0,9147</td><td>0,9162</td><td>0,9177</td></tr><tr><th>1,4</th><td>0,9192</td><td>0,9207</td><td>0,9222</td><td>0,9236</td><td>0,9251</td><td>0,9265</td><td>0,9279</td><td>0,9292</td><td>0,9306</td><td>0,9319</td></tr><tr><th>1,5</th><td>0,9332</td><td>0,9345</td><td>0,9357</td><td>0,9370</td><td>0,9382</td><td>0,9394</td><td>0,9406</td><td>0,9418</td><td>0,9429</td><td>0,9441</td></tr><tr><th>1,6</th><td>0,9452</td><td>0,9463</td><td>0,9474</td><td>0,9484</td><td>0,9495</td><td>0,9505</td><td>0,9515</td><td>0,9525</td><td>0,9535</td><td>0,9545</td></tr><tr><th>1,7</th><td>0,9554</td><td>0,9564</td><td>0,9573</td><td>0,9582</td><td>0,9591</td><td>0,9599</td><td>0,9608</td><td>0,9616</td><td>0,9625</td><td>0,9633</td></tr><tr><th>1,8</th><td>0,9641</td><td>0,9649</td><td>0,9656</td><td>0,9664</td><td>0,9671</td><td>0,9678</td><td>0,9686</td><td>0,9693</td><td>0,9699</td><td>0,9706</td></tr><tr><th>1,9</th><td>0,9713</td><td>0,9719</td><td>0,9726</td><td>0,9732</td><td>0,9738</td><td>0,9744</td><td>0,9750</td><td>0,9756</td><td>0,9761</td><td>0,9767</td></tr><tr><th>2,0</th><td>0,9772</td><td>0,9778</td><td>0,9783</td><td>0,9788</td><td>0,9793</td><td>0,9798</td><td>0,9803</td><td>0,9808</td><td>0,9812</td><td>0,9817</td></tr><tr><th>2,1</th><td>0,9821</td><td>0,9826</td><td>0,9830</td><td>0,9834</td><td>0,9838</td><td>0,9842</td><td>0,9846</td><td>0,9850</td><td>0,9854</td><td>0,9857</td></tr><tr><th>2,2</th><td>0,9861</td><td>0,9864</td><td>0,9868</td><td>0,9871</td><td>0,9875</td><td>0,9878</td><td>0,9881</td><td>0,9884</td><td>0,9887</td><td>0,9890</td></tr><tr><th>2,3</th><td>0,9893</td><td>0,9896</td><td>0,9898</td><td>0,9901</td><td>0,9904</td><td>0,9906</td><td>0,9909</td><td>0,9911</td><td>0,9913</td><td>0,9916</td></tr><tr><th>2,4</th><td>0,9918</td><td>0,9920</td><td>0,9922</td><td>0,9925</td><td>0,9927</td><td>0,9929</td><td>0,9931</td><td>0,9932</td><td>0,9934</td><td>0,9936</td></tr><tr><th>2,5</th><td>0,9938</td><td>0,9940</td><td>0,9941</td><td>0,9943</td><td>0,9945</td><td>0,9946</td><td>0,9948</td><td>0,9949</td><td>0,9951</td><td>0,9952</td></tr><tr><th>2,6</th><td>0,9953</td><td>0,9955</td><td>0,9956</td><td>0,9957</td><td>0,9959</td><td>0,9960</td><td>0,9961</td><td>0,9962</td><td>0,9963</td><td>0,9964</td></tr><tr><th>2,7</th><td>0,9965</td><td>0,9966</td><td>0,9967</td><td>0,9968</td><td>0,9969</td><td>0,9970</td><td>0,9971</td><td>0,9972</td><td>0,9973</td><td>0,9974</td></tr><tr><th>2,8</th><td>0,9974</td><td>0,9975</td><td>0,9976</td><td>0,9977</td><td>0,9977</td><td>0,9978</td><td>0,9979</td><td>0,9979</td><td>0,9980</td><td>0,9981</td></tr><tr><th>2,9</th><td>0,9981</td><td>0,9982</td><td>0,9982</td><td>0,9983</td><td>0,9984</td><td>0,9984</td><td>0,9985</td><td>0,9985</td><td>0,9986</td><td>0,9986</td></tr><tr><th>3,0</th><td>0,9987</td><td>0,9987</td><td>0,9987</td><td>0,9988</td><td>0,9988</td><td>0,9989</td><td>0,9989</td><td>0,9989</td><td>0,9990</td><td>0,9990</td></tr><tr><th>3,1</th><td>0,9990</td><td>0,9991</td><td>0,9991</td><td>0,9991</td><td>0,9992</td><td>0,9992</td><td>0,9992</td><td>0,9992</td><td>0,9993</td><td>0,9993</td></tr><tr><th>3,2</th><td>0,9993</td><td>0,9993</td><td>0,9994</td><td>0,9994</td><td>0,9994</td><td>0,9994</td><td>0,9994</td><td>0,9995</td><td>0,9995</td><td>0,9995</td></tr><tr><th>3,3</th><td>0,9995</td><td>0,9995</td><td>0,9995</td><td>0,9996</td><td>0,9996</td><td>0,9996</td><td>0,9996</td><td>0,9996</td><td>0,9996</td><td>0,9997</td></tr><tr><th>3,4</th><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9998</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-t",
        "n": "t",
        "title": "t-dreifing: tdf; α með Pr(T > t) = α",
        "html": "<section><h2><span class=\"n\">t</span>t-dreifing: t<sub>df; α</sub> með Pr(T &gt; t) = α</h2><p class=\"hint\">Efri hali. Tvíhliða próf eða bil með α: lesið dálkinn α/2. Neðri hali: −t.</p><div class=\"scroll\"><table class=\"phi\"><thead><tr><th>df</th><th>0,10</th><th>0,050</th><th>0,025</th><th>0,010</th><th>0,005</th></tr></thead><tbody><tr><th>1</th><td>3,078</td><td>6,314</td><td>12,706</td><td>31,821</td><td>63,657</td></tr><tr><th>2</th><td>1,886</td><td>2,920</td><td>4,303</td><td>6,965</td><td>9,925</td></tr><tr><th>3</th><td>1,638</td><td>2,353</td><td>3,182</td><td>4,541</td><td>5,841</td></tr><tr><th>4</th><td>1,533</td><td>2,132</td><td>2,776</td><td>3,747</td><td>4,604</td></tr><tr><th>5</th><td>1,476</td><td>2,015</td><td>2,571</td><td>3,365</td><td>4,032</td></tr><tr><th>6</th><td>1,440</td><td>1,943</td><td>2,447</td><td>3,143</td><td>3,707</td></tr><tr><th>7</th><td>1,415</td><td>1,895</td><td>2,365</td><td>2,998</td><td>3,499</td></tr><tr><th>8</th><td>1,397</td><td>1,860</td><td>2,306</td><td>2,896</td><td>3,355</td></tr><tr><th>9</th><td>1,383</td><td>1,833</td><td>2,262</td><td>2,821</td><td>3,250</td></tr><tr><th>10</th><td>1,372</td><td>1,812</td><td>2,228</td><td>2,764</td><td>3,169</td></tr><tr><th>11</th><td>1,363</td><td>1,796</td><td>2,201</td><td>2,718</td><td>3,106</td></tr><tr><th>12</th><td>1,356</td><td>1,782</td><td>2,179</td><td>2,681</td><td>3,055</td></tr><tr><th>13</th><td>1,350</td><td>1,771</td><td>2,160</td><td>2,650</td><td>3,012</td></tr><tr><th>14</th><td>1,345</td><td>1,761</td><td>2,145</td><td>2,624</td><td>2,977</td></tr><tr><th>15</th><td>1,341</td><td>1,753</td><td>2,131</td><td>2,602</td><td>2,947</td></tr><tr><th>16</th><td>1,337</td><td>1,746</td><td>2,120</td><td>2,583</td><td>2,921</td></tr><tr><th>17</th><td>1,333</td><td>1,740</td><td>2,110</td><td>2,567</td><td>2,898</td></tr><tr><th>18</th><td>1,330</td><td>1,734</td><td>2,101</td><td>2,552</td><td>2,878</td></tr><tr><th>19</th><td>1,328</td><td>1,729</td><td>2,093</td><td>2,539</td><td>2,861</td></tr><tr><th>20</th><td>1,325</td><td>1,725</td><td>2,086</td><td>2,528</td><td>2,845</td></tr><tr><th>21</th><td>1,323</td><td>1,721</td><td>2,080</td><td>2,518</td><td>2,831</td></tr><tr><th>22</th><td>1,321</td><td>1,717</td><td>2,074</td><td>2,508</td><td>2,819</td></tr><tr><th>23</th><td>1,319</td><td>1,714</td><td>2,069</td><td>2,500</td><td>2,807</td></tr><tr><th>24</th><td>1,318</td><td>1,711</td><td>2,064</td><td>2,492</td><td>2,797</td></tr><tr><th>25</th><td>1,316</td><td>1,708</td><td>2,060</td><td>2,485</td><td>2,787</td></tr><tr><th>26</th><td>1,315</td><td>1,706</td><td>2,056</td><td>2,479</td><td>2,779</td></tr><tr><th>27</th><td>1,314</td><td>1,703</td><td>2,052</td><td>2,473</td><td>2,771</td></tr><tr><th>28</th><td>1,313</td><td>1,701</td><td>2,048</td><td>2,467</td><td>2,763</td></tr><tr><th>29</th><td>1,311</td><td>1,699</td><td>2,045</td><td>2,462</td><td>2,756</td></tr><tr><th>30</th><td>1,310</td><td>1,697</td><td>2,042</td><td>2,457</td><td>2,750</td></tr><tr><th>40</th><td>1,303</td><td>1,684</td><td>2,021</td><td>2,423</td><td>2,704</td></tr><tr><th>60</th><td>1,296</td><td>1,671</td><td>2,000</td><td>2,390</td><td>2,660</td></tr><tr><th>120</th><td>1,289</td><td>1,658</td><td>1,980</td><td>2,358</td><td>2,617</td></tr><tr><th>∞</th><td>1,282</td><td>1,645</td><td>1,960</td><td>2,326</td><td>2,576</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-χ²",
        "n": "χ²",
        "title": "χ²-dreifing: c með Pr(χ² < c) = p",
        "html": "<section><h2><span class=\"n\">χ²</span>χ²-dreifing: c með Pr(χ² &lt; c) = p</h2><p class=\"hint\">Hlutfallsmörk neðan frá. Efri hali α: dálkurinn p = 1 − α.</p><div class=\"scroll\"><table class=\"phi\"><thead><tr><th>df</th><th>0,005</th><th>0,010</th><th>0,025</th><th>0,050</th><th>0,950</th><th>0,975</th><th>0,990</th><th>0,995</th></tr></thead><tbody><tr><th>1</th><td>0,0000</td><td>0,0002</td><td>0,0010</td><td>0,00</td><td>3,84</td><td>5,02</td><td>6,63</td><td>7,88</td></tr><tr><th>2</th><td>0,0100</td><td>0,0201</td><td>0,0506</td><td>0,10</td><td>5,99</td><td>7,38</td><td>9,21</td><td>10,60</td></tr><tr><th>3</th><td>0,07</td><td>0,11</td><td>0,22</td><td>0,35</td><td>7,81</td><td>9,35</td><td>11,34</td><td>12,84</td></tr><tr><th>4</th><td>0,21</td><td>0,30</td><td>0,48</td><td>0,71</td><td>9,49</td><td>11,14</td><td>13,28</td><td>14,86</td></tr><tr><th>5</th><td>0,41</td><td>0,55</td><td>0,83</td><td>1,15</td><td>11,07</td><td>12,83</td><td>15,09</td><td>16,75</td></tr><tr><th>6</th><td>0,68</td><td>0,87</td><td>1,24</td><td>1,64</td><td>12,59</td><td>14,45</td><td>16,81</td><td>18,55</td></tr><tr><th>7</th><td>0,99</td><td>1,24</td><td>1,69</td><td>2,17</td><td>14,07</td><td>16,01</td><td>18,48</td><td>20,28</td></tr><tr><th>8</th><td>1,34</td><td>1,65</td><td>2,18</td><td>2,73</td><td>15,51</td><td>17,53</td><td>20,09</td><td>21,95</td></tr><tr><th>9</th><td>1,73</td><td>2,09</td><td>2,70</td><td>3,33</td><td>16,92</td><td>19,02</td><td>21,67</td><td>23,59</td></tr><tr><th>10</th><td>2,16</td><td>2,56</td><td>3,25</td><td>3,94</td><td>18,31</td><td>20,48</td><td>23,21</td><td>25,19</td></tr><tr><th>11</th><td>2,60</td><td>3,05</td><td>3,82</td><td>4,57</td><td>19,68</td><td>21,92</td><td>24,72</td><td>26,76</td></tr><tr><th>12</th><td>3,07</td><td>3,57</td><td>4,40</td><td>5,23</td><td>21,03</td><td>23,34</td><td>26,22</td><td>28,30</td></tr><tr><th>13</th><td>3,57</td><td>4,11</td><td>5,01</td><td>5,89</td><td>22,36</td><td>24,74</td><td>27,69</td><td>29,82</td></tr><tr><th>14</th><td>4,07</td><td>4,66</td><td>5,63</td><td>6,57</td><td>23,68</td><td>26,12</td><td>29,14</td><td>31,32</td></tr><tr><th>15</th><td>4,60</td><td>5,23</td><td>6,26</td><td>7,26</td><td>25,00</td><td>27,49</td><td>30,58</td><td>32,80</td></tr><tr><th>16</th><td>5,14</td><td>5,81</td><td>6,91</td><td>7,96</td><td>26,30</td><td>28,85</td><td>32,00</td><td>34,27</td></tr><tr><th>17</th><td>5,70</td><td>6,41</td><td>7,56</td><td>8,67</td><td>27,59</td><td>30,19</td><td>33,41</td><td>35,72</td></tr><tr><th>18</th><td>6,26</td><td>7,01</td><td>8,23</td><td>9,39</td><td>28,87</td><td>31,53</td><td>34,81</td><td>37,16</td></tr><tr><th>19</th><td>6,84</td><td>7,63</td><td>8,91</td><td>10,12</td><td>30,14</td><td>32,85</td><td>36,19</td><td>38,58</td></tr><tr><th>20</th><td>7,43</td><td>8,26</td><td>9,59</td><td>10,85</td><td>31,41</td><td>34,17</td><td>37,57</td><td>40,00</td></tr><tr><th>21</th><td>8,03</td><td>8,90</td><td>10,28</td><td>11,59</td><td>32,67</td><td>35,48</td><td>38,93</td><td>41,40</td></tr><tr><th>22</th><td>8,64</td><td>9,54</td><td>10,98</td><td>12,34</td><td>33,92</td><td>36,78</td><td>40,29</td><td>42,80</td></tr><tr><th>23</th><td>9,26</td><td>10,20</td><td>11,69</td><td>13,09</td><td>35,17</td><td>38,08</td><td>41,64</td><td>44,18</td></tr><tr><th>24</th><td>9,89</td><td>10,86</td><td>12,40</td><td>13,85</td><td>36,42</td><td>39,36</td><td>42,98</td><td>45,56</td></tr><tr><th>25</th><td>10,52</td><td>11,52</td><td>13,12</td><td>14,61</td><td>37,65</td><td>40,65</td><td>44,31</td><td>46,93</td></tr><tr><th>26</th><td>11,16</td><td>12,20</td><td>13,84</td><td>15,38</td><td>38,89</td><td>41,92</td><td>45,64</td><td>48,29</td></tr><tr><th>27</th><td>11,81</td><td>12,88</td><td>14,57</td><td>16,15</td><td>40,11</td><td>43,19</td><td>46,96</td><td>49,64</td></tr><tr><th>28</th><td>12,46</td><td>13,56</td><td>15,31</td><td>16,93</td><td>41,34</td><td>44,46</td><td>48,28</td><td>50,99</td></tr><tr><th>29</th><td>13,12</td><td>14,26</td><td>16,05</td><td>17,71</td><td>42,56</td><td>45,72</td><td>49,59</td><td>52,34</td></tr><tr><th>30</th><td>13,79</td><td>14,95</td><td>16,79</td><td>18,49</td><td>43,77</td><td>46,98</td><td>50,89</td><td>53,67</td></tr><tr><th>40</th><td>20,71</td><td>22,16</td><td>24,43</td><td>26,51</td><td>55,76</td><td>59,34</td><td>63,69</td><td>66,77</td></tr><tr><th>50</th><td>27,99</td><td>29,71</td><td>32,36</td><td>34,76</td><td>67,50</td><td>71,42</td><td>76,15</td><td>79,49</td></tr><tr><th>60</th><td>35,53</td><td>37,48</td><td>40,48</td><td>43,19</td><td>79,08</td><td>83,30</td><td>88,38</td><td>91,95</td></tr><tr><th>80</th><td>51,17</td><td>53,54</td><td>57,15</td><td>60,39</td><td>101,88</td><td>106,63</td><td>112,33</td><td>116,32</td></tr><tr><th>100</th><td>67,33</td><td>70,06</td><td>74,22</td><td>77,93</td><td>124,34</td><td>129,56</td><td>135,81</td><td>140,17</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-✗",
        "n": "✗",
        "title": "Gildrulisti",
        "html": "<section><h2><span class=\"n\">✗</span>Gildrulisti</h2><ul><li>sd vs dreifni: N(μ, σ²) hefur dreifnina sem seinni stika, en <code>pnorm</code>, <code>qnorm</code>, <code>rnorm</code> taka sd</li><li>Var[X − Y] = Var X + Var Y (− 2Cov), ekki Var X − Var Y</li><li>SD[aX] = |a|·SD[X], ekki a·SD og ekki a²·SD</li><li>E[g(X)] ≠ g(E[X]) nema g sé línulegt (Jensen)</li><li>Pr(X = x) = 0 fyrir samfelldar breytur, og f(x) getur verið &gt; 1</li><li>Sundurlæg ≠ óháð: sundurlægir atburðir með jákvæðar líkur eru háðir</li><li>Cov = 0 ⇏ óhæði (t.d. X ~ N(0, 1) og Y = X²)</li><li>(A ∩ B)<sup>c</sup> = A<sup>c</sup> ∪ B<sup>c</sup>: „X &gt; 1 og Y &gt; 2\" er ekki 1 − F(1, 2)</li><li>λ skalað á rangt tímabil (t.d. á mánuði í stað tveggja ára)</li><li>λ í veldisdreifingu er tíðni; meðalbiðin er 1/λ</li><li>Tilvísun í R byrjar á 1, og matrix fyllist dálk fyrir dálk</li><li>S² deilir með n − 1; Var[X̄] = σ²/n er annað en S²</li><li>Staðalfrávik leggjast ekki saman: √(a + b) ≠ √a + √b</li><li>Pr(X ≤ k) vs Pr(X &lt; k) í strjálum dreifingum</li><li>Einhliða vs tvíhliða líkur</li><li>Að deila með σ en ekki σ/√n þegar spurt er um X̄</li><li>Sennileikamatið σ̂² deilir með n og er bjagað; S² deilir með n − 1</li><li>Einhliða bil og próf nota t<sub>α</sub>; tvíhliða nota t<sub>α/2</sub></li><li>χ²- og F-gildi eru skrifuð á tvo vegu á glærum 09 (neðan frá á gl. 81, efri hali á gl. 86 og 93): lesið hvaða hala gildið á við</li><li>Tilgáta um staðalfrávik (σ ≤ 110) er prófuð með dreifnum: s² og σ₀² = 110²</li><li>Að hafna ekki H₀ sannar hana ekki; „ekki hægt að hafna H₀\"</li><li>Í einhliða prófi skiptir stefna T máli: stórt neikvætt T hafnar ekki H₀: μ ≤ μ₀</li><li>F = s₁²/s₂², ekki hlutfall staðalfrávika</li></ul></section>"
      },
      {
        "id": "hag108g-!",
        "n": "!",
        "title": "Villur á glærum og í lausnum",
        "html": "<section><h2><span class=\"n\">!</span>Villur á glærum og í lausnum</h2><p class=\"hint\">Á prófi: notaðu rétta gildið og sýndu útreikninginn.</p><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Hvar</th><th>Stendur</th><th>Rétt</th></tr></thead><tbody><tr><td class=\"mono\">00 R, gl. 18</td><td><code>mat[1, 2]</code> skilar 2</td><td>Skilar 4 (matrix fyllist dálk fyrir dálk; keyrt í R)</td></tr><tr><td class=\"mono\">01, gl. 43</td><td>Teljari Bayes: Pr(B)Pr(A<sub>j</sub>|B)</td><td>Pr(A<sub>j</sub>)Pr(B|A<sub>j</sub>)</td></tr><tr><td class=\"mono\">02, gl. 18</td><td>Brúun: ·(a − b)</td><td>·(b − a)</td></tr><tr><td class=\"mono\">02, gl. 48</td><td>Var[P] = 39,04</td><td>9,76</td></tr><tr><td class=\"mono\">02, gl. 27–28</td><td>Texti: summa „hærri en 14\"; kóði: &gt; 13</td><td>Ósamræmi; E = 92,13 með kóðanum, 15,74 með textanum</td></tr><tr><td class=\"mono\">03, gl. 22–23</td><td>Merkingar Pr(X &gt; 0) o.fl.</td><td>Atburðirnir eru X ≥ 2 (3 dagar) og X = 2 (2 dagar); tölurnar 0,352 og 0,16 réttar</td></tr><tr><td class=\"mono\">03, gl. 29</td><td>rbinom „reiknar þéttleikafall\"</td><td>rbinom hermir slembigildi</td></tr><tr><td class=\"mono\">03, gl. 52</td><td>Pr(2 ≤ X ≤ 4) ≈ 0,676</td><td>0,541 (0,676 er Pr(X ≤ 2))</td></tr><tr><td class=\"mono\">05, gl. 29</td><td>Pr(2 &lt; X &lt; 4) ≈ 0,11</td><td>0,221</td></tr><tr><td class=\"mono\">05, gl. 41</td><td>Staðalfrávik aY = a·σ</td><td>|a|·σ</td></tr><tr><td class=\"mono\">05, gl. 54</td><td>Dreifni summu: Σσ<sub>i</sub></td><td>Σσ<sub>i</sub>²</td></tr><tr><td class=\"mono\">06, gl. 6</td><td>F(x, y) = 0</td><td>F(−∞, y) = F(x, −∞) = 0</td></tr><tr><td class=\"mono\">06, gl. 19</td><td>Síðasta lína e<sup>−1</sup>e<sup>−4</sup>; texti „y &gt; 2\"</td><td>e<sup>−1</sup>(1 − e<sup>−4</sup>) = 0,3611; y &lt; 2</td></tr><tr><td class=\"mono\">06, gl. 69</td><td>Fylgni 0 ⇒ óháðar</td><td>Aðeins öfugt: óháðar ⇒ fylgni 0</td></tr><tr><td class=\"mono\">07, gl. 56</td><td>1 − (1 − e<sup>0,288·5</sup>)</td><td>e<sup>−0,288·5</sup> = 0,237</td></tr><tr><td class=\"mono\">07, gl. 63 og 69</td><td>0,042 og 0,056</td><td>Einhliða: 0,017 (z = −2,12) og 0,035 (t₉ = −2,06); óstaðfest hvað er átt við</td></tr><tr><td class=\"mono\">08, gl. 15</td><td>„Bæði X̄ og X̃\"</td><td>Ẋ = X<sub>1</sub></td></tr><tr><td class=\"mono\">08, gl. 54</td><td>σ̂² = 1,647</td><td>2,099 fyrir gögnin á gl. 50 (S² = 2,332)</td></tr><tr><td class=\"mono\">09, gl. 55</td><td>„tilgátu um að μ sé minna en μ₀\"</td><td>H₁: μ &gt; 6,5, svo „stærra\"</td></tr><tr><td class=\"mono\">09, gl. 67</td><td>„um 1,35 lægri\"</td><td>0,013341 · 100 = 1,33</td></tr><tr><td class=\"mono\">09, gl. 76–78</td><td>ȳ = 7,5 og s = 1,1 gefa T = −2,15</td><td>R-gögnin hafa ȳ = 7,4 og s = 0,4: T = −2,37 (eins og R skilar)</td></tr><tr><td class=\"mono\">09, gl. 85</td><td>„S² er metið staðalfrávik\"</td><td>S² er dreifni úrtaksins</td></tr><tr><td class=\"mono\">09, gl. 96</td><td>F<sub>9,9; 0,025</sub> = 4,96</td><td>4,03 (qf(0.975, 9, 9)); niðurstaðan breytist ekki</td></tr><tr><td class=\"mono\">09, gl. 100–101</td><td>S² = dreifni úrtaksins</td><td>S = skeifni; S² er skeifnin í öðru veldi. Undir H₀ er JB ∼ χ²₂</td></tr><tr><td class=\"mono\">Dæmablað 4, 4b-ii</td><td>Miðja bils: (u<sub>i</sub> − l<sub>i</sub>)/2</td><td>(u<sub>i</sub> + l<sub>i</sub>)/2 (verkefni 5 rétt)</td></tr></tbody></table></div></section>"
      }
    ],
    "foot": "\n    <div class=\"callout\"><b>Óstaðfest</b><ul><li>Snið lokaprófsins (fjölval, skrifleg dæmi eða blanda).</li><li>Hvort formúlublaðið er eigið eða frá kennara; staðsetning prófsins.</li><li>Strjált miðgildi: formúla glæru 16 (min{x : F(x) ≥ 0,5}) og lausn verkefnis 3 (2d: 15 í stað 20) stangast á; lausn dæmablaðs 2 (2d) brúar 70% hlutfallsmörk (3⅓) þar sem reglan gefur 4.</li><li>Einhliða eða tvíhliða líkur á glærum 07 (gl. 63 og 69) — spurðu kennarann.</li><li>pchisq og qchisq koma fyrir á glæru 89 í 09, en pt og pf hvergi (t.test og var.test reikna þau innbyrðis); gert ráð fyrir sömu d/p/q/r-reglu.</li><li>Dæmablað 8, 1c: óljóst hvort nota á S² (n̂ = 8, p̂ = 0,4875) eða dreifni með n í nefnara (n̂ = 7), og hvort p̂ er gefið fyrir eða eftir námundun n.</li><li>Dæmablað 9, 2c leyfir sameinað t-próf með jafnri dreifni, en glærurnar kenna aðeins Welch. Báðar leiðir hafna H₀ við 5%.</li><li>Samantektin (skjalið) nær ekki enn yfir glærur 08 og 09; efni þeirra hér byggir eingöngu á glærunum og dæmablöðum 8–9.</li><li>Lausnir vantar fyrir verkefni 1 og dæmablöð 6–9 (líka 8 og 9); svörin hér eru reiknuð sjálfstætt og staðfest tölulega.</li></ul></div>\n  "
  },
  "examInfo": {
    "title": "Lokaprófið",
    "format": "Snið lokaprófsins er óstaðfest. Kennarinn segir að allt til prófs sé í glærunum og að spurningarnar líkist heimaverkefnunum; R er líka prófað.",
    "aids": "Reiknivél, formúlublað og töflur fyrir N/t/χ²/F",
    "weight": "70% af einkunn; verkefnaeinkunnin (30%) gildir aðeins ef þú færð minnst 5 á lokaprófinu",
    "callout": "<div class=\"callout\"><b>Óstaðfest</b><ul><li>Snið lokaprófsins (fjölval, skrifleg dæmi eða blanda).</li><li>Hvort formúlublaðið er eigið eða frá kennara; staðsetning prófsins.</li><li>Strjált miðgildi: formúla glæru 16 (min{x : F(x) ≥ 0,5}) og lausn verkefnis 3 (2d: 15 í stað 20) stangast á; lausn dæmablaðs 2 (2d) brúar 70% hlutfallsmörk (3⅓) þar sem reglan gefur 4.</li><li>Einhliða eða tvíhliða líkur á glærum 07 (gl. 63 og 69) — spurðu kennarann.</li><li>pchisq og qchisq koma fyrir á glæru 89 í 09, en pt og pf hvergi (t.test og var.test reikna þau innbyrðis); gert ráð fyrir sömu d/p/q/r-reglu.</li><li>Dæmablað 8, 1c: óljóst hvort nota á S² (n̂ = 8, p̂ = 0,4875) eða dreifni með n í nefnara (n̂ = 7), og hvort p̂ er gefið fyrir eða eftir námundun n.</li><li>Dæmablað 9, 2c leyfir sameinað t-próf með jafnri dreifni, en glærurnar kenna aðeins Welch. Báðar leiðir hafna H₀ við 5%.</li><li>Samantektin (skjalið) nær ekki enn yfir glærur 08 og 09; efni þeirra hér byggir eingöngu á glærunum og dæmablöðum 8–9.</li><li>Lausnir vantar fyrir verkefni 1 og dæmablöð 6–9 (líka 8 og 9); svörin hér eru reiknuð sjálfstætt og staðfest tölulega.</li></ul></div>",
    "facts": [
      {
        "value": "3 klst.",
        "label": "1. desember kl. 13:30"
      },
      {
        "value": "70%",
        "label": "af einkunn; verkefnin (30%) gilda aðeins ef þú færð ≥ 5"
      },
      {
        "value": "L00–L09",
        "label": "10 fyrirlestrar; R er líka prófað"
      },
      {
        "value": "+ blað",
        "label": "Reiknivél, formúlublað og töflur fyrir N/t/χ²/F"
      }
    ]
  },
  "passScore": 0.7,
  "sourceLabels": {
    "sheet": "Heimaverkefni"
  },
  "legacy": {
    "key": "hag108g-profaefing-v1",
    "file": "HAG108G prófæfing.html"
  }
};

/** @type {import('../schema.js').Course} */
export default adapt(meta, L);
