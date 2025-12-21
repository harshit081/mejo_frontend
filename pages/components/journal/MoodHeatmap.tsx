import { useMemo } from "react";
import { addDays, format, startOfDay, startOfWeek } from "date-fns";
import { DailyMoodSummary } from "@/lib/journalStats";
import { DEFAULT_MOOD, MOOD_LOOKUP, MoodOption, MoodValue } from "@/lib/mood";

const DAYS_TO_DISPLAY = 240;
const WEEK_STARTS_ON = 0; // Sunday
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const EMPTY_BASE_COLOR = "129, 140, 248"; // Indigo accent for empty days

interface MoodHeatmapProps {
    summary: Record<string, DailyMoodSummary>;
}

const MoodHeatmap: React.FC<MoodHeatmapProps> = ({ summary }) => {
    const today = startOfDay(new Date());
    const totalGridDays = Math.ceil(DAYS_TO_DISPLAY / 7) * 7;
    const gridStart = startOfWeek(addDays(today, -(totalGridDays - 1)), { weekStartsOn: WEEK_STARTS_ON });

    const days = useMemo(
        () => Array.from({ length: totalGridDays }, (_, index) => addDays(gridStart, index)),
        [gridStart, totalGridDays]
    );
    const weeks = useMemo(() => {
        const chunked: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            chunked.push(days.slice(i, i + 7));
        }
        return chunked;
    }, [days]);

    const monthLabels = useMemo(() => {
        return weeks.map((week, index) => {
            const firstDay = week[0];
            const prevWeek = weeks[index - 1];
            const isNewMonth = !prevWeek || firstDay.getMonth() !== prevWeek[0].getMonth();
            const withinFirstWeek = firstDay.getDate() <= 7;
            return isNewMonth && withinFirstWeek ? format(firstDay, "MMM") : "";
        });
    }, [weeks]);

    const maxEntries = useMemo(() => {
        const totals = Object.values(summary).map((day) => day.total);
        return totals.length ? Math.max(...totals) : 0;
    }, [summary]);

    const { loggedDays, totalEntries, moodLeader } = useMemo(() => {
        const totals = Object.values(summary);
        const logged = totals.length;
        const entryCount = totals.reduce((sum, day) => sum + day.total, 0);
        const moodFrequency = totals.reduce((acc, day) => {
            acc[day.dominantMood] = (acc[day.dominantMood] ?? 0) + day.total;
            return acc;
        }, {} as Record<MoodValue, number>);
        const leader = Object.entries(moodFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] as MoodValue | undefined;

        return {
            loggedDays: logged,
            totalEntries: entryCount,
            moodLeader: leader ? MOOD_LOOKUP[leader] : null
        };
    }, [summary]);

    const getAlpha = (count: number) => {
        if (count <= 0 || maxEntries === 0) return 0.15;
        const ratio = count / maxEntries;
        return 0.35 + ratio * 0.65;
    };

    const getDayData = (day: Date) => {
        const key = format(day, "yyyy-MM-dd");
        return summary[key];
    };

    const legendLevels = [0, 0.33, 0.66, 1];

    const hasEntries = Object.keys(summary).length > 0;

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-5 border border-white/40 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Mood heatmap</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last 6 weeks</p>
                </div>
                <p className="text-xs text-gray-400">Hover to preview each day</p>
            </div>

            {!hasEntries ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                    Add a few entries to unlock your mood timeline.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="min-w-max">
                        <div className="flex gap-2 ml-10 mb-2 text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            {monthLabels.map((label, index) => (
                                <span key={`month-${index}`} className="w-6 text-center">
                                    {label}
                                </span>
                            ))}
                        </div>
                        <div className="flex">
                            <div className="flex flex-col gap-2 mr-3 text-[11px] font-semibold text-indigo-400 dark:text-indigo-200">
                                {WEEKDAY_LABELS.map((label) => (
                                    <span key={label} className="h-6 flex items-center justify-end pr-1">
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                {weeks.map((week, index) => (
                                    <div key={`week-${index}`} className="flex flex-col gap-2">
                                        {week.map((day) => {
                                            const entry = getDayData(day);
                                            const moodMeta = entry ? MOOD_LOOKUP[entry.dominantMood] : null;
                                            const alpha = entry ? getAlpha(entry.total) : 0.12;
                                            const background = moodMeta
                                                ? `rgba(${moodMeta.heatmap}, ${alpha})`
                                                : `rgba(${EMPTY_BASE_COLOR}, 0.18)`;
                                            const border = moodMeta
                                                ? `rgba(${moodMeta.heatmap}, ${Math.min(alpha + 0.2, 0.95)})`
                                                : `rgba(${EMPTY_BASE_COLOR}, 0.35)`;
                                            const glow = moodMeta
                                                ? `0 2px 10px rgba(${moodMeta.heatmap}, ${alpha * 0.6})`
                                                : `0 1px 6px rgba(${EMPTY_BASE_COLOR}, 0.25)`;

                                            const label = entry
                                                ? `${format(day, "EEE, MMM d")} • ${entry.total} entr${entry.total === 1 ? "y" : "ies"} • Mostly ${moodMeta?.label}`
                                                : `${format(day, "EEE, MMM d")} • No entries logged`;

                                            return (
                                                <button
                                                    key={day.toISOString()}
                                                    className="w-6 h-6 rounded-lg transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-healing-400"
                                                    style={{ backgroundColor: background, border: `1px solid ${border}`, boxShadow: glow }}
                                                    title={label}
                                                    type="button"
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-4">
                <div className="flex items-center gap-1">
                    <span className="uppercase tracking-wide mr-1">Legend</span>
                    {legendLevels.map((level) => (
                        <span
                            key={`legend-neutral-${level}`}
                            className="w-4 h-3 rounded"
                            style={{ backgroundColor: `rgba(${MOOD_LOOKUP[DEFAULT_MOOD].heatmap}, ${0.25 + level * 0.55})` }}
                        />
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.values(MOOD_LOOKUP).map((mood) => (
                        <span
                            key={mood.value}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold"
                            style={{
                                backgroundColor: `rgba(${mood.heatmap}, 0.18)`,
                                color: `rgb(${mood.heatmap})`
                            }}
                        >
                            {mood.emoji} {mood.label}
                        </span>
                    ))}
                </div>
            </div>

            {hasEntries && (
                <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600 dark:text-gray-300">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-200">
                        {totalEntries} entries tracked
                    </span>
                    <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
                        {loggedDays} active days
                    </span>
                    {moodLeader && (
                        <span
                            className="px-3 py-1 rounded-full font-semibold"
                            style={{
                                backgroundColor: `rgba(${moodLeader.heatmap}, 0.18)`,
                                color: `rgb(${moodLeader.heatmap})`
                            }}
                        >
                            {moodLeader.emoji} Most felt: {moodLeader.label}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MoodHeatmap;
