"use client";

interface Props {
  message: string;
}

export default function ErrorState({ message }: Props) {
  return (
    <div style={{
      padding: "1rem",
      borderRadius: "4px",
      border: "1px solid #b00020",
      backgroundColor: "#fff5f5",
      color: "#b00020"
    }}>
      {message}
    </div>
  );
}
