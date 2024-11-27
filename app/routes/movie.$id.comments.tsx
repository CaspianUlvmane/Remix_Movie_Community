import { Form, useLoaderData, useNavigation, useParams } from "@remix-run/react";
import { LoaderArgs } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"
import { db } from "utils/db.server";
import { getSession } from "utils/sessions";
import comment from "~/components/comment";

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

    const users = await db.user.findMany({})

    return { data, session, users }
}

export async function action({ request }: ActionArgs) {
    const formData = await request.formData()

    const authorId = formData.get("authorId")

    const data = await db.comments.create({
        data: {
            message: formData.get("comment") as string,
            movieId: Number(formData.get("id")) as number,
            rating: Number(formData.get("rating")) as number,
            authorId: authorId ? Number(authorId) : null
        }
    })
    return data
}

export default function movieComments() {

    const { id } = useParams()
    const { data, session, users } = useLoaderData<typeof loader>()
    console.log(data, session);

    const userId = session.data.userId ? session.data.userId : null

    const navigation = useNavigation()

    return (
        <div className="rounded-lg border p-3">
            <h1 className="text-3xl font-semibold">Write a review</h1>
            <div>
                <Form method="POST" onChange={({ target }) => slider(target)}>
                    <textarea name="comment" className="w-full border border-pink-400 rounded-lg p-2 my-2"></textarea>
                    <label htmlFor="rating" id="rating">0</label>
                    <input name="rating" type="range" max={5} defaultValue={0} className="w-full accent-pink-200"></input>
                    <input type="hidden" name="id" value={Number(id)} />
                    {userId ? (<input type="hidden" name="authorId" value={Number(userId)} />) : (<input type="hidden" name="authorId" value={null}></input>)}
                    {navigation.state === "submitting" ? (
                        <button type="button" disabled className="bg-pink-400 px-4 py-2 rounded-lg text-white">Loading...</button>

                    ) : (
                        <button type="submit" className="bg-pink-400 px-4 py-2 rounded-lg text-white">Add Comment</button>
                    )}
                </Form>
            </div>
            <div className="pt-6">
                {data.map((post) => (
                    comment(post, users)
                ))}
            </div>
        </div >
    )
}

function slider(target) {

    if (target.type === "range") {
        document.getElementById('rating') ? document.getElementById('rating').innerHTML = target.value : 0
    }



}