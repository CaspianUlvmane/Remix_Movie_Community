import { Outlet } from "@remix-run/react";

export default function Dashboard() {

    return (
        <>
            <h1>This is the Dashboard page</h1>
            <Outlet />
        </>
    )
}