import React, { FC, useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const Panel: FC<{ title: JSX.Element | string; initiallyDeployed?: boolean }> = ({
  title,
  initiallyDeployed,
  children,
}) => {
  const [isDeployed, setIsDeployed] = useState(initiallyDeployed || false);

  return (
    <div className="panel">
      <h2>
        {title}{" "}
        <button type="button" onClick={() => setIsDeployed((v) => !v)}>
          {isDeployed ? <MdExpandLess /> : <MdExpandMore />}
        </button>
      </h2>
      {isDeployed && children}
    </div>
  );
};

export default Panel;
