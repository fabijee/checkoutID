require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB-Verbindung
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB verbunden"))
    .catch(err => console.error("MongoDB-Verbindungsfehler:", err));

// Mongoose Schema & Model für die Cart-ID
const cartSchema = new mongoose.Schema({
    cartId: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now }
});

const Cart = mongoose.model("Cart", cartSchema);

// Route: Cart-ID speichern
app.post("/save-cart-id", async (req, res) => {
    try {
        const { cartId } = req.body;
        if (!cartId) return res.status(400).json({ error: "Cart-ID fehlt" });

        // Neue Cart-ID speichern (ersetzt alte, falls existiert)
        await Cart.findOneAndUpdate({ cartId }, { cartId }, { upsert: true, new: true });

        res.json({ success: true, message: "Cart-ID gespeichert", cartId });
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});



app.use(express.json());

const SHOPIFY_API_URL = "https://a3stda-9m.myshopify.com/api/2024-04/graphql.json";
const SHOPIFY_ACCESS_TOKEN = "99e98dbc5e42a02cc46b83e5fc3c6e94"; // Hier dein Token einfügen

// API-Route für Cart-Erstellung
app.post('/create-cart', async (req, res) => {
    try {
        const response = await fetch(SHOPIFY_API_URL, {
            method: 'POST',
            headers: {
                'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation {
                        cartCreate {
                            cart {
                                id
                            }
                        }
                    }
                `
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Fehler bei der Cart-Erstellung:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});




// Server starten
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
