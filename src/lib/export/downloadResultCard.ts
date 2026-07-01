import { toPng } from "html-to-image";

export async function downloadResultCard(
  node: HTMLElement,
  filename: string,
): Promise<void> {
  if (!node) {
    throw new Error("Result card node is required.");
  }

  const targetWidth = 1080;
  const pixelRatio = Math.max(2, targetWidth / node.offsetWidth);

  const dataUrl = await toPng(node, {
    cacheBust: true,
    backgroundColor: "#ffffff",
    pixelRatio,
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: {
      margin: "0",
      transform: "none",
    },
  });

  if (!dataUrl) {
    throw new Error("Failed to generate result card image.");
  }

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = objectUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}
