import { Tab, Box, Tabs, TableCell, TableContainer, Paper, Table, TableRow, TableHead, TableBody } from '@mui/material';

const LeaderboardTable = ({table, comparisonType}) => {
    return (
    <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell align="right">User</TableCell>
                <TableCell align="right">{comparisonType}&nbsp;(WPM)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {table.map((user, i) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {i+1}
                  </TableCell>
                  <TableCell align="right">{user.username}</TableCell>
                  <TableCell align="right">{user.speed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    </TableContainer>);
}

export default LeaderboardTable;