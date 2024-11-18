import { useParams } from "@remix-run/react"

export default function DashId() {
    const { id } = useParams()
    return <h1>This is the dashboard for id {id}</h1>
}