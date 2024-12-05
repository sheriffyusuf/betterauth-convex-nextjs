"use client";
import { useConvexAuth } from "convex/react";
import { FormEvent } from "react";
import { authClient } from "~/lib/auth-client";

export default function Login() {
  const { isAuthenticated } = useConvexAuth();
  console.log("🚀 ~ Login ~ isAuthenticated:", isAuthenticated);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              className="w-full px-4 py-2 text-black text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full px-4 py-2 text-black text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            // type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={async () => {
              try {
                /*    const { data, error } = await authClient.signUp.email({
                  email: "faridat@gmail.com",
                  password: "12345678",
                  name: "Faridat Yusuf",
                  phoneNumber: "08035716860",
                });
 */
                const { data, error } = await authClient.signIn.email({
                  email: "faridat@gmail.com",
                  password: "12345678",
                });
                if (data?.session.token) {
                  localStorage.setItem("token", data.session.token);
                }

                console.log("data ", data);
                console.log("error ", error);
              } catch (e) {
                console.log("error ", e);
              }
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
