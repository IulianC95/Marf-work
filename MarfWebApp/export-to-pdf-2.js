document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('exportPdf').addEventListener('click', function () {
    const propAsoc = document.querySelector('#prop-asoc').value;
    const subsemnatul = document.querySelector('#subsemnatul').value;
    const value = document.querySelector('#value').value;
    const date = document.querySelector('#date').value;
    const allProducts = Array.from(document.querySelectorAll('[name=product]'))
      .map(input => input.value);

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
    .then(data => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const { street, nr, bloc, localitate, judet } = data;
      
      doc.setFont('helvetica', 'bold');
      doc.text(`ASOCIATIA DE PROPRIETARI ${propAsoc}`, pageWidth / 2, 30, { align: 'center' });
      doc.setFontSize(14);
      doc.setFont('helvetica');
      doc.text(`Str. ${street}, Nr. ${nr}, Bl. ${bloc}, localitate ${localitate}, Judet/Sector ${judet}`, pageWidth / 2, 40, { align: 'center' });
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPORT DE NECESITATE', pageWidth / 2, 80, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Subsemnatul ${subsemnatul}, in calitate de Administrator , propun Comitetului Executiv`, 30, 100);
      doc.text(`aprobarea achizitionarii urmatoarelor produse/servicii:`, 10, 110);


      // Adăugarea produselor pe linii separate
      let verticalOffset = 120;
      const lineSpacing = 10;
      allProducts.forEach((product) => {
        doc.text(`- ${product}`, 20, verticalOffset);
        verticalOffset += lineSpacing;
      });

      doc.text(`Valoarea achizitiilor propuse este de aproximativ ${value} lei.`, 10, verticalOffset + 10);
      doc.text(`Data solicitarii: ${date}`, 10, verticalOffset + 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('SE APROBA / NU SE APROBA', pageWidth / 2, verticalOffset + 30, { align: 'center' });
      doc.save('raport_necesitate.pdf');
    })
    .catch(error => {
      console.error('Eroare la preluarea detaliilor asociației:', error);
    });
  });
});
