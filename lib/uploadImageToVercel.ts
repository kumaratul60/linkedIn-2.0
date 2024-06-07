async function uploadImageToVercel(image: any) {
    if (!image) {
        throw new Error("No image file provided");
    }

    const formData: any = new FormData();
    formData.append('file', image);
    formData.append('storageName', process.env.BLOB_STORAGE_NAME);
    console.log(formData, "::formData");

    // const response = await fetch(`https://api.vercel.com/v2/blob/create?access_token=${process.env.BLOB_READ_WRITE_TOKEN}`, {
    //     method: 'POST',
    //     body: formData,
    // });

    const response = await fetch(`https://api.vercel.com/v2/blob/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload image: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // console.log(response, "::response");
    console.log(data, ":::data");

    return data?.url;
}

export { uploadImageToVercel };
