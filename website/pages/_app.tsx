import React from "react";
import App from "next/app";

import "../styles/index.scss";

export default class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}
