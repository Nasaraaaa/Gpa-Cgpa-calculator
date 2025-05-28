import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";

function Login({ onLogin }: { onLogin: (data: any) => void }) {
  const navigate = useNavigate();

  const initialValues = {
    matricNumber: "",
    password: "",
  };

  const validationSchema = Yup.object({
    matricNumber: Yup.string().required("Matric number is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const res = await axios.post(
        "https://gpa-cgpa-calculator-e7jw.onrender.com/login",
        values
      );
      const userData = res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      onLogin(userData);
      navigate("/dashboard");
    } catch (error: any) {
      toast(error.response.data.message, {
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="font-poppins text-2xl font-bold text-center mb-6 text-gray-700">
          Login
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field
                  type="text"
                  name="matricNumber"
                  placeholder="Matric Number"
                  className="w-full font-poppins p-3 mb-2 border border-gray-300 rounded-lg"
                />

                <ErrorMessage
                  name="matricNumber"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full font-poppins p-3 mb-2 border border-gray-300 rounded-lg"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-poppins bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-400 transition-all duration-300 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 font-poppins text-sm text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-poppins hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
