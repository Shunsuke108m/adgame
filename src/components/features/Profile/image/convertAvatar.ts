/**
 * プロフィール画像を 256x256 正方形にセンタークロップし、
 * PNG に再エンコードする。
 * createImageBitmap でデコードできない場合はエラー（不正な画像扱い）。
 * PNG にすることで OGP や Slack 等で扱いやすくする。
 */

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB
const OUTPUT_SIZE = 256;

export type ConvertAvatarResult = {
  blob: Blob;
  contentType: "image/png";
  fileName: string;
};

/**
 * File を 256x256 正方形（センタークロップ）に変換し、PNG の Blob を返す。
 * - 20MB 超のファイルはエラー
 * - createImageBitmap に失敗した場合は「画像として不正」でエラー
 */
export async function convertAvatar(file: File): Promise<ConvertAvatarResult> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("ファイルサイズは20MB以下にしてください");
  }

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("画像として認識できません。別の画像を選んでください。");
  });

  const w = bitmap.width;
  const h = bitmap.height;
  const size = Math.min(w, h);
  const sx = (w - size) / 2;
  const sy = (h - size) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("画像の処理に失敗しました");
  }

  ctx.drawImage(
    bitmap,
    sx, sy, size, size,  // source: center square
    0, 0, OUTPUT_SIZE, OUTPUT_SIZE  // dest: 256x256
  );
  bitmap.close();

  const blob = await canvasToBlobPng(canvas);
  return { blob, contentType: "image/png", fileName: "avatar.png" };
}

function canvasToBlobPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("画像の変換に失敗しました"));
      },
      "image/png",
      1
    );
  });
}
