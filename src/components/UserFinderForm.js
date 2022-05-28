import PropTypes from "prop-types";
import {List, ListItemButton, ListItemText, Stack, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";
import {useState} from "react";
import apiSecured, {URL_INFO_PERSONAL} from "../api/ApiSecured";
import Scrollbar from "./Scrollbar";
import {useAuthState} from "../context";

UserFinderForm.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default function UserFinderForm({ handleClick }) {
  const [users, setUsers] = useState([])
  const {enqueueSnackbar} = useSnackbar();
  const {user} = useAuthState();

  const handleChangeLogin = (e) => {
    const login = e.target.value
    if (login.length < 3)
      return

    apiSecured.get(`${URL_INFO_PERSONAL}api/persons/user/search/username/${login}`)
      .then(res => {
        setUsers(res.data.filter(u => u.userId !== user.id))
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  return (
    <Stack direction="column" spacing={3} justifyContent="center">
      <TextField
        fullWidth
        label="Логин"
        onChange={handleChangeLogin}
      />
      {users.length === 0 && (
        <div>
          <Typography variant="subtitle2" paragraph align="center">
            Не найдено
          </Typography>
          <Typography variant="body2" paragraph color="text.disable" align="center">
            Для поиска необходимо хотя бы 3 символа
          </Typography>
        </div>
      )}
      <Scrollbar>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {users.map((user, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleClick(user)}
            >
              <ListItemText primary={user.name} secondary={user.login} />
            </ListItemButton>
          ))}
        </List>
      </Scrollbar>
    </Stack>
  )
}