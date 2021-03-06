const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: "social-media-mern-a00d2",
    keyFilename: "./social-media-mern-a00d2-firebase-adminsdk-g7lj9-beb8090cf8.json",
});
const bucket = storage.bucket("gs://social-media-mern-a00d2.appspot.com");

const upload = (req) => {
    return new Promise((resolve, reject) => {
        const blob = bucket.file(String(Date.now())+'.jpeg');
        const blobStream = blob.createWriteStream({
            metadata: {
               contentType: req.file.mimetype,
            },
        });
        blobStream.on('error', (err) => reject(err));
   
        blobStream.on('finish', () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
            resolve({ 
                fileName: req.file.originalname,
                fileLocation: publicUrl
            })
        });
        blobStream.end(req.file.buffer);
    })  
}

const del = async (url) => {
    const fileName = url
                        .replace('https://firebasestorage.googleapis.com/v0/b/social-media-mern-a00d2.appspot.com/o/','')
                        .replace('?alt=media','');
                        
    const file = bucket.file(fileName);
    return await file.delete();
}

module.exports = {
    upload,
    del
}