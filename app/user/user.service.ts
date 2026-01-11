import { ProjectionType, QueryOptions } from "mongoose";
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import { supabase } from "../common/helper/supabaseClient";
import { supabaseAdmin } from "../common/helper/supabaseAdmin";
import bcrypt from "bcrypt";

type UserProjection = (keyof IUser)[] | undefined;

export const createUser = async (
  data: Omit<IUser, "_id" | "createdAt" | "updatedAt">
) => {
   const hashedPassword = await bcrypt.hash(data?.password!, 10);
   const payload = {
    ...data,
    password: hashedPassword,
  };
   const {data : user , error} = await supabase.from("users").insert(payload);
   if(error) throw error
   console.log({user})
   return user;
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  const { data: user, error } = await supabase
    .from("users")
    .update(data)
    .eq("id", id)
    .select("id, name, username, email, image, created_at")
    .single();

  if (error) throw error;
  return user;
};


export const editUser = async (id: string, data: Partial<IUser>) => {
  const { data: updatedUser, error } = await supabase
    .from("users")
    .update(data)
    .eq("id", id)    
    .select("id, name, email, image , created_at")
    .single();

  if (error) throw error;

  return updatedUser;
};


export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne(
    { _id: id },
    { select: "-password -refreshToken -facebookId" }
  );
  return result;  
};

export const getUserById = async (id: string) => {
  console.log({id})
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, uid, name, username, email, role, provider, created_at")
    .eq("id", id)
    .single();
  if(error) throw error
    console.log({data})   
  return data;
};


export const getAllUser = async (
  projection?: ProjectionType<IUser>,
  options?: QueryOptions<IUser>
) => {
  const result = await UserSchema.find({}, projection, options).lean();
  return result;
};
export const getUserByEmail = async (
  email: string,
  projection?: UserProjection
) => {
  const selectFields =
    projection && projection.length > 0
      ? projection.join(",")
      : "id, uid, name, email, username, password, role, provider, refreshToken, created_at";
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(selectFields)
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.log("getUserByEmail error:", error.message);
    return null;
  }

  return data as IUser | null;
};

export const countItems = () => {
  return UserSchema.count();
};
