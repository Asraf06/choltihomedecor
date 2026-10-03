export function uploadWithProgress(
  url: string,
  fd: FormData,
  onProgress: (pct: number) => void,
  headers?: Record<string, string>
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    if (headers) {
      for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
    }
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && e.total > 0) onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
    };
    xhr.onload = () => {
      let data: unknown = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve(data);
      } else {
        reject(new Error((data as { error?: string } | null)?.error ?? "Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.ontimeout = () => reject(new Error("Upload timed out"));
    xhr.timeout = 60000;
    xhr.send(fd);
  });
}
