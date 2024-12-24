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
import SearchIcon from '@mui/icons-material/Search';

// form & model
import UserForm from './UserForm';

// Api
import { createUser, getUser, updateUser } from 'api/user/useApi';

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
        label: 'NAME',
        align: 'center'
    },
    {
        id: 'email',
        numeric: true,
        label: 'EMAIL',
        align: 'center'
    },
    {
        id: 'createdAt',
        numeric: true,
        label: 'CREATED AT',
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

const User = () => {
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
    const [userModelEvent, setUserModelEvent] = React.useState(true);
    const [originalData, setOriginalData] = React.useState([]);
    const [userDetail, setUserDetail] = React.useState({});

    const fetchUsers = async () => {
        try {
            const response = await getUser();
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

                const properties = ['email', 'name'];
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
        setUserModelEvent(true);
        setIsModalOpen(true);
    };

    const handleEdit = (row) => {
        setUserModelEvent(false);
        setUserDetail(row);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleEventCreate = async (data) => {
        try {
            const response = await createUser(data);
            if (typeof response === 'string') {
                handleOpen(response, 'error');
            } else {
                handleOpen(response.data.message, 'success');
                handleModalClose();
                fetchUsers();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            const response = await updateUser(id, data);
            if (typeof response === 'string') {
                handleOpen(response, 'error');
            } else {
                handleOpen(response.data.message, 'success');
                handleModalClose();
                fetchUsers();
            }
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line
    }, []);

    return (
        <MainCard
            title="User List"
            content={false}
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="primary" variant="contained" onClick={handleAddClick}>
                        <AddIcon fontSize="small" /> Add User
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
                            placeholder="Search"
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
                                            {row?.email}
                                        </TableCell>
                                        <TableCell style={{ padding: '2px' }} align="center">
                                            {row?.createdAt.split('T')[0]}
                                        </TableCell>
                                        <TableCell style={{ padding: '2px' }} align="center">
                                            <IconButton color="primary" size="large" aria-label="edit" onClick={() => handleEdit(row)}>
                                                <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                            </IconButton>
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
                    <UserForm
                        onCancel={handleModalClose}
                        handleCreate={handleEventCreate}
                        event={userModelEvent}
                        handleUpdate={handleUpdate}
                        userDetail={userDetail}
                    />
                )}
            </Dialog>
        </MainCard>
    );
};

export default User;
