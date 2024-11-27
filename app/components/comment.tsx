export default function comment(post, users) {
    const user = users.filter(user => user.id === post.authorId)[0]
    console.log(user);


    return <div key={post.id} className="pt-6">
        {post.authorId ? (
            <h3 className="text-pink-200">{user.username}:</h3>
        )
            :
            (<></>)}
        {post.rating ? (
            <p>Score: {post.rating}</p>
        ) : (<></>)}
        <p className="">{post.message}</p>
    </div>
}
