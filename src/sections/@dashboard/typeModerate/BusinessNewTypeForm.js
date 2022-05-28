import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import apiSecured, {URL_ACCOUNT_BUSINESS, URL_INFO_BUSINESS, URL_TRANSACTION} from "../../../api/ApiSecured";
import {currencies, fCurrencyByEnum} from "../../../utils/formatEnum";
import SimpleDataVisible from "../../../components/SimpleDataVisible";
import {errorHandler} from "../../../utils/errorUtils";

export default function BusinessNewTypeForm({refresh}) {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const CompanySchema = Yup.object().shape({
    description: Yup.string()
      .max(100, 'Не больше 100 символов')
      .required('Описание обязательно'),
    name: Yup.string()
      .max(20, 'Не больше 20 символов')
      .required('Название обязательно'),
    maxSumForTransfer: Yup.number()
      .nullable(true)
      .min(100)
      .notRequired(),
    commissionRateWithdraw: Yup.number()
      .nullable(true)
      .max(90)
      .min(1)
      .notRequired(),
    currency: Yup.object()
      .required("Обязательно")
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      currency: currencies[2],
      maxSumForTransfer: null,
      commissionRateWithdraw: null,
    },
    validationSchema: CompanySchema,
    onSubmit: (values) => {
      console.log(values)
      const data = {
        name: values.name,
        description: values.description,
        currency: values.currency.value,
        maxSumForTransfer: values.maxSumForTransfer == null || values.maxSumForTransfer === '' ? null : values.maxSumForTransfer,
        commissionRateWithdraw: values.commissionRateWithdraw == null || values.commissionRateWithdraw === '' ? null : values.commissionRateWithdraw / 100,
      }
      console.log(data)
      return apiSecured.post(
        `${URL_ACCOUNT_BUSINESS}api/business/type`,
        data
      ).then(res => {
          console.log(res)
          enqueueSnackbar('Тип счета успешно создан', { variant: "success" })
          refresh(Math.random())
        },
        reason => {
          errorHandler(enqueueSnackbar, reason)
        })
    }
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} minWidth="md">
          <TextField
            fullWidth
            required
            label="Название"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />

          <TextField
            required
            fullWidth
            label="Описание"
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />

          <TextField
            select
            required
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

          <TextField
            fullWidth
            type="number"
            label="Максимальная сумма для вывода средств за раз"
            InputProps={{
              startAdornment: <InputAdornment position="start">{values.currency.label}</InputAdornment>,
            }}
            {...getFieldProps('maxSumForTransfer')}
            error={Boolean(touched.maxSumForTransfer && errors.maxSumForTransfer)}
            helperText={touched.maxSumForTransfer && errors.maxSumForTransfer}
          />

          <TextField
            fullWidth
            type="number"
            label="Комиссия за вывод средств от суммы вывода"
            InputProps={{
              startAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            {...getFieldProps('commissionRateWithdraw')}
            error={Boolean(touched.commissionRateWithdraw && errors.commissionRateWithdraw)}
            helperText={touched.commissionRateWithdraw && errors.commissionRateWithdraw}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Сохранить
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
