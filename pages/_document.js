import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    {/* Include the PayPal SDK script here */}
                    <Script src="https://www.paypal.com/sdk/js?client-id=AYqpZMMYtEhGewRFa4ynj7Xf3uQNe1dgDwxuPtsi9iKLfZq7dgflq-lwcI3zoxZkggYsA_ZTsYohw4a0&enable-funding=venmo" />
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