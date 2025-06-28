import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img className="h-12 w-auto" src="/logo.svg" alt="DevMastery" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Join DevMastery
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Create your account to start your coding journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/10 backdrop-blur-sm py-8 px-4 shadow-2xl border border-white/20 sm:rounded-lg sm:px-10">
          <SignUp
            afterSignUpUrl="/topics"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm normal-case font-medium",
                formFieldInput: "text-sm bg-white/90 border-white/20",
                formFieldLabel: "text-sm font-medium text-white",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "text-sm normal-case border-white/30 bg-white/10 hover:bg-white/20 text-white",
                dividerLine: "bg-white/20",
                dividerText: "text-gray-300 text-sm",
                footerActionLink: "text-blue-400 hover:text-blue-300",
                formResendCodeLink: "text-blue-400 hover:text-blue-300",
                otpCodeFieldInput: "text-sm bg-white/90",
                formHeaderTitle: "hidden",
                card: "bg-transparent shadow-none",
                rootBox: "bg-transparent",
              },
            }}
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-300">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}
