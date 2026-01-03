import mongoose from "mongoose";
import { supabase } from "../helper/supabaseClient";

export const initDB = async (): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    const mongodbUri = process.env.MONGODB_URI ?? "";
    console.log({mongodbUri})
    if (mongodbUri === "") throw new Error("mongo db uri not found!");
    // mongoose.set("debug", true);
    mongoose.set("strictQuery", false);
    mongoose
      .connect(mongodbUri)
      .then(() => {
        console.log("MongoDB Connected!");
        resolve(true);
      })
      .catch(reject);
  });
};


export const testSupabaseConnection = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  if (error) {
    console.error("❌ Supabase Connection Failed:", error.message);
  } else {
    console.log("✅ Supabase Connected Successfully");
  }
};