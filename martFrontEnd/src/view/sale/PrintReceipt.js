import { Button, Grid } from '@mui/material';
import MainCard from 'componets/MainCard';
import React, { useRef } from 'react';

const PrintReceipt = ({ itemTable, onCancel, total, customerName }) => {
    const printableRef = useRef(null);

    const currentDate = new Date();
    const dateTimeString = currentDate.toLocaleString();

    const handlePrint = () => {
        const printableContent = printableRef.current;
        if (printableContent) {
            const printWindow = window.open('', '_blank');
            printWindow?.document.open();
            printWindow?.document.write(`
                <html>
                <head>
                    <title>Print Receipt</title>
                    <style>
                        @media print {
                            @page {
                                size: 80mm; /* Adjust page size as needed */
                                margin: 0; /* Adjust margin as needed */
                            }
                            body {
                                font-family: Arial, sans-serif;
                                width: 100%;
                                display: flex;
                                // align-items: center;
                                // justify-content: center;
                                flex-direction: column;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 0; /* Adjust top margin as needed */
                            }
                            th, td {
                                border: 1px solid white;
                                padding: 0px;
                                text-align: center;
                                font-size: 15px;
                                white-space: nowrap;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printableContent.innerHTML}
                </body>
                </html>
            `);
            printWindow?.document.close();
            printWindow?.print();
            printWindow.close();
            onCancel();
        }
    };

    React.useEffect(() => {
        setTimeout(() => handlePrint(), 100);
    }, []);

    return (
        <MainCard>
            <div ref={printableRef}>
                <div style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bolder' }}>FAUJI RATION STORE</div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '10px' }}>P.NO : 7018423400, 6230073716</div>
                {/* <div style={{ display: 'flex', justifyContent: 'center', fontSize: '10px' }}>Pal building, Mandi Road, Hiranagar</div> */}
                <div style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bolder' }}>CASH MEMO</div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bolder' }}>
                    {customerName + `(${dateTimeString})`}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '1px solid #000' }}>S.NO</th>
                            <th style={{ borderBottom: '1px solid #000' }}>I.NAME</th>
                            <th style={{ borderBottom: '1px solid #000' }}>QTY</th>
                            <th style={{ borderBottom: '1px solid #000' }}>RATE</th>
                            <th style={{ borderBottom: '1px solid #000' }}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemTable.map((item, index) => (
                            <tr key={index}>
                                <td style={{ borderBottom: '1px solid #000' }}>{index + 1}</td>
                                <td style={{ borderBottom: '1px solid #000' }}>{item.itemName}</td>
                                <td style={{ borderBottom: '1px solid #000' }}>{item.quantity}</td>
                                <td style={{ borderBottom: '1px solid #000' }}>{item.rate}</td>
                                <td style={{ borderBottom: '1px solid #000' }}>{item.total}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={4} style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bolder' }}>
                                Total
                            </td>
                            <td />
                            <td />
                            <td />
                            <td>{total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                    <Button variant="outlined" color="primary" onClick={handlePrint}>
                        Print
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="error" onClick={onCancel}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default PrintReceipt;
