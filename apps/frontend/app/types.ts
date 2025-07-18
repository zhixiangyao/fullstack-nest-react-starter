import type { Blog as _Blog, Role as _Role, User as _User } from 'database'

export interface Blog extends _Blog {
  authorName: string
}

interface Role extends _Role {
  users: Omit<User, 'roles'>[]
}

export interface User extends Omit<_User, 'hashedPassword'> {
  roles: Omit<Role, 'users'>[]
  blogsTotal: number
}
