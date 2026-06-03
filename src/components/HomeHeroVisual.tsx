const c = {
  panel: "var(--background-soft)",
  surface: "var(--card-muted)",
  border: "var(--border-strong)",
  primary: "var(--primary)",
  accent: "var(--accent)",
  muted: "var(--muted-foreground)",
  primarySoft: "var(--primary-soft)",
  accentSoft: "var(--accent-soft)",
  success: "var(--success)",
  danger: "var(--danger)",
} as const;

/** Decorative hero art — uses theme CSS variables so fills render inside SVG. */
export function HomeHeroVisual() {
  return (
    <svg
      viewBox="-32 -28 464 396"
      xmlns="http://www.w3.org/2000/svg"
      className="home-hero-visual__svg"
      aria-hidden
      overflow="visible"
    >
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.28" />
          <stop offset="55%" stopColor={c.accent} stopOpacity="0.1" />
          <stop offset="100%" stopColor={c.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-logo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.primary} />
          <stop offset="100%" stopColor={c.accent} />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="172" rx="128" ry="118" fill="url(#hero-glow)" />
      <ellipse cx="200" cy="172" rx="168" ry="148" fill="url(#hero-glow)" opacity="0.45" />

      <rect
        x="40"
        y="36"
        width="320"
        height="268"
        rx="22"
        fill={c.panel}
        stroke={c.border}
        strokeWidth="2"
      />

      <rect x="60" y="56" width="280" height="36" rx="10" fill={c.surface} stroke={c.border} strokeWidth="1" />
      <circle cx="78" cy="74" r="5" fill={c.danger} />
      <circle cx="96" cy="74" r="5" fill="#fbbf24" />
      <circle cx="114" cy="74" r="5" fill={c.success} />
      <rect x="136" y="66" width="100" height="14" rx="7" fill={c.border} opacity="0.5" />

      <rect
        x="60"
        y="108"
        width="168"
        height="176"
        rx="14"
        fill={c.surface}
        stroke={c.border}
        strokeWidth="1.5"
      />
      <text x="76" y="136" fill={c.primary} fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="600">
        {`{ "tools": [`}
      </text>
      <text x="88" y="158" fill={c.muted} fontSize="11" fontFamily="ui-monospace, monospace">
        &quot;json-formatter&quot;,
      </text>
      <text x="88" y="178" fill={c.muted} fontSize="11" fontFamily="ui-monospace, monospace">
        &quot;jwt-decoder&quot;,
      </text>
      <text x="88" y="198" fill={c.accent} fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="600">
        &quot;regex-tester&quot;
      </text>
      <text x="76" y="222" fill={c.primary} fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="600">
        {`] }`}
      </text>
      <rect x="76" y="238" width="72" height="6" rx="3" fill={c.primary} opacity="0.35" />
      <rect x="76" y="252" width="120" height="6" rx="3" fill={c.border} opacity="0.6" />
      <rect x="76" y="266" width="90" height="6" rx="3" fill={c.accent} opacity="0.45" />

      <rect
        x="244"
        y="108"
        width="96"
        height="80"
        rx="14"
        fill={c.primarySoft}
        stroke={c.primary}
        strokeWidth="1.5"
        opacity="0.95"
      />
      <text
        x="292"
        y="158"
        textAnchor="middle"
        fill={c.primary}
        fontSize="26"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="800"
      >
        {"{ }"}
      </text>

      <rect
        x="244"
        y="200"
        width="96"
        height="84"
        rx="14"
        fill={c.accentSoft}
        stroke={c.accent}
        strokeWidth="1.5"
        opacity="0.95"
      />
      <path d="M272 242h40M292 222v40" stroke={c.accent} strokeWidth="3" strokeLinecap="round" />

      <rect x="268" y="52" width="72" height="30" rx="15" fill="url(#hero-logo)" />
      <text
        x="304"
        y="72"
        textAnchor="middle"
        fill="#fff"
        fontSize="11"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
      >
        Copy
      </text>

      <circle cx="52" cy="288" r="20" fill="url(#hero-logo)" />
      <text
        x="52"
        y="294"
        textAnchor="middle"
        fill="#fff"
        fontSize="13"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="800"
      >
        DF
      </text>
    </svg>
  );
}
