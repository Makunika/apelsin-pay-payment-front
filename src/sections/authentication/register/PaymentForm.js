import {Stack, TextField, IconButton, InputAdornment, Button} from '@mui/material';
import {useSnackbar} from "notistack";
import "yup-phone";
import PropTypes from "prop-types";

PaymentForm.propTypes = {
  order: PropTypes.object.isRequired
}

export default function PaymentForm({order}) {
  const {enqueueSnackbar} = useSnackbar();

  return (
    <Stack spacing={3}>
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
      >
        Apelsin Pay
      </Button>
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="secondary"
      >
        Tinkoff pay
      </Button>
    </Stack>
  );
}
