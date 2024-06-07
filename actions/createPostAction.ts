"use server"

import { AddPostRequestBody } from "@/app/api/posts/route";
import { uploadImageToVercel } from "@/lib/uploadImageToVercel";
import connectDB from "@/mongoDB/db";
import { Post } from "@/mongoDB/models/posts";
import { IUser } from "@/types/user";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
    /*
    const user = await currentUser();
    if (!user) {
        throw new Error("User not authenticated");
    }

    or

    auth().protect()
     */

    const user = await currentUser();
    const postInput = formData.get("postInput") as string;

    const image = formData.get("image") as File;
    let image_url: any;

    if (!postInput) {
        throw new Error("post input is required");
    }

    if (!user?.id) {
        throw new Error("User not authenticated");
    }

    // define user
    const userDB: IUser = {
        userId: user?.id,
        userImage: user?.imageUrl,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
    };

    try {
        if (image.size > 0) {
            // 1.  Upload image to Vercel Blob Storage
            console.log("Uploading image to Vercel Blob Storage...", image);
            image_url = await uploadImageToVercel(image);
            console.log("File uploaded successfully!", image_url);

            // 2. create post in database with image
            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput,
                imageUrl: image_url,
            };
            await connectDB();
            await Post.create(body);
        } else {
            // 1. create post in database without image
            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput,
            };

            await connectDB();
            await Post.create(body);
        }
    } catch (error: any) {
        throw new Error("Failed to create post", error);
    }
    // revalidatePath "/" - home page
    revalidatePath("/");
}






