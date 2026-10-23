import PropTypes from "prop-types";

/** Botón reutilizable: una sola fuente de estilos y de comportamiento. */
export default function Button({ variant = "primary", type = "button", children, ...rest }) {
  return (
    <button type={type} className={`btn btn--${variant}`} {...rest}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "ghost", "danger"]),
  type: PropTypes.oneOf(["button", "submit"]),
  children: PropTypes.node.isRequired,
};
