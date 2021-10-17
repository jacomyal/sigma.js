import React, { FC, useEffect, useRef, useState } from "react";
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

const FullScreenButton: FC = () => {
  const [isFullScreen, setFullScreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.onfullscreenchange = () => {
      setFullScreen(!isFullScreen);
    };

    return () => {
      document.onfullscreenchange = null;
    };
  }, [isFullScreen]);

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

export default FullScreenButton;
