"use server";

import { z } from "zod";

import { EditSchema } from "../_components/edit-form";

import { revalidatePath } from "next/cache";
import { getUser, updateUser, updateUserUseCase } from "@/infrastructure/users";

export const editAction = async (
  id: string,
  values: z.infer<typeof EditSchema>
) => {
  try {
    if (!id) throw new Error("Unauthorized!");

    await updateUserUseCase(
      { getUser: getUser, updateUser: updateUser },
      { id: id, ...values }
    );

    revalidatePath("data");
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }

  return { success: "User Edited!" };
};