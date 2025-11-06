interface SubmitButtonProps {
  onSubmit: () => void;
  disabled: boolean;
  isSubmitting: boolean;
}

export default function SubmitButton({
  onSubmit,
  disabled,
  isSubmitting,
}: SubmitButtonProps) {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled}
      className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
    >
      {isSubmitting ? "Submitting..." : "Submit Quiz"}
    </button>
  );
}
