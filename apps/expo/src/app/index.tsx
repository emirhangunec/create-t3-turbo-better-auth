import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { authClient, signIn, signOut } from "~/utils/auth";


function MobileAuth() {
  const { data: session } = authClient.useSession();

  return (
    <>
      <Text className="pb-2 text-center text-xl font-semibold">
        {session?.user.name ?? "Not logged in"}
      </Text>
      <Button
        onPress={() => (session ? signOut() : signIn.social({
          provider: "discord",
          callbackURL: "/",
        }))}
        title={session ? "Sign Out" : "Sign In With Discord"}
        color={"#5B65E9"}
      />
    </>
  );
}

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>
        <MobileAuth />
      </View>
    </SafeAreaView>
  );
}
