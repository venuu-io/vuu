const defaultAuthUrl = "api/authn";

export const authenticate = async (
  username: string,
  password: string,
  authUrl = defaultAuthUrl
): Promise<string | void> =>
  fetch(authUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": location.host,
    },
    body: JSON.stringify({ username, password }),
  }).then((response) => {
    if (response.ok) {
      const authToken = response.headers.get("vuu-auth-token");
      if (typeof authToken === "string" && authToken.length > 0) {
        return authToken;
      } else {
        throw Error(`Authentication failed auth token not returned by server`);
      }
    } else {
      throw Error(
        `Authentication failed ${response.status} ${response.statusText}`
      );
    }
  });
