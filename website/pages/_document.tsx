import Document, { DocumentProps, Head, Html, Main, NextScript } from "next/document";

const CUSTOM_CSS = `
  body {
    display: block !important;
    visibility: hidden;
  }
`;

export default class CustomDocument extends Document<DocumentProps> {
  render() {
    return (
      <Html>
        <Head>
          <style>{CUSTOM_CSS}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
