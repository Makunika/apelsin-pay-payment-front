
export function errorHandler(snack, reason) {
  console.log(reason)
  if (!reason || !reason.response || !reason.response.data) {
    snack(`Что то пошло не так 😢`, {variant: "error"})
  }
  let msg = reason.response.data.message || reason.response.data
  if (reason.response.data.violations) {
    reason.response.data.violations.forEach(v => {
      msg += ` (field: ${v.fieldName}, message: ${v.message})`
    })
  }
  snack(`Ошибка ${reason.response.status}${msg == null ? '' : `, сообщение: ${msg}`}`, {variant: "error"})
}