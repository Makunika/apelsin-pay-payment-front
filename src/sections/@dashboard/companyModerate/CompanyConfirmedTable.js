import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {Card, Container, Stack, TableCell, TableRow, Typography} from "@mui/material";
import apiSecured, {URL_INFO_BUSINESS, URL_INFO_PERSONAL} from "../../../api/ApiSecured";
import {fDate} from "../../../utils/formatTime";
import Label from "../../../components/Label";
import MoreMenu from "../../../components/MoreMenu";
import Page from "../../../components/Page";
import TableWithoutPageable from "../../../components/TableWithoutPageable";

const TABLE_HEAD = [
  { id: 'name', label: 'Имя', alignRight: false },
  { id: 'inn', label: 'Фамилия', alignRight: false },
  { id: 'address', label: 'Email', alignRight: false },
  { id: '' }
];

export default function CompanyConfirmedTable() {
  const [resfresh, setRefresh] = useState(1)
  const [companies, setCompanies] = useState([])
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    loadNewPage(0)
  }, [resfresh])

  const loadNewPage = (pageNumber) => {
    apiSecured.get(`${URL_INFO_BUSINESS}/company/on-conf`)
      .then(res => {
        console.log(res.data)
        setCompanies(res.data)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  const handleConfirm = (company) => {
    apiSecured.post(`${URL_INFO_BUSINESS}company/moderate/confirm/accept/${company.id}`)
      .then(() => {
        enqueueSnackbar(`${company.name} подтверждена`, {variant: "success"})
        setRefresh(Math.random())
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }


  const handleFailedConfirm = (company) => {
    const data = {
      reason: "Reason"
    }
    apiSecured.post(`${URL_INFO_BUSINESS}company/moderate/confirm/failed/${company.id}`, data)
      .then(() => {
        enqueueSnackbar(`${company.name} не подтверждена и отправлена на доработку`, {variant: "success"})
        setRefresh(Math.random())
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  const getRow = (company) => {
    const { id, name, inn, address } = company

    return (
      <TableRow
        hover
        key={id}
        tabIndex={-1}
      >
        <TableCell align="left">{name}</TableCell>
        <TableCell align="left">{inn}</TableCell>
        <TableCell align="left">{address}</TableCell>
        <TableCell align="right">
          <MoreMenu items={[
            {
              icon: "eva:checkmark-circle-2-outline",
              title: "Подтвердить",
              onClick: () => handleConfirm(company)
            },
            {
              icon: "eva:close-circle-outline",
              title: "Не подтвердить",
              onClick: () => handleFailedConfirm(company)
            }
          ]} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableWithoutPageable items={companies} tableHead={TABLE_HEAD} getRow={getRow} />
  );  
}