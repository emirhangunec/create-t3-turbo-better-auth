import React, { useState } from "react"
import { Button, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack } from "expo-router"
import { useQuery } from "@tanstack/react-query"

import { trpc } from "~/utils/api"
import { authClient, signIn, signOut } from "~/utils/auth"

function MobileAuth() {
  const { data: session, isPending } = authClient.useSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const handleSignIn = async () => {
    const res = await signIn.email({
      email,
      password,
    })
    if (res.error) {
      console.error(res.error)
      return
    }
    if (res.data.url) {
      console.log("Redirecting to: ", res.data.url)
    }
  }
  const handleSignUp = async () => {
    const res = await authClient.signUp.email({
      email,
      password,
      name,
    })
    if (res.error) {
      console.error(res.error)
      return
    }
    if (!res.data.token) {
      console.error("No token returned")
      return
    }
  }

  const handleSignOut = async () => {
    const res = await signOut()
    if (res.error) {
      console.error(res.error)
      return
    }
  }

  if (isPending) {
    return (
      <View className="flex h-full w-full items-center justify-center">
        <Text>Loading...</Text>
      </View>
    )
  }
  if (!session) {
    return (
      <View className="flex h-full w-full items-center justify-center">
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput placeholder="Name" value={name} onChangeText={setName} />
        <Button title="Sign In" onPress={handleSignIn} />
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    )
  }

  return (
    <>
      <Text className="pb-2 text-center text-xl font-semibold">
        {session.user.name}
      </Text>
      <Button onPress={handleSignOut} title={"Sign Out"} color={"#5B65E9"} />
    </>
  )
}

export default function Index() {
  const { data: message, refetch } = useQuery(
    trpc.auth.getSecretMessage.queryOptions(),
  )

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>
        <Text className="pb-2 text-center text-xl font-semibold">
          {message}
        </Text>
        <Button
          title="Refetch"
          onPress={() => {
            void refetch()
          }}
        />
        <MobileAuth />
      </View>
    </SafeAreaView>
  )
}
