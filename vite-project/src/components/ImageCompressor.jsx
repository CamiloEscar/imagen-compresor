import {useState} from 'react'
import imageCompression from 'browser-image-compression'

export default function ImageCompresor() {
    const [selectedImage, setSelectedImage] = useState(null)
    const [compressedImage, setCompressedImage] = useState(null)
    const [compressedImageBlob, setCompressedImageBlob] = useState(null)

    const handleImageUpload = (e) => {
        const imageFile = e.target.files[0]
        setSelectedImage(URL.createObjectURL(imageFile))
        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }
        
        imageCompression(imageFile, options)
    .then((compressedFile) => {
        const compressedBlob = new Blob([compressedFile], {type: compressedFile.type})
        setCompressedImage(URL.createObjectURL(compressedFile))
        setCompressedImageBlob(compressedBlob)
    })
    .catch((err) => {
        console.log('error durante la compresion ',err)
    })
}
const handleDownload = () => {
    if(compressedImageBlob){
        const link = document.createElement('a')
        link.href = URL.createObjectURL(compressedImageBlob)
        link.download = 'compressedImage.jpg'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
}
}


    return(
        <div className='container'>
        <div className='container'>
            <h1>imageCompression</h1>
            <input type="file" accept='image/' onChange={handleImageUpload}/>
            {selectedImage && (
                <div className='container'>
                    <h2>Original image</h2>
                    <img src={selectedImage} alt="original image" style={{maxWidth: '400px'}} />
                    </div>
            )}
            </div>
            {compressedImage && (
                <div className='container'>
                    <h2>Compressed image</h2>
                    <img src={compressedImage} alt="compressed image" style={{maxWidth: '400px'}} />
                    <button onClick={handleDownload}>Descargar</button>
                </div>
                )}
        </div>
    )
}