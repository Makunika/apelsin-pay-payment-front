import {useLocation, useNavigate} from 'react-router-dom';
// material
import {
  Grid, Box, Tab, Typography
} from '@mui/material';
// components
import {useState} from "react";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import PropTypes from "prop-types";
import {fillTypeDataBusiness, fillTypeDataPersonal} from "../../../utils/depositUtils";
import DepositTypeDetail from "../depositDetail/DepositTypeDetail";
//

TabsTypesList.propTypes = {
  actualTypes: PropTypes.array.isRequired,
  archiveTypes: PropTypes.array.isRequired,
  handleArchive: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  fillTypeData: PropTypes.oneOf([fillTypeDataBusiness, fillTypeDataPersonal]).isRequired
}

export default function TabsTypesList({ actualTypes, archiveTypes, handleArchive, loading, fillTypeData }) {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Актуальные типы" value="1" />
          <Tab label="Архивные типы" value="2" />
        </TabList>
      </Box>
      <TabPanel value="1">
        <Grid container spacing={3} >
          {actualTypes.length === 0 && (
            <Typography mt={3} mb={3}>
              Нет элементов
            </Typography>
          )}
          {actualTypes.map((value, index) => (
            <Grid item key={index} xs={12} sm={6} md={3} >
              <DepositTypeDetail
                name={value.name}
                description={value.description}
                type={fillTypeData(value)}
                handleButton={() => handleArchive(value)}
                titleButton="Сделать архивным"
                loading={loading}
                showTitle={false}
                defaultExpanded
                valid={value.valid}
                typeReturned={value}
                useAccordion={false}
              />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      <TabPanel value="2">
        <Grid container spacing={3} >
          {archiveTypes.length === 0 && (
            <Typography mt={3} mb={3}>
              Нет элементов
            </Typography>
          )}
          {archiveTypes.map((value, index) => (
            <Grid item key={index} xs={12}  sm={6} md={3} >
              <DepositTypeDetail
                name={value.name}
                description={value.description}
                type={fillTypeData(value)}
                showTitle={false}
                valid={value.valid}
                typeReturned={value}
                useAccordion={false}
              />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </TabContext>
  );
}