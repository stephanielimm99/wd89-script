/*
==========================
  SERVER SELECTOR SYSTEM
==========================
*/
(function () {
  "use strict";

  const BRAND_NAME = "WD89";
const ALLOWED_SERVERS = [
  { value: "indonesia", label: "Server Indonesia", min: 40.20, max: 99.80 },
  { value: "singapura", label: "Server Singapura", min: 42.90, max: 99.85 },
  { value: "singapore_vip", label: "Server Singapura VIP", min: 85.30, max: 99.95 },
  { value: "malaysia", label: "Server Malaysia", min: 41.80, max: 99.70 },
  { value: "thailand", label: "Server Thailand", min: 40.00, max: 99.85 },
  { value: "filipina", label: "Server Filipina", min: 40.70, max: 99.60 },
  { value: "kamboja", label: "Server Kamboja", min: 40.90, max: 99.50 },
  { value: "vietnam", label: "Server Vietnam", min: 41.10, max: 99.45 },
  { value: "china", label: "Server China", min: 40.85, max: 99.65 },
  { value: "hongkong", label: "Server Hongkong", min: 41.20, max: 99.88 },
  { value: "macau", label: "Server Macau", min: 41.75, max: 99.78 },
  { value: "macau_vip", label: "Server Macau VIP", min: 85.45, max: 99.98 },
  { value: "jepang", label: "Server Jepang", min: 42.70, max: 99.95 },
  { value: "korea", label: "Server Korea", min: 43.50, max: 99.78 }
];

const TARGET_SELECTORS = [
  ".jp-provider-div"
];

  const STORAGE_KEY = "selectedServerEvent";
  const MOBILE_BREAKPOINT = 768;
  const INSERT_POSITION = "beforebegin";

  function injectStyle() {
    if (document.getElementById("server-selector-style")) return;

    const style = document.createElement("style");
    style.id = "server-selector-style";
    style.textContent = `
      .server-selector-ui {
        width: 100%;
        max-width: 100%;
        margin: 14px auto 16px;
        padding: 16px;
        box-sizing: border-box;
        position: relative;
        overflow: visible;
        z-index: 99;
        font-family: Montserrat, Arial, sans-serif;
        border-radius: 20px;
        background:
          radial-gradient(circle at 15% 10%, rgba(255, 220, 90, 0.18), transparent 24%),
          radial-gradient(circle at 85% 18%, rgba(255, 230, 120, 0.10), transparent 22%),
          linear-gradient(145deg, #0b0d12 0%, #11141b 28%, #08090c 100%);
        border: 1px solid rgba(255, 214, 51, 0.55);
        box-shadow:
          0 0 0 1px rgba(255,255,255,.03) inset,
          0 0 0 2px rgba(255, 214, 51, 0.06),
          0 12px 34px rgba(0,0,0,.55),
          0 0 24px rgba(255, 214, 51, 0.12);
      }

      .server-selector-ui::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 20px;
        pointer-events: none;
        background:
          linear-gradient(135deg, rgba(255,255,255,.10), transparent 16%),
          linear-gradient(180deg, rgba(255,255,255,.05), transparent 24%),
          repeating-linear-gradient(
            90deg,
            rgba(255,255,255,.012) 0 1px,
            transparent 1px 14px
          );
        opacity: .9;
      }

      .server-selector-ui::after {
        content: "";
        position: absolute;
        inset: 7px;
        border-radius: 14px;
        pointer-events: none;
        border: 1px solid rgba(255, 214, 51, 0.16);
        box-shadow:
          inset 0 0 18px rgba(255, 214, 51, 0.05),
          0 0 12px rgba(255, 214, 51, 0.04);
      }

      .server-selector-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
        position: relative;
        z-index: 2;
      }

      .server-selector-title {
        color: #ffffff;
        font-size: 16px;
        font-weight: 900;
        line-height: 1.1;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        text-shadow:
          0 0 8px rgba(255, 214, 51, 0.18),
          0 0 18px rgba(255, 214, 51, 0.08);
      }

      .server-selector-sub {
        margin-top: 5px;
        color: rgba(255, 255, 255, 0.829);
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      .server-selector-badge {
        position: relative;
        flex: 0 0 auto;
        min-width: unset;
        width: auto; 
        padding: 6px 10px;
        border-radius: 8px;
        text-align: center;
        color: #171202;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 1px;
        text-transform: uppercase;
        background:
          linear-gradient(180deg, #ffe88a 0%, #ffd43a 35%, #d59e00 100%);
        border: 1px solid rgba(255, 244, 188, 0.42);
        box-shadow:
          0 1px 0 rgba(255,255,255,.30) inset,
          0 -6px 10px rgba(90, 55, 0, .20) inset,
          0 8px 18px rgba(0,0,0,.30),
          0 0 16px rgba(255, 214, 51, 0.12);
      }

      .server-selector-badge::after {
        content: "";
        position: absolute;
        inset: 1px;
        border-radius: 11px;
        background: linear-gradient(
          180deg,
          rgba(255,255,255,0.4),
          transparent 40%
        );
        pointer-events: none;
      }
      .server-selector-badge::before {
        content: "";
        position: absolute;
        inset: 1px;
        border-radius: 9px;
        background:
          linear-gradient(180deg, rgba(255,255,255,.26), transparent 38%),
          linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent);
        pointer-events: none;
      }

      .server-selector-field {
        position: relative;
        z-index: 20;
      }

      .server-native-select {
        display: none !important;
      }

      .server-custom-select {
        position: relative;
      }

      .server-custom-trigger {
        width: 100%;
        min-height: 58px;
        padding: 0 36px 0 12px;
        border-radius: 14px;
        border: 1px solid rgba(255, 214, 51, 0.48);
        cursor: pointer;
        transition: .28s ease;
        color: #ffe082;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .9px;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        position: relative;
        user-select: none;
        background:
          linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.01) 26%, rgba(0,0,0,.08) 27%, rgba(0,0,0,.04) 100%),
          linear-gradient(145deg, #191b20 0%, #0f1014 48%, #090a0d 100%);
        box-shadow:
          0 1px 0 rgba(255,255,255,.06) inset,
          0 -10px 18px rgba(0,0,0,.28) inset,
          0 0 0 1px rgba(255,255,255,.02) inset,
          0 8px 16px rgba(0,0,0,.20),
          0 0 14px rgba(255, 214, 51, 0.06);
      }

      .server-custom-trigger:hover {
        transform: translateY(-1px);
        border-color: rgba(255, 224, 102, 0.72);
        box-shadow:
          0 1px 0 rgba(255,255,255,.08) inset,
          0 -10px 18px rgba(0,0,0,.24) inset,
          0 8px 18px rgba(0,0,0,.24),
          0 0 18px rgba(255, 214, 51, 0.12);
      }

      .server-custom-select.open .server-custom-trigger {
        border-color: #ffe082;
        box-shadow:
          0 1px 0 rgba(255,255,255,.08) inset,
          0 -10px 18px rgba(0,0,0,.22) inset,
          0 0 0 3px rgba(255, 214, 51, 0.08),
          0 0 18px rgba(255, 214, 51, 0.16);
      }

.server-custom-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  min-width: 0;
  padding-right: 8px;
}

.selected-server-meta {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1;
}

      .server-selector-arrow {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        pointer-events: none;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid #ffd43a;
        filter: drop-shadow(0 0 6px rgba(255, 214, 51, 0.6));
        transition: .25s ease;
      }

      .server-custom-select.open .server-selector-arrow {
        transform: translateY(-50%) rotate(180deg);
      }

      .server-custom-menu {
        position: absolute;
        top: calc(100% + 10px);
        left: 0;
        right: 0;
        padding: 8px;
        border-radius: 16px;
        background:
          linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.01)),
          linear-gradient(145deg, #14171d 0%, #0b0d12 100%);
        border: 1px solid rgba(255, 214, 51, 0.22);
        box-shadow:
          0 16px 34px rgba(0,0,0,.42),
          0 0 20px rgba(255, 214, 51, 0.08),
          inset 0 1px 0 rgba(255,255,255,.04);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        opacity: 0;
        visibility: hidden;
        transform: translateY(8px);
        transition: .22s ease;
        max-height: 260px;
        overflow-y: auto;
      }

      .server-custom-select.open .server-custom-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .server-custom-menu::-webkit-scrollbar {
        width: 6px;
      }

      .server-custom-menu::-webkit-scrollbar-thumb {
        background: rgba(255, 214, 51, 0.35);
        border-radius: 99px;
      }

      .server-custom-option {
        position: relative;
        min-height: 48px;
        padding: 12px 14px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        color: #d4af37;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: .8px;
        text-transform: uppercase;
        cursor: pointer;
        transition: .18s ease;
        background: transparent;
        border: 1px solid transparent;
      }

      .server-custom-option:hover {
        color: #fff2b0;
        background:
          linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.01)),
          linear-gradient(145deg, rgba(255, 214, 51, .10), rgba(255, 214, 51, .03));
        border-color: rgba(255, 214, 51, 0.18);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.03),
          0 0 12px rgba(255, 214, 51, 0.08);
      }

      .server-custom-option.selected {
        color: #f5d76e;
        background: linear-gradient(180deg, #2a2a2a, #141414);
        border: 1px solid rgba(255, 214, 51, 0.4);
        box-shadow:
          0 0 8px rgba(255, 214, 51, 0.2),
          inset 0 1px 0 rgba(255,255,255,0.05);
      }

      .server-terminal-inline {
        margin-top: 14px;
        padding: 14px 14px 13px;
        display: none;
        position: relative;
        z-index: 2;
        border-radius: 14px;
        background:
          linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01)),
          linear-gradient(145deg, #14161a 0%, #0b0c10 100%);
        border: 1px solid rgba(255, 214, 51, 0.18);
        box-shadow:
          0 1px 0 rgba(255,255,255,.03) inset,
          inset 0 10px 18px rgba(255,255,255,.015),
          inset 0 -12px 20px rgba(0,0,0,.28);
      }

      .server-terminal-inline.show {
        display: block;
      }

      .server-terminal-inline::before {
        content: "";
        position: absolute;
        left: 15px;
        top: 15px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ffd43a;
        box-shadow:
          0 0 10px rgba(255, 214, 51, 0.55),
          0 0 18px rgba(255, 214, 51, 0.16);
      }

      .server-terminal-inline-box {
        padding-left: 24px;
        color: #f4e4a8;
        font-family: Consolas, Monaco, monospace;
        font-size: 10px;
        line-height: 1.4;
        letter-spacing: .5px;
        white-space: pre-wrap;
        text-transform: uppercase;
        text-shadow: 0 0 6px rgba(255, 214, 51, 0.06);
      }

      .server-terminal-inline-box div {
        opacity: .98;
      }

      .server-status {
        margin-top: 14px;
        padding: 14px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
        z-index: 2;
        background:
          linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.01)),
          linear-gradient(145deg, #181a1f 0%, #0d0e12 100%);
        border: 1px solid rgba(255, 214, 51, 0.18);
        box-shadow:
          0 1px 0 rgba(255,255,255,.04) inset,
          inset 0 10px 16px rgba(255,255,255,.01),
          inset 0 -12px 20px rgba(0,0,0,.22);
      }

      .server-status::after {
        content: "";
        position: absolute;
        inset: 1px;
        border-radius: 13px;
        pointer-events: none;
        border: 1px solid rgba(255,255,255,.02);
      }

      .server-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex: 0 0 12px;
        background: #ff2b2b;
        transition: .25s ease;
        box-shadow: 0 0 0 5px rgba(255, 0, 0, 0.015);
      }

      .server-dot.active {
        background: #00ff3c;
        box-shadow:
          0 0 0 5px rgba(75, 255, 51, 0.08),
          0 0 12px rgba(85, 255, 51, 0.72),
          0 0 26px rgba(126, 255, 51, 0.2);
      }

      .server-dot.pending {
        background: #ffe27a;
        box-shadow:
          0 0 0 5px rgba(255, 214, 51, 0.08),
          0 0 12px rgba(255, 214, 51, 0.46);
        animation: serverPulse 1s infinite ease-in-out;
      }

      @keyframes serverPulse {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.16);
          opacity: .72;
        }
      }

      .server-status-text {
        color: #eef0f3;
        font-size: 11px;
        line-height: 1.55;
        font-weight: 800;
        letter-spacing: .45px;
        text-transform: uppercase;
      }

      .server-status-text strong {
        color: #ffd84d;
        font-weight: 900;
        text-shadow: 0 0 8px rgba(255, 214, 51, 0.12);
      }

      .server-custom-option {
        justify-content: space-between;
        gap: 10px;
      }

      .server-option-name {
        flex: 1;
        min-width: 0;
      }

.server-option-percent {
  flex: 0 0 auto;
  margin-left: 16px;
  color: #ffd43a;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: .4px;
}

      .server-custom-option.selected .server-option-percent {
        color: inherit;
      }

.server-signal {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  margin-right: 4px;
  height: 12px;
  position: relative;
  top: 0;
}

.server-signal .signal-bar {
  width: 3px;
  background: currentColor;
  border-radius: 1px;
  opacity: 0.25;
  transition: 0.2s;
}

/* tinggi lebih proporsional */
.server-signal .signal-bar:nth-child(1) { height: 4px; }
.server-signal .signal-bar:nth-child(2) { height: 6px; }
.server-signal .signal-bar:nth-child(3) { height: 8px; }
.server-signal .signal-bar:nth-child(4) { height: 10px; }

.server-signal .signal-bar.active {
  opacity: 1;
}
    `;
    document.head.appendChild(style);
  }

  let isConnecting = false;
  let activeConnectionToken = 0;

  function getSavedServer() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setSavedServer(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function removeSavedServer() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function getServerLabel(value) {
    for (var i = 0; i < ALLOWED_SERVERS.length; i++) {
      if (ALLOWED_SERVERS[i].value === value) return ALLOWED_SERVERS[i].label;
    }
    return "";
  }

  function getServerData(value) {
  for (var i = 0; i < ALLOWED_SERVERS.length; i++) {
    if (ALLOWED_SERVERS[i].value === value) return ALLOWED_SERVERS[i];
  }
  return null;
}

function hashString(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// berubah tiap 10 menit
function getTimeBucket() {
  return Math.floor(Date.now() / (1000 * 60 * 10));
}

var lastValues = {};
var currentPercents = {};

function getDynamicPercent(value) {
  var server = getServerData(value);
  if (!server) return "0.00%";

  var bucketMs = 5 * 60 * 1000; // 5 menit
  var now = Date.now();

  var currentBucket = Math.floor(now / bucketMs);
  var nextBucket = currentBucket + 1;

  function getBucketValue(bucket) {
    var seed = hashString(value + "|" + bucket + "|" + BRAND_NAME);
    var rand = seededRandom(seed);
    return server.min + rand * (server.max - server.min);
  }

  var startValue = getBucketValue(currentBucket);
  var endValue = getBucketValue(nextBucket);

  var progress = (now % bucketMs) / bucketMs;

  // easing biar gerak lebih natural
  var eased = progress * progress * (3 - 2 * progress);

  var liveValue = startValue + (endValue - startValue) * eased;

  if (liveValue > server.max) liveValue = server.max;
  if (liveValue < server.min) liveValue = server.min;

  lastValues[value] = liveValue;
  var result = liveValue.toFixed(2) + "%";
  currentPercents[value] = result;

  return result;
}

  function setPendingState(label) {
    var dot = document.getElementById("serverDot");
    var statusText = document.getElementById("serverStatusText");

    if (!dot || !statusText) return;

    dot.classList.remove("active");
    dot.classList.add("pending");
    statusText.innerHTML = 'Menghubungkan ke <strong>' + label + '</strong>...';
  }

  function setConnectedState(label) {
  var dot = document.getElementById("serverDot");
  var statusText = document.getElementById("serverStatusText");
  var savedValue = getSavedServer();
  var customLabel = document.getElementById("serverCustomLabel");
  var percent = currentPercents[savedValue] || getDynamicPercent(savedValue);

  if (!dot || !statusText) return;

  dot.classList.remove("pending");
  dot.classList.add("active");

  if (customLabel) {
    var num = parseFloat(percent);

var level = 1;
if (num > 90) level = 4;
else if (num > 75) level = 3;
else if (num > 60) level = 2;

var barsHtml = '';
for (var i = 1; i <= 4; i++) {
  barsHtml += '<span class="signal-bar' + (i <= level ? ' active' : '') + '"></span>';
}

var signal = '<span class="server-signal">' + barsHtml + '</span>';

var metaColor = "#ff4d4d";
if (num > 90) metaColor = "#00ff88";
else if (num > 75) metaColor = "#ffd43a";

customLabel.innerHTML =
  '<span class="selected-server-name">' + label + '</span>' +
  '<span class="selected-server-meta" style="color:' + metaColor + ';">' + signal + ' ' + percent + '</span>';

  statusText.innerHTML = 'Terhubung ke <strong>' + label + '</strong>. Selamat bermain di ' + BRAND_NAME + '!';
  }
  }
  function setDisconnectedState() {
    var dot = document.getElementById("serverDot");
    var statusText = document.getElementById("serverStatusText");
    var nativeSelect = document.getElementById("serverDropdown");
    var customLabel = document.getElementById("serverCustomLabel");
    var customSelect = document.getElementById("serverCustomSelect");

    if (dot) {
      dot.classList.remove("active");
      dot.classList.remove("pending");
    }

    if (statusText) {
      statusText.textContent = "Status: Belum terhubung ke server";
    }

    if (nativeSelect) {
      nativeSelect.value = "";
    }

    if (customLabel) {
      customLabel.textContent = "Pilih Server";
    }

    if (customSelect) {
      syncSelectedOption("");
      customSelect.classList.remove("open");
    }
  }

  function syncSelectedOption(value) {
    var options = document.querySelectorAll(".server-custom-option");
    for (var i = 0; i < options.length; i++) {
      options[i].classList.toggle("selected", options[i].getAttribute("data-value") === value);
    }
  }

  function updateUIState() {
    if (isConnecting) return;

    var savedValue = getSavedServer();
    var savedLabel = getServerLabel(savedValue);
    var nativeSelect = document.getElementById("serverDropdown");
    var customLabel = document.getElementById("serverCustomLabel");

    if (nativeSelect) {
      nativeSelect.value = savedValue || "";
    }

    if (customLabel) {
      if (!savedValue) {
        customLabel.textContent = "Pilih Server";
      } 
    }

    syncSelectedOption(savedValue || "");

    if (savedValue && savedLabel) {
      setConnectedState(savedLabel);
    } else {
      setDisconnectedState();
    }
  }

  function clearTerminal() {
    var terminalWrap = document.getElementById("serverTerminalInline");
    var terminalBox = document.getElementById("serverTerminalInlineBox");
    if (terminalWrap) terminalWrap.classList.remove("show");
    if (terminalBox) terminalBox.innerHTML = "";
  }
  
  function refreshServerPercents() {
  var percentEls = document.querySelectorAll("[data-percent-for]");
  for (var i = 0; i < percentEls.length; i++) {
    var value = percentEls[i].getAttribute("data-percent-for");
    percentEls[i].textContent = getDynamicPercent(value);
  }
  }

  function refreshConnectedStatusPercent() {
  var savedValue = getSavedServer();
  var savedLabel = getServerLabel(savedValue);
  var statusText = document.getElementById("serverStatusText");
  var dot = document.getElementById("serverDot");
  var customLabel = document.getElementById("serverCustomLabel");

  if (!savedValue || !savedLabel || !statusText || !dot) return;
  if (!dot.classList.contains("active")) return;

  var percent = currentPercents[savedValue] || getDynamicPercent(savedValue);

  if (customLabel) {
    var num = parseFloat(percent);

var level = 1;
if (num > 90) level = 4;
else if (num > 75) level = 3;
else if (num > 60) level = 2;

var barsHtml = '';
for (var i = 1; i <= 4; i++) {
  barsHtml += '<span class="signal-bar' + (i <= level ? ' active' : '') + '"></span>';
}

var signal = '<span class="server-signal">' + barsHtml + '</span>';

var metaColor = "#ff4d4d";
if (num > 90) metaColor = "#00ff88";
else if (num > 75) metaColor = "#ffd43a";

customLabel.innerHTML =
  '<span class="selected-server-name">' + savedLabel + '</span>' +
  '<span class="selected-server-meta" style="color:' + metaColor + ';">' + signal + ' ' + percent + '</span>';

  statusText.innerHTML = 'Terhubung ke <strong>' + savedLabel + '</strong>. Selamat bermain di ' + BRAND_NAME + '!';
  }
  }
  function showTerminalSequence(lines, onComplete, token) {
    var terminalWrap = document.getElementById("serverTerminalInline");
    var terminalBox = document.getElementById("serverTerminalInlineBox");

    if (!terminalWrap || !terminalBox) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    terminalBox.innerHTML = "";
    terminalWrap.classList.add("show");

    var lineIndex = 0;

    function typeLine(text, done) {
      if (token !== activeConnectionToken) return;

      var i = 0;
      var line = document.createElement("div");
      terminalBox.appendChild(line);

      function tick() {
        if (token !== activeConnectionToken) return;
        if (i < text.length) {
          line.textContent += text.charAt(i++);
          setTimeout(tick, 14);
        } else {
          setTimeout(done, 170);
        }
      }

      tick();
    }

    function next() {
      if (token !== activeConnectionToken) return;

      if (lineIndex < lines.length) {
        typeLine(lines[lineIndex++], next);
      } else {
        setTimeout(function () {
          if (token !== activeConnectionToken) return;
          terminalWrap.classList.remove("show");
          terminalBox.innerHTML = "";
          if (typeof onComplete === "function") onComplete();
        }, 700);
      }
    }

    next();
  }

  function applyServerSelection(value) {
  var currentSavedValue = getSavedServer();
  var nativeSelect = document.getElementById("serverDropdown");
  var customLabel = document.getElementById("serverCustomLabel");
  var customSelect = document.getElementById("serverCustomSelect");
  var label = getServerLabel(value);

  if (value && currentSavedValue === value && !isConnecting) {
    if (nativeSelect) {
      nativeSelect.value = value;
    }

    if (customLabel) {
      customLabel.innerHTML = '<span class="selected-server-name">' + (label || "Pilih Server") + '</span>';
    }

    syncSelectedOption(value);

    if (customSelect) {
      customSelect.classList.remove("open");
    }

    return;
  }

  activeConnectionToken++;

  if (nativeSelect) {
    nativeSelect.value = value;
  }

  if (customLabel) {
    customLabel.innerHTML = '<span class="selected-server-name">' + (label || "Pilih Server") + '</span>';
  }

  syncSelectedOption(value);

  if (customSelect) {
    customSelect.classList.remove("open");
  }

  if (value && label) {
    isConnecting = true;
    setPendingState(label);

    var currentToken = activeConnectionToken;

    showTerminalSequence([
      "> Menginisialisasi: " + label,
      "> Memvalidasi koneksi server...",
      "> Respon gateway diterima",
      "> Membuka jalur koneksi aman...",
      "> Menyinkronkan data sesi...",
      "> Koneksi BERHASIL — Selamat datang di " + BRAND_NAME
    ], function () {
      if (currentToken !== activeConnectionToken) return;
      setSavedServer(value);
      isConnecting = false;
      setConnectedState(label);
    }, currentToken);
  } else {
    isConnecting = false;
    removeSavedServer();
    clearTerminal();
    setDisconnectedState();
  }
}

  function createUI() {
    var existing = document.getElementById("server-selector-ui");
    if (existing) return existing;

    var savedValue = getSavedServer();
    var savedLabel = getServerLabel(savedValue);
    var connected = !!savedValue && !!savedLabel;

    var wrap = document.createElement("div");
    wrap.className = "server-selector-ui";
    wrap.id = "server-selector-ui";

    wrap.innerHTML = `
      <div class="server-selector-head">
        <div>
          <div class="server-selector-title">Server Gacor</div>
          <div class="server-selector-sub">Pilih Server Gacor yang Tersedia</div>
        </div>
        <div class="server-selector-badge">${BRAND_NAME}</div>
      </div>

      <div class="server-selector-field">
        <select class="server-native-select" id="serverDropdown" aria-hidden="true" tabindex="-1">
          <option value="">Pilih Server</option>
          ${ALLOWED_SERVERS.map(function (item) {
            return '<option value="' + item.value + '"' + (item.value === savedValue ? " selected" : "") + '>' + item.label + '</option>';
          }).join("")}
        </select>

        <div class="server-custom-select" id="serverCustomSelect">
          <div class="server-custom-trigger" id="serverCustomTrigger" tabindex="0" role="button" aria-haspopup="listbox" aria-expanded="false">
            <span class="server-custom-label" id="serverCustomLabel">${
  savedLabel
    ? (function() {
  var percent = currentPercents[savedValue] || getDynamicPercent(savedValue);
  var num = parseFloat(percent);

  var level = 1;
  if (num > 90) level = 4;
  else if (num > 75) level = 3;
  else if (num > 60) level = 2;

  var barsHtml = '';
  for (var i = 1; i <= 4; i++) {
    barsHtml += '<span class="signal-bar' + (i <= level ? ' active' : '') + '"></span>';
  }

  var signal = '<span class="server-signal">' + barsHtml + '</span>';

  var metaColor = "#ff4d4d";
  if (num > 90) metaColor = "#00ff88";
  else if (num > 75) metaColor = "#ffd43a";

  return '<span class="selected-server-name">' + savedLabel + '</span>' +
         '<span class="selected-server-meta" style="color:' + metaColor + ';">' + signal + ' ' + percent + '</span>';
})()
    : "Pilih Server"
}</span>
            <span class="server-selector-arrow"></span>
          </div>

          <div class="server-custom-menu" id="serverCustomMenu" role="listbox">
            <div class="server-custom-option ${savedValue === "" ? "selected" : ""}" data-value="">Pilih Server</div>
            ${ALLOWED_SERVERS.map(function (item) {
              return '<div class="server-custom-option ' + (item.value === savedValue ? "selected" : "") + '" data-value="' + item.value + '">' +
                '<span class="server-option-name">' + item.label + '</span>' +
                '<span class="server-option-percent" data-percent-for="' + item.value + '">' +
                  getDynamicPercent(item.value) +
                '</span>' +
                '</div>';
            }).join("")}
          </div>
        </div>
      </div>

      <div class="server-terminal-inline" id="serverTerminalInline">
        <div class="server-terminal-inline-box" id="serverTerminalInlineBox"></div>
      </div>

      <div class="server-status">
        <span class="server-dot ${connected ? "active" : ""}" id="serverDot"></span>
        <div class="server-status-text" id="serverStatusText">
          ${connected
            ? 'Terhubung ke <strong>' + savedLabel + '</strong>. Selamat bermain di ' + BRAND_NAME + '!'
            : 'Status: Belum terhubung ke server'}
        </div>
      </div>
    `;

    var customSelect = wrap.querySelector("#serverCustomSelect");
    var trigger = wrap.querySelector("#serverCustomTrigger");
    var menu = wrap.querySelector("#serverCustomMenu");
    var options = wrap.querySelectorAll(".server-custom-option");

    function closeMenu() {
      customSelect.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      customSelect.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (customSelect.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (customSelect.classList.contains("open")) {
          closeMenu();
        } else {
          openMenu();
        }
      } else if (e.key === "Escape") {
        closeMenu();
      }
    });

    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener("click", function (e) {
        e.stopPropagation();
        applyServerSelection(this.getAttribute("data-value"));
      });
    }

    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        closeMenu();
      }
    });

    return wrap;
  }

  function init() {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;
    if (!document.querySelector(".jackpot")) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      let target = null;

      for (const sel of TARGET_SELECTORS) {
        target = document.querySelector(sel);
        if (target) break;
      }

if (target) {
  injectStyle();

const ui = createUI();

if (ui && !ui.parentNode) {

  const apkBox = createApkBox();

if (apkBox && !apkBox.parentNode) {
  target.insertAdjacentElement("beforebegin", apkBox);
}

if (ui && !ui.parentNode) {
  apkBox.insertAdjacentElement("afterend", ui);
}

  updateUIState();
  startRandomUpdates();
}

  clearInterval(interval);
}
    }, 500);

    window.addEventListener("storage", updateUIState);
  }

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
function startRandomUpdates() {
  var percentEls = document.querySelectorAll("[data-percent-for]");

  for (var i = 0; i < percentEls.length; i++) {
    (function(el) {

      function updateOne() {
        var value = el.getAttribute("data-percent-for");
        var percent = getDynamicPercent(value);
        var num = parseFloat(percent);


      var level = 1;

        if (num > 90) level = 4;
        else if (num > 75) level = 3;
        else if (num > 60) level = 2;

      var barsHtml = '';
        for (var i = 1; i <= 4; i++) {
        barsHtml += '<span class="signal-bar' + (i <= level ? ' active' : '') + '"></span>';
      }

      var signal = '<span class="server-signal">' + barsHtml + '</span>';
        el.innerHTML = signal + ' ' + percent;

        if (num > 90) {
          el.style.color = "#00ff88";
        } else if (num > 75) {
          el.style.color = "#ffd43a";
        } else {
          el.style.color = "#ff4d4d";
        }

        if (value === getSavedServer()) {
          refreshConnectedStatusPercent();
        }

        var delay = Math.random() * 3000 + 1000;
        setTimeout(updateOne, delay);
      }

      updateOne();

    })(percentEls[i]);
  }
}
})();
/*
==========================
  APK & LINK ALT
==========================
*/
function createApkBox() {
  const existing = document.getElementById("apk-box-ui");
  if (existing) return existing;

  const wrap = document.createElement("div");
  wrap.id = "apk-box-ui";

  wrap.innerHTML = `
    <div class="maxwin-box">
      <div class="left-panel">
        <div class="headline">
          <span class="line-1">Pastikan Selalu Login Dengan</span>
          <span class="line-2">Link Resmi Kami</span>
        </div>

        <button class="main-link" type="button" id="copyMainLinkBtn">
          altwin.link/wd89login
        </button>

        <div class="label">Pilih Link Alternatif:</div>

        <select id="altLink">
          <option value="https://vip.akses-kilat.com">vip.akses-kilat.com</option>
          <option value="https://vip1.akses-kilat.com">vip1.akses-kilat.com</option>
          <option value="https://vip2.akses-kilat.com">vip2.akses-kilat.com</option>
        </select>

        <button class="copy-btn" type="button" id="copyAltLinkBtn">Salin Link</button>

        <div class="note">
          * Klik tombol untuk menyalin link
        </div>

        <div class="search-wrap">
          <div class="search-note">Cari situs kami di CARILINK.NET</div>
          <a class="search-btn" href="https://carilink.net" target="_blank">
            CARILINK.NET
          </a>
        </div>
      </div>

      <div class="right-panel">
        <a href="XXXX" target="_blank">
          <img src="XXXX" alt="Download APK WD89">
        </a>
      </div>
    </div>
  `;

  const copyBtn = wrap.querySelector("#copyAltLinkBtn");
  const copyMainLinkBtn = wrap.querySelector("#copyMainLinkBtn");
  const select = wrap.querySelector("#altLink");

  if (copyBtn && select) {
    copyBtn.addEventListener("click", function () {
      const value = select.value;

      navigator.clipboard.writeText(value)
        .then(() => {
          alert("Link berhasil disalin: " + value);
        })
        .catch(() => {
          alert("Gagal menyalin link.");
        });
    });
  }

  if (copyMainLinkBtn) {
    copyMainLinkBtn.addEventListener("click", function () {
      const value = "https://altwin.link/wd89login";

      navigator.clipboard.writeText(value)
        .then(() => {
          alert("Link berhasil disalin: " + value);
        })
        .catch(() => {
          alert("Gagal menyalin link.");
        });
    });
  }
  return wrap;
}
