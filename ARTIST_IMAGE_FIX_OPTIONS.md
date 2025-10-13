# Artist Image Positioning Options

Try these different positioning options to see which works best for your images:

## Option 1: Center Focus (Default) - Best for square images
```
object-cover object-center
```

## Option 2: Top Focus (Current) - Best for portraits with face at top
```
object-cover object-top
```

## Option 3: Upper Center - Best compromise for portraits
```
object-cover object-[center_top_20%]
```

## Option 4: Face Focus - Custom positioning
```
object-cover object-[50%_25%]
```

## Option 5: Contain Mode - Shows full image (no crop)
```
object-contain object-center
```

---

## How to Change:

In `src/components/ArtistSection.tsx`, line 36, replace the className:

**Current:**
```tsx
className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
```

**Try one of:**
```tsx
// Option 1: Center (default)
className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"

// Option 3: Upper center (recommended!)
className="w-full h-full object-cover object-[center_top_20%] group-hover:scale-110 transition-transform duration-500"

// Option 5: Show full image
className="w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-electric-blue/10 to-neon-pink/10"
```

Let me know which option works best!

