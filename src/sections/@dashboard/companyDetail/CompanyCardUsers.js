import PropTypes from 'prop-types';
// material
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack
} from '@mui/material';
// utils
//
import {LoadingButton} from "@mui/lab";
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import SimpleDataVisible from "../../../components/SimpleDataVisible";
import apiSecured, {URL_INFO_BUSINESS, URL_INFO_PERSONAL} from "../../../api/ApiSecured";
import {fRoleCompany} from "../../../utils/formatEnum";
import Iconify from "../../../components/Iconify";
import {useAuthState} from "../../../context";
import UserFinderForm from "../../../components/UserFinderForm";
import {isOwner} from "../../../utils/companyUtils";

CompanyCardUsers.propTypes = {
  companyUser: PropTypes.object.isRequired,
  refresh: PropTypes.func,
  refreshState: PropTypes.number
};

export default function CompanyCardUsers({ companyUser, refresh, refreshState }) {
  const [isLoading, setLoading] = useState(false)
  const [refreshUsers, setRefreshUsers] = useState(1)
  const [isShowing, setShowing] = useState(false)
  const [users, setUsers] = useState([])
  const {enqueueSnackbar} = useSnackbar();
  const {user} = useAuthState();

  useEffect(() => {
    apiSecured.get(`${URL_INFO_BUSINESS}company/${companyUser.company.id}/users`)
      .then(res => res.data)
      .then(async users => {
        try {
          const data = await Promise.all(users.map(async (u) => ({
              ...u,
              personal: (await apiSecured.get(`${URL_INFO_PERSONAL}api/persons/user/${u.userId}/simple`)).data
            })));
          setUsers(data)
        } catch (e) {
          console.log("catch")
        }
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }, [refreshState, refreshUsers])


  const handlePickUser = (user) => {
    setShowing(false)
    setLoading(true)
    const data = {
      companyId: companyUser.company.id,
      userId: user.userId,
      roleCompany: 'MODERATOR'
    }
    apiSecured.post(`${URL_INFO_BUSINESS}company/user`, data)
      .then(() => {
        setLoading(false)
        setRefreshUsers(Math.random())
        enqueueSnackbar(`Пользователь ${user.login} добавлен к компании`, { variant: "success" })
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  const handleDeleteUser = (user) => {
    setLoading(true)
    console.log(user)
    const body = {
      companyId: companyUser.company.id,
      userId: user.userId,
    }
    apiSecured.delete(`${URL_INFO_BUSINESS}company/user`, { data: body })
      .then(() => {
        setLoading(false)
        setRefreshUsers(Math.random())
        enqueueSnackbar(`Пользователь ${user.personal.login} удален из компании`, { variant: "success" })
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }

  return (
    <div>
      <Dialog
        open={isShowing}
        onClose={() => setShowing(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Выберите пользователя
        </DialogTitle>
        <DialogContent>
          <Box mt={2} >
            <UserFinderForm handleClick={handlePickUser} />
          </Box>
        </DialogContent>
      </Dialog>
      <Card >
        <CardHeader title="Доступ к компании" />
        <CardContent>
          <Stack direction="column" justifyContent="flex-start" spacing={2}>
            {users.map((cu, index) => (
              <Stack key={index} direction="row" justifyContent="space-between">
                <SimpleDataVisible
                  label={fRoleCompany(cu.roleCompany)}
                  text={`${cu.personal.name} | ${cu.personal.login}`}
                  withDivider={false}
                />
                {cu.userId !== user.id && isOwner(companyUser) && (
                  <IconButton
                    onClick={() => handleDeleteUser(cu)}
                    color="secondary"
                  >
                    <Iconify icon="eva:close-outline" />
                  </IconButton>
                )}
              </Stack>
            ))}
            {isOwner(companyUser) && (
              <LoadingButton
                onClick={() => setShowing(true)}
                loading={isLoading}
              >
                Добавить пользователя
              </LoadingButton>
            )}
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
}
