import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import PropTypes from "prop-types";
import {LoadingButton} from "@mui/lab";

AlertDialog.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  handleAgree: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default function AlertDialog({title, text, handleAgree, open, onClose, loading }) {
  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose} autoFocus>
          Отменить
        </Button>
        <LoadingButton loading={loading} onClick={handleAgree} variant="contained">
          Подтвердить
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}