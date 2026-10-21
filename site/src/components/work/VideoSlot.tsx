import { useState } from "react";
import { PixelIcon } from "../PixelIcon";
import "./VideoSlot.css";

type Props = { youtubeId?: string; title: string; palette: [string, string, string] };

/**
 * YouTube slot for a 1 to 2 minute project walkthrough. With an ID it shows the
 * thumbnail and loads the privacy-friendly player only on click; without one
 * it shows a clearly marked placeholder.
 */
export function VideoSlot({ youtubeId, title, palette }: Props) {
  const [playing, setPlaying] = useState(false);
  const [a, b, c] = palette;

  if (youtubeId && playing) {
    return (
      <div className="video-slot">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      className={`video-slot ${youtubeId ? "" : "is-placeholder"}`}
      onClick={() => youtubeId && setPlaying(true)}
      disabled={!youtubeId}
      style={{ ["--a" as string]: a, ["--b" as string]: b, ["--c" as string]: c }}
      aria-label={youtubeId ? `Play video: ${title}` : `Video coming soon: ${title}`}
    >
      {youtubeId ? <img src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`} alt="" loading="lazy" /> : <span className="vs-bg" />}
      <span className="vs-play">
        <PixelIcon name="play" size={28} mono />
      </span>
      <span className="vs-meta">
        <span className="mono">Video walkthrough · 1 to 2 min</span>
        <b>{youtubeId ? title : "Video coming soon"}</b>
      </span>
    </button>
  );
}
