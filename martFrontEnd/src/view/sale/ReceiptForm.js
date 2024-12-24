import { Button, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import MainCard from 'componets/MainCard';
import React, { useRef, useState } from 'react';

// alert
import useSnackbarAlert from 'customHook/alert';

// components
import PrintReceipt from './PrintReceipt';

// api
import { getItemList, updateItem } from 'api/item/itemApi';

// icons
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const BLANK = '';

const tableHeader = [
    {
        itemName: BLANK,
        itemType: BLANK,
        isDiscountChecked: false,
        isGstChecked: false,
        quantity: 0,
        rate: 0,
        total: 0
    }
];

const ReceiptForm = () => {
    const { handleOpen, SnackbarComponent } = useSnackbarAlert();
    const buttonRef = useRef(null);

    const [tableInputBox, setTableInputBox] = useState(tableHeader);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [itemTableDetail, setItemTableDetail] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [total, setTotal] = useState(0);
    const [showPrintReceipt, setShowPrintReceipt] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [uniqueId, setUniqueId] = useState([]);
    const [editButtonPress, setEditButtonPress] = useState(false);
    const [validBarCode, setValidBarCode] = useState(false);

    const fetchItem = async () => {
        try {
            const response = await getItemList();
            if (typeof response === 'string') {
                handleOpen(response, 'error');
            } else {
                setItemList(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateItemFunction = async (id, data) => {
        try {
            const response = await updateItem(id, data);
            if (typeof response === 'string') {
                handleOpen(response, 'error');
            } else {
                handleOpen(response.data.message, 'success');
                fetchItem();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkItemAlreadyExists = (item) => {
        const itemNameArray = item.split('-');
        const itemName = itemNameArray[0];
        setUniqueId((prevUniqueIds) => (prevUniqueIds.includes(item) ? prevUniqueIds : [...prevUniqueIds, item]));

        const itemExists = itemTableDetail.find((item) => item.itemName.toLowerCase() === itemName.toLowerCase());

        if (itemExists) {
            itemExists.quantity = parseInt(itemExists.quantity, 10) + 1;
            itemExists.total = itemExists.quantity * itemExists.rate;
            return true;
        }
        return false;
    };

    const checkSameItemScanAgain = (item) => {
        const itemExists = uniqueId.includes(item);
        return itemExists;
    };

    const checkValidBarCode = (scanedItem) => {
        const regex = /\)/;
        if (regex.test(scanedItem)) {
            return true;
        } else {
            return false;
        }
    };

    // adding row and update in table
    const handleAddRow = () => {
        if (tableInputBox[0].itemName && tableInputBox[0].quantity && tableInputBox[0].rate) {
            if (selectedRowIndex !== null && editButtonPress) {
                // update
                tableInputBox[0].quantity = tableInputBox[0].quantity;
                const updatedTableDetail = [...itemTableDetail];
                updatedTableDetail[selectedRowIndex] = { ...tableInputBox[0] };
                setItemTableDetail(updatedTableDetail);
                setSelectedRowIndex(null);
                setEditButtonPress(false);
                buttonRef.current.focus();
            } else {
                // add
                tableInputBox[0].quantity = tableInputBox[0].quantity;
                setItemTableDetail((prevDetail) => [...prevDetail, tableInputBox[0]]);
                buttonRef.current.focus();
            }
            setTableInputBox(tableHeader);
        } else {
            handleOpen('Field Should Not Be Empty Of Item Table', 'error');
        }
    };

    // when input field change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;

        if (!editButtonPress) {
            const valid = checkValidBarCode(value);
            if (!valid) {
                const nameInputBox = [...tableInputBox];
                nameInputBox[index] = { ...nameInputBox[index], [name]: value };
                const currentRow = nameInputBox[index];
                if (currentRow.quantity && currentRow.rate) {
                    currentRow.total = currentRow.quantity * currentRow.rate;
                }
                nameInputBox[index] = { ...currentRow };
                setTableInputBox(nameInputBox);
                setValidBarCode(false);
                return;
            }

            const existInRecipt = checkSameItemScanAgain(value);
            if (existInRecipt) {
                handleOpen('Same Item Scan Again', 'error');
                return;
            }

            const checkItemAlreadyInRecipt = checkItemAlreadyExists(value);
            if (checkItemAlreadyInRecipt) {
                const nameInputBox = [...tableInputBox];
                nameInputBox[index] = { ...nameInputBox[index], [name]: '' };
                const currentRow = nameInputBox[index];
                nameInputBox[index] = { ...currentRow };
                setTableInputBox(nameInputBox);
                return;
            }
        }

        setValidBarCode(true);
        const updatedItem = [...tableInputBox];
        updatedItem[index] = { ...updatedItem[index], [name]: value };
        const currentItem = updatedItem[index];
        if (name === 'itemName') {
            const itemNameArray = value.split('-');
            const itemName = itemNameArray[0];
            const item = itemList.filter((row) => row.name.toLowerCase() === itemName.toLowerCase());
            if (item.length) {
                currentItem.itemType = item[0].itemType;
                currentItem.itemName = itemName;
                currentItem.rate = item[0].sellingPrice;
                setUniqueId((prevUniqueIds) => (prevUniqueIds.includes(value) ? prevUniqueIds : [...prevUniqueIds, value]));
                currentItem.quantity = 1;
            } else {
                currentItem.rate = null;
            }
        }

        if (currentItem.quantity && currentItem.rate) {
            currentItem.total = currentItem.quantity * currentItem.rate;
        }
        updatedItem[index] = { ...currentItem };
        setTableInputBox(updatedItem);
    };

    // handle delete row form table
    const handleDeleteRow = (row, index) => {
        setItemTableDetail((prevDimensions) => prevDimensions.filter((_, i) => i !== index));

        const newUniqueArray = [];
        uniqueId.forEach((element) => {
            const arrayItem = element.split('-');
            if (arrayItem.length) {
                if (arrayItem[0] !== row.itemName) {
                    newUniqueArray.push(element);
                }
            }
        });

        setUniqueId(newUniqueArray);
    };

    // handle edit row form table
    const handleEditRow = (index) => {
        const selectedRow = itemTableDetail[index];

        setSelectedRowIndex(index);
        setTableInputBox([
            {
                itemName: selectedRow.itemName,
                itemType: selectedRow.itemType,
                rate: selectedRow.rate,
                quantity: selectedRow.quantity,
                total: selectedRow.total
            }
        ]);
        setEditButtonPress(true);
    };

    // update the total ammount in table
    const handleTotalAmountOfTable = (tableDetail) => {
        let totalAmmount = 0;
        tableDetail.forEach((row) => {
            totalAmmount += parseFloat(row.total, 10);
        });
        setTotal(totalAmmount);
    };

    // handle discount and gst
    const handleCheckBox = (e, row, index, type) => {
        const isChecked = e.target.checked;

        const updatedItemTableDetail = itemTableDetail.map((tableRow, i) => {
            if (i === index) {
                const item = itemList.find((item) => item.name.toLowerCase() === row.itemName.toLowerCase());
                if (!item) return tableRow;

                let total = row.rate * row.quantity;

                const totalDiscount = ((row.rate * item.discount) / 100) * row.quantity;
                const totalGst = ((row.rate * item.gst) / 100) * row.quantity;

                if (type === 'discount') {
                    total = isChecked
                        ? parseInt(tableRow.total, 10) - totalDiscount
                        : tableRow.isGstChecked
                          ? parseInt(row.rate * row.quantity, 10) + totalGst
                          : row.rate * row.quantity;
                } else if (type === 'gst') {
                    total = isChecked
                        ? parseInt(tableRow.total, 10) + totalGst
                        : tableRow.isDiscountChecked
                          ? parseInt(row.rate * row.quantity, 10) - totalDiscount
                          : row.rate * row.quantity;
                }

                return {
                    ...tableRow,
                    total: total.toFixed(2),
                    isDiscountChecked: type === 'discount' ? isChecked : tableRow.isDiscountChecked,
                    isGstChecked: type === 'gst' ? isChecked : tableRow.isGstChecked
                };
            }
            return tableRow;
        });

        setItemTableDetail(updatedItemTableDetail);
    };

    // update the quantity and print the recipt
    const printTable = () => {
        itemTableDetail.forEach(async (row) => {
            const item = itemList.find((item) => item.name.toLowerCase() === row.itemName.toLowerCase());
            const dataToUpdate = {
                quantity: item.quantity - row.quantity
            };
            await updateItemFunction(item._id, dataToUpdate);
        });
        setShowPrintReceipt(true);
    };

    const handleClose = () => {
        setShowPrintReceipt(false);
        setItemTableDetail([]);
    };

    React.useEffect(() => {
        if (tableInputBox[0].itemName && tableInputBox[0].quantity && tableInputBox[0].rate && tableInputBox[0].total) {
            if (!editButtonPress && validBarCode) {
                handleAddRow();
            }
        }
    }, [tableInputBox]);

    React.useEffect(() => {
        handleTotalAmountOfTable(itemTableDetail);
    }, [itemTableDetail]);

    React.useEffect(() => {
        fetchItem();
        // eslint-disable-next-line
    }, []);

    if (showPrintReceipt) {
        return <PrintReceipt itemTable={itemTableDetail} onCancel={handleClose} total={total} customerName={customerName} />;
    }

    return (
        <MainCard
            // title="Receipt"
            content={false}
        >
            <SnackbarComponent />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '12%', marginBottom: '1%', marginTop: '1%' }}>
                <TextField placeholder="Customer Name" size="small" onChange={(event) => setCustomerName(event.target.value)} />
            </div>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <TableContainer sx={{ maxHeight: 550, maxWidth: 900 }}>
                    <Table
                        style={{
                            border: '1px solid black',
                            borderRadius: '4px',
                            borderCollapse: 'inherit',
                            background: '#f8fafd'
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{
                                        borderBottom: '1px solid black',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        padding: '4px',
                                        textAlign: 'center',
                                        width: '14%'
                                    }}
                                >
                                    S.NO
                                </TableCell>
                                <TableCell
                                    style={{
                                        borderBottom: '1px solid black',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        padding: '4px',
                                        textAlign: 'center',
                                        width: '14%'
                                    }}
                                >
                                    ITEM NAME
                                </TableCell>
                                <TableCell
                                    style={{
                                        borderBottom: '1px solid black',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        padding: '4px',
                                        textAlign: 'center',
                                        width: '14%'
                                    }}
                                >
                                    QUANTITY
                                </TableCell>
                                <TableCell
                                    style={{
                                        borderBottom: '1px solid black',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        padding: '4px',
                                        textAlign: 'center',
                                        width: '14%'
                                    }}
                                >
                                    RATE
                                </TableCell>
                                <TableCell
                                    style={{
                                        borderBottom: '1px solid black',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        padding: '4px',
                                        textAlign: 'center',
                                        width: '14%'
                                    }}
                                >
                                    DISCOUNT-GST
                                </TableCell>
                                <TableCell
                                    style={{
                                        borderBottom: '1px solid black',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        padding: '4px',
                                        textAlign: 'center',
                                        width: '14%'
                                    }}
                                >
                                    TOTAL
                                </TableCell>
                                <TableCell
                                    style={{ borderBottom: '1px solid black', color: 'black', fontWeight: 'bolder', padding: '4px' }}
                                />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemTableDetail.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ borderBottom: '1px solid black', padding: '2px', textAlign: 'center' }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell style={{ borderBottom: '1px solid black', padding: '2px', textAlign: 'center' }}>
                                        {row.itemName}
                                    </TableCell>{' '}
                                    <TableCell style={{ borderBottom: '1px solid black', padding: '2px', textAlign: 'center' }}>
                                        {row.quantity}
                                    </TableCell>
                                    <TableCell style={{ borderBottom: '1px solid black', padding: '2px', textAlign: 'center' }}>
                                        {row.rate}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            borderBottom: '1px solid black',
                                            padding: '5px',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Stack direction="row">
                                            <input
                                                type="checkbox"
                                                style={{ marginRight: '13px' }}
                                                onChange={(e) => handleCheckBox(e, row, index, 'discount')}
                                                checked={row.isDiscountChecked}
                                                disabled={row.itemType !== 'FURNITURE'}
                                            />
                                            <input
                                                type="checkbox"
                                                disabled={row.itemType !== 'FURNITURE'}
                                                onChange={(e) => handleCheckBox(e, row, index, 'gst')}
                                                checked={row.isGstChecked}
                                            />
                                        </Stack>
                                    </TableCell>
                                    <TableCell style={{ borderBottom: '1px solid black', padding: '2px', textAlign: 'center' }}>
                                        {row.total}
                                    </TableCell>
                                    <TableCell style={{ borderBottom: '1px solid black', padding: '2px', display: 'flex' }}>
                                        <Stack direction="row">
                                            <Button color="error" onClick={() => handleDeleteRow(row, index)}>
                                                <RemoveCircleIcon sx={{ fontSize: '1.3rem' }} />
                                            </Button>
                                            <Button color="primary" onClick={() => handleEditRow(index)}>
                                                <EditIcon sx={{ fontSize: '1.3rem' }} />
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {tableInputBox.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ padding: '2px' }} />
                                    <TableCell style={{ padding: '2px' }}>
                                        <input
                                            list={`browsers-${index}`}
                                            name="itemName"
                                            id={`itemName-${index}`}
                                            style={{
                                                width: '90%',
                                                height: '30px',
                                                borderRadius: '4px',
                                                border: '1px solid black',
                                                textAlign: 'center'
                                            }}
                                            ref={buttonRef}
                                            value={row.itemName || ''}
                                            onChange={(e) => {
                                                handleInputChange(e, index);
                                            }}
                                            disabled={editButtonPress}
                                        />
                                        {itemList.length > 0 && (
                                            <datalist id={`browsers-${index}`}>
                                                {itemList.map((row, idx) => (
                                                    <option key={idx} value={row.name}>
                                                        {row.name}
                                                    </option>
                                                ))}
                                            </datalist>
                                        )}
                                    </TableCell>
                                    <TableCell style={{ padding: '2px' }}>
                                        <input
                                            style={{
                                                width: '80%',
                                                height: '30px',
                                                borderRadius: '4px',
                                                border: '1px solid black',
                                                textAlign: 'center'
                                            }}
                                            name="quantity"
                                            type="number"
                                            value={row.quantity || BLANK}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '2px' }}>
                                        <input
                                            style={{
                                                width: '80%',
                                                height: '30px',
                                                borderRadius: '4px',
                                                border: '1px solid black',
                                                textAlign: 'center'
                                            }}
                                            type="number"
                                            name="rate"
                                            value={row.rate || BLANK}
                                            onChange={(e) => handleInputChange(e, index)}
                                            disabled={editButtonPress}
                                        />
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            padding: '2px',
                                            display: 'flex',
                                            width: '100%',
                                            height: '42px',
                                            borderRadius: '4px'
                                        }}
                                    ></TableCell>
                                    <TableCell style={{ padding: '2px' }}>
                                        <input
                                            style={{
                                                width: '80%',
                                                height: '30px',
                                                borderRadius: '4px',
                                                border: '1px solid black',
                                                textAlign: 'center'
                                            }}
                                            name="total"
                                            type="number"
                                            value={row.total || BLANK}
                                            onChange={(e) => handleInputChange(e, index)}
                                            disabled={editButtonPress}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '2px' }}>
                                        <Button onClick={handleAddRow} color="success" style={{ fontWeight: 'bolder' }}>
                                            {selectedRowIndex !== null ? 'Update' : 'Add'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <div
                                        style={{
                                            width: '110px'
                                        }}
                                    >
                                        <span style={{ fontWeight: 'bolder' }}>Total</span>
                                    </div>
                                </TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell style={{ textAlign: 'center' }}>{total?.toFixed(2) || 0}</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '10px' }}>
                <Grid container justifyContent="center" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button type="button" variant="outlined" onClick={printTable}>
                            Print
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ReceiptForm;
