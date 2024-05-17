import { ThirdwebProvider, embeddedWallet } from '@thirdweb-dev/react';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster, toast } from 'sonner'
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = 'mumbai';

function MyApp({ Component, pageProps }) {
	const initialOptions = {
		clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
		currency: "USD",
		intent: "capture",
		// "enable-funding": "venmo"
	};
	return (
		<PayPalScriptProvider options={initialOptions}>
			<ThirdwebProvider
				activeChain={activeChain}
				clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
				supportedWallets={[
					embeddedWallet(
						{
							auth: {
								options: ["google", "facebook"],
							}
						}
					)
				]}
			>
				<Toaster richColors position="top-right" />
				<Component {...pageProps} />
			</ThirdwebProvider>
		</PayPalScriptProvider>
	);
}

export default MyApp;
