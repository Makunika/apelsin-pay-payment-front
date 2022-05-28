import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import {Card, Grid, Typography, CardContent, CardHeader, Stack, Button, ButtonGroup} from '@mui/material';
// utils
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {useSnackbar} from "notistack";
import {fNumberDeposit} from '../../../utils/formatNumber';
//
import {BUSINESS_TYPE, fCurrencyByEnum, PERSONAL_TYPE} from "../../../utils/formatEnum";
import SimpleDataVisible from "../../../components/SimpleDataVisible";
import AlertDialog from "../../../components/AlertDialog";
import apiSecured, {URL_ACCOUNT_BUSINESS, URL_ACCOUNT_PERSONAL} from "../../../api/ApiSecured";


// ----------------------------------------------------------------------

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(3),
}));

// ----------------------------------------------------------------------

DepositCardDetail.propTypes = {
  deposit: PropTypes.object.isRequired,
  type: PropTypes.oneOf([ BUSINESS_TYPE, PERSONAL_TYPE ]).isRequired,
  refresh: PropTypes.func,
  refreshState: PropTypes.number
};

export default function DepositCardDetail({ deposit, type, refresh, refreshState }) {
  const { balance, currency, lock, number, typeId, typeName, userId, validType } = deposit
  const [openAlertBlock, setOpenAlertBlock] = useState(false)
  const [openAlertDelete, setOpenAlertDelete] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const {enqueueSnackbar} = useSnackbar();

  const handleCloseAlert = () => {
    setOpenAlertBlock(false)
    setOpenAlertDelete(false)
  }

  const handleBlockDeposit = () => {
    setLoading(true)
    const url = type === BUSINESS_TYPE ?
      `${URL_ACCOUNT_BUSINESS}api/business/block/${deposit.number}`
      :
      `${URL_ACCOUNT_PERSONAL}api/personal/block/number/${deposit.number}`

    apiSecured.delete(url)
      .then(() => {
        refresh(Math.random())
        setLoading(false)
        handleCloseAlert()
        enqueueSnackbar("Счет заблокирован", { variant: "info" })
      })
      .catch(reason => {
        console.log(reason)
        setLoading(false)
        enqueueSnackbar(`Ошибка ${reason.response.status}, сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  const handleUnblockDeposit = () => {
    setLoading(true)
    const url = type === BUSINESS_TYPE ?
      `${URL_ACCOUNT_BUSINESS}api/business/unblock/${deposit.number}`
      :
      `${URL_ACCOUNT_PERSONAL}api/personal/unblock/number/${deposit.number}`

    apiSecured.post(url)
      .then(() => {
        refresh(Math.random())
        setLoading(false)
        handleCloseAlert()
        enqueueSnackbar("Счет разблокирован", { variant: "info" })
      })
      .catch(reason => {
        console.log(reason)
        setLoading(false)
        enqueueSnackbar(`Ошибка ${reason.response.status}, сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  const handleDeleteDeposit = () => {
    setLoading(true)
    const url = type === BUSINESS_TYPE ?
      `${URL_ACCOUNT_BUSINESS}api/business/${deposit.number}`
      :
      `${URL_ACCOUNT_PERSONAL}api/personal/number/${deposit.number}`

    apiSecured.delete(url)
      .then(() => {
        refresh(Math.random())
        setLoading(false)
        handleCloseAlert()
        enqueueSnackbar("Счет удален", { variant: "info" })
      })
      .catch(reason => {
        console.log(reason)
        setLoading(false)
        enqueueSnackbar(`Ошибка ${reason.response.status}, сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }


  return (
    <div>
      <AlertDialog
        onClose={handleCloseAlert}
        text="Действительно УДАЛИТЬ счет? Все деньги на счету будут утеряны!"
        title="Удаление счета"
        handleAgree={handleDeleteDeposit}
        open={openAlertDelete}
        loading={isLoading}
      />
      <AlertDialog
        onClose={handleCloseAlert}
        text="Действительно заблокировать счет? Все деньги на счету останутся, но счетом пользоваться нельзя будет."
        title="Блокировка счета"
        handleAgree={handleBlockDeposit}
        open={openAlertBlock}
        loading={isLoading}
      />
      <Card>
        <CardHeader title="Информация о счете" />
        <CardContent>
          <Stack justifyContent="flex-start" direction="column" >
            <SimpleDataVisible label="Тип счета" text={typeName} />
            <SimpleDataVisible label="Номер счета" text={fNumberDeposit(number)} />
            {lock && <Typography color="warning">Счет заблокирован</Typography>}
          </Stack>
          <InfoStyle>
            <ButtonGroup size="small">
              <LoadingButton
                onClick={() => lock ? handleUnblockDeposit() : setOpenAlertBlock(true)}
                loading={isLoading}
                variant="outlined"
              >
                {lock ? "Разблокировать" : "Заблокировать"}
              </LoadingButton>
              <Button color="error" onClick={() => setOpenAlertDelete(true)}>
                Удалить счет
              </Button>
            </ButtonGroup>
            <Typography style={{ fontWeight: 600 }}>{`${balance} ${fCurrencyByEnum(currency).label}`}</Typography>
          </InfoStyle>
        </CardContent>
      </Card>
    </div>
  );
}
