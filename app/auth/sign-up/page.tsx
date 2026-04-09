import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="min-h-svh w-full p-10">
      <div className="flex flex-col md:flex-row w-full h-full justify-center items-center space-x-16">
        <div className="bg-pr
          imary w-1/2  max-w-lg h-fit rounded-xl hidden md:block px-8 py-12">
          <div className="w-full h-fit bg-sky-100/25 rounded-xl border p-5  border-white/25 backdrop-blur-sm">
            <h3 className="text-6xl leading-snug text-white font-semibold font-lato">
              Selamat Datang di Sellerra👋, Silakan Daftar Akun Baru
            </h3>
            <div className="flex flex-row mt-10 space-x-5">
              <div className="bg-white rounded-full w-20 h-4" />
              <div className="bg-white rounded-full w-4 h-4" />
              <div className="bg-white rounded-full w-4 h-4" />
            </div>
          </div>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}