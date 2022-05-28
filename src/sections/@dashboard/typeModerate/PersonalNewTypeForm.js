import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel,
  InputAdornment,
  MenuItem,
  Stack,
  TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import apiSecured, {
  URL_ACCOUNT_BUSINESS,
  URL_ACCOUNT_PERSONAL,
  URL_INFO_BUSINESS,
  URL_TRANSACTION
} from "../../../api/ApiSecured";
import {currencies, fCurrencyByEnum} from "../../../utils/formatEnum";
import SimpleDataVisible from "../../../components/SimpleDataVisible";
import {errorHandler} from "../../../utils/errorUtils";

export default function PersonalNewTypeForm({refresh}) {
  const {enqueueSnackbar} = useSnackbar();

  const CompanySchema = Yup.object().shape({
    description: Yup.string()
      .max(100, 'Не больше 100 символов')
      .required('Описание обязательно'),
    name: Yup.string()
      .max(20, 'Не больше 20 символов')
      .required('Название обязательно'),
    maxSum: Yup.number()
      .required("Обязательно")
      .min(1000, "Минимально 1000"),
    maxSumForPay: Yup.number()
      .required("Обязательно")
      .min(1, "Минимально 1"),
    minSumToStartWork: Yup.number()
      .nullable(true)
      .min(1,"Минимально 1")
      .notRequired(),
    typeRequiredConfirmed: Yup.bool()
      .required("Обязательно"),
    currency: Yup.object()
      .required("Обязательно")
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      currency: currencies[2],
      maxSum: 0.0,
      maxSumForPay: 0.0,
      minSumToStartWork: null,
      typeRequiredConfirmed: false,
    },
    validationSchema: CompanySchema,
    onSubmit: (values) => {
      console.log(values)
      const data = {
        name: values.name,
        description: values.description,
        currency: values.currency.value,
        maxSum: values.maxSum == null || values.maxSum === '' ? null : values.maxSum,
        maxSumForPay: values.maxSumForPay == null || values.maxSumForPay === '' ? null : values.maxSumForPay,
        minSumToStartWork: values.minSumToStartWork == null || values.minSumToStartWork === '' ? null : values.minSumToStartWork,
        typeRequiredConfirmed: values.typeRequiredConfirmed
      }
      console.log(data)
      return apiSecured.post(
        `${URL_ACCOUNT_PERSONAL}api/type`,
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
        <Stack spacing={3} minWidth="md" alignItems="flex-start">
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
            fullWidth
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
            label="Максимальная сумма на счете"
            InputProps={{
              startAdornment: <InputAdornment position="start">{values.currency.label}</InputAdornment>,
            }}
            {...getFieldProps('maxSum')}
            error={Boolean(touched.maxSum && errors.maxSum)}
            helperText={touched.maxSum && errors.maxSum}
          />

          <TextField
            fullWidth
            type="number"
            label="Максимальная сумма для перевода"
            InputProps={{
              startAdornment: <InputAdornment position="start">{values.currency.label}</InputAdornment>,
            }}
            {...getFieldProps('maxSumForPay')}
            error={Boolean(touched.maxSumForPay && errors.maxSumForPay)}
            helperText={touched.maxSumForPay && errors.maxSumForPay}
          />

          <TextField
            fullWidth
            type="number"
            label="Минимальная сумма для активации счета"
            InputProps={{
              startAdornment: <InputAdornment position="start">{values.currency.label}</InputAdornment>,
            }}
            {...getFieldProps('minSumToStartWork')}
            error={Boolean(touched.minSumToStartWork && errors.minSumToStartWork)}
            helperText={touched.minSumToStartWork && errors.minSumToStartWork}
          />

          <FormControlLabel
            control={
            <Checkbox
              checked={values.typeRequiredConfirmed}
              onChange={() => formik.setFieldValue('typeRequiredConfirmed', !values.typeRequiredConfirmed)}
            />
          }
            label="Необходимость подтверждения профиля"
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
