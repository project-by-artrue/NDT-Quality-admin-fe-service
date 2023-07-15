import React, { useState } from 'react';

function ImageUpload() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleImageUpload = () => {
        console.log({ selectedImage })
        if (selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage);
            console.log({ formData })
            fetch('https://artrueinfotech.com/Images', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response from the server
                    console.log('Upload successful:', data);
                })
                .catch(error => {
                    // Handle any errors that occur during the upload
                    console.error('Error:', error);
                });
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleImageUpload}>Upload</button>
        </div>
    );
}

export default ImageUpload;
