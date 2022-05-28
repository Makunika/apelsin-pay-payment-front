import PropTypes from 'prop-types';
// material
import {
  Card,
  Grid,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  InputAdornment,
  MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Divider
} from '@mui/material';
// utils
//
import {useSnackbar} from "notistack";
import * as Yup from "yup";
import {Form, FormikProvider, useFormik} from "formik";
import {LoadingButton} from "@mui/lab";
import InputMask from "react-input-mask";
import {useState} from "react";
import {currencies, fCurrencyByEnum} from "../../../utils/formatEnum";
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
        Подтверждение перевода
      </DialogTitle>
      <DialogContent>
        <Stack justifyContent="flex-start" direction="column">
          <SimpleDataVisible
            label="Кому"
            text={accountInfo.nameTo}
          />
          <SimpleDataVisible
            label="Платеж"
            text={`${accountInfo.money} ${fCurrencyByEnum(accountInfo.currency).label}`}
          />
          {accountInfo.moneyFrom != null && (
            <SimpleDataVisible
              label={
              `Спишется со счета с учетом ${fCurrencyByEnum(accountInfo.currencyFrom).label} -> ${fCurrencyByEnum(accountInfo.currency).label}`
              }
              text={`${accountInfo.moneyFrom} ${fCurrencyByEnum(accountInfo.currencyFrom).label}`}
            />
          )}
          {accountInfo.moneyTo != null && (
            <SimpleDataVisible
              label={
                `Зачислится со счета с учетом ${fCurrencyByEnum(accountInfo.currency).label} -> ${fCurrencyByEnum(accountInfo.currencyTo).label}`
              }
              text={`${accountInfo.moneyTo} ${fCurrencyByEnum(accountInfo.currencyTo).label}`}
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

TransactionOpenForm.propTypes = {
  number: PropTypes.string.isRequired,
  refresh: PropTypes.func
};

function TransactionOpenForm({ refresh, number }) {
  const [accountInfo, setAccountInfo] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoadSend, setLoadSend] = useState(false)
  const {enqueueSnackbar} = useSnackbar()

  const RegisterSchema = Yup.object().shape({
    number: Yup.string()
      .length(20, 'Номер счета состоит из 20 символов')
      .required('Номер счета обязателен'),
    money: Yup.number()
      .positive("Число должно быть положительным")
      .required('Обязательно'),
    currency: Yup.object()
      .required("Обязательно")
  });

  const formik = useFormik({
    initialValues: {
      number: '',
      money: 0.00,
      currency: currencies[2]
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      const data = {
        toNumber: values.number,
        fromNumber: number,
        money: values.money,
        currency: values.currency.value
      }
      return apiSecured.post(
        `${BASE_URL}${URL_TRANSACTION}api/prepare/info`,
        data
      ).then(res => {
        console.log(res)
        if (res.data.nameTo == null) {
          enqueueSnackbar("Счет получателя с таким номером не найден", {variant: "warning"})
          return
        }
        setAccountInfo(res.data)
        setOpenDialog(true)
      },
      reason => {
        console.log(reason)
        if (reason.response.status === 404) {
          enqueueSnackbar("Счет с таким номером не найден", {variant: "warning"})
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
      fromNumber: number,
      toNumber: values.number,
      money: values.money,
      currency: values.currency.value
    }
    console.log(data)
    return apiSecured.post(
      `${BASE_URL}${URL_TRANSACTION}api/transaction/from/account/to/account`,
      data
    ).then(res => {
      console.log(res.data)
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
        />
      )}
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <InputMask
            mask="99999 99999 99999 99999"
            alwaysShowMask
            maskChar='_'
            permanents={[5, 10, 15]}
            value={values.number}
            onChange={(val) => {
              formik.setFieldValue('number', val.target.value.replaceAll(/[ _]/g, ""));
            }}
          >
            {() => <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label="Номер счета"
              error={Boolean(touched.number && errors.number)}
              helperText={touched.number && errors.number}
            />}
          </InputMask>

          <TextField
            fullWidth
            autoComplete="money"
            type="number"
            label="Количество денег"
            InputProps={{
              startAdornment: <InputAdornment position="start">{values.currency.label}</InputAdornment>,
            }}
            {...getFieldProps('money')}
            error={Boolean(touched.money && errors.money)}
            helperText={touched.money && errors.money}
          />

          <TextField
            select
            label="Валюта"
            {...getFieldProps('currency')}
            error={Boolean(touched.currency && errors.currency)}
            helperText={touched.currency && errors.currency}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option}>
                {option.valueStr}
              </MenuItem>
            ))}
          </TextField>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Отправить
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}

//                         startAdornment={<InputAdornment position="start">{values.currency.label}</InputAdornment>}

TransactionOpen.propTypes = {
  number: PropTypes.string.isRequired,
  refresh: PropTypes.func,
  refreshState: PropTypes.number
};

export default function TransactionOpen({ number, refreshState, refresh }) {
  return (
    <Card>
      <CardHeader title="Перевести деньги" />
      <CardContent>
        <TransactionOpenForm refresh={refresh} number={number} />
      </CardContent>
    </Card>
  );
}
