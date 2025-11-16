import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile(file: Buffer | string, fileName: string) {
    const uploadFile = typeof file === 'string' ? file : `data:application/octet-stream;base64,${file.toString('base64')}`;
    const response = await imagekit.files.upload({
        file: uploadFile,
        fileName: fileName,
    });

    return response;
}