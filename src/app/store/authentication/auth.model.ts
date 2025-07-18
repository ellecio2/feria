export class User {
  id?: string
  email?: string
  role?: 'admin' | 'dealer' | 'cliente' | 'aseguradora' | 'financiera' | 'tasador' | 'gps'
  firstName?: string
  lastName?: string
  phone?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  fullName?: string
  token?: string
  // Compatibilidad con el template original
  username?: string
  password?: string
  name?: string
}
