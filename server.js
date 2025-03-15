const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Express App initialisieren
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB-Verbindung
mongoose.connect('mongodb+srv://fabije:Coolfabian1.@reisemedizindb.3ts0g.mongodb.net/reisemedizinDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Verbunden mit MongoDB'))
.catch(err => console.error('❌ MongoDB Fehler:', err));

// MongoDB Schema & Model
const CheckoutSchema = new mongoose.Schema({
    checkoutId: String,
    reisefragebogen: Object
});
const Checkout = mongoose.model('Checkout', CheckoutSchema);

// API Route zum Speichern von Checkout-Daten
app.post('/save-checkout', async (req, res) => {
    try {
        const { checkoutId, reisefragebogen } = req.body;
        const newEntry = new Checkout({ checkoutId, reisefragebogen });
        await newEntry.save();
        res.status(201).json({ message: 'Checkout gespeichert!', data: newEntry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
