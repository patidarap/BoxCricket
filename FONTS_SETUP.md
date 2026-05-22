# Adding Custom Fonts to BoxCricket App

## Recommended Fonts for Modern UI

### 1. **Inter** (Best for modern apps)
- Download from: https://fonts.google.com/specimen/Inter
- Download all weights (Regular, Medium, SemiBold, Bold)
- Files needed:
  - Inter-Regular.ttf
  - Inter-Medium.ttf
  - Inter-SemiBold.ttf
  - Inter-Bold.ttf

### 2. **Poppins** (Alternative - Very popular)
- Download from: https://fonts.google.com/specimen/Poppins
- Files needed:
  - Poppins-Regular.ttf
  - Poppins-Medium.ttf
  - Poppins-SemiBold.ttf
  - Poppins-Bold.ttf

### 3. **Manrope** (Alternative - Clean and modern)
- Download from: https://fonts.google.com/specimen/Manrope
- Files needed:
  - Manrope-Regular.ttf
  - Manrope-Medium.ttf
  - Manrope-SemiBold.ttf
  - Manrope-Bold.ttf

## Steps to Add Fonts:

1. **Download fonts** from Google Fonts (links above)
2. **Extract** the .ttf files
3. **Copy** the font files to: `assets/fonts/` directory
4. **Run** the linking command:
   ```bash
   npx react-native-asset
   ```
5. **Rebuild** the app:
   ```bash
   # For iOS
   cd ios && pod install && cd ..
   yarn ios
   
   # For Android
   yarn android
   ```

## Quick Download Links:

### Inter Font (Recommended):
1. Go to: https://fonts.google.com/specimen/Inter
2. Click "Download family"
3. Extract the zip file
4. Copy these files to `assets/fonts/`:
   - Inter-Regular.ttf
   - Inter-Medium.ttf
   - Inter-SemiBold.ttf
   - Inter-Bold.ttf

### Or use this direct download:
```bash
# Download Inter font directly
curl -L "https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip" -o Inter.zip
unzip Inter.zip -d Inter
cp Inter/Inter\ Desktop/Inter-Regular.otf assets/fonts/Inter-Regular.ttf
cp Inter/Inter\ Desktop/Inter-Medium.otf assets/fonts/Inter-Medium.ttf
cp Inter/Inter\ Desktop/Inter-SemiBold.otf assets/fonts/Inter-SemiBold.ttf
cp Inter/Inter\ Desktop/Inter-Bold.otf assets/fonts/Inter-Bold.ttf
```

## After Adding Fonts:

The fonts will be automatically available in your app. The theme file has been updated to use "Inter" as the default font family.

If fonts don't show up:
1. Make sure files are in `assets/fonts/`
2. Run: `npx react-native-asset`
3. Clean build:
   - iOS: `cd ios && rm -rf build && pod install && cd ..`
   - Android: `cd android && ./gradlew clean && cd ..`
4. Rebuild the app
