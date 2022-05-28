import PropTypes from 'prop-types';
// material
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography, Box
} from '@mui/material';
// utils
//
import {useSnackbar} from "notistack";
import * as Yup from "yup";
import {Form, FormikProvider, useFormik} from "formik";
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {fCurrencyByEnum} from "../../../utils/formatEnum";
import apiSecured, {BASE_URL, URL_TRANSACTION} from "../../../api/ApiSecured";
import SimpleDataVisible from "../../../components/SimpleDataVisible";

// ----------------------------------------------------------------------

DialogConfirm.propTypes = {
  accountInfo: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired
};


function DialogConfirm({ accountInfo, open, setOpen, isSubmitting, handleSend }) {
  return (
    <Dialog open={open}>
      <DialogTitle>
        Подтверждение пополнения счета
      </DialogTitle>
      <DialogContent>
        <Stack justifyContent="flex-start" direction="column">
          <SimpleDataVisible
            label="Зачисление"
            text={`${accountInfo.money} ${fCurrencyByEnum(accountInfo.currency).label}`}
          />
          {accountInfo.moneyFrom != null && (
            <SimpleDataVisible
              label={
                `Зачислится с учетом ${fCurrencyByEnum(accountInfo.currency).label} -> ${fCurrencyByEnum(accountInfo.currencyFrom).label}`
              }
              text={`${accountInfo.moneyFrom} ${fCurrencyByEnum(accountInfo.currencyFrom).label}`}
            />
          )}
          <LoadingButton
            fullWidth
            size="medium"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSend}
          >
            Подтвердить
          </LoadingButton>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setOpen(false)}
        >
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  )
}

TransactionDepositForm.propTypes = {
  number: PropTypes.string.isRequired,
  refresh: PropTypes.func
};

function TransactionDepositForm({ refresh, number }) {
  const [accountInfo, setAccountInfo] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoadSend, setLoadSend] = useState(false)
  const {enqueueSnackbar} = useSnackbar()

  const RegisterSchema = Yup.object().shape({
    money: Yup.number()
      .positive("Число должно быть положительным")
      .required('Обязательно')
  });
  const formik = useFormik({
    initialValues: {
      money: 0.00,
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      const data = {
        fromNumber: number,
        money: values.money,
        currency: "RUB"
      }
      console.log(data)
      return apiSecured.post(
        `${URL_TRANSACTION}api/prepare/info`,
        data
      ).then(res => {
          console.log(res)
          setAccountInfo(res.data)
          setOpenDialog(true)
        },
        reason => {
          console.log(reason)
          if (reason.response.status === 404) {
            enqueueSnackbar("Счет с таким номером не найден", {variant: "error"})
          } else {
            enqueueSnackbar(reason.response.data.message, {variant: "error"})
          }
        })
    }
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

  const handleSend = () => {
    setLoadSend(true)
    const data = {
      accountNumberTo: number,
      money: values.money
    }
    console.log(data)
    return apiSecured.post(
      `${BASE_URL}${URL_TRANSACTION}api/transaction/deposit/tinkoff`,
      data
    ).then(res => {
      console.log(res.data)
      if (res.data.tinkoffPayUrl) {
        window.location.href = res.data.tinkoffPayUrl
      }
      setOpenDialog(false)
      setLoadSend(false)
      enqueueSnackbar("Транзакция зарегистрирована!", {variant: "info"})
      setTimeout(() => {
        refresh(Math.random())
      }, 2000)
    }).catch(reason => {
      console.log(reason)
      enqueueSnackbar(reason, {variant: "error"})
      setOpenDialog(false)
      setLoadSend(false)
    })
  }

  return (
    <FormikProvider value={formik}>
      {accountInfo != null && (
        <DialogConfirm
          accountInfo={accountInfo}
          setOpen={setOpenDialog}
          handleSend={handleSend}
          open={openDialog}
          isSubmitting={isLoadSend}
          info={values}
        />
      )}
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="money"
            type="number"
            label="Количество денег"
            InputProps={{
              startAdornment: <InputAdornment position="start">₽</InputAdornment>,
            }}
            {...getFieldProps('money')}
            error={Boolean(touched.money && errors.money)}
            helperText={touched.money && errors.money}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="outlined"
            loading={isSubmitting}
          >
            Пополнить
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}

TransactionDeposit.propTypes = {
  number: PropTypes.string.isRequired,
  refresh: PropTypes.func,
  refreshState: PropTypes.number
};

export default function TransactionDeposit({ number, refreshState, refresh }) {
  return (
    <Card>
      <CardHeader title="Пополнить" />
      <CardContent>
        <Typography color="text.disabled" variant="body2" gutterBottom>
          Пополнить счет можно только рублями
        </Typography>
        <Box mt={3} >
          <TransactionDepositForm refresh={refresh} number={number} />
        </Box>
      </CardContent>
    </Card>
  );
}
