import { useContext } from "react";
import AnimatedDialog from "../../../components/AnimatedDialog";
import { appContext } from "../../../AppContext";
import CloseIcon from "../../../components/UI/Icons/CloseIcon";
import { Formik } from "formik";
import * as yup from "yup";

interface Props {
  id: string;
}
const EditNickname = ({ id }: Props) => {
  const {
    _promptEditNickname,
    promptEditNickname,
    _contractNicknames,
    editNickname,
  } = useContext(appContext);

  return (
    <AnimatedDialog display={_promptEditNickname} dismiss={promptEditNickname}>
      <div className="my-4 mx-4 md:mx-0 grid grid-rows-[auto_3fr_auto] sm:block h-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">
            Add an alias
          </h2>
          <span onClick={promptEditNickname}>
            <CloseIcon fill="currentColor" />
          </span>
        </div>

        <div>
          <Formik
            initialValues={{
              nickname:
                (_contractNicknames && _contractNicknames[id]) || "Untitled",
            }}
            onSubmit={(data) => {
              const { nickname } = data;
              editNickname(id, nickname.replaceAll("'", " "));
            }}
            validationSchema={yup.object().shape({
              nickname: yup
                .string()
                .required("Field is required")
                .max(255, "Alias cannot exceed 255 characters"),
            })}
          >
            {({ errors, values, handleSubmit, handleChange }) => (
              <form
                className="space-y-4"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onSubmit={handleSubmit}
              >
                <input
                  id="nickname"
                  name="nickname"
                  value={values.nickname}
                  onChange={handleChange}
                  placeholder="Enter an alias for this contract"
                  className="w-full bg-white rounded px-4 placeholder:text-neutral-500 text-sm py-4 focus:outline-none"
                />

                {errors && errors.nickname && <p>{errors.nickname as string}</p>}
                <button
                  disabled={!!(errors && errors.nickname)}
                  type="submit"
                  className="p-2 tracking-wide disabled:opacity-30 hover:bg-yellow-300 focus:outline-none bg-[#FFCD1E] text-[#1B1B1B] w-full flex items-center justify-center gap-2 font-bold py-2 rounded hover:bg-opacity-90"
                >
                  Save
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </AnimatedDialog>
  );
};

export default EditNickname;
