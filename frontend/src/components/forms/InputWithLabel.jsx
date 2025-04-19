import { Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";

const InputWithLabel = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = true,
  isPasswordField = false,
  showPassword,
  setShowPassword,
}) => {
  return (
    <div className="form-control">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={name} className="label label-text font-medium">
          {label}
        </label>
      </div>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="input input-bordered w-full"
        />
        {isPasswordField && setShowPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="size-5 text-base-content/40" />
            ) : (
              <Eye className="size-5 text-base-content/40" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

InputWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  isPasswordField: PropTypes.bool,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func,
};

export default InputWithLabel;
