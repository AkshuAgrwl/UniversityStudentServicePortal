import Link from "next/link";

import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { LoginButton } from "@/components/login-button";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <Link
            href="#"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">MME LNMIIT</span>
          </Link>
          <h1 className="text-xl font-bold">
            Welcome to the Mechanical-Mechatronics Engineering Department,
            LNMIIT
          </h1>
        </div>

        <FieldSeparator />

        <Field className="grid gap-4 sm:grid-cols-1">
          <LoginButton type="google" redirectTo="/dashboard">
            Continue with LNMIIT Google Account
          </LoginButton>
        </Field>
        <FieldSeparator />
      </FieldGroup>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="https://lnmiit.ac.in/terms-conditions/">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="https://lnmiit.ac.in/privacy-policy/">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
