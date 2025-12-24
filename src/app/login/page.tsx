import { login } from './actions'

export default async function LoginPage({ searchParams }: Readonly<{ searchParams: Promise<{ message: string }> }>) {
  // Ambil pesan error (jika ada) dari URL
  const { message } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            AgriMonitor
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Silakan login untuk mengakses dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-t-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                placeholder="Email admin..."
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                placeholder="Password..."
              />
            </div>
          </div>

          <div>
            <button
              formAction={login}
              className="group relative flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-all"
            >
              Masuk Sistem
            </button>
          </div>
          
          {/* Menampilkan pesan error validasi */}
          {message && (
             <p className="mt-2 text-center text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
               {message}
             </p>
          )}
        </form>
      </div>
    </div>
  )
}