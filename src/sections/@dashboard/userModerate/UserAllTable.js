import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {TableCell, TableRow} from "@mui/material";
import apiSecured, {URL_INFO_PERSONAL} from "../../../api/ApiSecured";
import {fDate} from "../../../utils/formatTime";
import Label from "../../../components/Label";
import MoreMenu from "../../../components/MoreMenu";
import TableWithoutPageable from "../../../components/TableWithoutPageable";
import {fStatusConfirmed, getColorByStatus} from "../../../utils/formatEnum";

const TABLE_HEAD = [
  { id: 'firstName', label: 'Имя', alignRight: false },
  { id: 'lastName', label: 'Фамилия', alignRight: false },
  { id: 'login', label: 'Логин', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'birthday', label: 'Дата рождения', alignRight: false },
  { id: 'phone', label: 'Номер телефона', alignRight: false },
  { id: 'lock', label: 'Статус', alignRight: false },
  { id: 'status', label: 'Статус подтверждения', alignRight: false },
  { id: '' }
];

export default function UserAllTable() {
  const [resfresh, setRefresh] = useState(1)
  const [users, setUsers] = useState([])
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    loadNewPage(0)
  }, [resfresh])

  const loadNewPage = (pageNumber) => {
    apiSecured.get(`${URL_INFO_PERSONAL}api/persons/all/nopage`)
      .then(res => {
        console.log(res.data)
        setUsers(res.data)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  const handleBan = (profile) => {
    apiSecured.post(`${URL_INFO_PERSONAL}api/persons/ban/${profile.id}`)
      .then(() => {
        enqueueSnackbar(`${profile.lastName} заблокирован`, {variant: "success"})
        setRefresh(Math.random())
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }


  const handleUnban = (profile) => {
    apiSecured.post(`${URL_INFO_PERSONAL}api/persons/unban/${profile.id}`)
      .then(() => {
        enqueueSnackbar(`${profile.lastName} разблокирован`, {variant: "success"})
        setRefresh(Math.random())
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  const getRow = (profile) => {
    const { id, userId, lock, firstName, lastName, email, phone, login, status, birthday } = profile

    return (
      <TableRow
        hover
        key={id}
        tabIndex={-1}
      >
        <TableCell align="left">{firstName}</TableCell>
        <TableCell align="left">{lastName}</TableCell>
        <TableCell align="left">{login}</TableCell>
        <TableCell align="left">{email}</TableCell>
        <TableCell align="left">{fDate(birthday)}</TableCell>
        <TableCell align="left">{phone}</TableCell>
        <TableCell align="left">
          <Label
            variant="ghost"
            color={(lock && 'error') || 'success'}
          >
            {lock ? 'Заблокирован' : 'Не заблокирован'}
          </Label>
        </TableCell>
        <TableCell align="left">
          <Label
            variant="ghost"
            color={getColorByStatus(status)}
          >
            {fStatusConfirmed(status)}
          </Label>
        </TableCell>
        <TableCell align="right">
          <MoreMenu items={[
            {
              icon: "eva:person-delete-outline",
              title: "Заблокировать",
              onClick: () => handleBan(profile)
            },
            {
              icon: "eva:person-done-outline",
              title: "Разблокировать",
              onClick: () => handleUnban(profile)
            }
          ]} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableWithoutPageable items={users} tableHead={TABLE_HEAD} getRow={getRow} />
  );  
}