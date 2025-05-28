import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const initialValues = {
    matricNumber: "",
    fullName: "",
    password: "",
  };

  const validationSchema = Yup.object({
    matricNumber: Yup.string().required("Matric number is required"),
    fullName: Yup.string().required("Full name is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await axios.post(
        "https://gpa-cgpa-calculator-e7jw.onrender.com/register",
        values
      );
      toast("Registration Successful!");
      navigate("/login");
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
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field
                  name="matricNumber"
                  type="text"
                  placeholder="Matric Number"
                  className="w-full p-3 mb-2 border border-gray-300 rounded-lg"
                />
                <ErrorMessage
                  name="matricNumber"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <Field
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 mb-2 border border-gray-300 rounded-lg"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
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
                className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-400 transition-all duration-300 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
