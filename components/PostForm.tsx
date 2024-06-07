'use client'

import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import createPostAction from "@/actions/createPostAction";

// if want to use hooks use "use cleint"

function PostForm() {
    const ref = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user } = useUser()
    const [preview, setPreview] = useState<string | null>(null)

    const handlePostAction = async (formData: FormData) => {
        const formDataCopy = formData;
        ref.current?.reset();

        const accessByInputText = formDataCopy.get("postInput") as string;

        if (!accessByInputText.trim()) {
            throw new Error("You must provide a post input")
        }
        setPreview(null)

        try {
            //Server action
            await createPostAction(formDataCopy);
        } catch (error) {
            console.log("error creating post:", error);
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }
    return (
        <div className="mb-2">
            <form ref={ref}
                action={(formData) => {
                    // Handle form submission with server action
                    handlePostAction(formData);

                    // Toast notification based on the promise above
                }}
                className="p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <input type="text" name="postInput"
                        placeholder="Start writing a post...."
                        className="flex-1 outline-none rounded-full py-3 px-4 border "
                    />
                    <input ref={fileInputRef} type="file" name="image"
                        accept="image/*" hidden
                        onChange={handleImageChange}
                    />
                    <button type="submit" hidden>Post</button>
                </div>
                {/* Preview conditional check */}
                {preview && (
                    <div className="mt-2">
                        <img src={preview} alt="Preview" className="w-full object-cover" />
                    </div>
                )}
                <div className="flex justify-end mt-2 space-x-2">
                    <Button type="button" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="mr-2" size={16} color="currentColor" />
                        {preview ? "Change" : "Add"} image
                    </Button>

                    {/* Add a remove preview button */}
                    {preview && (
                        <Button
                            type="button"
                            onClick={() => setPreview(null)}
                            variant="outline"
                            className="ml-2"
                        >
                            <XIcon className="mr-2" size={16} color="currentColor" />
                            Remove image
                        </Button>
                    )}
                    <hr className="mt-2 border-gray-300" />
                </div>
            </form>
        </div>
    )
}

export default PostForm