function compressPDF() {
    const fileInput = document.getElementById("fileInput");
    const compressionLevel = document.getElementById("CompressionLevel").value;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("level", compressionLevel);

    fetch("https://pdf-backend-5hfm.onrender.com/compress", {
        method: "POST",
        body: formData,
    })
    .then((response) => response.blob())
    .then((blob) => {
        const downloadLink = document.getElementById("downloadLink");
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.style.display = "inline";
    })
    .catch((error) => {
        console.error("Error compressing PDF:", error);
    });
}
