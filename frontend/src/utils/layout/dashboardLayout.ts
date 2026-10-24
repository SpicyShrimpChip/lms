import { z } from 'zod';
import type {
  DashboardComponentId,
  DashboardLayout,
  LayoutItem,
} from '@/types';

// LLM은 화면 코드를 만들지 않고, 여기 있는 영역 id·순서·크기·이유만 JSON으로 준다
export const DASHBOARD_COMPONENT_IDS = [
  'summary',
  'mastery',
  'conceptDetail',
  'recommendation',
  'courseShare',
] as const satisfies readonly DashboardComponentId[];

export const LAYOUT_REASON_MAX_LENGTH = 80;
export const LAYOUT_SUMMARY_MAX_LENGTH = 120;

const count = z.number().int().nonnegative();

const layoutItemSchema = z.object({
  component: z.enum(DASHBOARD_COMPONENT_IDS),
  order: z.number().int().min(1).max(DASHBOARD_COMPONENT_IDS.length),
  size: z.enum(['wide', 'normal']),
  aiReason: z.string().trim().min(1).max(LAYOUT_REASON_MAX_LENGTH),
});

const layoutSchema = z.object({
  generatedAt: z.string(),
  aiSummary: z.string().trim().min(1).max(LAYOUT_SUMMARY_MAX_LENGTH),
  basis: z.object({
    weaknessCount: count,
    askedAgainCount: count,
    conversationCount: count,
  }),
  items: z
    .array(layoutItemSchema)
    .min(1)
    .max(DASHBOARD_COMPONENT_IDS.length)
    .refine(
      (items) =>
        new Set(items.map((item) => item.component)).size === items.length,
      '같은 영역이 두 번 나왔어요',
    )
    .refine(
      (items) => new Set(items.map((item) => item.order)).size === items.length,
      '순서 번호가 겹쳐요',
    ),
});

// 검증 실패·배치 없음일 때 쓰는 기본 배치 (이유 없음)
export const DEFAULT_LAYOUT: DashboardLayout = {
  isDefault: true,
  generatedAt: null,
  aiSummary: null,
  basis: null,
  items: [
    { component: 'summary', order: 1, size: 'wide', aiReason: null },
    { component: 'mastery', order: 2, size: 'normal', aiReason: null },
    { component: 'conceptDetail', order: 3, size: 'normal', aiReason: null },
    { component: 'recommendation', order: 4, size: 'normal', aiReason: null },
    { component: 'courseShare', order: 5, size: 'normal', aiReason: null },
  ],
};

// 서버가 준 배치 JSON(unknown)을 검증한다. 통과하면 순서대로 정렬하고,
// 빠진 영역은 기본 순서로 뒤에 붙인다. 통과하지 못하면 기본 배치를 돌려준다
export function parseDashboardLayout(raw: unknown): DashboardLayout {
  if (raw === undefined || raw === null) return DEFAULT_LAYOUT;

  const result = layoutSchema.safeParse(raw);
  if (!result.success) {
    if (import.meta.env.DEV) {
      console.warn(
        '배치 JSON 검증 실패, 기본 배치를 씁니다',
        result.error.issues,
      );
    }
    return DEFAULT_LAYOUT;
  }

  const sorted: LayoutItem[] = [...result.data.items].sort(
    (a, b) => a.order - b.order,
  );
  const missing = DEFAULT_LAYOUT.items.filter(
    (item) => !sorted.some((placed) => placed.component === item.component),
  );
  const items = [...sorted, ...missing].map((item, index) => ({
    ...item,
    order: index + 1,
  }));

  return {
    isDefault: false,
    generatedAt: result.data.generatedAt,
    aiSummary: result.data.aiSummary,
    basis: result.data.basis,
    items,
  };
}
