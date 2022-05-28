import PropTypes from "prop-types";
import {Box, Button, Divider, Stack, Typography} from "@mui/material";
import Label from "./Label";

SimpleDataVisible.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  withDivider: PropTypes.bool,
  mb: PropTypes.number,
  colorTitle: PropTypes.oneOf(
    ["text.disable", "text.error"]
  ),
  withButton: PropTypes.bool,
  onClick: PropTypes.func,
  titleButton: PropTypes.any,
  isLabel: PropTypes.bool,
  colorLabel: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error'
  ]),
}

export default function SimpleDataVisible({
                                            label,
                                            text,
                                            withDivider = true,
                                            mb = 1,
                                            colorTitle = 'text.disable',
                                            withButton = false,
                                            onClick,
                                            titleButton,
                                            isLabel = false,
                                            colorLabel
}) {
  return (
    <Box mb={mb} >
      <Stack direction="column" >
        <Typography variant="caption" color={colorTitle}>{label}</Typography>

        {isLabel ? (
          <Label color={colorLabel} sx={{ maxWidth: "200px"}}>
            {text}
          </Label>
        ) : (
          <Typography variant="body1">
            {text}
          </Typography>
        )}

        {withButton && (
          <Button color="secondary"
                  onClick={onClick}
          >
            {titleButton}
          </Button>
        )}
        {withDivider && (
          <Divider />
        )}
      </Stack>
    </Box>
  )
}