import React from "react";

interface StateContainerProps {
  children: React.ReactNode;
}

const StateContainer = ({ children }: StateContainerProps) => (
  <div className="p-6">
    <div className="flex items-center justify-center h-64">{children}</div>
  </div>
);

export const LoadingState = ({ label }: { label: string }) => (
  <StateContainer>
    <p className="text-gray-500">{label}</p>
  </StateContainer>
);

export const ErrorState = ({
  prefix,
  message,
}: {
  prefix: string;
  message: string;
}) => (
  <div className="p-6">
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {prefix} {message}
    </div>
  </div>
);

export const NoDataState = ({ label }: { label: string }) => (
  <div className="p-6">
    <p className="text-gray-500">{label}</p>
  </div>
);
