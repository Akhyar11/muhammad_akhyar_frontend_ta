import type { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: Request, res: NextApiResponse) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing file ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const googleDriveUrl = `https://drive.google.com/uc?id=${id}&export=download`;

  try {
    const response = await fetch(googleDriveUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Error fetching image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
