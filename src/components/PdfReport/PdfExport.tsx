import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type PdfExportProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

const PdfExport: React.FC<PdfExportProps> = ({ title, children }) => {
  const [loader, setLoader] = useState(false);
  const captureRef = useRef(null);

  const downloadPDF = () => {
    const capture = captureRef.current;

    if (!capture) {
      return;
    }

    setLoader(true);

    html2canvas(capture).then((canvas: any) => {
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF("p", "mm", "a3");
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
      setLoader(false);
      doc.save(`${title}.pdf`);
    });
  };

  return (
    <div>
      <div ref={captureRef}>{children}</div>
      <button onClick={downloadPDF} disabled={loader}>
        Download PDF
      </button>
    </div>
  );
};

export default PdfExport;
