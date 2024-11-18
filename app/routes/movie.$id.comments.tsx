import { Form, useLoaderData, useNavigation, useParams } from "@remix-run/react";
import { LoaderArgs } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"
import { db } from "utils/db.server";

export async function loader({ params }: LoaderArgs) {
    const data = await db.comments.findMany({
        where: {
            movieId: Number(params.id)
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return data
}

export async function action({ request }: ActionArgs) {
    const formData = await request.formData()
    const data = await db.comments.create({
        data: {
            message: formData.get("comment") as string,
            movieId: Number(formData.get("id")) as number
        }
    })
    return data
}

export default function movieComments() {

    const { id } = useParams()
    const data = useLoaderData<typeof loader>()
    const navigation = useNavigation()

    return (
        <div className="rounded-lg border p-3">
            <h1 className="text-3xl font-semibold">Write a review</h1>
            <div>
                <Form method="POST">
                    <textarea name="comment" className="w-full border border-pink-400 rounded-lg p-2 my-2"></textarea>
                    <input type="hidden" name="id" value={Number(id)} />
                    {navigation.state === "submitting" ? (
                        <button type="button" disabled className="bg-pink-400 px-4 py-2 rounded-lg text-white">Loading...</button>

                    ) : (
                        <button type="submit" className="bg-pink-400 px-4 py-2 rounded-lg text-white">Add Comment</button>
                    )}
                </Form>
            </div>
            <div className="pt-4">
                {data.map((post) => (
                    <div key={post.id}>
                        <p className="py-3 font">{post.message}</p>
                    </div>
                ))}
            </div>
        </div >
    )
}