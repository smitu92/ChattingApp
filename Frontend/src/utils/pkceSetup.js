import { randomString, sha256Base64Url } from "./pkce";

export default async function pkceSetup(type) {
    const codeVerifier = randomString();
      localStorage.setItem("pkce_verifier", codeVerifier);

      const codeChallenge = await sha256Base64Url(codeVerifier);
      const state = crypto.randomUUID();

      // save state to check on /callback
      localStorage.setItem("oauth_state", state);

      const params = new URLSearchParams({
        response_type: "code",
        client_id: "chat-ui",
        redirect_uri: "http://localhost:5174/auth/callback",
        scope: "openid profile email",
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        type:type
      });

      const url = `http://localhost:2000/authservice/authorize?${params.toString()}`;
      return url;

}