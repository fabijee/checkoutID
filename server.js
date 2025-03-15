const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Verbindung
mongoose.connect("mongodb+srv://fabije:Coolfabian1.@reisemedizindb.3ts0g.mongodb.net/reisemedizinDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const cors = require('cors');
app.use(cors(a3stda-9m.myshopify.com));

// Middleware
app.use(bodyParser.json());

// Checkout Schema
const CheckoutSchema = new mongoose.Schema({
  checkout_id: { type: String, required: true },
  items: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Checkout = mongoose.model('Checkout', CheckoutSchema);

// API-Route zum Empfangen der Checkout-ID
app.post('/api/cart', async (req, res) => {
  try {
    const { checkout_id, items } = req.body;
    if (!checkout_id || !items) {
      return res.status(400).json({ message: 'checkout_id und items sind erforderlich' });
    }

    const newCheckout = new Checkout({ checkout_id, items });
    await newCheckout.save();


    
    res.status(201).json({ message: 'Checkout gespeichert', checkout_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
