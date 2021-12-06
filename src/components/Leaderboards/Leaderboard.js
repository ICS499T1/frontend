import React, {useState, useEffect} from 'react';
import { Tab, Box, Tabs  } from '@mui/material';
import LeaderboardTable from './LeaderboardTable.js';
import GLOBAL from '../../resources/Global';

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Leaderboard = () => {
  const [fastestUsers, setFastestUsers] = useState([]);
  const [fastestRaces, setFastestRaces] = useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchInit = {
      method: 'GET',
      mode: 'cors'
    };

    fetch(GLOBAL.API + '/leaderboard', fetchInit)
      .then(response => response.json())
      .then(data => {
        setFastestUsers(data.fastestPlayers);
        setFastestRaces(data.fastestRaces);
      })
      .catch(err => console.log('fetching error : ', err))
  }, []);

  return (
    <>
      <Box sx={{ padding: '20px', maxWidth: '50%', margin: "auto", borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant="fullWidth" value={value} onChange={handleChange} centered>
          <Tab label="Fastest Players" />
          <Tab label="Fastest Races" />
        </Tabs>
      </Box>
      <Box sx={{ maxWidth: '50%', margin: "auto", borderBottom: 1, borderColor: 'divider' }}>
      <TabPanel value={value} index={0}>
        <LeaderboardTable table={fastestUsers} comparisonType="Avg. Speed" />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <LeaderboardTable table={fastestRaces} comparisonType="Best Speed" />
      </TabPanel>
      </Box>
    </>
  );
}

export default Leaderboard;