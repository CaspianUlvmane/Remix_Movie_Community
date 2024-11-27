import { data, Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { LoaderArgs } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"
import { db } from "utils/db.server";
import { getSession, commitSession } from "utils/sessions";

export async function loader({ request }: LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const errormessage = session.data.__flash_error__
    session.flash("error", "")
    return data(errormessage, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    })
}


export async function action({ request }: ActionArgs) {
    const formData = await request.formData()
    const session = await getSession(request.headers.get("Cookie"));

    if (formData.get("username") === "" || formData.get("password") === "") {
        session.flash("error", "Fields can not be empty!")
        // Redirect back to the login page with errors.
        return redirect("/signIn", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        })
    }
    const data = await db.user.findFirst({
        where: {
            username: formData.get("username"),
            password: formData.get("password")
        },
    })

    const userId = data?.id


    if (userId === undefined) {
        session.flash("error", "Username or password is wrong, try again")
        // Redirect back to the login page with errors.
        return redirect("/signIn", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        })
    } else {

        session.flash("error", "")
        session.set("userId", String(userId));
        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        })
    }
}

export default function signIn() {

    const data = useLoaderData<typeof loader>()
    const navigation = useNavigation()
    const error = data


    return (
        <div className="rounded-lg border p-3 max-w-screen-sm m-auto my-12">
            <h1 className="text-3xl font-semibold">Sign in</h1>
            <a href="/signUp"><p className="text-lg font-semibold hover:text-pink-200">or sign up</p></a>
            {error ? <div className="error">{error}</div> : null}
            <div>
                <Form method="POST">
                    <input name="username" placeholder="Username" className="w-full border border-pink-400 rounded-lg p-2 my-2"></input>
                    <input name="password" type="password" placeholder="Password" className="w-full border border-pink-400 rounded-lg p-2 my-2"></input>
                    {navigation.state === "submitting" ? (
                        <button type="button" disabled className="bg-pink-400 px-4 py-2 rounded-lg text-white">Loading...</button>

                    ) : (
                        <button type="submit" className="bg-pink-400 px-4 py-2 rounded-lg text-white">Sign In</button>
                    )}
                </Form>
            </div>
        </div >
    )
}