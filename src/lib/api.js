const PHASE_ONE = "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne";
const PHASE_TWO = "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo";

export async function postPhaseOne(payload) {
  const res = await fetch(PHASE_ONE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Phase 1 API failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function postPhaseTwo(payload) {
  console.log('postPhaseTwo payload keys:', Object.keys(payload))
  console.log('postPhaseTwo Image field exists:', 'Image' in payload)
  console.log('postPhaseTwo Image value type:', typeof payload.Image)
  console.log('postPhaseTwo Image value length:', payload.Image?.length)
  
  const res = await fetch(PHASE_TWO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error('API Error Response:', text)
    throw new Error(`Phase 2 API failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

