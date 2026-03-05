import './Button.css';

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    className = '',
    ...props
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
            {...props}
        >
            {loading && (
                <span className="btn-spinner" aria-hidden="true">
                    <span className="btn-spinner-dot"></span>
                </span>
            )}
            {icon && iconPosition === 'left' && !loading && (
                <span className="btn-icon btn-icon--left">{icon}</span>
            )}
            <span className={loading ? 'btn-text-loading' : ''}>{children}</span>
            {icon && iconPosition === 'right' && !loading && (
                <span className="btn-icon btn-icon--right">{icon}</span>
            )}
        </button>
    );
}
