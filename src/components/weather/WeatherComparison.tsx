import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowUpDown } from "lucide-react";
import { WeatherData } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { cn } from "@/lib/utils";

interface ComparisonMetric {
  label: string;
  key: keyof WeatherData;
  unit: string;
  higherIsBetter?: boolean;
}

const metrics: ComparisonMetric[] = [
  { label: "Temperature", key: "temperature", unit: "°C" },
  { label: "Feels Like", key: "feelsLike", unit: "°C" },
  { label: "Humidity", key: "humidity", unit: "%", higherIsBetter: false },
  { label: "Wind Speed", key: "windSpeed", unit: "km/h", higherIsBetter: false },
  { label: "UV Index", key: "uvIndex", unit: "", higherIsBetter: false },
  { label: "Visibility", key: "visibility", unit: "km", higherIsBetter: true },
];

export const WeatherComparison = ({ cities }: { cities: WeatherData[] }) => {
  if (cities.length < 2) return null;

  const getMinMax = (key: keyof WeatherData) => {
    const values = cities
      .map((c) => c[key])
      .filter((v): v is number => typeof v === "number");

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const getTrend = (value: number, metric: ComparisonMetric) => {
    const { min, max } = getMinMax(metric.key);
    if (value === max && value !== min) {
      return metric.higherIsBetter ? "best" : "highest";
    }
    if (value === min && value !== max) {
      return metric.higherIsBetter === false ? "best" : "lowest";
    }
    return "neutral";
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold flex items-center gap-2">
        <ArrowUpDown className="w-5 h-5 text-primary" />
        City Comparison
      </h2>

      <div className="overflow-x-auto">
        <div className="glass-card min-w-max">
          {/* Header */}
          <div className="grid grid-flow-col auto-cols-fr border-b">
            <div className="p-4 font-medium">Metric</div>
            {cities.map((city) => (
              <div key={city.id} className="p-4 text-center border-l">
                <div className="flex justify-center gap-2">
                  <WeatherIcon condition={city.condition} size="sm" />
                  <span>{city.city}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {metrics.map((metric, i) => (
            <div
              key={metric.key}
              className={cn(
                "grid grid-flow-col auto-cols-fr",
                i !== metrics.length - 1 && "border-b"
              )}
            >
              <div className="p-4 font-medium">{metric.label}</div>

              {cities.map((city) => {
                const value = city[metric.key] as number;
                const trend = getTrend(value, metric);

                return (
                  <div
                    key={city.id + metric.key}
                    className={cn(
                      "p-4 text-center border-l flex gap-2 justify-center",
                      trend === "best" && "bg-primary/10"
                    )}
                  >
                    <span>
                      {value}
                      {metric.unit}
                    </span>

                    {trend === "highest" && <TrendingUp size={16} />}
                    {trend === "lowest" && <TrendingDown size={16} />}
                    {trend === "neutral" && <Minus size={16} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
