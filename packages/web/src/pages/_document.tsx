import Document, { Head, Html, Main, NextScript } from "next/document";

// noinspection HtmlRequiredTitleElement
class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Watch Together" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
