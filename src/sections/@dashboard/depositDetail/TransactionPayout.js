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
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  Select,
  Accordion,
  AccordionDetails, AccordionSummary
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
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

DialogConfirm.propTypes = {
  accountInfo: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  commission: PropTypes.number.isRequired
};


function DialogConfirm({ accountInfo, info, open, setOpen, isSubmitting, handleSend, commission }) {
  return (
    <Dialog open={open}>
      <DialogTitle>
        Подтверждение вывода средств
      </DialogTitle>
      <DialogContent>
        <Stack justifyContent="flex-start" direction="column">
          <SimpleDataVisible
            label="Номер счета получателя"
            text={info.number}
          />
          <SimpleDataVisible
            label="Название банка"
            text={info.bankName}
          />
          <SimpleDataVisible
            label="Кор. счет"
            text={info.corrAccountNumber}
          />
          <SimpleDataVisible
            label="БИК"
            text={info.bik}
          />
          <SimpleDataVisible
            label="Платеж"
            text={`${accountInfo.money} ${fCurrencyByEnum(accountInfo.currency).label}`}
          />
          {accountInfo.moneyFrom != null ? (
            <div>
              <SimpleDataVisible
                label={
                  `Спишется со счета с учетом ${fCurrencyByEnum(accountInfo.currencyFrom).label} -> ${fCurrencyByEnum(accountInfo.currency).label}`
                }
                text={`${accountInfo.moneyFrom} ${fCurrencyByEnum(accountInfo.currencyFrom).label}`}
              />
              <SimpleDataVisible
                label={
                  `Спишется с учетом комиссии ${commission * 100}%`
                }
                text={`${accountInfo.moneyFrom + accountInfo.moneyFrom * commission} ${fCurrencyByEnum(accountInfo.currencyFrom).label}`}
              />
            </div>
          ) : (
            <SimpleDataVisible
              label={
                `Спишется с учетом комиссии ${commission * 100}%`
              }
              text={`${accountInfo.money + accountInfo.money * commission} ${fCurrencyByEnum(accountInfo.currency).label}`}
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

TransactionPayoutOpenForm.propTypes = {
  number: PropTypes.string.isRequired,
  refresh: PropTypes.func,
  commission: PropTypes.number.isRequired
};

function TransactionPayoutOpenForm({ refresh, number, commission }) {
  const [accountInfo, setAccountInfo] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoadSend, setLoadSend] = useState(false)
  const [isPerson, setPerson] = useState(true)
  const {enqueueSnackbar} = useSnackbar()

  const RegisterSchema = Yup.object().shape({
    number: Yup.string()
      .length(20, 'Номер счета состоит из 20 цифр')
      .required('Номер счета обязателен'),
    money: Yup.number()
      .positive("Число должно быть положительным")
      .required('Обязательно'),
    corrAccountNumber: Yup.string()
      .length(20, 'Корреспондентский счета состоит из 20 цифр')
      .required('Обязательно'),
    bankName: Yup.string()
      .required("Обязательно"),
    bik: Yup.string()
      .length(9, 'БИК состоит из 9 цифр')
      .required("Обязательно")
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      money: 0.00,
      corrAccountNumber: '',
      bankName: '',
      bik: '',
      inn: '',
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
      fromNumber: number,
      money: values.money,
      payoutModel: {
        isPerson,
        inn: isPerson ? '0' : values.inn,
        bik: values.bik,
        bankName: values.bankName,
        corrAccountNumber: values.corrAccountNumber,
        accountNumber: values.number
      }
    }
    console.log(data)
    return apiSecured.post(
      `${BASE_URL}${URL_TRANSACTION}api/transaction/from/account/to/external`,
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
          commission={commission}
          info={values}
        />
      )}
      <Form autoComplete="off" noValidate onSubmit={(e) => {
        console.log("SUBMIT")
        handleSubmit(e)
      }}>
        <Stack spacing={3}>

          <TextField
            select
            label="Тип получателя"
            value={isPerson ? 1 : 2}
            onChange={e => setPerson(e.target.value === 1)}
          >
            <MenuItem key={1} value={1}>
              Физическое лицо
            </MenuItem>
            <MenuItem key={2} value={2}>
              Юридическое лицо
            </MenuItem>
          </TextField>

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

          <InputMask
            mask="99999999999999999999"
            alwaysShowMask
            maskChar='_'
            value={values.corrAccountNumber}
            onChange={(val) => {
              formik.setFieldValue('corrAccountNumber', val.target.value.replaceAll(/[ _]/g, ""));
            }}
          >
            {() => <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label="Корр. счет"
              error={Boolean(touched.corrAccountNumber && errors.corrAccountNumber)}
              helperText={touched.corrAccountNumber && errors.corrAccountNumber}
            />}
          </InputMask>

          <InputMask
            mask="999999999"
            alwaysShowMask
            maskChar='_'
            value={values.bik}
            onChange={(val) => {
              formik.setFieldValue('bik', val.target.value.replaceAll(/[ _]/g, ""));
            }}
          >
            {() => <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label="БИК"
              error={Boolean(touched.bik && errors.bik)}
              helperText={touched.bik && errors.bik}
            />}
          </InputMask>

          <TextField
            fullWidth
            label="Название банка"
            {...getFieldProps('bankName')}
            error={Boolean(touched.bankName && errors.bankName)}
            helperText={touched.bankName && errors.bankName}
          />

          {!isPerson && (
            <TextField
              fullWidth
              label="ИНН"
              {...getFieldProps('inn')}
              error={Boolean(touched.inn && errors.inn)}
              helperText={touched.inn && errors.inn}
            />
          )}

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
            Отправить
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}

TransactionPayout.propTypes = {
  number: PropTypes.string.isRequired,
  refresh: PropTypes.func,
  refreshState: PropTypes.number,
  commission: PropTypes.number
};

export default function TransactionPayout({ number, refreshState, refresh, commission = 0 }) {
  return (
    <Card>
      <CardHeader title="Вывод средств" />
      <CardContent>
        <Typography color="text.disabled" variant="body2" gutterBottom>
          Вывести деньги можно только в рублях
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-outline" />}>
            <Typography>
              Заполнить форму
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TransactionPayoutOpenForm refresh={refresh} number={number}  commission={commission}/>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
