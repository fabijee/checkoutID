const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Verbindung zur MongoDB-Datenbank herstellen
mongoose.connect('mongodb+srv://fabije:Coolfabian1.@reisemedizindb.3ts0g.mongodb.net/reisemedizinDB', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("MongoDB verbunden"))
.catch(err => console.error("MongoDB Verbindungsfehler:", err));

// Mongoose Schema und Model definieren
const checkoutSchema = new mongoose.Schema({
  checkoutId: { type: String, required: true },
  travelQuestionnaire: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

// Endpoint zum Speichern der Checkout-Daten
app.post('/saveCheckoutData', async (req, res) => {
  try {
    const { checkoutId, travelQuestionnaire } = req.body;
    if (!checkoutId || !travelQuestionnaire) {
      return res.status(400).json({ message: 'Fehlende erforderliche Felder' });
    }
    const newEntry = new Checkout({ checkoutId, travelQuestionnaire });
    await newEntry.save();
    res.json({ message: 'Daten erfolgreich gespeichert' });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler', error: err });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));

