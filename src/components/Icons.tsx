import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

interface IconProps { color: string; size?: number; strokeWidth?: number; }

export function BellIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

export function PlusCircleIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={10} fill="none" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M12 8v8M8 12h8" />
    </Svg>
  );
}

export function MinusCircleIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={10} fill="none" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 12h8" />
    </Svg>
  );
}

export function ArrowRightLeftIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m16 3 4 4-4 4" />
      <Path d="M20 7H4" />
      <Path d="m8 21-4-4 4-4" />
      <Path d="M4 17h16" />
    </Svg>
  );
}

export function ScanIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <Line x1={7} y1={12} x2={17} y2={12} />
    </Svg>
  );
}

export function TrendingUpIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <Polyline points="16 7 22 7 22 13" />
    </Svg>
  );
}

export function TrendingDownIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <Polyline points="16 17 22 17 22 11" />
    </Svg>
  );
}

export function HomeIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  );
}

export function ListIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Line x1={8} y1={6} x2={21} y2={6} />
      <Line x1={8} y1={12} x2={21} y2={12} />
      <Line x1={8} y1={18} x2={21} y2={18} />
      <Line x1={3} y1={6} x2={3.01} y2={6} />
      <Line x1={3} y1={12} x2={3.01} y2={12} />
      <Line x1={3} y1={18} x2={3.01} y2={18} />
    </Svg>
  );
}

export function BarChart2Icon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Line x1={18} y1={20} x2={18} y2={10} />
      <Line x1={12} y1={20} x2={12} y2={4} />
      <Line x1={6} y1={20} x2={6} y2={14} />
    </Svg>
  );
}

export function UserCircleIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={10} fill="none" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={12} cy={10} r={3} fill="none" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </Svg>
  );
}

export function PlusIcon({ color, size = 22, strokeWidth = 2.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function LightbulbIcon({ color, size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.3 18 9.2 18 8A6 6 0 1 0 6 8c0 1.2.3 2.3 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
      <Path d="M9 18h6" />
      <Path d="M10 22h4" />
    </Svg>
  );
}

export function ShoppingBagIcon({ color, size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <Line x1={3} y1={6} x2={21} y2={6} />
      <Path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  );
}

export function CoffeeIcon({ color, size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <Path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <Line x1={6} y1={2} x2={6} y2={4} />
      <Line x1={10} y1={2} x2={10} y2={4} />
      <Line x1={14} y1={2} x2={14} y2={4} />
    </Svg>
  );
}

export function ZapIcon({ color, size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Svg>
  );
}

export function CarIcon({ color, size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9h-2" />
      <Circle cx={7} cy={17} r={2} fill="none" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={17} cy={17} r={2} fill="none" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function ChevronRightIcon({ color, size = 16, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

export function ArrowDownLeftIcon({ color, size = 14, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 7 7 17" />
      <Path d="M17 17H7V7" />
    </Svg>
  );
}

export function ArrowUpRightIcon({ color, size = 14, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7 17 17 7" />
      <Path d="M7 7h10v10" />
    </Svg>
  );
}
