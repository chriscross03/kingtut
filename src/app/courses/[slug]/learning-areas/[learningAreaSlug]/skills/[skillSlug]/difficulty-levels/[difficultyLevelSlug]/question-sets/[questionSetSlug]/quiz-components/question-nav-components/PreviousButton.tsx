interface PreviousButtonProps {
  onPrevious: () => void;
  disabled: boolean;
}

export default function PreviousButton({
  onPrevious,
  disabled,
}: PreviousButtonProps) {
  return (
    <button
      onClick={onPrevious}
      disabled={disabled}
      className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Previous
    </button>
  );
}
