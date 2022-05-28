import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {Card, Container, Stack, TableCell, TableRow, Typography} from "@mui/material";
import apiSecured, {URL_INFO_PERSONAL} from "../../../api/ApiSecured";
import {fDate} from "../../../utils/formatTime";
import Label from "../../../components/Label";
import MoreMenu from "../../../components/MoreMenu";
import Page from "../../../components/Page";
import TableWithoutPageable from "../../../components/TableWithoutPageable";

const TABLE_HEAD = [
  { id: 'firstName', label: 'Имя', alignRight: false },
  { id: 'lastName', label: 'Фамилия', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'passportSeries', label: 'Серия паспорта', alignRight: false },
  { id: 'passportNumber', label: 'Номер паспорта', alignRight: false },
  { id: 'birthday', label: 'Дата рождения', alignRight: false },
  { id: 'phone', label: 'Номер телефона', alignRight: false },
  { id: 'status', label: 'Статус', alignRight: false },
  { id: '' }
];

export default function UserConfirmedTable() {
  const [resfresh, setRefresh] = useState(1)
  const [users, setUsers] = useState([])
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    loadNewPage(0)
  }, [resfresh])

  const loadNewPage = (pageNumber) => {
    apiSecured.get(`${URL_INFO_PERSONAL}api/persons/onconf`)
      .then(res => {
        console.log(res.data)
        setUsers(res.data)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  const handleConfirm = (profile) => {
    apiSecured.post(`${URL_INFO_PERSONAL}api/persons/conf/accept/${profile.id}`)
      .then(() => {
        enqueueSnackbar(`${profile.lastName} подтвержден`, {variant: "success"})
        setRefresh(Math.random())
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }


  const handleFailedConfirm = (profile) => {
    apiSecured.post(`${URL_INFO_PERSONAL}api/persons/conf/fail/${profile.id}`)
      .then(() => {
        enqueueSnackbar(`${profile.lastName} не подтвержден и отправлен на доработку`, {variant: "success"})
        setRefresh(Math.random())
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  const getRow = (profile) => {
    const { id, userId, lock, firstName, lastName, email, phone, birthday, passportSeries,
      passportNumber } = profile

    return (
      <TableRow
        hover
        key={id}
        tabIndex={-1}
      >
        <TableCell align="left">{firstName}</TableCell>
        <TableCell align="left">{lastName}</TableCell>
        <TableCell align="left">{email}</TableCell>
        <TableCell align="left">{passportSeries}</TableCell>
        <TableCell align="left">{passportNumber}</TableCell>
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
        <TableCell align="right">
          <MoreMenu items={[
            {
              icon: "eva:checkmark-circle-2-outline",
              title: "Подтвердить",
              onClick: () => handleConfirm(profile)
            },
            {
              icon: "eva:close-circle-outline",
              title: "Не подтвердить",
              onClick: () => handleFailedConfirm(profile)
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