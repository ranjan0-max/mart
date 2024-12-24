import { Button, Grid } from '@mui/material';
import MainCard from 'componets/MainCard';
import React, { useRef } from 'react';
import Barcode from 'react-barcode';

const BarCodePage = ({ item, onCancel }) => {
    const printableRef = useRef(null);

    const handlePrint = () => {
        const printableContent = printableRef.current;

        if (printableContent) {
            // Create a new window with the content
            const printWindow = window.open('', '_blank');
            // Write the content to the new window, excluding the buttons
            printWindow.document.open();
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print</title>
                        <style>
                        @media print {
                            @page {
                                size: 101.6mm 40mm; /* Set the default page size to A6 */
                                margin: 0; /* Reset margins for print */
                            }
                            body {
                                font-family: Arial, sans-serif;
                                width: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-direction: column; /* Change flexDirection to column */
                            }
                            .centered-text {
                                text-align: center;
                            }
    
                            .address {
                                font-size: 15px;
                            }
                        } 
                        </style>
                    </head>
                    <body>
                        ${printableContent.innerHTML}
                    </body>
                    </html>
            `);

            // Close the document, triggering the print dialog
            printWindow.document.close();
            printWindow.print();
        }
        onCancel();
    };

    React.useEffect(() => {
        setTimeout(() => handlePrint(), 100);
    }, []);

    return (
        <MainCard>
            <div ref={printableRef} style={{ border: '1px solid #ccc', padding: '20px' }} className="printable-content">
                {item.map((itemUniqueCode, index) => {
                    // const adjustedIndex = index + 1;

                    return <Barcode value={itemUniqueCode} marginTop={'20px'} />;
                })}
            </div>
            <Grid item xs={12} className="centered-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button type="button" variant="outlined" color="primary" onClick={handlePrint}>
                    Print
                </Button>
            </Grid>
            <Grid item xs={12} className="centered-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button type="button" variant="outlined" color="error" onClick={onCancel}>
                    Cancel
                </Button>
            </Grid>
        </MainCard>
    );
};

export default BarCodePage;
