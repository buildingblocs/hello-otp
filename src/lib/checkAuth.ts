import { error } from "@sveltejs/kit";
import { auth } from "$lib/auth";

type UserKeyMetadata = {
  addedOn?: string;
};

function mapMeta(kvdata: any[]) {
  return kvdata.map((k) => {
    const metadata = (k.metadata ?? {}) as UserKeyMetadata;
    return {
      name: k.name,
      addedOn: metadata.addedOn ?? null,
    };
  });
}

export default async function checkAuth(
  platform: Readonly<App.Platform> | undefined,
  request: Request<unknown, CfProperties<unknown>>,
) {
  const kv = platform?.env?.host_otp;
  if (!kv) error(500, "Somethings not configured properly");
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const useremail = session?.user.email;
    const { keys: kvdata } = await kv.list();
    if (useremail) {
      if (kvdata.length === 0) {
        const key = "allow:" + useremail;
        const addedOn = new Date().toISOString();
        await kv.put(key, "1", { metadata: { addedOn } });
        return { authorised: true, userList: [] };
      } else {
        const isAllowed = kvdata.some((k) => k.name == "allow:" + useremail);
        const users = mapMeta(kvdata);
        return { authorised: isAllowed, userList: users };
      }
    }
  } catch (e) {
    error(500, String(e) ?? "There was an error receiving list of users, please report this issue");
  }
}
