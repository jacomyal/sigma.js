import React, { FC, useEffect, useRef, useState } from "react";
import { useSigma } from "react-sigma-v2";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

export const FullScreenButton: FC = () => {
  const sigma = useSigma();
  const [isFullScreen, setFullScreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.onfullscreenchange = () => {
      setFullScreen(!isFullScreen);
    };

    return () => {
      document.onfullscreenchange = null;
    };
  }, [isFullScreen, useSigma]);

  if (!document.fullscreenEnabled) return null;

  return (
    <button
      ref={containerRef}
      type="button"
      className="ico"
      onClick={() => toggleFullScreen()}
      title="Toggle fullscreen"
    >
      {isFullScreen ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
    </button>
  );
};
