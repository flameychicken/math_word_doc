import { useState } from "react";
import {
  Bold, Italic, Underline, Strikethrough, XCircle, Table, AlignLeft, AlignCenter, AlignRight, Download
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function MathWordDoc() {
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [docName, setDocName] = useState("Untitled Document");
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrices, setMatrices] = useState([]);

  const insertMatrix = () => {
    const newMatrix = Array.from({ length: rows }, () => Array(cols).fill(0));
    setMatrices([...matrices, newMatrix]);
    setShowMatrixModal(false);
  };

  const exportToPDF = async () => {
    const content = document.getElementById("document-content");
    const pdf = new jsPDF("p", "in", "letter"); // 8.5 x 11 inches
    const pageHeight = 11; // Letter size in inches
    const margin = 0.5; // Half inch margin
    let yOffset = margin;

    const elements = [...content.children]; // Get all child elements

    for (const element of elements) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 8.5 - 2 * margin; // Image width with margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yOffset + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yOffset = margin; // Reset y position for new page
      }

      pdf.addImage(imgData, "PNG", margin, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 0.2; // Add some spacing
    }

    pdf.save(`${docName}.pdf`);
  };

  return (
    <div className="bg-light py-4" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="bg-white p-3 rounded shadow w-75 mb-3 d-flex justify-content-between align-items-center">
        <input 
          type="text" 
          value={docName} 
          onChange={(e) => setDocName(e.target.value)}
          className="form-control w-50 fw-bold"
        />
        <div className="d-flex gap-2">
          <button className="btn btn-light"><Bold size={18} /></button>
          <button className="btn btn-light"><Italic size={18} /></button>
          <button className="btn btn-light"><Underline size={18} /></button>
          <button className="btn btn-light"><Strikethrough size={18} /></button>
          <button className="btn btn-light"><AlignLeft size={18} /></button>
          <button className="btn btn-light"><AlignCenter size={18} /></button>
          <button className="btn btn-light"><AlignRight size={18} /></button>
          <button className="btn btn-light" onClick={() => setShowMatrixModal(true)}><Table size={18} /></button>
          <button className="btn btn-success" onClick={exportToPDF}><Download size={18} /> Export</button>
        </div>
      </div>
      
      <div
        id="document-content"
        className="bg-white p-4 rounded shadow text-start"
        style={{ width: "8.5in", minHeight: "11in", border: "1px solid #ccc", paddingBottom: "1in" }}
        contentEditable
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault(); 
            document.execCommand("insertText", false, "    "); 
          }
        }}
      >
        {matrices.map((matrix, index) => (
          <div key={index} className="mb-3">
            <table className="table table-bordered">
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="text-center">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {showMatrixModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
          <div className="bg-white p-3 rounded" style={{ width: "300px" }}>
            <h5>Insert Matrix</h5>
            <div className="d-flex gap-2 align-items-center">
              <label>Rows:</label>
              <input type="number" min="1" value={rows} onChange={(e) => setRows(+e.target.value)} className="form-control w-25" />
              <label>Cols:</label>
              <input type="number" min="1" value={cols} onChange={(e) => setCols(+e.target.value)} className="form-control w-25" />
            </div>
            <div className="mt-3 d-flex justify-content-between">
              <button className="btn btn-primary" onClick={insertMatrix}>Insert</button>
              <button className="btn btn-danger" onClick={() => setShowMatrixModal(false)}><XCircle size={14} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
