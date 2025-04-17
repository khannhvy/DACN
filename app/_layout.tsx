import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login/login" options={{ title: "Đăng nhập", headerShown: false }} />
      <Stack.Screen name="login/register" options={{ title: "Đăng ký", headerShown: false }} />
      <Stack.Screen name="login/forgot-password" options={{ title: "Quên mật khẩu", headerShown: false }} />
    </Stack>
  );
}
