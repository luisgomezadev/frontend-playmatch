export interface JwtClaims {
  sub?: string;
  exp?: number;
  iat?: number;
  role?: string;
}
