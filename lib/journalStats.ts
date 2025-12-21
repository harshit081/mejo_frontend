import { format } from "date-fns";
import { DEFAULT_MOOD, MoodValue } from "@/lib/mood";

export type MoodCountMap = Partial<Record<MoodValue, number>>;

export interface DailyMoodSummary {
    dominantMood: MoodValue;
    total: number;
    counts: MoodCountMap;
}

interface SummarizableEntry {
    createdAt: string | Date;
    mood?: MoodValue;
}

export const summarizeDailyMoods = <T extends SummarizableEntry>(entries: T[]): Record<string, DailyMoodSummary> => {
    const dailyMap: Record<string, { total: number; counts: MoodCountMap }> = {};

    entries.forEach((entry) => {
        const createdAt = new Date(entry.createdAt);
        if (Number.isNaN(createdAt.getTime())) {
            return;
        }
        const dayKey = format(createdAt, "yyyy-MM-dd");
        if (!dailyMap[dayKey]) {
            dailyMap[dayKey] = { total: 0, counts: {} };
        }

        const moodKey = entry.mood ?? DEFAULT_MOOD;
        const counts = dailyMap[dayKey].counts;
        counts[moodKey] = (counts[moodKey] ?? 0) + 1;
        dailyMap[dayKey].total += 1;
    });

    return Object.entries(dailyMap).reduce<Record<string, DailyMoodSummary>>((acc, [day, data]) => {
        const dominantMoodEntry = Object.entries(data.counts as Record<MoodValue, number>)
            .sort((a, b) => b[1] - a[1])[0];
        const dominantMood = (dominantMoodEntry?.[0] as MoodValue) ?? DEFAULT_MOOD;

        acc[day] = {
            dominantMood,
            total: data.total,
            counts: data.counts
        };
        return acc;
    }, {});
};
