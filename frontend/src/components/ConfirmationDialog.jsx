import PropTypes from 'prop-types';

const ConfirmationDialog = ({
  isOpen,
  title,
  content,
  onCancel,
  onConfirm,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-bottom sm:modal-middle" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{content}</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            <button className="btn" onClick={onCancel}>
              {cancelText}
            </button>
            <button className="btn btn-error" onClick={onConfirm}>
              {confirmText}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string, // Made confirmText optional
  cancelText: PropTypes.string,
};

export default ConfirmationDialog;
