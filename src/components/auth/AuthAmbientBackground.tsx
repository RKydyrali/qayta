type AuthAmbientBackgroundProps = {
  isOnboarding?: boolean;
};

export function AuthAmbientBackground({ isOnboarding }: AuthAmbientBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-auth-base" />
      
      {/* Background Media Container - dimmed and blurred slightly if onboarding */}
      <div className={`absolute inset-0 transition-all duration-700 ease-out ${
        isOnboarding ? "opacity-[0.72] blur-[3px] scale-[1.015]" : "opacity-100 blur-0 scale-100"
      }`}>
        <div className="auth-bg-image auth-bg-light absolute inset-0" />
        <div className="auth-bg-image auth-bg-dark absolute inset-0" />
        <video
          className="auth-bg-video auth-bg-video-light absolute inset-0 h-full w-full"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/auth-bg-light.png"
        >
          <source src="/videos/auth-bg-light.mp4" type="video/mp4" />
        </video>
        <video
          className="auth-bg-video auth-bg-video-dark absolute inset-0 h-full w-full"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/auth-bg-dark.png"
        >
          <source src="/videos/auth-bg-dark.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Cinematic Vignette */}
      <div className={`auth-bg-vignette absolute inset-0 transition-all duration-500`} />
      
      {/* Soft Diffusion Panel */}
      <div className="auth-bg-soft-panel absolute inset-0" />

      {/* Center focus vignette overlay strictly active on onboarding to highlight modal */}
      {isOnboarding && (
        <div className="onboarding-focus-vignette absolute inset-0 z-10 transition-opacity duration-700" />
      )}

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--auth-line) / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--auth-line) / 0.04) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 88%)",
        }}
      />

      <div className="auth-grain absolute inset-0 opacity-[0.04]" />
    </div>
  );
}
