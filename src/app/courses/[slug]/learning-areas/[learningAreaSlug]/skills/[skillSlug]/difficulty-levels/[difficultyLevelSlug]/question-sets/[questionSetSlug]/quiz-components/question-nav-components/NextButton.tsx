interface NextButtonProps {
  onNext: () => void;
  disabled: boolean;
}

export default function NextButton({ onNext, disabled }: NextButtonProps) {
  return (
    <button
      onClick={onNext}
      disabled={disabled}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
    >
      Next
    </button>
  );
}
