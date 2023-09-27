document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('exportPdf').addEventListener('click', async function () {
    const propAsoc = document.querySelector('#prop-asoc').value;
    const subsemnatul = document.querySelector('#subsemnatul').value;
    const value = document.querySelector('#value').value;
    const date = document.querySelector('#date').value;
    const allProducts = Array.from(document.querySelectorAll('[name=product]'))
      .map(input => input.value);

    const uploadedFileInput = document.getElementById('uploadedFile');
    const file = uploadedFileInput.files[0];

    fetch('getAssociationDetails.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: propAsoc,
      }),
    })
    .then(response => response.json())
    .then(async data => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = 290;
      let verticalOffset = 110;

      const { street, nr, bloc, localitate, judet, cif, president } = data;

      doc.setFont('courier', 'bold');
      doc.text(`ASOCIATIA DE PROPRIETARI ${propAsoc}`, pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(11);
      doc.setFont('courier', 'normal');
      doc.text(`Str. ${street}, Nr. ${nr}, Bl. ${bloc}, localitate ${localitate}, Judet/Sector ${judet}`, pageWidth / 2, 30, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('courier', 'normal');
      doc.text(`C.I.F.: ${cif}`, pageWidth / 2, 40, { align: 'center' });
      doc.setFontSize(24);
      doc.setFont('courier', 'bold');
      doc.text('RAPORT DE NECESITATE', pageWidth / 2, 65, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('courier', 'normal');
      doc.text(`Subsemnatul ${subsemnatul}, in calitate de Administrator al Asociatiei`, 35, 85);
      doc.text(`de proprietari ${propAsoc} propun Comitetului Executiv`, 15, 90)
      doc.text(`aprobarea achizitionarii urmatoarelor produse/servicii:`, 15, 95);


      // Adding products on separate lines
      const lineSpacing = 10;
      allProducts.forEach((product) => {
        // Check if adding the next product will exceed the page height
        if (verticalOffset + lineSpacing > pageHeight) {
          doc.addPage();
          verticalOffset = 10;  // Reset the vertical offset for the new page
        }
        doc.text(`- ${product}`, 20, verticalOffset);
        verticalOffset += lineSpacing;
      });

       // Check if the remaining content will exceed the page height
       const remainingContentHeight = 120;  // Estimate the height of the remaining content
       if (verticalOffset + remainingContentHeight > pageHeight) {
         doc.addPage();
         verticalOffset = 10;  // Reset the vertical offset for the new page
       }

      doc.text(`Valoarea achizitiilor propuse este de aproximativ ${value} lei.`, 15, verticalOffset + 10);
      doc.text(`Data solicitarii: ${date}`, 15, verticalOffset + 20);
      doc.setFont('courier', 'bold');
      doc.setFontSize(12);
      doc.text('SE APROBA / NU SE APROBA', pageWidth / 2, verticalOffset + 30, { align: 'center' });
      doc.setFont('courier', 'bold');
      doc.setFontSize(12);
      doc.text('Presedinte', pageWidth / 15, verticalOffset + 40);
      doc.setFont('courier', 'normal');
      doc.setFontSize(12);
      doc.text(`Numele/Prenume ${president} Semnatura _____________________`, pageWidth / 15, verticalOffset + 45);
      doc.setFont('courier', 'bold');
      doc.setFontSize(12);
      doc.text(`Membru Comitetul Executiv`, pageWidth / 15, verticalOffset + 50);
      doc.setFont('courier', 'normal');
      doc.setFontSize(12);
      doc.text(`Numele/Prenume _____________________ Semnatura _____________________`, pageWidth / 15, verticalOffset + 55);
      doc.setFont('courier', 'bold');
      doc.setFontSize(12);
      doc.text(`Membru Comitetul Executiv`, pageWidth / 15, verticalOffset + 60);
      doc.setFont('courier', 'normal');
      doc.setFontSize(12);
      doc.text(`Numele/Prenume _____________________ Semnatura _____________________`, pageWidth / 15, verticalOffset + 65);
      doc.setFont('courier', 'bold');
      doc.setFontSize(12);
      doc.text('Comitetul Executiv al Asociatiei DISPUNE ca aceasta cheltuiala sa fie:', pageWidth / 2, verticalOffset + 75, { align: 'center' });
      doc.setFont('courier', 'normal');
      doc.setFontSize(12);
      doc.text('[ ] distribuita in listele de intretinere lunare', pageWidth / 15, verticalOffset + 90);
      doc.setFont('courier', 'normal');
      doc.setFontSize(12);
      doc.text('[ ] debitata din Fondul de Reparatii conform Hotararii Adunarii Generale', pageWidth / 15, verticalOffset + 95);
      doc.setFont('courier', 'normal');
      doc.setFontSize(12);
      doc.text('[ ] _____________________________________________________________', pageWidth / 15, verticalOffset + 100);
      doc.setFont('courier', 'bold');
      doc.setFontSize(12);
      doc.text('[ ] alte dispozitii/observatii: ___________________________________', pageWidth / 15, verticalOffset + 110);

      const reader = new FileReader();
  reader.onload = async function (e) {
    const pdfData = new Uint8Array(e.target.result);

    // Încarcă PDF-ul folosind PDF.js
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      // Adaugă o pagină nouă înainte de a adăuga fiecare pagină din PDF-ul încărcat
      doc.addPage();
      verticalOffset = 10;  // Resetare offset vertical pentru noua pagină

      const page = await pdf.getPage(pageNum);

      // Randează fiecare pagină ca un canvas
      const viewport = page.getViewport({ scale: 1.0 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;

      // Adaugă canvas-ul ca imagine în PDF-ul jsPDF
      const imgData = canvas.toDataURL();
      doc.addImage(imgData, 'PNG', 15, verticalOffset, 180, 160); 
    }

    // Salvează PDF-ul final
    doc.save('raport_necesitate.pdf');
  };
  
  if (file) {
  reader.readAsArrayBuffer(file);
}  else {
  // Dacă nu este încărcat niciun fișier PDF, salvează PDF-ul ca înainte
  doc.save('raport_necesitate.pdf');
}
    })
    .catch(error => {
      console.error('Eroare la preluarea detaliilor asociației:', error);
    });
  });
});