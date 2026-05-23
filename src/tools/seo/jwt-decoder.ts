import type { ToolSeoBlock } from "@/tools/types";

export const jwtDecoderSeo: ToolSeoBlock = {
  seoIntro:
    "Decode JWT access tokens and ID tokens locally to inspect claims, expiration, and issuer details during auth debugging. This JWT decoder is built for developers who need fast answers without sending bearer tokens to a remote service.",
  contentSections: [
    {
      heading: "What a JWT decoder does (and what it does not do)",
      paragraphs: [
        "A JSON Web Token (JWT) is a compact string with three Base64url-encoded segments: header, payload, and signature. A JWT decoder splits those segments and reveals the JSON inside the header and payload so you can read claims like subject, audience, roles, issued-at, and expiration. Decoding is not the same as verification—anyone can decode the middle segment, but only a service with the correct keys can prove the token was issued by a trusted party and has not been tampered with.",
        "This tool focuses on inspection. It helps you answer practical questions during development: Has the token expired? Does the audience match my API? Are the scopes what I expect after login? Use your identity provider or backend libraries to validate signatures in production paths. Treat decoded output as sensitive when tokens contain personal data or privileged roles.",
      ],
    },
    {
      heading: "Understanding JWT header and payload claims",
      paragraphs: [
        "The header typically includes alg (signing algorithm) and typ (token type). The payload contains registered claims such as iss (issuer), sub (subject), aud (audience), exp (expiration), nbf (not before), iat (issued at), and jti (JWT ID), plus custom claims defined by your application. OAuth access tokens often embed scope or permissions; OpenID Connect ID tokens add profile fields like email or name when configured.",
        "Time-based claims are Unix timestamps in seconds. Compare exp to the current time when debugging session timeouts. Clock skew between services can cause false negatives—allow a small buffer in validators. If you need human-readable timestamps for exp or iat, copy values into a timestamp converter after decoding. For opaque nested objects, paste the payload into a JSON formatter for easier reading.",
      ],
    },
    {
      heading: "JWT decoding workflow for API and frontend engineers",
      paragraphs: [
        "When a protected route returns 401, decode the access token from your client storage or network trace. Confirm exp has not passed and aud matches the API identifier. If refresh flows fail, inspect refresh token claims separately according to your provider documentation. For microservices, verify the service account token includes expected roles before blaming application logic.",
        "During local development, decode tokens issued by staging identity servers to confirm custom claims mapped correctly from SAML or social logins. Security reviewers decode sample tokens in a sandbox to document data minimization without accessing production directories. Always rotate tokens that were pasted into shared tools on untrusted machines, even when processing is local.",
      ],
    },
    {
      heading: "Base64url, privacy, and safe handling of bearer tokens",
      paragraphs: [
        "JWT segments use Base64url encoding, which differs slightly from standard Base64 (URL-safe characters, padding optional). Decoders must translate - and _ before parsing. If you are learning encoding details, experiment with a Base64 encoder and decoder on non-sensitive strings to see how binary data maps to text—never reuse production secrets in learning examples.",
        "Because decoding does not require the signing key, never treat a decoded token as proof of authenticity. Attackers can craft plausible payloads. Your API must validate signatures with published JWKS or shared secrets according to algorithm policy. Disable alg=none in validators and pin allowed algorithms to prevent downgrade attacks in custom stacks.",
      ],
    },
    {
      heading: "When to pair a JWT decoder with other developer tools",
      paragraphs: [
        "Authentication debugging rarely stops at JWTs. After decoding, format nested JSON for readability, convert epoch exp values to local time, and generate TypeScript types if you are modeling token payloads in frontend code. UUID generators help create test subjects; regex testers help validate dynamic issuer URLs in configuration files.",
        "Keep a consistent toolkit: decode locally, verify on the server, log minimally in production, and document claim contracts for each environment. That discipline reduces time spent chasing false authentication bugs and keeps user sessions stable across deploys.",
      ],
    },
  ],
  useCases: [
    "Inspect exp and iat claims when debugging session timeouts and refresh loops.",
    "Verify audience, issuer, and scope values on OAuth access tokens from network traces.",
    "Review custom role or tenant claims after identity provider configuration changes.",
    "Decode staging tokens to document claim shapes for frontend TypeScript models.",
    "Compare header algorithm values against server validation policies.",
    "Educate new team members on JWT structure without using production secrets in slides.",
  ],
  faqs: [
    {
      question: "Is it safe to paste production JWTs here?",
      answer:
        "Decoding runs locally with no network calls, but tokens are credentials. Avoid pasting production JWTs on shared computers. This tool does not verify signatures and does not store tokens after you close the tab.",
    },
    {
      question: "Can this tool validate JWT signatures?",
      answer:
        "No. It decodes header and payload segments only. Use your identity provider SDK, API gateway, or backend middleware to validate signatures with the correct keys.",
    },
    {
      question: "What JWT formats are supported?",
      answer:
        "Standard three-segment JWT strings (header.payload.signature) using Base64url encoding. JWE encrypted tokens are not supported by this decoder.",
    },
    {
      question: "Why does decoding succeed on a tampered token?",
      answer:
        "Decoding only reveals content. Without signature verification, anyone can read or fabricate payload JSON. Always verify on the server before trusting claims.",
    },
    {
      question: "How do I read exp and iat values?",
      answer:
        "They are Unix timestamps in seconds. This tool highlights common time claims; use a timestamp converter for timezone-friendly inspection.",
    },
    {
      question: "Does it support opaque refresh tokens?",
      answer:
        "Refresh tokens are often opaque strings, not JWTs. If yours is a JWT, paste it here; otherwise inspect it through your provider's admin tools.",
    },
    {
      question: "Can I decode only the payload segment?",
      answer:
        "Paste the full JWT for automatic splitting. Partial segments can be decoded with a Base64url-aware Base64 tool if needed for learning.",
    },
    {
      question: "Where is processing performed?",
      answer:
        "Entirely in your browser. No uploads occur, which reduces exposure compared with remote debuggers.",
    },
  ],
  internalLinkSlugs: [
    "hash-generator",
    "uuid-generator",
    "base64-encoder",
    "json-formatter",
    "timestamp-converter",
    "query-string-parser",
  ],
};
