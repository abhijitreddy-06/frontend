import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, {
  Path, Defs, LinearGradient, Stop, Circle,
} from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedProps, withTiming, Easing,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_W = SCREEN_W - 48; // 24px padding each side
const CHART_H = 120;

// Build a smooth SVG path from data points
function buildPath(points: number[], w: number, h: number, padding = 12): string {
  if (points.length < 2) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => padding + (i / (points.length - 1)) * (w - padding * 2));
  const ys = points.map(v => padding + (1 - (v - min) / range) * (h - padding * 2));

  let d = `M${xs[0]},${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2;
    d += ` C${cpx},${ys[i - 1]} ${cpx},${ys[i]} ${xs[i]},${ys[i]}`;
  }
  return d;
}

function buildFill(points: number[], w: number, h: number, padding = 12): string {
  const line = buildPath(points, w, h, padding);
  if (!line) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => padding + (i / (points.length - 1)) * (w - padding * 2));
  const lastX = xs[xs.length - 1];
  const firstX = xs[0];
  return `${line} L${lastX},${h - padding} L${firstX},${h - padding} Z`;
}

interface SpendingChartProps {
  data: number[];
  c: Colors;
  width?: number;
  height?: number;
}

const DASH = 1200;

export function SpendingChart({ data, c, width = CHART_W, height = CHART_H }: SpendingChartProps) {
  const progress = useSharedValue(DASH);

  useEffect(() => {
    progress.value = DASH;
    progress.value = withTiming(0, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [data]);

  const linePath = buildPath(data, width, height);
  const fillPath = buildFill(data, width, height);

  const animatedLineProps = useAnimatedProps(() => ({
    strokeDashoffset: progress.value,
  }));

  // Find peak point for the dot
  const maxIdx = data.indexOf(Math.max(...data));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 12;
  const dotX = padding + (maxIdx / (data.length - 1)) * (width - padding * 2);
  const dotY = padding + (1 - (data[maxIdx] - min) / range) * (height - padding * 2);

  return (
    <View>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={c.primary} stopOpacity="0.18" />
            <Stop offset="100%" stopColor={c.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Fill */}
        <Path d={fillPath} fill="url(#spendGrad)" />

        {/* Animated line */}
        <AnimatedPath
          animatedProps={animatedLineProps}
          d={linePath}
          fill="none"
          stroke={c.primary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={DASH}
        />

        {/* Peak dot */}
        <Circle cx={dotX} cy={dotY} r={5} fill={c.primary} />
        <Circle cx={dotX} cy={dotY} r={9} fill={c.primary} fillOpacity={0.15} />
      </Svg>
    </View>
  );
}
