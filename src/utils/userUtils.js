export function isModerator(user) {
  return (user.authorities.findIndex(auth => auth === 'ROLE_MODERATOR') !== -1) || isAdmin(user)
}

export function isAdmin(user) {
  return user.authorities.findIndex(auth => auth === 'ROLE_ADMINISTRATOR') !== -1
}