import React from 'react';

// Color and pattern configurations for each jersey team
const teamConfigs = {
  // Football
  "India National Football Team Home Jersey 2024": {
    baseColor: "#0055c4",
    trimColor: "#ff9933",
    sleeveColor: "#0055c4",
    pattern: "solid",
    sponsor: "INDIA",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ff9933",
    crestColor: "#f4b400",
    defaultName: "CHHETRI",
    defaultNumber: "11"
  },
  "Brazil 2024 Home Jersey — Canary Yellow": {
    baseColor: "#ffdf00",
    trimColor: "#009c3b",
    sleeveColor: "#ffdf00",
    pattern: "solid",
    sponsor: "BRASIL",
    logoColor: "#009c3b",
    textColor: "#009c3b",
    numColor: "#009c3b",
    crestColor: "#009c3b",
    defaultName: "VINICIUS JR",
    defaultNumber: "7"
  },
  "Real Madrid 2024-25 Home Jersey": {
    baseColor: "#ffffff",
    trimColor: "#c19a40",
    sleeveColor: "#ffffff",
    pattern: "solid",
    sponsor: "Emirates",
    logoColor: "#c19a40",
    textColor: "#1e293b",
    numColor: "#c19a40",
    crestColor: "#3b82f6",
    defaultName: "BELLINGHAM",
    defaultNumber: "5"
  },
  "FC Barcelona Home Jersey 2024": {
    baseColor: "#004d98",
    trimColor: "#a50044",
    sleeveColor: "#004d98",
    pattern: "stripes",
    stripeColor: "#a50044",
    sponsor: "Spotify",
    logoColor: "#fdb913",
    textColor: "#fdb913",
    numColor: "#fdb913",
    crestColor: "#fdb913",
    defaultName: "LEWANDOWSKI",
    defaultNumber: "9"
  },
  "Manchester United 24-25 Home Jersey": {
    baseColor: "#da291c",
    trimColor: "#ffffff",
    sleeveColor: "#da291c",
    pattern: "solid",
    sponsor: "Snapdragon",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#fdb913",
    defaultName: "RASHFORD",
    defaultNumber: "10"
  },
  "Arsenal FC 2024-25 Home Jersey": {
    baseColor: "#db0007",
    trimColor: "#db0007",
    sleeveColor: "#ffffff",
    pattern: "solid",
    sponsor: "Emirates",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#fdb913",
    defaultName: "SAKA",
    defaultNumber: "7"
  },
  "Liverpool FC Home Jersey 24-25": {
    baseColor: "#c8102e",
    trimColor: "#f6eb61",
    sleeveColor: "#c8102e",
    pattern: "solid",
    sponsor: "Standard Chartered",
    logoColor: "#f6eb61",
    textColor: "#ffffff",
    numColor: "#f6eb61",
    crestColor: "#f6eb61",
    defaultName: "SALAH",
    defaultNumber: "11"
  },
  "Bayern Munich Away Jersey 2024": {
    baseColor: "#171717",
    trimColor: "#8b5cf6",
    sleeveColor: "#171717",
    pattern: "solid",
    sponsor: "T",
    logoColor: "#8b5cf6",
    textColor: "#ffffff",
    numColor: "#8b5cf6",
    crestColor: "#8b5cf6",
    defaultName: "KANE",
    defaultNumber: "9"
  },
  "Argentina Copa America 2024 Jersey": {
    baseColor: "#ffffff",
    trimColor: "#74acdf",
    sleeveColor: "#ffffff",
    pattern: "stripes",
    stripeColor: "#74acdf",
    sponsor: "AFA",
    logoColor: "#fdb913",
    textColor: "#1e293b",
    numColor: "#fdb913",
    crestColor: "#fdb913",
    defaultName: "MESSI",
    defaultNumber: "10"
  },
  "Portugal 2024 Home Jersey (Euro Edition)": {
    baseColor: "#8b0000",
    trimColor: "#006400",
    sleeveColor: "#8b0000",
    pattern: "solid",
    sponsor: "PORTUGAL",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#fdb913",
    defaultName: "RONALDO",
    defaultNumber: "7"
  },
  "Manchester City Home Jersey 24-25": {
    baseColor: "#6cabdd",
    trimColor: "#1c2d5a",
    sleeveColor: "#6cabdd",
    pattern: "solid",
    sponsor: "Etihad Airways",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#ffffff",
    defaultName: "HAALAND",
    defaultNumber: "9"
  },
  "Juventus 24-25 Home Jersey": {
    baseColor: "#ffffff",
    trimColor: "#000000",
    sleeveColor: "#ffffff",
    pattern: "stripes",
    stripeColor: "#000000",
    sponsor: "Jeep",
    logoColor: "#c19a40",
    textColor: "#ffffff",
    numColor: "#c19a40",
    crestColor: "#c19a40",
    defaultName: "VLAHOVIC",
    defaultNumber: "9"
  },
  "PSG Jordan Strike Jersey 2024": {
    baseColor: "#002f6c",
    trimColor: "#e30613",
    sleeveColor: "#002f6c",
    pattern: "psg",
    sponsor: "Qatar Airways",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#ffffff",
    defaultName: "MBAPPÉ",
    defaultNumber: "7"
  },
  "Chelsea FC 2024-25 Home Kit": {
    baseColor: "#034694",
    trimColor: "#ffffff",
    sleeveColor: "#034694",
    pattern: "solid",
    sponsor: "Chelsea",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#ffffff",
    defaultName: "PALMER",
    defaultNumber: "20"
  },
  "Inter Miami CF Home Jersey 2024": {
    baseColor: "#ffb3c6",
    trimColor: "#000000",
    sleeveColor: "#ffb3c6",
    pattern: "solid",
    sponsor: "Royal Caribbean",
    logoColor: "#000000",
    textColor: "#000000",
    numColor: "#000000",
    crestColor: "#000000",
    defaultName: "MESSI",
    defaultNumber: "10"
  },

  // Cricket
  "India T20 Blue Jersey — World Cup 2024": {
    baseColor: "#004899",
    trimColor: "#ff7700",
    sleeveColor: "#ff7700",
    pattern: "solid",
    sponsor: "INDIA",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ff7700",
    crestColor: "#fdb913",
    defaultName: "ROHIT",
    defaultNumber: "45"
  },
  "India Test Cricket Whites 2024": {
    baseColor: "#f8f9fa",
    trimColor: "#004899",
    sleeveColor: "#f8f9fa",
    pattern: "solid",
    sponsor: "INDIA",
    logoColor: "#004899",
    textColor: "#004899",
    numColor: "#004899",
    crestColor: "#fdb913",
    defaultName: "KOHLI",
    defaultNumber: "18"
  },
  "Mumbai Indians IPL 2025 Jersey": {
    baseColor: "#004e9e",
    trimColor: "#f5a623",
    sleeveColor: "#004e9e",
    pattern: "mi",
    sponsor: "Slice",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#f5a623",
    crestColor: "#f5a623",
    defaultName: "HARDIK",
    defaultNumber: "33"
  },
  "Chennai Super Kings 2025 Yellow Kit": {
    baseColor: "#fdb913",
    trimColor: "#0066cc",
    sleeveColor: "#fdb913",
    pattern: "csk",
    sponsor: "Gulf",
    logoColor: "#0066cc",
    textColor: "#0066cc",
    numColor: "#0066cc",
    crestColor: "#ff7700",
    defaultName: "DHONI",
    defaultNumber: "7"
  },
  "Royal Challengers Bengaluru 2025": {
    baseColor: "#222222",
    trimColor: "#db0007",
    sleeveColor: "#db0007",
    pattern: "rcb",
    sponsor: "Qatar Airways",
    logoColor: "#f5a623",
    textColor: "#ffffff",
    numColor: "#f5a623",
    crestColor: "#f5a623",
    defaultName: "KOHLI",
    defaultNumber: "18"
  },
  "Kolkata Knight Riders 2025 Champions Kit": {
    baseColor: "#3b1e54",
    trimColor: "#f5a623",
    sleeveColor: "#3b1e54",
    pattern: "solid",
    sponsor: "Joy",
    logoColor: "#f5a623",
    textColor: "#ffffff",
    numColor: "#f5a623",
    crestColor: "#f5a623",
    defaultName: "SHREYAS",
    defaultNumber: "41"
  },
  "Pakistan 2024 ODI Green Jersey": {
    baseColor: "#0e5a36",
    trimColor: "#ffffff",
    sleeveColor: "#0e5a36",
    pattern: "solid",
    sponsor: "PAKISTAN",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#f5a623",
    crestColor: "#f5a623",
    defaultName: "BABAR",
    defaultNumber: "56"
  },
  "Australia 2024 Baggy Gold Cricket Jersey": {
    baseColor: "#f5b041",
    trimColor: "#0b5345",
    sleeveColor: "#f5b041",
    pattern: "solid",
    sponsor: "AUSTRALIA",
    logoColor: "#0b5345",
    textColor: "#0b5345",
    numColor: "#0b5345",
    crestColor: "#0b5345",
    defaultName: "SMITH",
    defaultNumber: "49"
  },
  "West Indies T20 Maroon Jersey 2024": {
    baseColor: "#7d1935",
    trimColor: "#f5b041",
    sleeveColor: "#f5b041",
    pattern: "solid",
    sponsor: "WINDIES",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#f5b041",
    crestColor: "#f5b041",
    defaultName: "POORAN",
    defaultNumber: "29"
  },
  "Delhi Capitals IPL 2025 Kit": {
    baseColor: "#004e9e",
    trimColor: "#db0007",
    sleeveColor: "#004e9e",
    pattern: "dc",
    sponsor: "DP World",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#db0007",
    crestColor: "#db0007",
    defaultName: "PANT",
    defaultNumber: "17"
  },
  "Rajasthan Royals IPL 2025 Pink Kit": {
    baseColor: "#e0115f",
    trimColor: "#002f6c",
    sleeveColor: "#e0115f",
    pattern: "solid",
    sponsor: "Luminous",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#ffffff",
    defaultName: "SANJU",
    defaultNumber: "11"
  },
  "Sunrisers Hyderabad IPL 2025 Kit": {
    baseColor: "#ff6600",
    trimColor: "#1a1a1a",
    sleeveColor: "#1a1a1a",
    pattern: "solid",
    sponsor: "Dream11",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#ffffff",
    defaultName: "CUMMINS",
    defaultNumber: "30"
  },
  "Lucknow Super Giants IPL 2025 Kit": {
    baseColor: "#00a896",
    trimColor: "#f5a623",
    sleeveColor: "#00a896",
    pattern: "solid",
    sponsor: "My11Circle",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#f5a623",
    defaultName: "KL RAHUL",
    defaultNumber: "1"
  },
  "England Cricket Test Whites Jersey": {
    baseColor: "#f8f9fa",
    trimColor: "#002f6c",
    sleeveColor: "#f8f9fa",
    pattern: "solid",
    sponsor: "ENGLAND",
    logoColor: "#002f6c",
    textColor: "#002f6c",
    numColor: "#002f6c",
    crestColor: "#d4af37",
    defaultName: "STOKES",
    defaultNumber: "55"
  },

  // Basketball
  "LA Lakers LeBron #23 Replica Jersey": {
    baseColor: "#f5b041",
    trimColor: "#512da8",
    sleeveColor: "#f5b041",
    pattern: "solid",
    sponsor: "LAKERS",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#512da8",
    crestColor: "#512da8",
    defaultName: "JAMES",
    defaultNumber: "23"
  },
  "Golden State Warriors Home Jersey": {
    baseColor: "#1e3a8a",
    trimColor: "#f5a623",
    sleeveColor: "#1e3a8a",
    pattern: "solid",
    sponsor: "WARRIORS",
    logoColor: "#f5a623",
    textColor: "#ffffff",
    numColor: "#f5a623",
    crestColor: "#f5a623",
    defaultName: "CURRY",
    defaultNumber: "30"
  },
  "Chicago Bulls #23 Iconic Jersey": {
    baseColor: "#db0007",
    trimColor: "#111111",
    sleeveColor: "#db0007",
    pattern: "solid",
    sponsor: "BULLS",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#111111",
    crestColor: "#111111",
    defaultName: "JORDAN",
    defaultNumber: "23"
  },
  "Brooklyn Nets Away Jersey": {
    baseColor: "#111111",
    trimColor: "#ffffff",
    sleeveColor: "#111111",
    pattern: "solid",
    sponsor: "NETS",
    logoColor: "#ffffff",
    textColor: "#ffffff",
    numColor: "#ffffff",
    crestColor: "#ffffff",
    defaultName: "THOMAS",
    defaultNumber: "24"
  }
};

