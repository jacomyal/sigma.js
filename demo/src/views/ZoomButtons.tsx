import React, { FC } from "react";
import { useSigma } from "react-sigma-v2";
import { BsZoomIn, BsZoomOut } from "react-icons/bs";
import { BiRadioCircleMarked } from "react-icons/bi";

const ZoomButtons: FC = () => {
  const sigma = useSigma();

  function zoom(ratio?: number): void {
    if (sigma) {
      if (!ratio) {
        sigma.getCamera().animatedReset({ duration: 200 });
      } else if (ratio > 0) {
        sigma.getCamera().animatedZoom({ duration: 200, factor: 1.5 });
      } else if (ratio < 0) {
        sigma.getCamera().animatedUnzoom({ duration: 200, factor: 1.5 });
      }
    }
  }

  return (
    <>
      <button type="button" className="ico" onClick={() => zoom(1)} title="Zoom In">
        <BsZoomIn />
      </button>
      <button type="button" className="ico" onClick={() => zoom(-1)} title="Zoom Out">
        <BsZoomOut />
      </button>
      <button type="button" className="ico" onClick={() => zoom()} title="See whole graph">
        <BiRadioCircleMarked />
      </button>
    </>
  );
};

export default ZoomButtons;
