import {Box, Button, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import {MotionContainer, varBounceIn} from "../../components/animate";

Section404.propTypes = {
  renderBack: PropTypes.bool,
  renderHome: PropTypes.bool,
}

export default function Section404({renderBack, renderHome}) {

  const navigate = useNavigate();

  return (
    <MotionContainer initial="initial" open>
      <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
        <motion.div variants={varBounceIn}>
          <Typography variant="h3" paragraph>
            Страница не найдена!
          </Typography>
        </motion.div>
        <Typography sx={{ color: 'text.secondary' }}>
          Извините, мы не смогли найти страницу, которую вы ищете. Возможно, вы ошиблись URL-адресом?
          Проверьте URL-адрес
        </Typography>

        <motion.div variants={varBounceIn}>
          <Box
            component="img"
            src="/static/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />
        </motion.div>

        <Stack
          justifyContent="space-around"
          direction="row"
          spacing={1}
        >
          {renderHome && (
            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Домой
            </Button>
          )}
          {renderBack && (
            <Button size="large" variant="contained" onClick={() => navigate(-1)}>
            Назад
            </Button>
          )}
        </Stack>
      </Box>
    </MotionContainer>
  )
}