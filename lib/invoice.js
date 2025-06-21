import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './currency';

// Invoice generation utilities
export class InvoiceGenerator {
  constructor(companyInfo = {}) {
    this.companyInfo = {
      name: companyInfo.name || 'Catatan Uang',
      address: companyInfo.address || 'Jl. Contoh No. 123, Jakarta',
      phone: companyInfo.phone || '+62 21 1234 5678',
      email: companyInfo.email || 'info@catatanuang.com',
      website: companyInfo.website || 'www.catatanuang.com',
      ...companyInfo
    };
  }

  generateInvoice(invoiceData) {
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      customer,
      items,
      subtotal,
      tax,
      total,
      currency = 'IDR',
      notes = '',
      terms = ''
    } = invoiceData;

    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Invoice ${invoiceNumber}`,
      subject: `Invoice for ${customer.name}`,
      author: this.companyInfo.name,
      creator: 'Catatan Uang App'
    });

    // Add company header
    this.addCompanyHeader(doc);
    
    // Add invoice details
    this.addInvoiceDetails(doc, invoiceNumber, invoiceDate, dueDate);
    
    // Add customer information
    this.addCustomerInfo(doc, customer);
    
    // Add items table
    this.addItemsTable(doc, items, currency);
    
    // Add totals
    this.addTotals(doc, subtotal, tax, total, currency);
    
    // Add notes and terms
    if (notes) this.addNotes(doc, notes);
    if (terms) this.addTerms(doc, terms);
    
    // Add footer
    this.addFooter(doc);

    return doc;
  }

  addCompanyHeader(doc) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(this.companyInfo.name, 20, 30);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(this.companyInfo.address, 20, 40);
    doc.text(`Phone: ${this.companyInfo.phone}`, 20, 45);
    doc.text(`Email: ${this.companyInfo.email}`, 20, 50);
    doc.text(`Website: ${this.companyInfo.website}`, 20, 55);
  }

  addInvoiceDetails(doc, invoiceNumber, invoiceDate, dueDate) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 150, 30);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoiceNumber}`, 150, 40);
    doc.text(`Date: ${new Date(invoiceDate).toLocaleDateString('id-ID')}`, 150, 45);
    if (dueDate) {
      doc.text(`Due Date: ${new Date(dueDate).toLocaleDateString('id-ID')}`, 150, 50);
    }
  }

  addCustomerInfo(doc, customer) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, 80);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(customer.name, 20, 90);
    if (customer.address) doc.text(customer.address, 20, 95);
    if (customer.phone) doc.text(`Phone: ${customer.phone}`, 20, 100);
    if (customer.email) doc.text(`Email: ${customer.email}`, 20, 105);
  }

  addItemsTable(doc, items, currency) {
    const tableY = 130;
    
    // Table headers
    const headers = [
      ['No', 'Description', 'Qty', 'Price', 'Total']
    ];
    
    // Table data
    const data = items.map((item, index) => [
      index + 1,
      item.description,
      item.quantity,
      formatCurrency(item.price, currency),
      formatCurrency(item.total, currency)
    ]);
    
    // Add table
    doc.autoTable({
      startY: tableY,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 15 }, // No
        1: { cellWidth: 80 }, // Description
        2: { cellWidth: 20 }, // Qty
        3: { cellWidth: 35 }, // Price
        4: { cellWidth: 35 }  // Total
      }
    });
  }

  addTotals(doc, subtotal, tax, total, currency) {
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Subtotal:', 150, finalY);
    doc.text(formatCurrency(subtotal, currency), 180, finalY);
    
    if (tax > 0) {
      doc.text('Tax:', 150, finalY + 10);
      doc.text(formatCurrency(tax, currency), 180, finalY + 10);
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 150, finalY + 20);
    doc.text(formatCurrency(total, currency), 180, finalY + 20);
  }

  addNotes(doc, notes) {
    const finalY = doc.lastAutoTable.finalY + 40;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, finalY);
    
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(notes, 170);
    doc.text(splitNotes, 20, finalY + 10);
  }

  addTerms(doc, terms) {
    const finalY = doc.lastAutoTable.finalY + 60;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions:', 20, finalY);
    
    doc.setFont('helvetica', 'normal');
    const splitTerms = doc.splitTextToSize(terms, 170);
    doc.text(splitTerms, 20, finalY + 10);
  }

  addFooter(doc) {
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', 20, pageHeight - 20);
    doc.text(`Generated by ${this.companyInfo.name}`, 20, pageHeight - 15);
    doc.text(`Generated on: ${new Date().toLocaleString('id-ID')}`, 20, pageHeight - 10);
  }
}

// Helper function to generate invoice from transaction
export function generateInvoiceFromTransaction(transaction, customer, companyInfo = {}) {
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(transaction.id).padStart(4, '0')}`;
  const invoiceDate = new Date();
  const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  const items = [{
    description: transaction.produk,
    quantity: 1,
    price: transaction.hargaJual,
    total: transaction.hargaJual
  }];
  
  const subtotal = transaction.hargaJual;
  const tax = 0; // Can be calculated based on business rules
  const total = subtotal + tax;
  
  const invoiceData = {
    invoiceNumber,
    invoiceDate,
    dueDate,
    customer,
    items,
    subtotal,
    tax,
    total,
    currency: transaction.mataUang || 'IDR',
    notes: `Transaction ID: ${transaction.id}`,
    terms: 'Payment is due within 30 days of invoice date.'
  };
  
  const generator = new InvoiceGenerator(companyInfo);
  return generator.generateInvoice(invoiceData);
}

// Helper function to download invoice as PDF
export function downloadInvoice(invoiceData, filename = null) {
  const generator = new InvoiceGenerator();
  const doc = generator.generateInvoice(invoiceData);
  
  const defaultFilename = `invoice-${invoiceData.invoiceNumber}.pdf`;
  doc.save(filename || defaultFilename);
} 