// Default fallback configuration
const defaultValues = {
  baseColor: "#334155",
  trimColor: "#ffffff",
  sleeveColor: "#334155",
  pattern: "solid",
  sponsor: "SPORTZONE",
  logoColor: "#ffffff",
  textColor: "#ffffff",
  numColor: "#38bdf8",
  crestColor: "#e2e8f0"
};

export default function JerseyMockup({ teamName, customName, customNumber, height = "280px" }) {
  const config = teamConfigs[teamName] || defaultValues;

  const displayName = (customName && customName.trim()) 
    ? customName.trim().toUpperCase() 
    : (config.defaultName || "YOUR NAME");
    
  const displayNumber = (customNumber !== undefined && customNumber !== null && customNumber !== "") 
    ? String(customNumber) 
    : (config.defaultNumber || "00");

  // Render SVG Jersey paths
  return (
    <svg 
      viewBox="0 0 540 320" 
      style={{ width: "100%", height: height, background: "#0d121c", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <defs>
        {/* Soft fabric crease / fold gradients */}
        <linearGradient id="fold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>
        
        {/* Shadow Overlay for 3D realism */}
        <radialGradient id="shadow-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Stripes pattern */}
        <pattern id="jersey-stripes" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="20" height="40" fill={config.stripeColor || "#ff0000"} />
          <rect x="20" width="20" height="40" fill={config.baseColor || "#ffffff"} />
        </pattern>

        {/* Diagonal lines pattern for MI */}
        <pattern id="mi-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <rect width="60" height="60" fill={config.baseColor} />
          <line x1="0" y1="30" x2="60" y2="30" stroke="#00356b" strokeWidth="6" />
          <line x1="30" y1="0" x2="30" y2="60" stroke="#f5a623" strokeWidth="2" opacity="0.4" />
        </pattern>
      </defs>

      {/* Ground shadows under jerseys */}
      <ellipse cx="140" cy="290" rx="90" ry="12" fill="url(#shadow-grad)" />
      <ellipse cx="400" cy="290" rx="90" ry="12" fill="url(#shadow-grad)" />

      {/* ======================================================== */}
      {/*                    1. FRONT JERSEY VIEW                  */}
      {/* ======================================================== */}
      <g transform="translate(10, 10)">
        
        {/* Sleeves (Left & Right) */}
        {/* Left Sleeve */}
        <path 
          d="M 60 70 L 10 100 L 25 140 L 70 110 Z" 
          fill={config.sleeveColor} 
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="2"
        />
        {/* Left Sleeve Cuff Trim */}
        <path 
          d="M 10 100 L 25 140 L 29 137 L 16 100 Z" 
          fill={config.trimColor} 
        />

        {/* Right Sleeve */}
        <path 
          d="M 200 70 L 250 100 L 235 140 L 190 110 Z" 
          fill={config.sleeveColor}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="2"
        />
        {/* Right Sleeve Cuff Trim */}
        <path 
          d="M 250 100 L 235 140 L 231 137 L 244 100 Z" 
          fill={config.trimColor} 
        />

        {/* Main Body */}
        <path 
          d="M 70 70 
             Q 130 90 190 70 
             L 200 270 
             Q 130 280 60 270 Z" 
          fill={config.pattern === "stripes" ? "url(#jersey-stripes)" : config.pattern === "mi" ? "url(#mi-pattern)" : config.baseColor} 
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="2"
        />

        {/* Special pattern overlays */}
        {/* CSK Shoulder stripes */}
        {config.pattern === "csk" && (
          <>
            <path d="M 68 82 Q 130 98 192 82 L 195 105 Q 130 118 65 105 Z" fill="#0066cc" opacity="0.8" />
            <path d="M 65 105 Q 130 118 195 105 L 197 115 Q 130 126 63 115 Z" fill="#ff7700" />
          </>
        )}

        {/* RCB half-and-half black/red */}
        {config.pattern === "rcb" && (
          <path d="M 67 76 Q 130 93 193 76 L 197 150 L 63 150 Z" fill="#db0007" />
        )}

        {/* PSG center red/white stripe */}
        {config.pattern === "psg" && (
          <>
            <rect x="118" y="85" width="24" height="190" fill="#ffffff" />
            <rect x="123" y="85" width="14" height="190" fill="#e30613" />
          </>
        )}

        {/* DC half-and-half red/blue */}
        {config.pattern === "dc" && (
          <path d="M 130 85 L 200 85 L 200 270 Q 165 275 130 272 Z" fill="#db0007" />
        )}

        {/* Collar trim V-Neck / Round Neck */}
        <path 
          d="M 90 73 Q 130 110 170 73 Q 130 85 90 73" 
          fill={config.trimColor} 
        />
        <path 
          d="M 95 72 Q 130 102 165 72 Q 130 81 95 72" 
          fill="#111827" 
        />

        {/* Brand logo (Tick / Stripes) */}
        <path d="M 85 110 Q 95 115 105 105 L 107 108 Q 95 120 83 112 Z" fill={config.logoColor} />
        
        {/* Team Crest */}
        <circle cx="170" cy="112" r="8" fill={config.crestColor} />
        <circle cx="170" cy="112" r="5" fill="#111827" />
        <circle cx="170" cy="112" r="2" fill={config.crestColor} />

        {/* Sponsor Name text */}
        <text 
          x="130" 
          y="165" 
          textAnchor="middle" 
          fill={config.textColor} 
          fontSize="15" 
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          letterSpacing="1.5"
        >
          {config.sponsor}
        </text>

        {/* Sublimated Front Jersey Number (Small) */}
        {displayNumber !== "00" && (
          <text 
            x="130" 
            y="215" 
            textAnchor="middle" 
            fill={config.numColor} 
            fontSize="32" 
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            opacity="0.85"
          >
            {displayNumber}
          </text>
        )}

        {/* Fabric lighting fold overlay */}
        <path 
          d="M 70 70 Q 130 90 190 70 L 200 270 Q 130 280 60 270 Z" 
          fill="url(#fold-grad)" 
          style={{ mixBlendMode: "multiply" }}
          pointerEvents="none"
        />

        <text x="130" y="300" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600" letterSpacing="1">FRONT</text>

      </g>

      {/* ======================================================== */}
      {/*                     2. BACK JERSEY VIEW                  */}
      {/* ======================================================== */}
      <g transform="translate(270, 10)">
        
        {/* Sleeves (Left & Right) */}
        {/* Left Sleeve */}
        <path 
          d="M 60 70 L 10 100 L 25 140 L 70 110 Z" 
          fill={config.sleeveColor} 
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="2"
        />
        {/* Left Sleeve Cuff Trim */}
        <path 
          d="M 10 100 L 25 140 L 29 137 L 16 100 Z" 
          fill={config.trimColor} 
        />

        {/* Right Sleeve */}
        <path 
          d="M 200 70 L 250 100 L 235 140 L 190 110 Z" 
          fill={config.sleeveColor}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="2"
        />
        {/* Right Sleeve Cuff Trim */}
        <path 
          d="M 250 100 L 235 140 L 231 137 L 244 100 Z" 
          fill={config.trimColor} 
        />

        {/* Main Body */}
        <path 
          d="M 70 70 
             Q 130 90 190 70 
             L 200 270 
             Q 130 280 60 270 Z" 
          fill={config.pattern === "stripes" ? "url(#jersey-stripes)" : config.pattern === "mi" ? "url(#mi-pattern)" : config.baseColor} 
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="2"
        />

        {/* Special pattern overlays for back */}
        {config.pattern === "rcb" && (
          <path d="M 67 76 Q 130 93 193 76 L 197 150 L 63 150 Z" fill="#db0007" />
        )}
        {config.pattern === "csk" && (
          <>
            <path d="M 68 82 Q 130 98 192 82 L 195 105 Q 130 118 65 105 Z" fill="#0066cc" opacity="0.8" />
            <path d="M 65 105 Q 130 118 195 105 L 197 115 Q 130 126 63 115 Z" fill="#ff7700" />
          </>
        )}
        {config.pattern === "psg" && (
          <>
            <rect x="118" y="85" width="24" height="190" fill="#ffffff" />
            <rect x="123" y="85" width="14" height="190" fill="#e30613" />
          </>
        )}
        {config.pattern === "dc" && (
          <path d="M 130 85 L 200 85 L 200 270 Q 165 275 130 272 Z" fill="#db0007" />
        )}

        {/* Back Collar Trim */}
        <path 
          d="M 90 73 Q 130 85 170 73 Q 130 68 90 73" 
          fill={config.trimColor} 
        />

        {/* Path for Player Name curve */}
        <path 
          id="back-name-path" 
          d="M 80 118 Q 130 110 180 118" 
          fill="none" 
        />

        {/* Player Name */}
        <text fontSize="14" fontWeight="800" letterSpacing="1.2" fontFamily="system-ui, sans-serif" fill={config.textColor === "#1e293b" ? "#0f172a" : "#ffffff"}>
          <textPath href="#back-name-path" startOffset="50%" textAnchor="middle">
            {displayName}
          </textPath>
        </text>

        {/* Player Number (Large on Back) */}
        <text 
          x="130" 
          y="205" 
          textAnchor="middle" 
          fill={config.numColor} 
          fontSize="76" 
          fontWeight="900"
          fontFamily="Impact, Arial Black, system-ui, sans-serif"
        >
          {displayNumber}
        </text>

        {/* Fabric lighting fold overlay */}
        <path 
          d="M 70 70 Q 130 90 190 70 L 200 270 Q 130 280 60 270 Z" 
          fill="url(#fold-grad)" 
          style={{ mixBlendMode: "multiply" }}
          pointerEvents="none"
        />

        <text x="130" y="300" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600" letterSpacing="1">BACK</text>

      </g>
    </svg>
  );
}
