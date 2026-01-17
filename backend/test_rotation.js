const { PDFDocument, degrees } = require('pdf-lib');

(async () => {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        
        try {
            console.log("Trying setRotation(90)...");
            page.setRotation(90); // This might fail
            console.log("Success setRotation(90)");
        } catch (e) {
            console.error("Failed setRotation(90):", e.message);
        }

        try {
            console.log("Trying setRotation(degrees(90))...");
            page.setRotation(degrees(90)); // This should work
            console.log("Success setRotation(degrees(90))");
        } catch (e) {
             console.error("Failed setRotation(degrees(90)):", e.message);
        }

    } catch (e) {
        console.error(e);
    }
})();
