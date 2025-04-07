import { Role } from "../data/types"

export {}

declare global {
    interface CustomJwtSessionClaims{
        roles: Role[]
    }
}