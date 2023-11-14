import React, { FC, useEffect, useRef, useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import AnimateHeight from "react-animate-height";

const DURATION = 300;

const Panel: FC<{ title: JSX.Element | string; initiallyDeployed?: boolean }> = ({
  title,
  initiallyDeployed,
  children,
}) => {
  const [isDeployed, setIsDeployed] = useState(initiallyDeployed || false);
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDeployed)
      setTimeout(() => {
        if (dom.current) dom.current.parentElement!.scrollTo({ top: dom.current.offsetTop - 5, behavior: "smooth" });
      }, DURATION);
  }, [isDeployed]);

  return (
    <div className="panel" ref={dom}>
      <h2>
        {title}{" "}
        <button type="button" onClick={() => setIsDeployed((v) => !v)}>
          {isDeployed ? <MdExpandLess /> : <MdExpandMore />}
        </button>
      </h2>
      <AnimateHeight duration={DURATION} height={isDeployed ? "auto" : 0}>
        {children}
      </AnimateHeight>
    </div>
  );
};

export default Panel;
