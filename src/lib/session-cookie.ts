// Node-free constant shared by Edge middleware and the Node auth module.
// Keeping this separate stops node:crypto (in auth.ts) from being pulled into
// the Edge Runtime bundle.
export const SESSION_COOKIE = "epsos_session";
