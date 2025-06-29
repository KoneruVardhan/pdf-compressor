async function compressPDF() {
  const fileInput = document.getElementById('fileInput');
  const level = document.getElementById('compressionLevel').value;
  const downloadLink = document.getElementById('downloadLink');

  if (!fileInput.files.length) {
    alert('Please select a PDF file');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  formData.append('level', level);

  try {
    const response = await fetch('https://pdf-backend-5hfm.onrender.com/compress', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Compression failed');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.style.display = 'inline-block';
    downloadLink.innerText = 'Download Compressed PDF';
  } catch (error) {
    alert('Failed to compress PDF');
    console.error(error);
  }
}
