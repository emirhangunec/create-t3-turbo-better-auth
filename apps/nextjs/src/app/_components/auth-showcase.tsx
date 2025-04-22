"use client"

import { useState } from "react"
import { redirect } from "next/navigation"

import { authClient } from "@acme/auth/client"

export function AuthShowcase() {
  const { data: session, isPending } = authClient.useSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSignIn = async () => {
    const res = await authClient.signIn.email({
      email,
      password,
    })

    console.log(res)
    if (res.error) {
      console.error(res.error)
      return
    }

    if (res.data.url) redirect(res.data.url)
  }

  const handleSignUp = async () => {
    const res = await authClient.signUp.email({
      email,
      password,
      name,
    })

    console.log(res)
    if (res.error) {
      console.error(res.error)
      return
    }
  }
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>Loading...</p>
      </div>
    )
  }
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold">Logged in as {session.user.email}</p>
        <button
          className="btn-primary btn"
          onClick={() => authClient.signOut()}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold">Not logged in</p>
      <input
        type="text"
        placeholder="email"
        className="input-bordered input w-full max-w-xs"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="password"
        className="input-bordered input w-full max-w-xs"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="name"
        className="input-bordered input w-full max-w-xs"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn-primary btn" onClick={handleSignUp}>
        Sign up
      </button>
      <button className="btn-primary btn" onClick={handleSignIn}>
        Sign in
      </button>
    </div>
  )
}
