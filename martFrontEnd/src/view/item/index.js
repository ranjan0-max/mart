import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import {
    Box,
    Button,
    CardContent,
    Dialog,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import useSnackbarAlert from 'customHook/alert';

// project imports
import MainCard from 'componets/MainCard';

// assets
import AddIcon from '@mui/icons-material/AddTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import SearchIcon from '@mui/icons-material/Search';

// form & model
import BarCodePage from './BarCodePage';
import InputForBarCodeModel from './InputForBarCodeModel';
import ItemModel from './ItemModel';

// Api
import { createItem, getItemList, updateItem } from 'api/item/itemApi';

// table sort
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array = [], comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// table header options

const headCells = [
    {
        id: 'id',
        numeric: true,
        label: 'S.NO',
        align: 'center'
    },
    {
        id: 'name',
        numeric: false,
        label: 'ITEM NAME',
        align: 'center'
    },
    {
        id: 'itemType',
        numeric: true,
        label: 'ITEM TYPE',
        align: 'center'
    },
    {
        id: 'quantity',
        numeric: true,
        label: 'Quantity',
        align: 'center'
    },
    {
        id: 'discount',
        numeric: true,
        label: 'Discount',
        align: 'center'
    },
    {
        id: 'purchaseRate',
        numeric: true,
        label: 'P PRICE',
        align: 'center'
    },
    {
        id: 'sellingPrice',
        numeric: true,
        label: 'S PRICE',
        align: 'center'
    },
    {
        id: 'gst',
        numeric: true,
        label: 'GST',
        align: 'center'
    }
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, theme, selected }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={8}>
                        <EnhancedTableToolbar numSelected={selected?.length} />
                    </TableCell>
                )}
                {numSelected <= 0 &&
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                style={{ fontWeight: 'bolder' }}
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                {numSelected <= 0 && (
                    <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900', fontWeight: 'bolder' }}
                        >
                            ACTION
                        </Typography>
                    </TableCell>
                )}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    theme: PropTypes.object,
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar
        sx={{
            p: 0,
            pl: 1,
            pr: 1,
            ...(numSelected > 0 && {
                color: (theme) => theme.palette.secondary.main
            })
        }}
    >
        {numSelected > 0 ? (
            <Typography color="inherit" variant="h4">
                {numSelected} Selected
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                Nutrition
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {numSelected > 0 && (
            <Tooltip title="Delete">
                <IconButton size="large">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

const CustomTableCell = ({ purchaseRate }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <TableCell
            style={{ padding: '2px', cursor: 'pointer' }}
            align="center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Typography variant="body1">{hovered ? purchaseRate : '######'}</Typography>
        </TableCell>
    );
};

// ==============================|| Item LIST ||============================== //

const Receipt = () => {
    const theme = useTheme();
    const { handleOpen, SnackbarComponent } = useSnackbarAlert();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [itemModelEvent, setItemModelEvent] = React.useState(true);
    const [originalData, setOriginalData] = React.useState([]);
    const [itemDetail, setItemDetail] = React.useState({});
    const [isBarCodeInputModelOpen, setIsBarCodeInputModelOpen] = React.useState(false);
    const [itemName, setItemName] = React.useState('');
    const [isBarCodePageOpen, setIsBarCodePageOpen] = React.useState(false);
    const [barCodeToPrint, setBarCodeToPrint] = React.useState([]);

    const fetchItem = async () => {
        try {
            const response = await getItemList();
            if (typeof response === 'string') {
                handleOpen(response, 'error');
            } else {
                setRows(response);
                setOriginalData(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = originalData.filter((row) => {
                let matches = true;

                const properties = ['itemType', 'name'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            setRows(newRows);
        } else {
            setRows(originalData);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            if (selected?.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId = rows.map((n) => n.name);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;

    const handleAddClick = () => {
        setItemModelEvent(true);
        setIsModalOpen(true);
    };

    const handleEdit = (row) => {
        setItemModelEvent(false);
        setItemDetail(row);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleEventCreate = async (data) => {
        try {
            const response = await createItem(data);
            if (typeof response === 'string') {
                handleOpen(response, 'error');
            } else {
                handleOpen(response.data.message, 'success');
                handleModalClose();
                fetchItem();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            const response = await updateItem(id, data);
            if (typeof response === 'string') {
                handleOpen(response, 'error');
            } else {
                handleOpen(response.data.message, 'success');
                handleModalClose();
                fetchItem();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // open bar code input quantity model

    const handleBarCode = (row) => {
        setItemName(row.name);
        setIsBarCodeInputModelOpen(true);
    };

    // open bar code print page

    const handlePrint = (data) => {
        setBarCodeToPrint(data);
        setIsBarCodeInputModelOpen(false);
        setIsBarCodePageOpen(true);
    };

    // handle on cancel button

    const onCancel = () => {
        setIsBarCodeInputModelOpen(false);
        setIsBarCodePageOpen(false);
    };

    React.useEffect(() => {
        fetchItem();
        // eslint-disable-next-line
    }, []);

    if (isBarCodePageOpen) {
        return <BarCodePage item={barCodeToPrint} onCancel={onCancel} />;
    }

    return (
        <MainCard
            title="Item List"
            content={false}
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="primary" variant="contained" onClick={handleAddClick}>
                        <AddIcon fontSize="small" /> Add Item
                    </Button>
                </Stack>
            }
        >
            <SnackbarComponent />
            <CardContent>
                <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
                            onChange={handleSearch}
                            placeholder="Search Item"
                            value={search}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                        {/* <Tooltip title="Copy">
                            <IconButton size="large">
                                <FileCopyIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Print">
                            <IconButton size="large">
                                <PrintIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Filter">
                            <IconButton size="large">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip> */}
                    </Grid>
                </Grid>
            </CardContent>

            {/* table */}
            <TableContainer component={Paper} sx={{ maxHeight: 450 }}>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        numSelected={selected?.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows?.length}
                        theme={theme}
                        selected={selected}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                /** Make sure no display bugs if row isn't an OrderData object */
                                if (typeof row === 'number') return null;

                                const isItemSelected = isSelected(row.name);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}
                                    >
                                        <TableCell style={{ padding: '2px' }} id={labelId} scope="row">
                                            <Typography
                                                variant="subtitle1"
                                                align="center"
                                                sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}
                                            >
                                                {index + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ padding: '2px' }} id={labelId} scope="row" align="center">
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}
                                            >
                                                {row?.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ padding: '2px' }} align="center">
                                            {row?.itemType}
                                        </TableCell>
                                        <TableCell style={{ padding: '2px' }} align="center">
                                            {row?.quantity}
                                        </TableCell>
                                        <TableCell style={{ padding: '2px' }} align="center">
                                            {row?.discount}%
                                        </TableCell>
                                        <CustomTableCell purchaseRate={row?.purchaseRate} />
                                        <TableCell style={{ padding: '2px' }} align="center">
                                            {row?.sellingPrice}
                                        </TableCell>
                                        <TableCell style={{ padding: '2px' }} align="center">
                                            {row?.gst}%
                                        </TableCell>
                                        <TableCell style={{ padding: '2px' }} align="center">
                                            <IconButton color="secondary" size="large" aria-label="edit" onClick={() => handleEdit(row)}>
                                                <EditTwoToneIcon color="primary" sx={{ fontSize: '1.3rem' }} />
                                            </IconButton>
                                            <Tooltip title="Bar Code">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    aria-label="view"
                                                    onClick={() => handleBarCode(row)}
                                                >
                                                    <LocalPrintshopIcon sx={{ fontSize: '1.3rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* table pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {isModalOpen && (
                    <ItemModel
                        itemList={originalData}
                        onCancel={handleModalClose}
                        handleCreate={handleEventCreate}
                        event={itemModelEvent}
                        handleUpdate={handleUpdate}
                        itemDetail={itemDetail}
                    />
                )}
            </Dialog>
            <Dialog maxWidth="sm" fullWidth onClose={onCancel} open={isBarCodeInputModelOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {isBarCodeInputModelOpen && <InputForBarCodeModel itemName={itemName} onCancel={onCancel} handlePrint={handlePrint} />}
            </Dialog>
        </MainCard>
    );
};

export default Receipt;
