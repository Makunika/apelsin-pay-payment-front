import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Stack, TextField} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import apiSecured, {URL_INFO_BUSINESS} from "../../../api/ApiSecured";

CompanyForm.propTypes = {
  initCompany: PropTypes.shape({
    name: PropTypes.string.isRequired,
    inn: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }),
  isSave: PropTypes.bool,
  id: PropTypes.number
}

export default function CompanyForm({ initCompany, isSave, id }) {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const handleSave = (values) => apiSecured.post(
    `${URL_INFO_BUSINESS}company`,
    values
  ).then(res => {
      console.log(res)
      enqueueSnackbar("Компания была создана, ожидайте подтверждения компании", {variant: "success"})
      navigate(`/dashboard/company?${res.data.id}`)
    },
    reason => {
      console.log(reason)
      enqueueSnackbar(`Ошибка ${reason.response.statusText}`, {variant: "error"})
    })

  const handleUpdate = (values, id) => {
    const data = {
      ...values,
      id
    }
    console.log(data)
    return apiSecured.put(
      `${URL_INFO_BUSINESS}company`,
      data
    ).then(res => {
        console.log(res)
        enqueueSnackbar("Данные изменены, ожидайте подтверждения компании", {variant: "success"})
        window.location.reload();
      },
      reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка ${reason.response.statusText}`, {variant: "error"})
      })
  }

  const CompanySchema = Yup.object().shape({
    name: Yup.string()
      .required('Название обязательно'),
    inn: Yup.string()
      .matches(/\d+/g, "Только цифры")
      .required('ИНН обязателен'),
    address: Yup.string()
      .required('Адрес обязателен')
  });

  const formik = useFormik({
    initialValues: {
      name: initCompany == null ? '' : initCompany.name,
      inn: initCompany == null ? '' : initCompany.inn,
      address: initCompany == null ? '' : initCompany.address,
    },
    validationSchema: CompanySchema,
    onSubmit: (values) => {
      console.log(values)
      console.log(JSON.stringify(values))
      return isSave ? handleSave(values) : handleUpdate(values, id)
    }
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} minWidth="md">
          <TextField
            fullWidth
            label="Название"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />

          <TextField
            fullWidth
            label="ИНН"
            {...getFieldProps('inn')}
            error={Boolean(touched.inn && errors.inn)}
            helperText={touched.inn && errors.inn}
          />

          <TextField
            fullWidth
            label="Адрес"
            {...getFieldProps('address')}
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
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
