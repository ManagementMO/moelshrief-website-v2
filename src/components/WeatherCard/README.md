# Weather Card Component

This component displays a beautiful, glossy weather card that shows real-time weather information based on the visitor's location.

## Features

- Geolocation-based weather data
- Beautiful UI with animations and hover effects
- Responsive design
- Error handling and loading states
- Manual refresh option

## Setup Instructions

To use the OpenWeatherMap-backed components (MiniWeatherCard and NavbarWeatherCard), you need an API key:

1. Go to OpenWeatherMap and create a free account
2. After signing up, go to your API keys section
3. Copy your API key
4. Create a .env file at the project root (or copy .env.example to .env)
5. Add your key as VITE_WEATHER_API_KEY=your_actual_key

No need to edit src/config/env.ts — it automatically reads VITE_WEATHER_API_KEY via import.meta.env.

## Usage

```tsx
import WeatherCard from "@/components/WeatherCard";

// In your component
<WeatherCard />
```

## Customization

You can customize the appearance of the weather card by modifying the CSS classes and styles in the `WeatherCard.tsx` file.

## API Information

- MiniWeatherCard and NavbarWeatherCard use the OpenWeatherMap API.
- WeatherCard (full card) currently fetches from wttr.in and does not require an API key.

## Credits

- Weather icons from Lucide React
- UI components from Shadcn UI
- Animations powered by Framer Motion
