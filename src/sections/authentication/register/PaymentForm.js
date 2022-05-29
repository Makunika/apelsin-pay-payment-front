import {Stack, Button} from '@mui/material';
import {useSnackbar} from "notistack";
import "yup-phone";
import PropTypes from "prop-types";
import axios from "axios";
import {BASE_URL, URL_PAYMENTS} from "../../../api/ApiSecured";
import {errorHandler} from "../../../utils/errorUtils";

PaymentForm.propTypes = {
  order: PropTypes.object.isRequired
}

export default function PaymentForm({order}) {
  const {enqueueSnackbar} = useSnackbar();
  const isNew = order.orderStatus === 'CREATED'
  const isTinkoff = order.orderType === 'TINKOFF'

  const handleCreateTinkoff = () => {
    const data = {
      orderId: order.id
    }
    axios.post(`${BASE_URL}${URL_PAYMENTS}public/pay/tinkoff`, data)
      .then(res => {
        console.log(res.data)
        window.location.href = res.data.url
      })
      .catch(reason => {
        errorHandler(enqueueSnackbar, reason)
      })
  };

  if (isNew) {
    return (
      <Stack spacing={3}>
        <Button
          fullWidth
          size="large"
          variant="contained"
        >
          Apelsin Pay
        </Button>
        <Button
          fullWidth
          size="large"
          onClick={handleCreateTinkoff}
          variant="contained"
          color="secondary"
        >
          Tinkoff Pay
        </Button>
      </Stack>
    )
  }

  if (isTinkoff) {
    return (
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="secondary"
        onClick={() => window.location.href = order.payTinkoffUrl}
      >
        Продолжить оплату через Tinkoff Pay
      </Button>
    )
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
    >
      Продолжить оплату через Apelsin Pay
    </Button>
  )
}
