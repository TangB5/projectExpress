import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../src/models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        // 🔗 Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connecté à MongoDB");

        // 🧩 Données de l'admin
        const adminData = {
            name: "Admin Principal",
            email: "admin@shop.com",
            password: "Admin123!",
            phone: "+237656569102",
            avatar: "",
            address: {
                street: "Rue de la Boutique",
                city: "douala",
                postalCode: "00225",
                country: "CAMEROUN",
            },
            preferences: {
                newsletter: false,
                smsNotifications: false,
                emailNotifications: true,
            },
            roles: ["admin"],
        };

        const existingAdmin = await User.findOne({ roles: "admin" });
        if (existingAdmin) {
            console.log(`⚠️ Un administrateur existe déjà : ${existingAdmin.email}`);
            process.exit(0);
        }

        // 🔐 Hash du mot de passe
        const hashedPassword = await bcrypt.hash(adminData.password, 10);


        const admin = new User({
            ...adminData,
            password: hashedPassword,
        });

        await admin.save();

        console.log("✅ Administrateur créé avec succès !");
        console.log("------------------------------------");
        console.log(`Email : ${admin.email}`);
        console.log(`Mot de passe : ${adminData.password}`);
        console.log("------------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
        process.exit(1);
    }
};

seedAdmin();
