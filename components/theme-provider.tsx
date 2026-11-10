"use client"

import * as React from "react"
import { ThemeProvider as ThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof ThemesProvider>) {
  return <ThemesProvider {...props}>{children}</ThemesProvider>
}