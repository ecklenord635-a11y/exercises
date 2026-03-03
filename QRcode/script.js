const urlInput = document.getElementById("url-input");
const sizeInput = document.getElementById("size-input");
const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const qrcodeContainer = document.getElementById("qrcode");

const bulkInput = document.getElementById("bulk-input");
const bulkSizeInput = document.getElementById("bulk-size-input");
const bulkGenerateBtn = document.getElementById("bulk-generate-btn");
const bulkList = document.getElementById("bulk-list");

const modeButtons = document.querySelectorAll("[data-mode]");
const singlePanel = document.getElementById("single-mode");
const batchPanel = document.getElementById("batch-mode");

let qrInstance = null;

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  return hasProtocol ? trimmed : "https://" + trimmed;
}

function clearQr() {
  qrcodeContainer.innerHTML = "";
  qrInstance = null;
  if (downloadBtn) {
    downloadBtn.disabled = true;
  }
}

function parseSize(inputEl, fallback) {
  const raw = parseInt(inputEl.value || String(fallback), 10);
  if (Number.isNaN(raw)) return fallback;
  return Math.min(512, Math.max(128, raw));
}

function downloadFromContainer(container, filename = "qrcode.png") {
  if (!container) return;

  const canvas = container.querySelector("canvas");
  const img = container.querySelector("img");
  let dataUrl;

  if (canvas) {
    dataUrl = canvas.toDataURL("image/png");
  } else if (img && img.src) {
    dataUrl = img.src;
  }

  if (!dataUrl) return;

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateQr() {
  const raw = urlInput.value;
  const url = normalizeUrl(raw);

  if (!url) {
    alert("请输入要转换的网址。");
    urlInput.focus();
    clearQr();
    return;
  }

  const size = parseSize(sizeInput, 256);

  clearQr();

  qrInstance = new QRCode(qrcodeContainer, {
    text: url,
    width: size,
    height: size,
    correctLevel: QRCode.CorrectLevel.H,
  });

  if (downloadBtn) {
    downloadBtn.disabled = false;
  }
}

function generateBulkQrs() {
  const lines = bulkInput.value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  bulkList.innerHTML = "";

  if (!lines.length) {
    alert("请输入至少一个网址（每行一个）。");
    bulkInput.focus();
    return;
  }

  const size = parseSize(bulkSizeInput, 224);

  lines.forEach((raw, index) => {
    const url = normalizeUrl(raw);
    if (!url) return;

    const card = document.createElement("div");
    card.className = "qr-card";

    const urlLabel = document.createElement("div");
    urlLabel.className = "qr-url";
    urlLabel.textContent = url;

    const thumb = document.createElement("div");
    thumb.className = "qr-thumb";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "下载 PNG";

    card.appendChild(thumb);
    card.appendChild(urlLabel);
    card.appendChild(btn);
    bulkList.appendChild(card);

    const fileSafe = url.replace(/^https?:\/\//i, "").replace(/[^\w.-]+/g, "_");
    const filename = `qr_${index + 1}_${fileSafe || "code"}.png`;

    // 生成二维码
    new QRCode(thumb, {
      text: url,
      width: size,
      height: size,
      correctLevel: QRCode.CorrectLevel.H,
    });

    btn.addEventListener("click", () => {
      downloadFromContainer(thumb, filename);
    });
  });
}

// 模式切换（单个 / 批量）
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    modeButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    if (mode === "single") {
      singlePanel.classList.add("is-active");
      batchPanel.classList.remove("is-active");
    } else {
      batchPanel.classList.add("is-active");
      singlePanel.classList.remove("is-active");
    }
  });
});

// 事件绑定
generateBtn.addEventListener("click", generateQr);

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    if (!qrInstance) return;
    downloadFromContainer(qrcodeContainer, "qrcode.png");
  });
}

bulkGenerateBtn.addEventListener("click", generateBulkQrs);

urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    generateQr();
  }
});

