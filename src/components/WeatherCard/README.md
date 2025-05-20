# Weather Card Component

This component displays a beautiful, glossy weather card that shows real-time weather information based on the visitor's location.

## Features

- Geolocation-based weather data
- Beautiful UI with animations and hover effects
- Responsive design
- Error handling and loading states
- Manual refresh option

## Setup Instructions

To use this component, you need to get an API key from OpenWeatherMap:

1. Go to [OpenWeatherMap](https://openweathermap.org/) and create a free account
2. After signing up, go to your API keys section
3. Copy your API key
4. Open `src/config/env.ts` and replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key

```typescript
export const ENV = {
  WEATHER_API_KEY: "your-actual-api-key-here",
};
```

## Usage

```tsx
import WeatherCard from "@/components/WeatherCard";

// In your component
<WeatherCard />
```

## Customization

You can customize the appearance of the weather card by modifying the CSS classes and styles in the `WeatherCard.tsx` file.

## API Information

This component uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch weather data. The free tier allows up to 1,000 API calls per day, which should be sufficient for most personal websites.

## Credits

- Weather icons from [Lucide React](https://lucide.dev/)
- UI components from Shadcn UI
- Animations powered by Framer Motion
