import React from "react";
import { Formik, Form, Field, FieldProps, FormikProps } from "formik";
import * as yup from "yup";

export interface LoginDto {
  username: string;
  password: string;
}

const LoginSchema = yup.object().shape({
  username: yup.string().required("Required"),
  password: yup.string().required("Required"),
});

export function LoginForm() {
  const initalValues = { username: "", password: "" };

  const defaultInputClassName =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const errorInputClassName =
    "shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

  const logIn = ({ username }: LoginDto) => {
    localStorage.setItem("creds", username + "-" + Math.random());
    window.location.href = "/home";
  };

  return (
    <div className="flex justify-center items-center flex-col absolute top-0 right-0 left-0 bottom-0">
      <div className="w-full max-w-sm">
        <Formik
          initialValues={initalValues}
          onSubmit={(values) => logIn(values)}
          validationSchema={LoginSchema}
          render={({ values, errors, submitForm }: FormikProps<LoginDto>) => {
            return (
              <Form className="bg-white mr-1 ml-1 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <Field
                  name="username"
                  value={values.username}
                  render={({ field }: FieldProps) => (
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        {...field}
                        className={
                          errors.username
                            ? errorInputClassName
                            : defaultInputClassName
                        }
                        id="username"
                        type="text"
                        placeholder="Username"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-xs italic">
                          {errors.username}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Field
                  name="password"
                  value={values.password}
                  render={({ field }: FieldProps) => (
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        {...field}
                        className={
                          errors.password
                            ? errorInputClassName
                            : defaultInputClassName
                        }
                        id="password"
                        type="password"
                        placeholder="******************"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs italic">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={submitForm}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Sign In
                  </button>
                  <a
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>
              </Form>
            );
          }}
        />

        <p className="text-center text-gray-500 text-xs">
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
}
