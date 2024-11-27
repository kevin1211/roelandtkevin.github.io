function downloadFile(fileName) {
    const filePath = 'https://kevin1211.github.io/INFORMATIONS/doc/' + fileName; // Utilisez l'URL correcte
    const link = document.createElement('a');
    link.href = filePath;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}