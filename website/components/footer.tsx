import Link from "next/link";
import React, { FC } from "react";

const Footer: FC<{}> = () => (
  <footer className="text-center">
    <Link href="/">
      <a>sigma.js</a>
    </Link>{" "}
    is developed with ♥ by{" "}
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
