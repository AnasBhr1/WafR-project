import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { User, Transaction } from './userService';

export const generateTransactionsPDF = (user: User, transactions: Transaction[]): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add WafR logo and title
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Primary blue color
  doc.text('WafR', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Transaction Report', 14, 27);
  
  // Add report generation details
  doc.setFontSize(8);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 33);
  
  // Add user information
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('User Information', 14, 42);
  
  doc.setFontSize(10);
  doc.text(`Name: ${user.name}`, 14, 48);
  doc.text(`Phone: ${user.phoneNumber}`, 14, 53);
  doc.text(`Email: ${user.email}`, 14, 58);
  doc.text(`Account Status: ${user.isBlocked ? 'Blocked' : 'Active'}`, 14, 63);
  doc.text(`Current Balance: ${user.balance.toFixed(2)} MAD`, 14, 68);
  
  // Add transactions table
  doc.setFontSize(12);
  doc.text('Transaction History', 14, 78);
  
  // Prepare data for the table
  const tableData = transactions.map(transaction => [
    transaction.id,
    format(new Date(transaction.date), 'PP'),
    transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    transaction.description,
    `${transaction.amount.toFixed(2)} MAD`,
    transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
  ]);
  
  // Add the table
  autoTable(doc, {
    startY: 83,
    head: [['ID', 'Date', 'Type', 'Description', 'Amount', 'Status']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 25 },
      2: { cellWidth: 20 },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 20, halign: 'center' }
    }
  });
  
  // Add footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${pageCount} - WafR Transaction Report`,
      doc.internal.pageSize.width / 2, 
      doc.internal.pageSize.height - 10, 
      { align: 'center' }
    );
  }
  
  return doc;
};

export const downloadTransactionsPDF = (user: User, transactions: Transaction[]): void => {
  const doc = generateTransactionsPDF(user, transactions);
  doc.save(`wafr-transactions-${user.id}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};