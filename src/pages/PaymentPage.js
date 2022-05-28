import { styled } from '@mui/material/styles';
import {Box, Card, Link, Container, Typography, CircularProgress} from '@mui/material';
// layouts
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
// components
import {useSnackbar} from "notistack";
import Page from '../components/Page';
import PaymentForm from "../sections/authentication/register/PaymentForm";
import axios from "axios";
import {BASE_URL, URL_PAYMENTS} from "../api/ApiSecured";
import {errorHandler} from "../utils/errorUtils";
import {fCurrencyByEnum} from "../utils/formatEnum";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function PaymentPage() {
  const {search} = useLocation();
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState({})
  const {enqueueSnackbar} = useSnackbar();

  const params = new URLSearchParams(search);
  const id = params.get('id');

  if (id == null) {
    return (
      <RootStyle title="Оплатить | Apelsin pay">
        <Container>
          <ContentStyle>
            <Typography color="error" variant="h4" align="center">
              Нет обязательного параметра "ID заказа"
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    axios.get(`${BASE_URL}${URL_PAYMENTS}public/order/${id}`)
      .then(res => {
        console.log(res)
        setOrder(res.data)
        setLoading(false)
      })
      .catch(reason => {
        errorHandler(enqueueSnackbar, reason)
      })
  }, [search])

  if (loading) {
    return (
      <RootStyle title="Оплатить | Apelsin pay">
        <Container>
          <ContentStyle>
            <CircularProgress />
          </ContentStyle>
        </Container>
      </RootStyle>
    )
  }

  return (
    <RootStyle title="Оплатить | Apelsin pay">
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {order.fullName} | Заказ номер {order.id}
            </Typography>
            <Typography variant="h4" gutterBottom>
              {order.amount} {fCurrencyByEnum(order.currency).label}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {order.shortName}
            </Typography>
          </Box>

          <PaymentForm order={order} />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            Оплачивая, я соглашаюсь с Апельсин.&nbsp;
            <Link underline="always" color="textPrimary">
              Условия сервиса
            </Link>
            &nbsp;и&nbsp;
            <Link underline="always" color="textPrimary">
              Политика конфиденциальности
            </Link>
            .
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}