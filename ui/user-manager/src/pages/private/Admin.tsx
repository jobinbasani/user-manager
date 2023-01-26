import { SyntheticEvent, useState } from 'react';
import { Box, Tabs } from '@mui/material';
import Tab from '@mui/material/Tab';
import { useSelector } from 'react-redux';
import TabPanel from '../../components/tabs/TabPanel';
import ManageAdmins from '../../components/admin/ManageAdmins';
import { RootState } from '../../store';
import ManageBackgroundImages from '../../components/admin/ManageBackgroundImages';
import { UserDetails } from '../../store/user/user-slice';

export type AdminProps={
  user: UserDetails
}

export default function Admin() {
  const user = useSelector((state: RootState) => state.user);
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: { md: '70%', sm: '100%' } }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Admins" />
          <Tab label="Backgrounds" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ManageAdmins />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ManageBackgroundImages user={user} />
      </TabPanel>
    </Box>
  );
}
