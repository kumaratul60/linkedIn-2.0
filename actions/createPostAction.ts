"use server"

import { AddPostRequestBody } from "@/app/api/posts/route";
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
    let imageUrl: string | undefined;

    if (!postInput) {
        throw new Error("post input is required");
    }

    if (!user?.id) {
        throw new Error("User not authenticated");
    }

    // define user
    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
    };

    try {
        if (image.size > 0) {
            // 1. upload image if there is one - Blob storage
            // 2. create post in database with image
            console.log("Uploading image to Azure Blob Storage...", image);

            // const accountName = process.env.AZURE_STORAGE_NAME;
            // const sasToken = await generateSASToken();
            // const blobServiceClient = new BlobServiceClient(
            //     `https://${accountName}.blob.core.windows.net?${sasToken}`
            // );

            // const containerClient =
            //     blobServiceClient.getContainerClient(containerName);

            // // generate current timestamp
            // const timestamp = new Date().getTime();
            // const file_name = `${randomUUID()}_${timestamp}.png`;

            // const blockBlobClient = containerClient.getBlockBlobClient(file_name);

            // const imageBuffer = await image.arrayBuffer();
            // const res = await blockBlobClient.uploadData(imageBuffer);
            // image_url = res._response.request.url;

            // console.log("File uploaded successfully!", image_url);

            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput,
                // imageUrl: image_url,
            };

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
    // revalidatePath("/");
}






