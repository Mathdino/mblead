import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import sql from "mssql";

export const runtime = "nodejs";

const cfg: sql.config = {
  server: process.env.SQLSERVER_SERVER!,
  database: process.env.SQLSERVER_DATABASE!,
  user: process.env.SQLSERVER_USER!,
  password: process.env.SQLSERVER_PASSWORD!,
  options: {
    encrypt: process.env.SQLSERVER_ENCRYPT === "true",
    trustServerCertificate: process.env.SQLSERVER_ENCRYPT !== "true",
  },
};

async function getPool() {
  if (
    !process.env.SQLSERVER_SERVER ||
    !process.env.SQLSERVER_DATABASE ||
    !process.env.SQLSERVER_USER ||
    !process.env.SQLSERVER_PASSWORD
  ) {
    throw new Error("Variáveis de ambiente do SQL Server não configuradas");
  }
  const pool = new sql.ConnectionPool(cfg);
  return pool.connect();
}

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT Niche, Text FROM dbo.Messages");
    const rows = result.recordset ?? [];
    return NextResponse.json(rows, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "DB error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const niche: string = body?.niche;
    const text: string = body?.text ?? "";
    const pool = await getPool();
    await pool
      .request()
      .input("Niche", sql.NVarChar(128), niche)
      .input("Text", sql.NVarChar(sql.MAX), text).query(`
        IF EXISTS (SELECT 1 FROM dbo.Messages WHERE Niche = @Niche)
        BEGIN
          UPDATE dbo.Messages
          SET Text = @Text, UpdatedAt = SYSDATETIMEOFFSET()
          WHERE Niche = @Niche
        END
        ELSE
        BEGIN
          INSERT INTO dbo.Messages (Id, Niche, Text, CreatedAt, UpdatedAt)
          VALUES (NEWID(), @Niche, @Text, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET())
        END
      `);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "DB error" },
      { status: 500 },
    );
  }
}
