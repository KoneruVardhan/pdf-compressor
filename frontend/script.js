function compressPDF() {
    const fileInput = document.getElementById("fileInput");
    const compressionLevel = document.getElementById("CompressionLevel").value;

    if (!fileInput.files.length) {
        alert("Please select a PDF file.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("level", compressionLevel);

    console.log("Sending data to backend...");

    fetch("https://pdf-backend-5hfm.onrender.com/compress", {
        method: "POST",
        body: formData,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }
        return response.blob();
    })
    .then((blob) => {
        console.log("Received compressed PDF");

        const downloadLink = document.getElementById("downloadLink");
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.style.display = "inline";
    })
    .catch((error) => {
        console.error("Compression failed:", error);
        alert("Error compressing PDF: " + error.message);
    });
}
