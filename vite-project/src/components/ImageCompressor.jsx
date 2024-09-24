import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

export default function ImageCompresor() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [compressedImage, setCompressedImage] = useState(null);
    const [compressedImageBlob, setCompressedImageBlob] = useState(null);

    const handleImageUpload = (e) => {
        const imageFile = e.target.files[0];
        setSelectedImage(URL.createObjectURL(imageFile));

        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };

        imageCompression(imageFile, options)
            .then((compressedFile) => {
                const compressedBlob = new Blob([compressedFile], { type: compressedFile.type });
                setCompressedImage(URL.createObjectURL(compressedFile));
                setCompressedImageBlob(compressedBlob);
            })
            .catch((err) => {
                console.error('Error durante la compresión:', err);
                alert('Ocurrió un error al comprimir la imagen.');
            });
    };

    const handleDownload = () => {
        if (compressedImageBlob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(compressedImageBlob);
            link.download = 'compressedImage.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    };

    useEffect(() => {
        // Limpiar los URLs al desmontar el componente
        return () => {
            if (selectedImage) URL.revokeObjectURL(selectedImage);
            if (compressedImage) URL.revokeObjectURL(compressedImage);
        };
    }, [selectedImage, compressedImage]);

    return (
        <div className='container'>
            <h1>Image Compression</h1>
            <input type="file" accept='image/*' onChange={handleImageUpload} />
            {selectedImage && (
                <div className='container'>
                    <h2>Imagen Original</h2>
                    <img src={selectedImage} alt="Imagen original" style={{ maxWidth: '400px' }} />
                </div>
            )}
            {compressedImage && (
                <div className='container'>
                    <h2>Imagen Comprimida</h2>
                    <img src={compressedImage} alt="Imagen comprimida" style={{ maxWidth: '400px' }} />
                    <button onClick={handleDownload}>Descargar</button>
                </div>
            )}
        </div>
    );
}
