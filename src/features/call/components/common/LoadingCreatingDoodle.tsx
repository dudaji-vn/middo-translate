
export const LoadingCreatingDoodle = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="flex flex-col items-center justify-center w-80 h-80 bg-white rounded-2xl">
                <div className="flex items-center justify-center w-24 h-24">
                    <svg className="w-24 h-24 text-primary animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                </div>
                <div className="mt-5 text-xl font-semibold text-center">
                    Creating doodle...
                </div>
            </div>
        </div>
    );
};
