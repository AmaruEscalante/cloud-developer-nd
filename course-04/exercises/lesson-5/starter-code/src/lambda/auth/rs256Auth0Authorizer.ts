
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify } from 'jsonwebtoken'
import 'source-map-support/register'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJfH+/61A/S2bxMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi0xbGE4eDM2NS51cy5hdXRoMC5jb20wHhcNMjEwOTIxMTczMjM0WhcN
MzUwNTMxMTczMjM0WjAkMSIwIAYDVQQDExlkZXYtMWxhOHgzNjUudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApPy1sKYhVqrbyglH
XYPm9tttfc23qJh16eVNFszz1YEo6UAiOXPxOVAt1xc0S6N1HE4DUiRkQUf5OBur
wRc4T9Hm/63GJK2301IApnmq20ZsQMEqwC7ANoWZpx+96F2J/WRN1pJgei7LcYE+
VWUDeZg0vtDQSlhtUFYcG3ywa4WULc5X4GqyOpU6KR0zJOMUycdrRzAiISK5T0+k
4a0ykhQb5rrSs6brL1+b4T8QWmET4tdTuYojagU/+1+78HwS57kN3V2FU+VIq6pi
ft35jMIS32HWGfFk/ix12baBE3jWca7NloIw+cdX31g9itB04+qDGzEoKkKK8Wf7
qM7AQwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSXm+SZFefY
Tc4MbyGtiT0SIdAXPTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AGJIJpTxwuTdgo83OwOe+hAvaEMXnt5ZVFUYi/rMZBPltCwDuqXGUP8fSrD1F/ys
ueVigr/2WzeM3dl6rkMMnL/24fchfoweHwyfUowF1Qz6jSs0+J9l8f3vJk47S5fM
sSMpWYBnogGxkJhnMjddw6nQreAD2y+otXLMV9F2G4DFaMiPQKi/zCWsJIWp4lBK
ViN2hxLkSmL7+ShwWXSDlFAy3DKyYizwd6AXJgKhjBeuq5BLPEb6qXUhLYL281Xc
ViC7EwZbssrKcpBLJmHpaJbO8NKhUEp1yWRAU9VwKLo3GL5IvqFBeN4sTSAmlS2k
mof8PQpBc5SgccI1GIiDdRI=
-----END CERTIFICATE-----`
export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
  const token = event.authorizationToken
  const jwtToken = verifyToken(token)

  console.log('User authorized', jwtToken)

  return {
    principalId: jwtToken.sub,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: '*'
        }
      ]
    }
  }
} catch (e) {
    console.log('User not authorized', e.message)
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}


function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}