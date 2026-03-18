import { deserialize } from "$app/forms";
import { toast } from "svelte-sonner";
import { error, type ActionResult } from "@sveltejs/kit";

type UserItem = { name: string; addedOn: string };

export default async function addUser(
  email: string,
  fetchFunc: typeof fetch,
  onUserAdded?: (user: UserItem) => void,
) {
  const data = new FormData();
  data.append("key", "allow:" + email.toLowerCase());

  const response = await fetchFunc("?/addUser", {
    method: "POST",
    body: data,
  });

  const result: ActionResult = deserialize(await response.text());

  if (result.type == "success" && onUserAdded) {
    const addedOn = new Date().toISOString();
    onUserAdded({
      name: "allow:" + email.toLowerCase(),
      addedOn,
    });
  }

  if (result.type !== "success") {
    toast.error("Error in adding user", {
      action: {
        label: "Try again",
        onClick: () => addUser(email, fetchFunc),
      },
    });
    error(500, "Failed to add user")
  }

  return result
}
