export const MEDIAPIPE_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240";

export const WRIST = 0;
export const THUMB_TIP = 4;
export const INDEX_TIP = 8;
export const INDEX_PIP = 6;
export const MIDDLE_PIP = 10;
export const MIDDLE_TIP = 12;
export const RING_TIP = 16;
export const PINKY_TIP = 20;

export const CURSOR_SMOOTH = 0.42;
export const VIEWPORT_EDGE_MARGIN = 0.05;
export const PINCH_CLICK_RATIO = 0.09;
export const PINCH_CLICK_COOLDOWN_MS = 450;
/** Hand scroll: slow smooth follow */
export const SCROLL_SENSITIVITY = 1.4;
export const SCROLL_MAX_STEP = 10;
export const SCROLL_SMOOTH = 0.18;

export function locateMediaPipeFile(file) {
  return `${MEDIAPIPE_CDN}/${file}`;
}

export function dist2(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function handSpanFromLandmarks(landmarks) {
  return (
    Math.hypot(
      landmarks[WRIST].x - landmarks[9].x,
      landmarks[WRIST].y - landmarks[9].y
    ) || 0.12
  );
}

export function pinchThresholdNormalized(span, ratio) {
  return Math.max(0.04, span * ratio);
}

/** Normalized landmark → full viewport client coordinates */
export function landmarkToViewportClient(lm) {
  const m = VIEWPORT_EDGE_MARGIN;
  const nx = m + lm.x * (1 - 2 * m);
  const ny = m + lm.y * (1 - 2 * m);
  return {
    x: nx * window.innerWidth,
    y: ny * window.innerHeight,
  };
}

/** Index + middle extended, ring & pinky curled — scroll mode */
export function isScrollGesture(landmarks) {
  const wrist = landmarks[WRIST];
  const indexTip = landmarks[INDEX_TIP];
  const indexPip = landmarks[INDEX_PIP];
  const middleTip = landmarks[MIDDLE_TIP];
  const middlePip = landmarks[MIDDLE_PIP];

  const indexTipDist = dist2(indexTip, wrist);
  const indexPipDist = dist2(indexPip, wrist);
  const middleTipDist = dist2(middleTip, wrist);
  const middlePipDist = dist2(middlePip, wrist);

  if (indexTipDist < indexPipDist * 1.06) return false;
  if (middleTipDist < middlePipDist * 1.06) return false;

  const curledMax = Math.min(indexTipDist, middleTipDist) * 0.9;
  return (
    dist2(landmarks[RING_TIP], wrist) < curledMax &&
    dist2(landmarks[PINKY_TIP], wrist) < curledMax
  );
}

export function isPointingGesture(landmarks) {
  if (isScrollGesture(landmarks)) return false;
  const wrist = landmarks[WRIST];
  const indexTip = landmarks[INDEX_TIP];
  const indexPip = landmarks[INDEX_PIP];
  const indexTipDist = dist2(indexTip, wrist);
  const indexPipDist = dist2(indexPip, wrist);

  if (indexTipDist < indexPipDist * 1.08) return false;

  const curledMax = indexTipDist * 0.92;
  return (
    dist2(landmarks[MIDDLE_TIP], wrist) < curledMax &&
    dist2(landmarks[RING_TIP], wrist) < curledMax &&
    dist2(landmarks[PINKY_TIP], wrist) < curledMax
  );
}

export function isThumbIndexPinch(landmarks) {
  const span = handSpanFromLandmarks(landmarks);
  const thresh = pinchThresholdNormalized(span, PINCH_CLICK_RATIO);
  return dist2(landmarks[THUMB_TIP], landmarks[INDEX_TIP]) < thresh;
}

export function restoreNativeCursor() {
  document.body.style.cursor = "";
  document.documentElement.style.cursor = "";
}

export function updateSmoothedCursor(cursor, target) {
  if (!target) {
    cursor.active = false;
    return;
  }
  if (!cursor.active) {
    cursor.x = target.x;
    cursor.y = target.y;
    cursor.active = true;
    return;
  }
  cursor.x += (target.x - cursor.x) * CURSOR_SMOOTH;
  cursor.y += (target.y - cursor.y) * CURSOR_SMOOTH;
}

export function syncBrowserCursor(el, cursor, lastHover) {
  if (!cursor.active) {
    if (el) el.style.display = "none";
    restoreNativeCursor();
    if (lastHover.current) {
      lastHover.current.dispatchEvent(
        new MouseEvent("mouseout", { bubbles: true, view: window })
      );
      lastHover.current = null;
    }
    return;
  }

  if (el) {
    el.style.display = "block";
    el.style.left = `${cursor.x}px`;
    el.style.top = `${cursor.y}px`;
  }

  document.body.style.cursor = "none";
  document.documentElement.style.cursor = "none";

  const target = document.elementFromPoint(cursor.x, cursor.y);
  if (target && target !== lastHover.current) {
    lastHover.current?.dispatchEvent(
      new MouseEvent("mouseout", { bubbles: true, view: window })
    );
    target.dispatchEvent(
      new MouseEvent("mouseover", { bubbles: true, view: window })
    );
    lastHover.current = target;
  }

  document.dispatchEvent(
    new PointerEvent("pointermove", {
      clientX: cursor.x,
      clientY: cursor.y,
      bubbles: true,
      view: window,
      pointerId: 1,
      pointerType: "mouse",
    })
  );
}

export function createHandScrollState() {
  return { active: false, lastY: null, smoothedDelta: 0 };
}

/**
 * Smooth vertical scroll from index+middle finger height in frame.
 * Move hand up → scroll up, down → scroll down.
 */
export function updateHandScroll(state, landmarks) {
  if (!isScrollGesture(landmarks)) {
    state.active = false;
    state.lastY = null;
    state.smoothedDelta *= 0.85;
    return false;
  }

  const midY = (landmarks[INDEX_TIP].y + landmarks[MIDDLE_TIP].y) / 2;
  const viewportY = landmarkToViewportClient({ x: 0.5, y: midY }).y;

  if (state.lastY == null) {
    state.lastY = viewportY;
    state.active = true;
    return true;
  }

  const rawDelta = viewportY - state.lastY;
  state.lastY = viewportY;

  state.smoothedDelta += (rawDelta - state.smoothedDelta) * SCROLL_SMOOTH;
  let amount = state.smoothedDelta * SCROLL_SENSITIVITY;
  amount = Math.max(-SCROLL_MAX_STEP, Math.min(SCROLL_MAX_STEP, amount));

  if (Math.abs(amount) > 0.12) {
    window.scrollBy({ top: amount, left: 0, behavior: "auto" });
  }

  state.active = true;
  return true;
}

export function clickAtCursor(cursor) {
  const x = cursor.x;
  const y = cursor.y;
  const target =
    document.elementFromPoint(x, y) ??
    document.elementFromPoint(x, y - 1);

  if (!target) return false;

  const clickable =
    target.closest("a, button, [role='button'], input, select, textarea, label") ??
    target;

  const opts = {
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
    view: window,
    buttons: 1,
  };

  clickable.dispatchEvent(new PointerEvent("pointerdown", { ...opts, pointerId: 1, pointerType: "mouse" }));
  clickable.dispatchEvent(new MouseEvent("mousedown", opts));
  clickable.dispatchEvent(new PointerEvent("pointerup", { ...opts, pointerId: 1, pointerType: "mouse" }));
  clickable.dispatchEvent(new MouseEvent("mouseup", opts));
  clickable.dispatchEvent(new MouseEvent("click", opts));

  if (typeof clickable.click === "function" && clickable !== document.body) {
    clickable.click();
  }

  return true;
}
