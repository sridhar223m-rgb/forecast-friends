import { motion } from 'framer-motion';
import { 
  Umbrella, 
  Glasses, 
  Shirt, 
  Droplets,
  Wind,
  Thermometer,
  AlertCircle,
  Sun,
  Snowflake
} from 'lucide-react';
import { WeatherData, WeatherAdvice as WeatherAdviceType } from '@/types/weather';
import { cn } from '@/lib/utils';

interface WeatherAdviceProps {
  weatherData: WeatherData[];
}

const getAdviceForWeather = (weather: WeatherData[]): WeatherAdviceType[] => {
  const advice: WeatherAdviceType[] = [];
  
  const hasRain = weather.some(w => w.condition === 'rain' || w.condition === 'drizzle' || w.condition === 'thunderstorm' || w.condition === 'sleet');
  const hasSunny = weather.some(w => w.condition === 'clear');
  const hasSnow = weather.some(w => w.condition === 'snow' || w.condition === 'sleet');
  const hasClouds = weather.some(
  w => w.condition === 'clouds'
);

const hasFoggyConditions = weather.some(
  w =>
    w.condition === 'fog' ||
    w.condition === 'mist' ||
    w.condition === 'haze'
);

const hasPoorAirQuality = weather.some(
  w =>
    w.condition === 'smoke' ||
    w.condition === 'dust' ||
    w.condition === 'sand' ||
    w.condition === 'ash'
);

  const highTemp = Math.max(...weather.map(w => w.temperature));
  const lowTemp = Math.min(...weather.map(w => w.temperature));
  const highUV = Math.max(...weather.map(w => w.uvIndex));
  const highWind = Math.max(...weather.map(w => w.windSpeed));
  const highHumidity = Math.max(...weather.map(w => w.humidity));

  if (hasRain) {
    advice.push({
      icon: 'umbrella',
      title: 'Bring an Umbrella',
      description: 'Rain is expected in some areas. Keep an umbrella handy for unexpected showers.',
      priority: 'high',
    });
  }

  if (highUV >= 6) {
    advice.push({
      icon: 'sunglasses',
      title: 'UV Protection Needed',
      description: `UV index is ${highUV}. Wear sunscreen (SPF 30+), sunglasses, and seek shade during peak hours.`,
      priority: 'high',
    });
  }

  if (highTemp >= 35) {
    advice.push({
      icon: 'thermometer',
      title: 'Stay Hydrated',
      description: 'High temperatures expected. Drink plenty of water and avoid prolonged outdoor exposure.',
      priority: 'high',
    });
  }

  if (lowTemp <= 5) {
    advice.push({
      icon: 'shirt',
      title: 'Bundle Up',
      description: 'Cold temperatures ahead. Layer up with warm clothing and protect extremities.',
      priority: 'medium',
    });
  }

  if (hasSnow) {
    advice.push({
      icon: 'snowflake',
      title: 'Winter Conditions',
      description: 'Snow expected. Drive carefully and wear appropriate winter footwear.',
      priority: 'high',
    });
  }

  if (highWind >= 25) {
    advice.push({
      icon: 'wind',
      title: 'Strong Winds',
      description: 'Windy conditions expected. Secure loose outdoor items and be cautious while driving.',
      priority: 'medium',
    });
  }

  if (highHumidity >= 80) {
    advice.push({
      icon: 'droplets',
      title: 'High Humidity',
      description: 'Very humid conditions. Stay cool and consider indoor activities.',
      priority: 'low',
    });
  }

  if (hasSunny && highUV < 6) {
    advice.push({
      icon: 'sun',
      title: 'Great Outdoor Weather',
      description: 'Perfect conditions for outdoor activities. Enjoy the sunshine!',
      priority: 'low',
    });
  }

  if (hasClouds && !hasRain && !hasSnow) {
  advice.push({
    icon: 'cloud',
    title: 'Overcast Skies',
    description: 'Cloudy conditions expected. It may feel cooler and less sunny than usual.',
    priority: 'low',
  });
}

if (hasFoggyConditions) {
  advice.push({
    icon: 'alert-triangle',
    title: 'Reduced Visibility',
    description:
      'Foggy or hazy conditions may reduce visibility. Drive carefully and use fog lights if needed.',
    priority: 'medium',
  });
}

if (hasPoorAirQuality) {
  advice.push({
    icon: 'mask',
    title: 'Poor Air Quality',
    description:
      'Air quality may be poor due to smoke or dust. Limit outdoor activities and consider wearing a mask.',
    priority: 'high',
  });
}

  return advice.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

const iconMap: Record<string, React.ElementType> = {
  umbrella: Umbrella,
  sunglasses: Glasses,
  shirt: Shirt,
  droplets: Droplets,
  wind: Wind,
  thermometer: Thermometer,
  alert: AlertCircle,
  sun: Sun,
  snowflake: Snowflake,
};

const priorityColors = {
  high: 'bg-destructive/20 border-destructive/20 text-destructive',
  medium: 'bg-accent/20 border-accent/20 text-accent',
  low: 'bg-primary/20 border-primary/20 text-primary',
};

export const WeatherAdvice = ({ weatherData }: WeatherAdviceProps) => {
  if (weatherData.length === 0) return null;

  const advice = getAdviceForWeather(weatherData);

  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
        <Shirt className="w-5 h-5 text-primary" />
        Weather Advice
      </h2>

      <div className="grid gap-3">
        {advice.map((item, index) => {
          const Icon = iconMap[item.icon] || AlertCircle;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 flex items-start gap-3"
            >
              <div className={cn(
                'p-2 rounded-xl border',
                priorityColors[item.priority]
              )}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <span className={cn(
                    'text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded-full border',
                    priorityColors[item.priority]
                  )}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
