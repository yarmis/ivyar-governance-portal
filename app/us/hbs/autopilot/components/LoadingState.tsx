"use client";

interface Props {
  label?: string;
}

export default function LoadingState({ label }: Props) {
  return (
    <div style={{ color: "#555", fontSize: "0.9rem" }}>
      {label || "Loading..."}
    </div>
  );
}
