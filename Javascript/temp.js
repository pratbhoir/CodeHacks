
//Download Base64 File
var base64content = 'data:application/pdf;base64,' + content;
downloadBase64File('TAG_QRCode.pdf', pdfDoc);
function downloadBase64File(filename, base64content) {
    var element = document.createElement('a');
    element.setAttribute('href', base64content);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
