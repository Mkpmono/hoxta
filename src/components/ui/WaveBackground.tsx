export function WaveBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Wave */}
      <svg
        className="absolute top-0 left-0 w-full h-[600px] opacity-20"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(195, 100%, 55%)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="hsl(195, 100%, 55%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(195, 100%, 55%)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 C150,150 350,50 500,100 C650,150 750,50 900,100 C1050,150 1200,50 1440,100 L1440,0 L0,0 Z"
          fill="none"
          stroke="url(#waveGradient1)"
          strokeWidth="1"
          className="animate-pulse"
        />
        <path
          d="M0,200 C200,250 400,150 600,200 C800,250 1000,150 1200,200 C1350,235 1440,200 1440,200 L1440,0 L0,0 Z"
          fill="none"
          stroke="url(#waveGradient1)"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>

      {/* Middle Wave */}
      <svg
        className="absolute top-1/3 left-0 w-full h-[400px] opacity-10"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 C240,100 480,300 720,200 C960,100 1200,300 1440,200"
          fill="none"
          stroke="hsl(195, 100%, 55%)"
          strokeWidth="1"
        />
      </svg>

      {/* Glow Effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
    </div>
  );
}
