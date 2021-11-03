import axios from "axios";
import { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import signedBackground from "../images/Background.png";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    minWidth: 170
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    background: {signedBackground},
  },
});

const Leaderboard = () => {
  const classes = useStyles();
  const [user, setUser] = useState([]);
  const [search, setSearch] = useState("");

  const getUserData = async () => {
    try {
      const data = await axios.get(
        "http://localhost:8080/leaderboard"
      );
      console.log(data.data);
      setUser(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className="Leaderboard">
      <h1 align = "center">Leaderboard</h1>
      <TextField
          search-box
          id="outlined-search-box"
          label="Search Box"
          placeholder="Search by username"
          height="10px"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
            <StyledTableCell align="left"></StyledTableCell>
            <StyledTableCell align="center">Username</StyledTableCell>
            <StyledTableCell align="right">Average Speed</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user
              .filter((player) => {
                if (search == "") {
                  return player;
                } else if (
                  player.username.toLowerCase().includes(search.toLowerCase())
                ) {
                  return player;
                }
              })
              .map((player) => {
                return (
                  <StyledTableRow key={player.username}>
                    <Avatar sx={{ bgcolor: deepOrange[300] }}>{player.username.substr(0, 1)}</Avatar>
                    <StyledTableCell align = "center" component="th" scope="row">
                      {player.username}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {player.userStats.averageSpeed}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Leaderboard;