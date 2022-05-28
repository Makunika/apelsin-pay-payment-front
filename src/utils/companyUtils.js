export function isOwner(companyUser) {
  return companyUser.roleCompany === 'OWNER'
}

export function isConfirmed(companyUser) {
  if (companyUser == null || companyUser.company == null) {
    return false
  }
  return companyUser.company.status === 'CONFIRMED'
}