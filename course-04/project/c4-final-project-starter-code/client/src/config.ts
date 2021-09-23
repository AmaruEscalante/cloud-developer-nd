// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '7byl117319'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-1la8x365.us.auth0.com',            // Auth0 domain
  clientId: 'DM2FWZOSd4H7jbwnVV2vWdkv9iomDK2c',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
