// scripts/initSettings.js
import 'dotenv/config';
import mongoose from "mongoose";
import Settings from "../src/models/settings.model.js";

// Vérifie que l'URI est défini
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("❌ MONGODB_URI n'est pas défini dans le fichier .env");
}

async function initSettings() {
    try {

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ Connecté à MongoDB Atlas");

        const exists = await Settings.findById("STORE_SETTINGS");
        if (!exists) {
            await Settings.create({ _id: "STORE_SETTINGS" });
            console.log("✅ Document STORE_SETTINGS créé !");
        } else {
            console.log("ℹ️ STORE_SETTINGS existe déjà.");
        }

    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation :", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Déconnecté de MongoDB");
    }
}

initSettings();
