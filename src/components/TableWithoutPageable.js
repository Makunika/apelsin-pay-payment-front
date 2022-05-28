import {useState} from 'react';
// material
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination, Paper
} from '@mui/material';
import PropTypes from "prop-types";
import Scrollbar from "./Scrollbar";
import ListHead from "./ListHead";
import {applySortFilter, getComparator} from "../utils/tableUtils";
import {fDate} from "../utils/formatTime";
import Label from "./Label";
import MoreMenu from "./MoreMenu";

TableWithoutPageable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHead: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    alignRight: PropTypes.bool
  })).isRequired,
  getRow: PropTypes.func.isRequired,
  applySortAndFilter: PropTypes.func,
  rowsPerPage: PropTypes.number
}

export default function TableWithoutPageable({ items, tableHead, getRow, applySortAndFilter = applySortFilter, rowsPerPage = 5 }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(tableHead[0].id);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

  const filteredItems = applySortAndFilter(items, getComparator(order, orderBy));

  const isRowNotFound = filteredItems.length === 0;

  return (
    <div>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <ListHead
              order={order}
              orderBy={orderBy}
              headLabel={tableHead}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {filteredItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => getRow(row))
              }
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={tableHead.length} />
                </TableRow>
              )}
            </TableBody>
            {isRowNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={tableHead.length} sx={{ py: 3 }}>
                    <Paper>
                      <Typography gutterBottom align="center" variant="subtitle1">
                        Нет данных
                      </Typography>
                    </Paper>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </div>
  );
}
