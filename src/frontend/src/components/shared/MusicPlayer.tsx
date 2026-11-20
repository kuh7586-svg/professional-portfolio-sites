import { MUSIC_TRACK } from "@/lib/shared/sites";
import { cn } from "@/lib/utils";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface MusicApi {
  playing: boolean;
  loading: boolean;
  error: string | null;
  toggle: () => void;
}

const MusicContext = createContext<MusicApi | null>(null);

/** Owns one <audio> element for the whole app, so playback survives route changes. */
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = MUSIC_TRACK.volume;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onReady = () => setLoading(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onReady);
    audio.addEventListener("canplay", onReady);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onReady);
      audio.removeEventListener("canplay", onReady);
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setError(null);
    setLoading(true);
    audio.volume = MUSIC_TRACK.volume;
    audio
      .play()
      .catch(() => setError("Не удалось включить трек"))
      .finally(() => setLoading(false));
  }, []);

  const api = useMemo(
    () => ({ playing, loading, error, toggle }),
    [playing, loading, error, toggle],
  );

  return (
    <MusicContext.Provider value={api}>
      {children}
      {/* biome-ignore lint/a11y/useMediaCaption: instrumental background track without speech */}
      <audio ref={audioRef} loop preload="none">
        <source src={MUSIC_TRACK.src} type="audio/mpeg" />
        <source src={MUSIC_TRACK.fallbackSrc} type="audio/mpeg" />
      </audio>
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicApi {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}

const BAR_DELAYS = ["0s", "-0.35s", "-0.6s", "-0.15s"];

export function Equalizer({
  active,
  className,
}: { active: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex h-3.5 items-end gap-[2px]", className)}
    >
      {BAR_DELAYS.map((delay) => (
        <span
          key={delay}
          className="block h-full w-[2px] origin-bottom animate-eq-bar bg-current"
          style={{
            animationDelay: delay,
            animationPlayState: active ? "running" : "paused",
            transform: active ? undefined : "scaleY(0.3)",
          }}
        />
      ))}
    </span>
  );
}

/** «Музыка» toggle with the animated equalizer. Can be placed in any header. */
export function MusicToggle({ className }: { className?: string }) {
  const { playing, loading, toggle } = useMusic();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      data-ocid="music.toggle"
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        playing ? "text-primary" : "text-ink-2 hover:text-foreground",
        className,
      )}
    >
      <span>Музыка</span>
      <span className="sr-only">{playing ? "— выключить" : "— включить"}</span>
      <Equalizer active={playing && !loading} />
    </button>
  );
}

export function MusicCredit({ className }: { className?: string }) {
  return (
    <span className={cn("text-[11px] leading-snug text-ink-2", className)}>
      {MUSIC_TRACK.title} — {MUSIC_TRACK.author} (
      <a
        href={MUSIC_TRACK.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="link-draw hover:text-foreground"
      >
        incompetech.com
      </a>
      ),{" "}
      <a
        href={MUSIC_TRACK.licenseUrl}
        target="_blank"
        rel="noreferrer"
        data-ocid="music.license.link"
        className="link-draw hover:text-foreground"
      >
        {MUSIC_TRACK.licenseName}
      </a>
    </span>
  );
}

/** Fixed bottom-right dock rendered once in the app shell (outside routed content). */
export function MusicDock() {
  const { error } = useMusic();
  return (
    <aside
      aria-label="Фоновая музыка"
      data-ocid="music.panel"
      className="theme-portfolio fixed bottom-3 right-3 z-[85] flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-0.5 border border-hairline bg-background px-3 py-1.5 md:bottom-5 md:right-5"
    >
      <MusicToggle />
      <MusicCredit className="max-w-[16rem] text-right" />
      {error && (
        <output
          data-ocid="music.error_state"
          className="text-[11px] text-destructive"
        >
          {error}
        </output>
      )}
    </aside>
  );
}
