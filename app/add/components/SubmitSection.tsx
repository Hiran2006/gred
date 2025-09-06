type SubmitSectionProps = {
  isSubmitting: boolean;
  canSubmit: boolean;
  imagesError?: string;
};

export const SubmitSection = ({ isSubmitting, canSubmit, imagesError }: SubmitSectionProps) => {
  return (
    <div className="pt-4 border-t border-gray-200 mt-6">
      <button
        type="submit"
        className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 text-sm sm:text-base font-medium flex items-center justify-center"
        disabled={isSubmitting || !canSubmit}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Submitting...
          </>
        ) : !canSubmit ? (
          'Add at least one image'
        ) : (
          'Add Property'
        )}
      </button>
      {imagesError && (
        <p className="mt-2 text-sm text-red-600 text-center">{imagesError}</p>
      )}
    </div>
  );
};
