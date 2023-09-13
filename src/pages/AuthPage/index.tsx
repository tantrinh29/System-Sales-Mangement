import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/auth/actions";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../store";
import { AuthActionTypes } from "../../store/auth/types";
import { useForm } from "react-hook-form";
import { message } from "antd";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch =
    useDispatch<ThunkDispatch<AppState, null, AuthActionTypes>>();
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if (data.email && data.password) {
      try {
        const res: any = await dispatch(login(data));
        if (res.status === true) {
          message.success(res.message);
        } else {
          message.error(res.message);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      className="flex min-h-full flex-col justify-center py-12 sm:px:6 lg:px-8 bg-gray-100 "
      style={{ height: "100vh" }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className=" mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign In To Your Admin
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                className="block text-sm font-medium leading-6 text-gray-900"
                htmlFor="Email"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="Email"
                  type="email"
                  placeholder="qhuy.dev@gmail.com"
                  className={`form-input pl-4 block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }
                focus:ring-sky-600 sm:text-sm sm:leading-6`}
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    * Email is required
                  </p>
                )}
              </div>
            </div>
            <div className="pt-5">
              <label
                className="block text-sm font-medium leading-6 text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  className={`form-input block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset
                ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }focus:ring-sky-600 sm:text-sm sm:leading-6`}
                  {...register("password", { required: true })}
                  name="password"
                  placeholder="*********"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    * Password is required
                  </p>
                )}
              </div>
            </div>
            <div className="pt-5">
              {isLoading ? (
                <button
                  disabled
                  type="button"
                  className="flex justify-center text-white px-3 py-2 focus-visible:outline focus-cisible: outline2 focus-visible: outline-offset-2 w-full   bg-sky-600 focus-visible: outline-sky-600 mr-2 text-sm font-medium rounded-lg border  focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 items-center"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Sign in ...
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-cisible: outline2 focus-visible: outline-offset-2 w-full text-white bg-sky-500 hover:bg-sky-600 focus-visible: outline-sky-600"
                >
                  Sign in
                </button>
              )}
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className=" absolute  inset-0  flex  items-center ">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                className=" inline-flex w-full  justify-center  rounded-md  bg-white  px-4  py-2  text-gray-500  shadow-sm  ring-1  ring-inset  ring-gray-300  hover:bg-gray-50  focus:outline-offset-0 "
              >
                <svg
                  stroke="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </button>
              <button
                type="button"
                className=" inline-flex w-full  justify-center  rounded-md  bg-white  px-4  py-2  text-gray-500  shadow-sm  ring-1  ring-inset  ring-gray-300  hover:bg-gray-50  focus:outline-offset-0 "
              >
                <svg
                  stroke="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
