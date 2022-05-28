
export function errorHandler(snack, reason) {
  console.log(reason)
  if (reason == null) {
    snack(`Что то пошло не так 😢`, {variant: "error"})
  }
  if (reason.response == null) {
    snack(`Ошибка ${reason}`, {variant: "error"})
    return
  }
  let msg = reason.response.data.message
  if (reason.response.data.violations != null) {
    reason.response.data.violations.forEach(v => {
      msg += ` (field: ${v.fieldName}, message: ${v.message})`
    })
  }
  snack(`Ошибка ${reason.response.status}${msg == null ? '' : `, сообщение: ${msg}`}`, {variant: "error"})
}