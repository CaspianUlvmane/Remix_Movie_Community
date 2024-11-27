import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"
import { getSession } from "utils/sessions"
import { db } from "utils/db.server"


export async function loader({ request, params }: LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"))
    const data = await db.comments.findMany({
        where: {
            movieId: Number(params.id)
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const userId = session.data.userId ? session.data.userId : null
    if (!userId) {
        return { data, session }
    }
    const user = await db.user.findFirst({
        where: {
            id: Number(userId)
        }
    })


    return { data, session, user }
}

export async function action({ request }: ActionArgs) {
    const formData = await request.formData()

    const data = await db.comments.patch({
        data: {
            message: formData.get("comment") as string,
            movieId: Number(formData.get("id")) as number,
            rating: Number(formData.get("rating")) as number,
            authorId: authorId ? Number(authorId) : null
        }
    })
    return data
}

export default function UserSettings() {


    const { data, session, user } = useLoaderData<typeof loader>()
    console.log(data, session, user);

    const userId = session.data.userId ? session.data.userId : null

    const navigation = useNavigation()

    return (
        <div className="rounded-lg border p-3 my-16 max-w-screen-md m-auto">
            <h1 className="text-3xl font-semibold">Settings for {user?.username}</h1>
            <div className="flex flex-col gap-10">
                <Form method="PATCH">
                    <label htmlFor="newUsername">Change Username:</label>
                    <input name="newUsername" placeholder="New username" className="w-full border border-pink-400 rounded-lg p-2 my-2"></input>
                    <input name="password" type="password" placeholder="Password" className="w-full border border-pink-400 rounded-lg p-2 my-2"></input>
                    {navigation.state === "submitting" ? (
                        <button type="button" disabled className="bg-pink-400 px-4 py-2 rounded-lg text-white">Loading...</button>

                    ) : (
                        <button type="submit" className="bg-pink-400 px-4 py-2 rounded-lg text-white">Change Username</button>
                    )}
                </Form>

                <Form method="PATCH">
                    <label htmlFor="password">Change Password:</label>
                    <input name="password" type="password" placeholder="Password" className="w-full border border-pink-400 rounded-lg p-2 my-2"></input>
                    <input name="newPassword" type="password" placeholder="New password" className="w-full border border-pink-400 rounded-lg p-2 my-2"></input>
                    <input name="repeatNewPassword" type="password" placeholder="Repeat new password" className="w-full border border-pink-400 rounded-lg p-2 my-2"></input>
                    {navigation.state === "submitting" ? (
                        <button type="button" disabled className="bg-pink-400 px-4 py-2 rounded-lg text-white">Loading...</button>

                    ) : (
                        <button type="submit" className="bg-pink-400 px-4 py-2 rounded-lg text-white">Change Password</button>
                    )}
                </Form>
                <Link to={"/signOut"} prefetch="intent" className="px-3 py-2 rounded-lg bg-pink-600 w-24">
                    Sign Out
                </Link>
                <Form method="DELETE">
                    <input type="hidden" name="id" value={Number(userId)} />
                    {navigation.state === "submitting" ? (
                        <button type="button" disabled className="bg-pink-400 px-4 py-2 rounded-lg text-white">Loading...</button>

                    ) : (
                        <button type="submit" className="bg-red-600 px-4 py-2 rounded-lg text-white">Delete Account</button>
                    )}
                </Form>
            </div>
        </div>
    )
}