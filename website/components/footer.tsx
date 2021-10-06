import Link from "next/link";
import React, { FC } from "react";

const Footer: FC<{}> = () => (
  <footer className="text-center py-3 bg-white">
    <Link href="/">
      <a>sigma.js</a>
    </Link>{" "}
    is developed with <span className="text-primary">♥</span> by{" "}
    <Link href="https://www.ouestware.com/en/">
      <a>OuestWare</a>
    </Link>{" "}
    and{" "}
    <Link href="https://medialab.sciencespo.fr/en/">
      <a>the Sciences-Po médialab</a>
    </Link>
  </footer>
);

export default Footer;
