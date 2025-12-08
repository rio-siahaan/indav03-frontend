# 📊 Rate Limit Component - Frontend Integration

## ✅ Komponen yang Telah Ditambahkan

### 1. Type Definitions

**File:** `src/types/rate-limit.ts`

Berisi TypeScript interfaces untuk:

- `RateLimitInfo` - Data rate limit dari backend
- `ChatResponse` - Response dari API chat

### 2. RateLimitIndicator Component

**File:** `src/components/chat/RateLimitIndicator.tsx`

**Features:**

- ✅ Progress bars untuk Requests Per Day & Tokens Per Minute
- ✅ Color-coded indicators (green/yellow/red)
- ✅ Warning banner saat usage > 80%
- ✅ Reset time display
- ✅ Processing time indicator
- ✅ Auto-update timestamp

**Visual Design:**

```
┌─────────────────────────────────┐
│ 📊 Penggunaan API        ⏱ 2.3s │
├─────────────────────────────────┤
│ ⚠️ Mendekati batas penggunaan   │
│    Pertimbangkan untuk menunggu │
├─────────────────────────────────┤
│ ⚡ Request Harian      0.21%     │
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ 14,370 tersisa dari 14,400      │
├─────────────────────────────────┤
│ ⚡ Token/Menit         0.02%     │
│ █░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ 17,997 tersisa dari 18,000      │
├─────────────────────────────────┤
│ Reset Request: 2m59s             │
│ Reset Token: 7.66s               │
└─────────────────────────────────┘
```

### 3. ChatLayout Integration

**File:** `src/layouts/ChatLayout.tsx`

**Changes:**

- Added `rateLimit` state
- Added `processingTime` state
- Capture rate limit from API response
- Display `RateLimitIndicator` in sidebar

## 📐 Layout Structure

```
┌──────────────┬────────────────────────┬──────────────┐
│              │                        │              │
│  Chat        │   Chat Area            │  Rate Limit  │
│  Sidebar     │   (Messages)           │  Indicator   │
│              │                        │              │
│  - New Chat  │   User: Hello          │  📊 Usage    │
│  - History   │   AI: Hi there!        │  ⚡ Requests │
│              │                        │  ⚡ Tokens   │
│              │   [Input Box]          │              │
│              │                        │              │
└──────────────┴────────────────────────┴──────────────┘
   250px              Flexible              320px
```

## 🎨 Responsive Design

### Desktop (≥1024px)

- Rate limit sidebar visible on the right
- Width: 320px (w-80)
- Always visible

### Tablet & Mobile (<1024px)

- Rate limit sidebar hidden
- Full width for chat area
- Can be shown in modal/dropdown if needed

## 🚀 How It Works

### 1. User sends message

```typescript
handleSendMessage("Berapa jumlah penduduk Medan?");
```

### 2. API call to backend

```typescript
const aiRes = await fetch("http://localhost:8000/chat", {
  method: "POST",
  body: JSON.stringify({ message: content }),
});
```

### 3. Response includes rate limit

```json
{
  "response": "Jumlah penduduk Medan...",
  "rate_limit": {
    "limits": { ... },
    "remaining": { ... },
    "usage_percentage": { ... }
  },
  "processing_time": 2.34
}
```

### 4. Update UI

```typescript
if (data.rate_limit) {
  setRateLimit(data.rate_limit);
}
```

### 5. Component auto-updates

```tsx
<RateLimitIndicator rateLimit={rateLimit} processingTime={processingTime} />
```

## 🎯 Color Coding

| Usage   | Color     | Meaning      |
| ------- | --------- | ------------ |
| 0-70%   | 🟢 Green  | Normal usage |
| 70-90%  | 🟡 Yellow | Warning      |
| 90-100% | 🔴 Red    | Critical     |

## ⚙️ Customization

### Change Warning Threshold

Edit `RateLimitIndicator.tsx`:

```typescript
const showWarning =
  usage_percentage.requests >= 80 || usage_percentage.tokens >= 80;
// Change 80 to your desired threshold
```

### Change Sidebar Width

Edit `ChatLayout.tsx`:

```tsx
<aside className="hidden lg:block w-80 ...">
// Change w-80 (320px) to w-64 (256px) or w-96 (384px)
```

### Add Mobile Support

Add a toggle button:

```tsx
const [showRateLimit, setShowRateLimit] = useState(false);

// In mobile view
{showRateLimit && (
  <div className="lg:hidden fixed inset-0 bg-black/50 z-50">
    <div className="absolute right-0 top-0 h-full w-80 bg-white p-4">
      <RateLimitIndicator ... />
    </div>
  </div>
)}
```

## 🧪 Testing

### 1. Start Backend

```bash
cd backend
uvicorn main:app --reload
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Test Chat

1. Go to `http://localhost:3000/chat`
2. Send a message
3. Check rate limit sidebar on the right
4. Verify:
   - Progress bars update
   - Processing time shows
   - Colors change based on usage

### 4. Test Warning

To test warning state, you can mock high usage:

```typescript
// In ChatLayout.tsx, temporarily add:
setRateLimit({
  limits: { requests_per_day: 14400, tokens_per_minute: 18000 },
  remaining: { requests: 1440, tokens: 1800 },
  usage_percentage: { requests: 90, tokens: 90 },
  // ... other fields
});
```

## 📝 Notes

1. **Backend Must Be Running**: Rate limit data comes from backend
2. **CORS**: Make sure backend allows `http://localhost:3000`
3. **Desktop Only**: Currently only shows on desktop (lg breakpoint)
4. **Auto-update**: Updates on every chat message
5. **Fallback**: Shows "Menunggu data..." if no rate limit yet

## 🔧 Troubleshooting

### Rate limit not showing

- Check if backend is running
- Check browser console for errors
- Verify API response includes `rate_limit` field

### Wrong colors

- Check `getColor()` and `getBarColor()` functions
- Verify percentage calculation

### Layout issues

- Check Tailwind classes
- Verify responsive breakpoints
- Check browser width (must be ≥1024px)

## 🎨 Future Enhancements

- [ ] Mobile modal for rate limit
- [ ] Historical usage chart
- [ ] Notification when approaching limit
- [ ] Auto-disable send button at 95%
- [ ] Countdown timer for reset
- [ ] Export usage statistics
