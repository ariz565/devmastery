import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img className="h-12 w-auto" src="/logo.svg" alt="DevMastery" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to DevMastery
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your admin dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignIn
            afterSignInUrl="/admin"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                formFieldInput: "text-sm",
                formFieldLabel: "text-sm font-medium text-gray-700",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "text-sm normal-case border-gray-300",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-sm",
                footerActionLink: "text-blue-600 hover:text-blue-500",
                formResendCodeLink: "text-blue-600 hover:text-blue-500",
                otpCodeFieldInput: "text-sm",
                formHeaderTitle: "hidden",
              },
            }}
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          New to DevMastery?{" "}
          <a
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
