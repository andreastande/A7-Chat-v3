"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { Button } from "@/components/base-ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/base-ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/base-ui/field"
import { Input } from "@/components/base-ui/input"
import { Spinner } from "@/components/ui/spinner"
import { getLastUsedLoginMethod, signInEmail } from "@/lib/auth/client"
import { LastUsedBadge } from "../_components/last-used-badge"
import { PasswordInput } from "../_components/password-input"
import { SocialLoginButtons } from "../_components/social-login-buttons"

const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z.string().min(1, { error: "Password is required." }),
})

export default function Page() {
  const [lastMethod, setLastMethod] = useState<string | null>(null)

  // Avoid hydration mismatch (Better Auth uses document.cookie, which is unavailable during SSR)
  useEffect(() => {
    setLastMethod(getLastUsedLoginMethod())
  }, [])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const { error } = await signInEmail(data)
    if (error) {
      return form.setError("root.serverError", { message: error.message ?? "Invalid email or password" })
    }
    window.location.href = "/"
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Enter your email and password to log in</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                          Forgot your password?
                        </Link>
                      </div>
                      <PasswordInput {...field} id="password" aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                {form.formState.errors.root?.serverError && (
                  <Field>
                    <FieldError errors={[form.formState.errors.root.serverError]} />
                  </Field>
                )}
                <Field className="relative">
                  <Button type="submit" disabled={form.formState.isSubmitting} focusableWhenDisabled>
                    {form.formState.isSubmitting && <Spinner />}
                    Log In
                  </Button>
                  <LastUsedBadge show={lastMethod === "email"} />
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <SocialLoginButtons lastMethod={lastMethod} />
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our <Link href="/terms-of-service">Terms of Service</Link> and{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </FieldDescription>
      </div>
    </main>
  )
}
