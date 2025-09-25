import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js'; // Importez l'application

dotenv.config();


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); 
  });