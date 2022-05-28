import {useLocation, useNavigate} from 'react-router-dom';
// material
import {Container, Stack, Typography, CircularProgress, Box, Grid} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import {alpha} from "@mui/material/styles";
import Page from '../../../components/Page';
//
import API_SECURED, {URL_ACCOUNT_BUSINESS, URL_ACCOUNT_PERSONAL} from "../../../api/ApiSecured";
import DepositTypeDetail from "../depositDetail/DepositTypeDetail";
import {fillTypeDataBusiness} from "../../../utils/depositUtils";

CompanyDepositNewOrUpdateForm.propTypes = {
  companyUser: PropTypes.object.isRequired,
  updateInfo: PropTypes.shape({
    deposit: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired
  })
}

export default function CompanyDepositNewOrUpdateForm({ companyUser, updateInfo }) {
  const isUpdate = updateInfo != null
  const [isLoading, setLoading] = useState(true)
  const [types, setTypes] = useState([])
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    API_SECURED.get(`${URL_ACCOUNT_BUSINESS}api/business/type/valid`)
      .then(res => {
        setTypes(res.data)
        setLoading(false)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка: ${reason}`, { variant: "error" })
      })
  }, [])

  const handleNew = (type) => {
    setLoading(true)
    const data = {
      typeId: type.id,
      companyId: companyUser.company.id
    }
    API_SECURED.post(`${URL_ACCOUNT_BUSINESS}api/business/`, data)
      .then(res => {
        setLoading(false)
        enqueueSnackbar("Счет создан", {variant: "success"})
        window.location.reload()
      })
      .catch(reason => {
        console.log(reason)
        setLoading(false)
        const msg = reason.response.data.message;
        enqueueSnackbar(`Ошибка: ${msg}`, { variant: "error" })
      })
  }
  const handleUpdate = (type) => {
    setLoading(true)
    const data = {
      typeId: type.id,
      number: updateInfo.deposit.number
    }
    API_SECURED.post(`${URL_ACCOUNT_BUSINESS}api/business/type/change`, data)
      .then(res => {
        setLoading(false)
        enqueueSnackbar("Тип счета изменен", {variant: "success"} )
        window.location.reload()
      })
      .catch(reason => {
        console.log(reason)
        setLoading(false)
        const msg = reason.response.data.message;
        enqueueSnackbar(`Ошибка: ${msg}`, { variant: "error" })
      })
  }

  if (isLoading) {
    return (
      <Page>
        <Container>
          <Stack direction="column" alignItems="center" justifyContent="center" mt={5}>
            <CircularProgress />
          </Stack>
        </Container>
      </Page>
    )
  }
  const filterTypes = isUpdate ? types.filter(value => value.id !== updateInfo.type.id) : types

  return (
    <Container>
      {isUpdate && (
        <div>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h6" gutterBottom>
              Активный тип счета
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap" mb={5}>
            <DepositTypeDetail valid={updateInfo.type.valid}
                               name={updateInfo.type.name}
                               description={updateInfo.type.description}
                               type={fillTypeDataBusiness(updateInfo.type)}
                               showTitle
                               useAccordion={false}
            />
          </Stack>
        </div>
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h6" gutterBottom>
          Выберите тип счета
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        {filterTypes.map((value, index) => (
          <Grid item key={index} xs={12} md={6} >
            <DepositTypeDetail
              name={value.name}
              description={value.description}
              type={fillTypeDataBusiness(value)}
              handleButton={updateInfo == null ? handleNew : handleUpdate}
              titleButton="Выбрать"
              showTitle={false}
              valid={value.valid}
              typeReturned={value}
              useAccordion={false}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}