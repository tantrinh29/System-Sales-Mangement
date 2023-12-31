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
      <button
        className="mt-4 float-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={downloadPDF}
        disabled={loader}
      >
        Download PDF
      </button>
    </div>
  );
};

export default PdfExport;
