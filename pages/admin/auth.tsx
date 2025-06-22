import { SignIn } from '@clerk/nextjs'

export default function AdminSignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your blog dashboard
          </p>
        </div>
        <SignIn 
          routing="path" 
          path="/admin/auth" 
          redirectUrl="/admin"
        />
      </div>
    </div>
  )
}
