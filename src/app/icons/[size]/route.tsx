import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(_req: Request, { params }: { params: { size: string } }) {
  const size = Number(params.size);
  const safe = size === 192 || size === 512 ? size : 512;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff9f1, #fdba74 55%, #3d261f)",
          color: "#3d261f",
          fontSize: safe / 3.2,
          fontWeight: 800,
          letterSpacing: -6,
        }}
      >
        R
      </div>
    ),
    { width: safe, height: safe },
  );
}

