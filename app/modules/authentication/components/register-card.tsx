import { Form, Link, useActionData, useNavigation } from "react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useConfigurables } from "~/modules/configurables";
import { Coffee } from "lucide-react";

interface ActionData {
  error?: string;
}

export function RegisterCard() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config, loading } = useConfigurables();

  const appName = loading ? "BrewOps" : (config?.appName ?? "BrewOps");
  const primary = loading ? "#3B1F0A" : (config?.brandColor?.primary ?? "#3B1F0A");
  const secondary = loading ? "#C8832A" : (config?.brandColor?.secondary ?? "#C8832A");
  const bg = loading ? "#FAF6F0" : (config?.backgroundColor ?? "#FAF6F0");

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: bg }}>
      <Card className="w-full max-w-sm shadow-lg rounded-2xl border-0">
        <CardHeader className="space-y-3 text-center pb-4">
          <div className="flex items-center justify-center">
            {config?.logoUrl && !config.logoUrl.includes("FILL") ? (
              <img src={config.logoUrl} alt={appName} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: primary }}
              >
                <Coffee className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold" style={{ color: primary }}>{appName}</CardTitle>
            <CardDescription>Create your account</CardDescription>
          </div>
        </CardHeader>

        <Form method="post">
          <CardContent className="space-y-4">
            {actionData?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {actionData.error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="Your name" required autoComplete="username" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full text-white border-0 hover:opacity-90"
              style={{ backgroundColor: primary }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth/login" className="font-medium underline underline-offset-4" style={{ color: secondary }}>
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
