import mongoose from "mongoose";

const requestConsentSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    consentTo: {
        type: String,
        required: true
    },

    sendTo: {
        type: String,
        required: true
    },
    isAccepted: {
        type: Boolean,
        default: "false"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// const requestConsent = mongoose.model("request-consent", requestConsentSchema, "request-consent");
// export default mongoose.models.requestConsent || mongoose.model("request-consent", requestConsentSchema, "request-consent");

const requestConsentModel = mongoose.models['Requestconsent'] || mongoose.model('Requestconsent', requestConsentSchema);
export default requestConsentModel;