'use client';

type ProgressBarProps = {
  value: number;
  color?: string;
};

export default function ProgressBar({ value, color = 'bg-yellow-500' }: ProgressBarProps) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
      <div
        className={`h-full ${color}`}
        style={{
          width: `${value}%`
        }}
      >
      </div>
    </div>
  );
}
