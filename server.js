const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Fix: Korrekte MongoDB-Verbindung
const mongoURI = 'mongodb+srv://fabije:Coolfabian1.@reisemedizindb.3ts0g.mongodb.net/reisemedizinDB';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Verbunden mit MongoDB'))
.catch(err => console.error('❌ MongoDB Fehler:', err));

// ✅ Fix: Sicherstellen, dass das Schema korrekt ist
const CheckoutSchema = new mongoose.Schema({
    checkoutId: { type: String, required: true },
    reisefragebogen: { type: Object, required: true }
});

const Checkout = mongoose.model('Checkout', CheckoutSchema);

// ✅ API zum Speichern von Checkout-Daten
app.post('/save-checkout', async (req, res) => {
    try {
        console.log("📩 Eingehende Anfrage:", req.body);

        const { checkoutId, reisefragebogen } = req.body;

        // ✅ Fehlerprüfung: Sind alle Daten vorhanden?
        if (!checkoutId || !reisefragebogen) {
            console.error("❌ Fehlende Daten:", { checkoutId, reisefragebogen });
            return res.status(400).json({ error: "checkoutId und reisefragebogen sind erforderlich!" });
        }

        const newEntry = new Checkout({ checkoutId, reisefragebogen });
        await newEntry.save();

        console.log("✅ Daten gespeichert:", newEntry);
        res.status(201).json({ message: 'Checkout gespeichert!', data: newEntry });
    } catch (err) {
        console.error('❌ Fehler beim Speichern in MongoDB:', err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
