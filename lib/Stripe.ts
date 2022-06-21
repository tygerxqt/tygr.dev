import initStripe from "stripe";

const stripe = new initStripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: null,
    typescript: true,
    telemetry: false
});

export default stripe;