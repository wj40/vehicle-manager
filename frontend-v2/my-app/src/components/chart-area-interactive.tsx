"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { type Vehicle } from "@/types/vehicle"

const chartConfig = {
  vehicles: {
    label: "Vehicles",
    color: "var(--primary)",
  },
} satisfies ChartConfig

type ChartAreaInteractiveProps = {
  vehicles: Vehicle[]
}

export function ChartAreaInteractive({vehicles}: ChartAreaInteractiveProps) {
  const yearCounts = useMemo(() => {
    const map: Record<number, number> = {}
    vehicles.forEach((v) => {
      map[v.productionYear] = (map[v.productionYear] || 0) + 1
    })
    return Object.entries(map)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, count]) => ({ year: Number(year), vehicles: count }))
  }, [vehicles])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Registered vehicles by production year</CardTitle>
        <CardDescription>Vehicles grouped by production year</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={yearCounts}>
            <defs>
              <linearGradient id="fillVehicles" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-vehicles)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-vehicles)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: number) => String(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => String(value)}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="vehicles"
              type="natural"
              fill="url(#fillVehicles)"
              stroke="var(--color-vehicles)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
